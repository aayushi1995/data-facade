import { Box, Button, Grid, Step, StepButton, Stepper, Snackbar } from "@mui/material"
import React from "react"
import { Route, RouteComponentProps, Switch, useHistory, useRouteMatch } from "react-router-dom"
import ParameterDefinitionConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane"
import { SCHEDULED_JOBS_ROUTE } from "../../../common/components/header/data/ApplicationRoutesConfig"
import LoadingIndicator from "../../../common/components/LoadingIndicator"
import NoData from "../../../common/components/NoData"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import useCreateWorkflowActionInstanceMutation from "../../../common/components/workflow/execute/hooks/useCreateWorkflowActionInstanceMutation"
import { useGetWorkflowChildInstances, useGetWorkflowDetails } from "../../../common/components/workflow/execute/hooks/useGetWorkflowInstaces"
import { userSettingsSingleton } from "../../../data_manager/userSettingsSingleton"
import { ActionInstance, ActionParameterInstance } from "../../../generated/entities/Entities"
import { ActionDefinitionDetail, ActionInstanceWithParameters } from "../../../generated/interfaces/Interfaces"
import ActionDefinitionHero from "../../build_action/components/shared-components/ActionDefinitionHero"
import ConfigureActionRecurring from "../../execute_action/components/ConfigureActionRecurring"
import ConfigureSlackAndEmail from "../../execute_action/components/ConfigureSlackAndEmail"
import { SetWorkflowContext, WorkflowActionDefinition, WorkflowContext, WorkflowContextProvider } from "./WorkflowContext"

interface MatchParams {
    workflowId: string
}

const ExecuteWorkflow = ({match}: RouteComponentProps<MatchParams>) => {
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
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

    const saveWorkflowMutation = useCreateWorkflowActionInstanceMutation(workflowContext, handleInstanceSaved)
    const workflowId = match.params.workflowId
    const handleTemplate = (data: ActionDefinitionDetail[]) => {
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
                Parameters: actionInstanceWithParameters.ParameterInstances      
            } as WorkflowActionDefinition

            workflowContext.WorkflowParameters.forEach(globalParameter => {
                const mappedGlobalParameter = workflowAction.Parameters?.find(parameter => parameter.GlobalParameterId === globalParameter.Id)
                if(!!mappedGlobalParameter) {
                    parametersArray.push({TableId: mappedGlobalParameter.TableId, ParameterValue: mappedGlobalParameter.ParameterValue, ActionParameterDefinitionId: globalParameter.Id})
                }
            })
            const stageId = workflowContext.stages[0].Id
            setWorkflowContext({type: 'ADD_ACTION', payload: {stageId: stageId, Action: workflowAction}})
        }) 
        if(parametersArray.length > 0){
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
            component: <ParameterDefinitionConfigPlane parameterDefinitions={workflowContext.WorkflowParameters} parameterInstances={workflowContext.WorkflowParameterInstance || []} handleChange={handleParameterInstancesChange} />
        },
        {
            component: <ConfigureSlackAndEmail parameterInstances={workflowContext.WorkflowParameterInstance || []} slack={recurrenceConfig.slack} email={recurrenceConfig.email} handleEmailAndSlackChange={handleEmailAndSlackChange}/>,
        },
        {
            component: <ConfigureActionRecurring actionInstance = {recurrenceConfig.actionInstance} handleRecurringChange={handleRecurringChange} startDate={recurrenceConfig.startDate} handleStartDateChange={changeStartDate}/>
        }
    ]
    if(workflowContext.Template !== undefined && workflowContext.stages[0].Actions.length > 0 && isReady)
    {
        return (
            <Box sx={{display: 'flex', gap: 2, flexDirection: 'column', justifyContent: 'center'}}>
                <Box sx={{flex: 1}}>
                    <ActionDefinitionHero mode="READONLY" name={workflowContext.Name} description={workflowContext.Description} applicationId={workflowContext.ApplicationId} group={workflowContext.ActionGroup}/>
                </Box>
                <Box sx={{flex: 4, mb: 2}}>
                    <ReactQueryWrapper data={workflowContext.WorkflowParameterInstance} isLoading={instancesLoading} error={instancesError} children={
                        () => (
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                                <Grid container sx={{mt: 3}}>
                                    <Grid item xs={4} />
                                    <Grid item xs= {4} >
                                        <Stepper nonLinear activeStep={recurrenceConfig.activeIndex}>
                                            {IndexToComponent.map((component, index) => (
                                                <Step key={index}>
                                                    <StepButton onClick={() => handleGoToStep(index)}>
                                                        step {index+1}/{IndexToComponent.length}
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
                    <Box sx={{flex: 1, maxWidth: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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