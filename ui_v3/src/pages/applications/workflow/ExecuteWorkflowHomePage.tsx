import { Box, Button, Card, Grid, Snackbar, Step, StepButton, Stepper, Tooltip, IconButton, Typography } from "@mui/material"
import React from "react"
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom"
import { SCHEDULED_JOBS_ROUTE } from "../../../common/components/header/data/ApplicationRoutesConfig"
import LoadingIndicator from "../../../common/components/LoadingIndicator"
import { SetModuleContextState } from "../../../common/components/ModuleContext"
import NoData from "../../../common/components/NoData"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import ActionDescriptionCard from "../../../common/components/workflow-action/ActionDescriptionCard"
import useCreateWorkflowActionInstanceMutation from "../../../common/components/workflow/execute/hooks/useCreateWorkflowActionInstanceMutation"
import useGetActionInstanceDetails from "../../../common/components/workflow/execute/hooks/useGetActionInstanceDetails"
import { useGetWorkflowChildInstances, useGetWorkflowDetails } from "../../../common/components/workflow/execute/hooks/useGetWorkflowInstaces"
import { userSettingsSingleton } from "../../../data_manager/userSettingsSingleton"
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype"
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag"
import { ActionInstance, ActionParameterInstance, ProviderInstance } from "../../../generated/entities/Entities"
import { ActionDefinitionDetail, ActionInstanceDetails, ActionInstanceWithParameters } from "../../../generated/interfaces/Interfaces"
import ConfigureActionRecurring from "../../execute_action/components/ConfigureActionRecurring"
import ConfigureParameters, { isDefaultValueDefined } from "../../execute_action/components/ConfigureParameters"
import ConfigureSlackAndEmail from "../../execute_action/components/ConfigureSlackAndEmail"
import SelectProviderInstance from "../../execute_action/components/SelectProviderInstance"
import SelectProviderInstanceHook from "../../execute_action/components/SelectProviderInstanceHook"
import { safelyParseJSON } from "../../execute_action/util"
import { defaultWorkflowContext, SetWorkflowContext, WorkflowActionDefinition, WorkflowContext, WorkflowContextProvider } from "./WorkflowContext"
import EditIcon from '@mui/icons-material/Edit';

interface MatchParams {
    workflowId: string
}

interface ExecuteWorkflowProps {
    workflowId?: string,
    previousInstanceId?: string
}

export const ExecuteWorkflow = (props: ExecuteWorkflowProps) => {
    const match = useRouteMatch<MatchParams>()
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

    const areAllParametersFilled = () => {
        return workflowContext.WorkflowParameterInstance?.filter(wpi => !!wpi.ParameterValue || !!wpi.TableId || !!wpi.ColumnId)?.length === workflowContext.WorkflowParameterInstance?.length
    }

    const tableTypeParameterExists = workflowContext.WorkflowParameters?.some(apd => apd.Tag === ActionParameterDefinitionTag.TABLE_NAME)
    const pandasDataframeParameterExists = workflowContext.WorkflowParameters?.some(apd => apd.Tag === ActionParameterDefinitionTag.DATA && apd.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME)

    const saveWorkflowMutation = useCreateWorkflowActionInstanceMutation(workflowContext, handleInstanceSaved)
    const workflowId = props.workflowId || match.params.workflowId
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
        refetchFunction()
    }
    const { availableProviderInstanceQuery, availableProviderDefinitionQuery } = SelectProviderInstanceHook()
    const defaultProviderInstance = availableProviderInstanceQuery?.data?.find(prov => prov?.IsDefaultProvider)

    React.useEffect(() => {
        if(!!defaultProviderInstance && !workflowContext.SelectedProviderInstance){
            console.log("here")
            setWorkflowContext({type: 'SET_SELECTED_PROVIDER_INSTANCE', payload: {newProviderInstance: defaultProviderInstance}})
        }
    }, [defaultProviderInstance])

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
                    if(!parametersArray.find(parameter => parameter.ActionParameterDefinitionId === globalParameter.Id)){
                        parametersArray.push({
                            ...defaultParameterInstance,
                            TableId: mappedGlobalParameter.TableId || defaultParameterInstance?.TableId, 
                            ParameterValue: defaultParameterInstance?.ParameterValue || mappedGlobalParameter.ParameterValue , 
                            ActionParameterDefinitionId: globalParameter.Id
                        })
                    }
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

    const handlePreviousInstanceFetched = (data: ActionInstanceDetails[]) => {
        const actionInstanceDetails = data?.[0]
        if(!!actionInstanceDetails) {
            setWorkflowContext({type: 'CHANGE_WORKFLOW_PARAMETER_INSTANCES', payload: {'parameterInstances': actionInstanceDetails.ActionParameterInstance || []}})
        }
    }

    React.useEffect(() => {
        if(!!props.previousInstanceId && isReady) {
            actionInstanceDetailsQuery.refetch()
        }
    }, [props.previousInstanceId, isReady])

    React.useEffect(() => {
        setWorkflowContext({
            type: 'SET_ENTIRE_CONTEXT',
            payload: defaultWorkflowContext
        })
    }, [props.workflowId])

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
    const actionInstanceDetailsQuery = useGetActionInstanceDetails({filter: {Id: props.previousInstanceId}, options: {enabled: false, onSuccess: handlePreviousInstanceFetched}})
    const [workflowDefinition, error, loading] = useGetWorkflowDetails(workflowId, {enabled: workflowContext.Template === undefined, onSuccess: handleTemplate})
    const [workflowInstances, instancesError, instancesLoading, refetchFunction, isRefetching] = useGetWorkflowChildInstances(workflowId, {enabled: false, onSuccess: handleInstances})
    
    const handleEmailAndSlackChange = (slack?: string, email?: string) => {
        setRecurrenceConfig(config => ({
            ...config,
            slack: slack,
            email: email
        }))
    }

    const IndexToComponent: {component: React.ReactNode, label: string}[] = []

    if(workflowContext.WorkflowParameters.filter(apd => !isDefaultValueDefined(apd.DefaultParameterValue)).length > 0) {
        IndexToComponent.push(
            {
                component: <ConfigureParameters 
                    ActionParameterDefinitions={workflowContext.WorkflowParameters} 
                    ActionParameterInstances={workflowContext.WorkflowParameterInstance || []} 
                    ParameterAdditionalConfig={workflowContext.WorkflowParameterAdditionalConfigs || []}
                    handleParametersChange={handleParameterInstancesChange}
                    mode="GENERAL"
                />,
                label: "Required Input"
            }
        )
    }

    if(workflowContext.WorkflowParameters.filter(apd => isDefaultValueDefined(apd.DefaultParameterValue)).length > 0) {
        IndexToComponent.push(
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
        )
    }
    

    IndexToComponent.push(
        {
            component: <ConfigureSlackAndEmail parameterInstances={workflowContext.WorkflowParameterInstance || []} slack={recurrenceConfig.slack} email={recurrenceConfig.email} handleEmailAndSlackChange={handleEmailAndSlackChange}/>,
            label: "Notifcation"
        }   
    )

    if((!tableTypeParameterExists)&&(!pandasDataframeParameterExists)) {
        IndexToComponent.push({
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

    const handleEditFlow = () => {
        history.push(`/application/edit-workflow/${workflowId}`)
    }

    if(history.location.state !== 'fromTest') {
        IndexToComponent.push(
            {
                component: <ConfigureActionRecurring actionInstance = {recurrenceConfig.actionInstance} handleRecurringChange={handleRecurringChange} startDate={recurrenceConfig.startDate} handleStartDateChange={changeStartDate}/>,
                label: "Schedule"
            }
        )
    }
    if(workflowContext.Template !== undefined && workflowContext.stages[0].Actions.length > 0 && isReady && !actionInstanceDetailsQuery.isRefetching)
    {
        return (
            <Box sx={{display: 'flex', gap: 2, flexDirection: 'column', justifyContent: 'center',p:3}}>
                <Box sx={{flex: 1}}>
                    {/* <ActionDescriptionCard description={workflowContext.Description}  mode="READONLY" /> */}
                </Box>
                <Box sx={{flex: 4, mb: 2}}>
                    <ReactQueryWrapper data={workflowContext.WorkflowParameterInstance} isLoading={!isReady} error={instancesError} children={
                        () => (
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                                <Grid container sx={{mt: 0}}>
                                    <Grid item xs={2} />
                                    <Grid item xs= {8} >
                                        <Stepper nonLinear activeStep={recurrenceConfig.activeIndex} alternativeLabel>
                                            {IndexToComponent.map((component, index) => (
                                                <Step key={index}>
                                                    <StepButton onClick={() => handleGoToStep(index)}>
                                                        <Typography sx={{fontWeight:500}}>{IndexToComponent[index].label}</Typography>
                                                    </StepButton>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Grid>
                                    <Grid item xs={2} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                        <Tooltip title="Edit Flow">
                                            <IconButton onClick={handleEditFlow}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                                <Box> 
                                    {IndexToComponent[recurrenceConfig.activeIndex].component}
                                </Box>
                            </Box>
                        )
                    }/>
                    
                </Box>
                <Box sx={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', mt: 0,}}>
                    <Box sx={{flex: 1, maxWidth: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2}}>
                        {saveWorkflowMutation.isLoading ? (
                            <LoadingIndicator/>
                        ) : (
                            <>
                            {recurrenceConfig.activeIndex ===  (IndexToComponent.length - 1)? (
                                <Button sx={{width: '200px',backgroundColor: 'ActionConfigComponentBtnColor2.main',justifyContent: 'center'}} variant="contained" onClick={executeWorkflow}>EXECUTE</Button>
                            ) : (
                                <Box sx={{display: 'flex', flexDirection:'row', width:'25vw',justifyContent: 'center'}}>
                                    <Button sx={{mx:1, minWidth: '45%',position:'relative',left:0 ,backgroundColor: 'ActionConfigComponentBtnColor1.main'}} variant="contained" disabled={!areAllParametersFilled()} onClick={executeWorkflow}>EXECUTE</Button>
                                    <Button sx={{mx:1, minWidth: '45%',position:'relative',right:0 ,backgroundColor: 'ActionConfigComponentBtnColor2.main'}} variant="contained" onClick={handleGoNext}>NEXT</Button>
                                </Box>
                            )}
                            
                            </>
                        )}
                        
                    </Box>
                </Box>
                <Snackbar open={snackbarState} autoHideDuration={5000} onClose={() => setSnackbarState(false)} message="Execution Created"/>
            </Box>
        )
    } else if(loading || instancesLoading || !isReady || actionInstanceDetailsQuery.isRefetching){
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