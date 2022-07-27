import { Box, Button, Card, Grid, Snackbar, Step, StepButton, Stepper } from "@mui/material"
import React from "react"
import { Route, RouteComponentProps, Switch, useHistory, useRouteMatch } from "react-router-dom"
import ParameterDefinitionConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane"
import { SCHEDULED_JOBS_ROUTE } from "../../../common/components/header/data/ApplicationRoutesConfig"
import LoadingIndicator from "../../../common/components/LoadingIndicator"
import { SetModuleContextState } from "../../../common/components/ModuleContext"
import NoData from "../../../common/components/NoData"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import ActionDescriptionCard from "../../../common/components/workflow-action/ActionDescriptionCard"
import useCreateWorkflowActionInstanceMutation from "../../../common/components/workflow/execute/hooks/useCreateWorkflowActionInstanceMutation"
import { useGetWorkflowChildInstances, useGetWorkflowDetails } from "../../../common/components/workflow/execute/hooks/useGetWorkflowInstaces"
import { userSettingsSingleton } from "../../../data_manager/userSettingsSingleton"
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype"
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag"
import { ActionInstance, ActionParameterInstance, ProviderInstance } from "../../../generated/entities/Entities"
import { ActionDefinitionDetail, ActionInstanceWithParameters } from "../../../generated/interfaces/Interfaces"
import ActionDefinitionHero from "../../build_action/components/shared-components/ActionDefinitionHero"
import ConfigureActionRecurring from "../../execute_action/components/ConfigureActionRecurring"
import ConfigureParameters from "../../execute_action/components/ConfigureParameters"
import ConfigureSlackAndEmail from "../../execute_action/components/ConfigureSlackAndEmail"
import SelectProviderInstance from "../../execute_action/components/SelectProviderInstance"
import { safelyParseJSON } from "../../execute_action/util"
import { SetWorkflowContext, WorkflowActionDefinition, WorkflowContext, WorkflowContextProvider } from "./WorkflowContext"

interface MatchParams {
    workflowId: string
}

const ExecuteWorkflow = ({match}: RouteComponentProps<MatchParams>) => {
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const setModuleContextState = React.useContext(SetModuleContextState)
    const history = useHistory()
    const [isReady, setIsReady] = React.useState(false)
    const [snackbarState, setSnackbarState] = React.useState(false)
    const [recurrenceConfig, setRecurrenceConfig] = React.useState<{
        actionInstance: ActionInstance,
        startDate: Date,
        activeIndex: number,
        slack?: string,
        email?: string
    }>({actionInstance: {}, startDate: new Date(Date.now()), activeIndex: 0, slack: 'C01NSTT6AA3', email: userSettingsSingleton.userEmail})

    const handleInstanceSaved = (data: any) => {
        if(recurrenceConfig.actionInstance.IsRecurring) {
            setSnackbarState(true)
            history.push(SCHEDULED_JOBS_ROUTE)
        } else {
            history.push(`/application/workflow-execution/${data?.[0]?.Id}`)
        }
    }

    const tableTypeParameterExists = workflowContext.WorkflowParameters?.some(apd => apd.Tag === ActionParameterDefinitionTag.TABLE_NAME)
    const pandasDataframeParameterExists = workflowContext.WorkflowParameters?.some(apd => apd.Tag === ActionParameterDefinitionTag.DATA && apd.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME)

    const saveWorkflowMutation = useCreateWorkflowActionInstanceMutation(workflowContext, handleInstanceSaved)
    const workflowId = match.params.workflowId
    const handleTemplate = (data: ActionDefinitionDetail[]) => {
        setModuleContextState({
            type: 'SetHeader',
            payload: {
                newHeader: {
                    Title: data?.[0]?.ActionDefinition?.model?.DisplayName,
                    SubTitle: 'Last Updated On ' + (new Date(data?.[0]?.ActionDefinition?.model?.UpdatedOn || data?.[0]?.ActionDefinition?.model?.CreatedOn || Date.now()).toString())
                }
            }
        })

        setWorkflowContext({type: 'ADD_ACTION_TEMPLATE', payload: {template: data?.[0]?.ActionTemplatesWithParameters?.[0].model}})
        setWorkflowContext({type: 'CHANGE_NAME', payload: {newName: data?.[0]?.ActionDefinition?.model?.DisplayName || "workflow"}})
        setWorkflowContext({type: 'CHANGE_DESCRIPTION', payload: {newDescription: data?.[0]?.ActionDefinition?.model?.Description || "NA"}})
        setWorkflowContext({type: 'ADD_WORKFLOW_PARAMETERS', payload: data?.[0]?.ActionTemplatesWithParameters?.[0]?.actionParameterDefinitions?.map(parameter => parameter?.model || {}) || []})
        setWorkflowContext({type: 'SET_APPLICATION_ID', payload: data?.[0]?.ActionDefinition?.model?.ApplicationId })
        setWorkflowContext({type: 'SET_ACTION_GROUP', payload: data?.[0]?.ActionDefinition?.model?.ActionGroup })
    }

    const handleInstances = (data: ActionInstanceWithParameters[]) => {
        const parametersArray: ActionParameterInstance[] = []
        data.forEach(actionInstanceWithParameters => {
            const workflowAction = {
                Id: actionInstanceWithParameters.model?.Id || "id",
                DisplayName: actionInstanceWithParameters.model?.DisplayName || "DisplayName",
                Name: actionInstanceWithParameters.model?.Name || "Name",
                ActionGroup: "test",
                DefaultActionTemplateId: actionInstanceWithParameters.model?.TemplateId || "templateId",
                TemplateId: actionInstanceWithParameters.model?.TemplateId || "templateId",
                DefinitionId: actionInstanceWithParameters.model?.DefinitionId || "definitionId",
                Parameters: actionInstanceWithParameters.ParameterInstances,
                ResultTableName: actionInstanceWithParameters.model?.ResultTableName,
                ResultSchemaName: actionInstanceWithParameters.model?.ResultSchemaName
            } as WorkflowActionDefinition
            
            workflowContext.WorkflowParameters.forEach(globalParameter => {
                const mappedGlobalParameter = workflowAction.Parameters?.find(parameter => parameter.GlobalParameterId === globalParameter.Id)
                const defaultParameterInstance = safelyParseJSON(globalParameter?.DefaultParameterValue) as ActionParameterInstance
                console.log(mappedGlobalParameter, defaultParameterInstance)
                if(!!mappedGlobalParameter) {
                    parametersArray.push({
                        ...defaultParameterInstance,
                        TableId: mappedGlobalParameter.TableId || defaultParameterInstance?.TableId, 
                        ParameterValue: defaultParameterInstance?.ParameterValue || mappedGlobalParameter.ParameterValue , 
                        ActionParameterDefinitionId: globalParameter.Id
                    })
                }
            })

            const stageId = workflowContext.stages[0].Id
            setWorkflowContext({type: 'ADD_ACTION', payload: {stageId: stageId, Action: workflowAction}})
        }) 
        if(parametersArray.length > 0){
            console.log(parametersArray)
            setWorkflowContext({type: 'CHANGE_WORKFLOW_PARAMETER_INSTANCES', payload: {'parameterInstances': parametersArray}})
        }
        setIsReady(true)
    }

    const handleParameterInstancesChange = (newGlobalParameterInstances: ActionParameterInstance[]) => {
        setWorkflowContext({type: 'CHANGE_WORKFLOW_PARAMETER_INSTANCES', payload: {parameterInstances: newGlobalParameterInstances}})
    }

    const executeWorkflow = () => {
        saveWorkflowMutation.mutate({workflowId: workflowId, workflowName: workflowContext.Name, recurrenceConfig: recurrenceConfig})
    }

    const handleRecurringChange = (actionInstance: ActionInstance) => {
        setRecurrenceConfig(config => ({
            ...config,
            actionInstance: actionInstance
        }))
    }

    const changeStartDate = (startDate: Date) => {
        setRecurrenceConfig(config => ({
            ...config,
            startDate: startDate
        }))
    }

    const handleGoToStep = (index: number) => {
        setRecurrenceConfig(config => ({
            ...config,
            activeIndex: index
        }))
    }
    
    const handleGoNext = () => {
        const index = recurrenceConfig.activeIndex
        setRecurrenceConfig(config => ({
            ...config,
            activeIndex: index + 1
        }))
    }

    const [workflowDefinition, error, loading] = useGetWorkflowDetails(workflowId, {enabled: workflowContext.Template === undefined, onSuccess: handleTemplate})
    const [workflowInstances, instancesError, instancesLoading] = useGetWorkflowChildInstances(workflowId, {enabled: ((workflowDefinition?.length || 0) > 0 && workflowContext.stages[0].Actions.length === 0), onSuccess: handleInstances})
    
    const handleEmailAndSlackChange = (slack?: string, email?: string) => {
        setRecurrenceConfig(config => ({
            ...config,
            slack: slack,
            email: email
        }))
    }

    const IndexToComponent = [
        {
            component: <ConfigureParameters 
                ActionParameterDefinitions={workflowContext.WorkflowParameters} 
                ActionParameterInstances={workflowContext.WorkflowParameterInstance || []} 
                ParameterAdditionalConfig={workflowContext.WorkflowParameterAdditionalConfigs || []}
                handleParametersChange={handleParameterInstancesChange}
                mode="GENERAL"
            />,
            label: "Inputs General"
        },
        {
            component: <ConfigureParameters 
                ActionParameterDefinitions={workflowContext.WorkflowParameters} 
                ActionParameterInstances={workflowContext.WorkflowParameterInstance || []} 
                ParameterAdditionalConfig={workflowContext.WorkflowParameterAdditionalConfigs || []}
                handleParametersChange={handleParameterInstancesChange}
                mode="ADVANCED"
            />,
            label: "Inputs Advanced"
        },
        {
            component: <ConfigureSlackAndEmail parameterInstances={workflowContext.WorkflowParameterInstance || []} slack={recurrenceConfig.slack} email={recurrenceConfig.email} handleEmailAndSlackChange={handleEmailAndSlackChange}/>,
            label: "Notifcation"
        },
        
    ]

    if((!tableTypeParameterExists)&&(!pandasDataframeParameterExists)) {
        IndexToComponent.unshift({
            component:  
                <Card sx={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #F8F8F8', 
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '-5px -5px 10px #E3E6F0, 5px 5px 10px #A6ABBD', 
                    borderRadius: '10px', backgroundBlendMode: 'soft-light, normal', minWidth: '100%', minHeight: '100%', 
                    justifyContent: 'center', alignItems: 'center', display: 'flex', p: 2}}
                >
                    <Grid container>
                        <Grid item xs={0} md={3} lg={4}/>
                        <Grid item xs={12} md={6} lg={4}>
                            <SelectProviderInstance
                                selectedProviderInstance={workflowContext.SelectedProviderInstance}
                                onProviderInstanceChange={(newProviderInstance?: ProviderInstance) => setWorkflowContext({ type: "SET_SELECTED_PROVIDER_INSTANCE", payload: { newProviderInstance: newProviderInstance } })}
                            />
                        </Grid>
                        <Grid item xs={0} md={3} lg={4}/>
                    </Grid>
                </Card>,
            label: "Providers"
        })
    }

    if(history.location.state !== 'fromTest') {
        IndexToComponent.push(
            {
                component: <ConfigureActionRecurring actionInstance = {recurrenceConfig.actionInstance} handleRecurringChange={handleRecurringChange} startDate={recurrenceConfig.startDate} handleStartDateChange={changeStartDate}/>,
                label: "Schedule"
            }
        )
    }
    if(workflowContext.Template !== undefined && workflowContext.stages[0].Actions.length > 0 && isReady)
    {
        return (
            <Box sx={{display: 'flex', gap: 2, flexDirection: 'column', justifyContent: 'center'}}>
                <Box sx={{flex: 1}}>
                    <ActionDescriptionCard description={workflowContext.Description}  mode="READONLY" />
                </Box>
                <Box sx={{flex: 4, mb: 2}}>
                    <ReactQueryWrapper data={workflowContext.WorkflowParameterInstance} isLoading={instancesLoading} error={instancesError} children={
                        () => (
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                                <Grid container sx={{mt: 3}}>
                                    <Grid item xs={4} />
                                    <Grid item xs= {4} >
                                        <Stepper nonLinear activeStep={recurrenceConfig.activeIndex} alternativeLabel>
                                            {IndexToComponent.map((component, index) => (
                                                <Step key={index}>
                                                    <StepButton onClick={() => handleGoToStep(index)}>
                                                        {IndexToComponent[index].label}
                                                    </StepButton>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Grid>
                                </Grid>
                                <Box> 
                                    {IndexToComponent[recurrenceConfig.activeIndex].component}
                                </Box>
                            </Box>
                        )
                    }/>
                    
                </Box>
                <Box sx={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', mt: 5}}>
                    <Box sx={{flex: 1, maxWidth: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2}}>
                        {saveWorkflowMutation.isLoading ? (
                            <LoadingIndicator/>
                        ) : (
                            <>
                            {recurrenceConfig.activeIndex ===  (IndexToComponent.length - 1)? (
                                <Button sx={{minWidth: '100%', background: 'rgba(241, 120, 182, 1)'}} variant="contained" onClick={executeWorkflow}>EXECUTE</Button>
                            ) : (
                                <Button sx={{minWidth: '50%', background: 'rgba(241, 120, 182, 1)'}} variant="contained" onClick={handleGoNext}>NEXT</Button>
                            )}
                            
                            </>
                        )}
                        
                    </Box>
                </Box>
                <Snackbar open={snackbarState} autoHideDuration={5000} onClose={() => setSnackbarState(false)} message="Execution Created"/>
            </Box>
        )
    } else if(loading || instancesLoading || !isReady){
        return <LoadingIndicator/>
    } else if(!!instancesError || !!error){
        return <>Fetching Instances Error...</>
    } else {
        return <NoData/>
    }
}


const ExecuteWorkflowHomePage = () => {
    const match = useRouteMatch()

    return (
        <WorkflowContextProvider>
            <Switch>
                <Route path={`${match.path}/:workflowId`} component={ExecuteWorkflow}/>
            </Switch>
        </WorkflowContextProvider>
    )
}

export default ExecuteWorkflowHomePage