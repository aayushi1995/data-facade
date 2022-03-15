import { Box, Button } from "@mui/material"
import React from "react"
import { Route, Switch, useRouteMatch, RouteComponentProps, useHistory } from "react-router-dom"
import { useGetWorkflowDetails } from "../../../common/components/workflow/execute/hooks/useGetWorkflowInstaces"
import { ActionParameterInstance } from "../../../generated/entities/Entities"
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces"
import useActionDefinitionDetail from "../../build_action/hooks/useActionDefinitionDetail"
import { SetWorkflowContext, WorkflowActionDefinition, WorkflowContext, WorkflowContextProvider, WorkflowContextType } from "./WorkflowContext"
import WorkflowHeroInfo from "../../../common/components/workflow-editor/WorkflowHero"
import { StagesWithActions } from "../../../common/components/workflow/create/newStage/StagesWithActions"
import NoData from "../../../common/components/NoData"
import { AddingActionView } from "../../../common/components/workflow/create/addAction/AddingActionView"
import { WorkflowHeroWrapper } from "../../build_workflow/BuildWorkflowHomePage"
import { useUpdateWorkflow } from "../../../common/components/workflow/edit/hooks/useUpdateWorkflow"


interface MatchParams {
    workflowId: string
}

export interface WorkflowTemplateType {
    Id: string,
    DisplayName: string,
    DefaultActionTemplateId: string,
    ParameterValues: object,
    stageId: string,
    stageName: string
}

const EditWorkflow = ({match}: RouteComponentProps<MatchParams>) => {
    const history = useHistory()
    const workflowId = match.params.workflowId
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const [isWorkflowFetched, setIsWorkflowFetched] = React.useState(false)
    const useWorkflowUpdate = useUpdateWorkflow("UpdateWorkflow", workflowContext)

    const handleSuccess = (data: ActionDefinitionDetail[]) => {
        const workflowTemplate = data?.[0]?.ActionTemplatesWithParameters?.[0]?.model?.Text || "{}"
        const workflowParameters = data?.[0]?.ActionTemplatesWithParameters?.[0]?.actionParameterDefinitions?.map(apd => apd?.model || {}) || []
        const workflowDefinition = data?.[0]?.ActionDefinition?.model
        const workflowContextObject: WorkflowContextType = {
            stages: [],
            Name: workflowDefinition?.DisplayName || "",
            WorkflowParameters: workflowParameters || [],
            Description: workflowDefinition?.Description || "",
            Author: workflowDefinition?.CreatedBy || "",
            draggingAllowed: true,
            ApplicationId: workflowDefinition?.ApplicationId,
            Template: data?.[0]?.ActionTemplatesWithParameters?.[0]?.model
        }
        const workflowActions = JSON.parse(workflowTemplate) as WorkflowTemplateType[]
        for(let i = 0; i < workflowActions.length; i++) {
            const currentStageId = workflowActions[i].stageId
            const currentStageName = workflowActions[i].stageName
            const stageActions: WorkflowActionDefinition[] = []
            while(i < workflowActions.length && workflowActions[i].stageId === currentStageId) {
                const parameterMappings = workflowActions[i].ParameterValues
                const parameters = Object.entries(parameterMappings).map(([parameterDefinitionId, parameterInstance]) => {
                    const actionParameter = {
                        ...parameterInstance,
                        ActionParameterDefinitionId: parameterDefinitionId,
                        userInputRequired: parameterInstance.GlobalParameterId ? "Yes" : "No"
                    }
                    return actionParameter
                })
                stageActions.push({
                    Id: workflowActions[i].Id,
                    ActionGroup: "Data Cleansing", // TODO: Remove Hard Coding after introduction of groups
                    DisplayName: workflowActions[i].DisplayName,
                    DefaultActionTemplateId: workflowActions[i].DefaultActionTemplateId,
                    Parameters: parameters
                })  
                i++;
            }
            workflowContextObject.stages.push({
                Id: currentStageId,
                Name: currentStageName,
                Actions: stageActions
            })
            i--;
        }
        setIsWorkflowFetched(true)
        setWorkflowContext({type: 'SET_ENTIRE_CONTEXT', payload: workflowContextObject})
    }

    const [workflowDetails, error, isLoading] = useGetWorkflowDetails(workflowId, {enabled: !isWorkflowFetched, onSuccess: handleSuccess})
    
    const handleReset = () => {
        setIsWorkflowFetched(false)
    }
    
    const handleUpdate = () => {
        useWorkflowUpdate.mutate({
            workflowId: workflowId
        },{
            onSuccess: () => {
                console.log("UPDATED")
                history.goBack()
            }
        })
    }

    if(isWorkflowFetched && !useWorkflowUpdate.isLoading) {
        return (
            <Box sx={{display: 'flex', minWidth: '100%', minHeight: '100%', flexDirection: 'column', gap: 3, justifyContent: 'center'}}>
               <Box sx={{display: 'flex', minWidth: '100%', flex: 1}}>
                    <WorkflowHeroWrapper/>
                </Box>
                <Box sx={{flex: 4, minHeight: '100%', minWidth: '100%'}}>
                    {workflowContext.currentSelectedStage ? (
                        <AddingActionView/>
                    ) : (
                        <StagesWithActions/>
                    )}
                </Box> 
                <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}} mb={3}>
                    <Button variant="contained" color="primary" onClick={handleUpdate}>Update Workflow</Button>
                    <Button variant="contained" color="primary" onClick={handleReset}>Reset Changes</Button>
                </Box>
            </Box>
        )
    } else if(error){
        return <NoData/>
    } else {
        return <>Loading...</>
    }
}

const EditWorkflowHomePage = () => {

    const match = useRouteMatch()
    return (
        <Switch>
            <WorkflowContextProvider>
                <Route path={`${match.path}/:workflowId`} component={EditWorkflow}/>
            </WorkflowContextProvider>
        </Switch>
    )
}

export default EditWorkflowHomePage