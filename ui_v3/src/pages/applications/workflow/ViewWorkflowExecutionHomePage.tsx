import { Box } from "@material-ui/core"
import React from "react"
import { Route, RouteComponentProps, Switch, useRouteMatch } from "react-router-dom"
import NoData from "../../../common/components/NoData"
import WorkflowHeroInfo from "../../../common/components/workflow-editor/WorkflowHero"
import { StagesWithActions } from "../../../common/components/workflow/create/newStage/StagesWithActions"
import useGetWorkflowStatus from "../../../common/components/workflow/execute/hooks/useGetWorkflowStatus"
import { WorkflowActionExecutions } from "../../../generated/interfaces/Interfaces"
import { SetWorkflowContext, WorkflowActionDefinition, WorkflowContext, WorkflowContextProvider } from "./WorkflowContext"

interface MatchParams {
    workflowExecutionId: string
}

const ViewWorkflowExecution = ({match}: RouteComponentProps<MatchParams>) => {
    const workflowExecutionId = match.params.workflowExecutionId
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const [areChildActionsReady, setAreChildActionReady] = React.useState<boolean>(false)
    console.log(workflowContext)

    const handleRefreshQuery = (data?: WorkflowActionExecutions[]) => {
        if(data?.[0]?.ChildExecutionsWithDefinitions?.length || 0 > 0) {
            if(areChildActionsReady === false) {
                setWorkflowContext({type: 'DELETE_STAGE', payload: {stageId: workflowContext.stages[0].Id}})
            }
            console.log(data)
            var currentStageId = ""
            const totalChildExecutions = data?.[0]?.ChildExecutionsWithDefinitions?.length || 0
            const childExecutions = data?.[0]?.ChildExecutionsWithDefinitions
            for(let i = 0; i < totalChildExecutions; i++) {
                currentStageId = childExecutions?.[i]?.stageId || "stageId"
                const stageActions = []
                while(i<totalChildExecutions && childExecutions?.[i]?.stageId === currentStageId) {
                    stageActions.push({
                        Id: childExecutions?.[i]?.ActionExecution?.Id || "executionId",
                        ActionGroup: "DataCleansing",
                        DisplayName: childExecutions?.[i]?.ActionDefinition?.DisplayName || "Name",
                        DefaultActionTemplateId: childExecutions?.[i]?.ActionDefinition?.DefaultActionTemplateId || "templateId",
                        Parameters: [],
                        ExecutionStatus: childExecutions?.[i]?.ActionExecution?.Status || "Created"
                    })
                    i++;
                }
                const currentStage = workflowContext.stages.find(stage => stage.Id === currentStageId)
                if(!!currentStage) {
                    stageActions.forEach((stageAction, index) => {
                        setWorkflowContext({type: 'UPDATE_CHILD_STATUS', payload: {
                            stageId: currentStageId,
                            actionId: stageAction.Id,
                            actionIndex: index,
                            newStatus: stageAction.ExecutionStatus
                        }})
                    })
                } else {
                    setWorkflowContext({type: 'ADD_STAGE', payload: {
                        Name: childExecutions?.[i]?.stageName || "stage",
                        Id: currentStageId,
                        Actions: stageActions
                    }})
                }
                i--;

            }
            setWorkflowContext({type: 'SET_WORKFLOW_DETAILS', payload: {actionName: data?.[0]?.WorkflowDefinition?.DisplayName || "WorkflowName", description: data?.[0]?.WorkflowDefinition?.Description || "NA"}})
            setWorkflowContext({type: 'CHANGE_EXECUTION_STATUS', payload: {status: data?.[0]?.WorkflowExecution?.Status || "NA"}})
            setWorkflowContext({type: 'SET_DRAGGABLE_PROPERTY', payload: false})
            setAreChildActionReady(true)   
        }
        
    }

    const [workflowActionExecutionData, workflowActionExecutionError, workflowActionExecutionLoading] = useGetWorkflowStatus(workflowExecutionId, {enabled: (workflowContext.WorkflowExecutionStatus !== 'Completed' && workflowContext.WorkflowExecutionStatus !== 'Failed'), handleSuccess: handleRefreshQuery})

    if(!areChildActionsReady){
        return <>Loading...</>
    } else if(workflowActionExecutionError) {
        return <NoData/>
    } else {
        return (
            <Box sx={{display: 'flex', minWidth: '100%', minHeight: '100%', flexDirection: 'column', gap: 3, justifyContent: 'center'}}>
                <Box sx={{display: 'flex', minWidth: '100%', flex: 1}}>
                    <WorkflowHeroInfo readonly={true} Name={workflowContext.Name} Description={workflowContext.Description} Author={workflowContext.Author}/>
                </Box>
                <Box sx={{flex: 4, minHeight: '100%', minWidth: '100%', mb: 4}}>
                    <StagesWithActions/>
                </Box>
            </Box>
        )
    }
}

export const ViewWorkflowExecutionHomePage = () => {
    const match = useRouteMatch()
    return (
        <WorkflowContextProvider>
            <Switch>
                <Route path={`${match.path}/:workflowExecutionId`} component={ViewWorkflowExecution}/>
            </Switch>
        </WorkflowContextProvider>
    )
}

export default ViewWorkflowExecutionHomePage