import React from "react"
import { Route, RouteComponentProps, Switch, useHistory, useRouteMatch } from "react-router-dom"
import ParameterDefinitionsConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane"
import { useGetWorkflowChildInstances, useGetWorkflowDetails } from "../../../common/components/workflow/execute/hooks/useGetWorkflowInstaces"
import { SetWorkflowContext, WorkflowActionDefinition, WorkflowContext, WorkflowContextProvider } from "./WorkflowContext"
import ParameterDefinitionConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane"
import { ActionDefinitionDetail, ActionInstanceWithParameters } from "../../../generated/interfaces/Interfaces"
import NoData from "../../../common/components/NoData"
import { Box, Button } from "@material-ui/core"
import WorkflowHero  from "../../../common/components/workflow-editor/WorkflowHero"
import { ActionParameterInstance } from "../../../generated/entities/Entities"
import useCreateWorkflowActionInstanceMutation from "../../../common/components/workflow/execute/hooks/useCreateWorkflowActionInstanceMutation"

interface MatchParams {
    workflowId: string
}

const ExecuteWorkflow = ({match}: RouteComponentProps<MatchParams>) => {
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const history = useHistory()

    const handleInstanceSaved = (data: any) => {
        history.push(`/workflow-execution/${data?.[0]?.Id}`)
    }

    const saveWorkflowMutation = useCreateWorkflowActionInstanceMutation(workflowContext, handleInstanceSaved)
    const workflowId = match.params.workflowId
    
    console.log(workflowContext)
    const handleTemplate = (data: ActionDefinitionDetail[]) => {
        setWorkflowContext({type: 'ADD_ACTION_TEMPLATE', payload: {template: data?.[0]?.ActionTemplatesWithParameters?.[0].model}})
        setWorkflowContext({type: 'CHANGE_NAME', payload: {newName: data?.[0]?.ActionDefinition?.model?.DisplayName || "workflow"}})
        setWorkflowContext({type: 'CHANGE_DESCRIPTION', payload: {newDescription: data?.[0]?.ActionDefinition?.model?.Description || "NA"}})
        setWorkflowContext({type: 'ADD_WORKFLOW_PARAMETERS', payload: data?.[0]?.ActionTemplatesWithParameters?.[0]?.actionParameterDefinitions?.map(parameter => parameter?.model || {}) || []})
    }

    const handleInstances = (data: ActionInstanceWithParameters[]) => {
        console.log("ACTION INSTANCES", data)
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
            const stageId = workflowContext.stages[0].Id
            setWorkflowContext({type: 'ADD_ACTION', payload: {stageId: stageId, Action: workflowAction}})
        }) 
    }

    const handleParameterInstancesChange = (newGlobalParameterInstances: ActionParameterInstance[]) => {
        setWorkflowContext({type: 'CHANGE_WORKFLOW_PARAMETER_INSTANCES', payload: {parameterInstances: newGlobalParameterInstances}})
    }

    const executeWorkflow = () => {
        saveWorkflowMutation.mutate({workflowId: workflowId, workflowName: workflowContext.Name})
    }

    const [workflowDefinition, error, loading] = useGetWorkflowDetails(workflowId, {enabled: workflowContext.Template === undefined, onSuccess: handleTemplate})
    const [workflowInstances, instancesError, instancesLoading] = useGetWorkflowChildInstances(workflowId, {enabled: ((workflowDefinition?.length || 0) > 0 && workflowContext.stages[0].Actions.length === 0), onSuccess: handleInstances})

    if(workflowContext.Template !== undefined && workflowContext.stages[0].Actions.length > 0)
    {
        return (
            <Box sx={{display: 'flex', gap: 2, flexDirection: 'column', justifyContent: 'center'}}>
                <Box sx={{flex: 1}}>
                    <WorkflowHero readonly={true} Name={workflowContext.Name} Description={workflowContext.Description}/>
                </Box>
                <Box sx={{flex: 4, mb: 2}}>
                    <ParameterDefinitionConfigPlane parameterDefinitions={workflowContext.WorkflowParameters} parameterInstances={workflowContext.WorkflowParameterInstance || []} handleChange={handleParameterInstancesChange}/>
                </Box>
                <Box sx={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', mt: 5}}>
                    <Box sx={{flex: 1, maxWidth: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Button sx={{minWidth: '100%', background: 'rgba(241, 120, 182, 1)'}} variant="contained" onClick={executeWorkflow}>TEST/EXECUTE</Button>
                    </Box>
                </Box>
            </Box>
        )
    } else if(loading || instancesLoading){
        return <>Loading...</>
    } else if(instancesError || error){
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