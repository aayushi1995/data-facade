import CloseIcon from '@mui/icons-material/Close'
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Button } from "@mui/material"
import React from "react"
import { RouteComponentProps, useRouteMatch } from "react-router-dom"
import LoadingIndicator from '../../../common/components/LoadingIndicator'
import NoData from "../../../common/components/NoData"
import { StagesWithActions } from "../../../common/components/workflow/create/newStage/StagesWithActions"
import ExportAsDashboard from '../../../common/components/workflow/execute/ExportAsDashboard'
import useGetWorkflowStatus from "../../../common/components/workflow/execute/hooks/useGetWorkflowStatus"
import ShowWorkflowExecutionOutput from "../../../common/components/workflow/execute/ShowWorkflowExecutionOutput"
import ViewWorkflowStageResults from '../../../common/components/workflow/execute/ViewWorkflowStageResults'
import { WorkflowActionExecutions } from "../../../generated/interfaces/Interfaces"
import { ActionDefinitionHeroActionContextWrapper } from '../../build_action/components/shared-components/ActionDefinitionHero'
import { BuildActionContext, BuildActionContextProvider, SetBuildActionContext } from '../../build_action/context/BuildActionContext'
import ViewActionExecution from '../../view_action_execution/VIewActionExecution'
import ViewWorkflowExecutionNew from './ViewWorkflowExecutionNew'
import { SetWorkflowContext, WorkflowContext, WorkflowContextProvider } from "./WorkflowContext"

interface MatchParams {
    workflowExecutionId: string
}

const ViewWorkflowExecution = ({match}: RouteComponentProps<MatchParams>) => {
    const workflowExecutionId = match.params.workflowExecutionId
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)

    const actionContext = React.useContext(BuildActionContext)
    const setActionContext = React.useContext(SetBuildActionContext)
    
    const [areChildActionsReady, setAreChildActionReady] = React.useState<boolean>(false)
    const [areActionsCompleted, setAreActionsCompleted] = React.useState<boolean>(false)
    const [resultsAvailable, setResultsAvailable] = React.useState<boolean>(false)

    const checkIfActionsCompleted = (data: WorkflowActionExecutions[]) => {
        var areActionsCompleted = true
        data[0].ChildExecutionsWithDefinitions?.forEach(child => {
            if(child?.ActionExecution?.Status !== 'Completed' && child?.ActionExecution?.Status !== 'Failed') {
                areActionsCompleted = false;
            }
        })
        
        setAreActionsCompleted(areActionsCompleted)
    }

    const handleRefreshQuery = (data?: WorkflowActionExecutions[]) => {
        if(data?.[0]?.ChildExecutionsWithDefinitions?.length || 0 > 0) {
            if(areChildActionsReady === false) {
                setWorkflowContext({type: 'DELETE_STAGE', payload: {stageId: workflowContext.stages[0].Id}})
            }
            const workflowExecutionStartedOn = data?.[0]?.WorkflowExecution?.ExecutionStartedOn || (new Date(Date.now()).getTime())
            var currentStageId = ""
            const totalChildExecutions = data?.[0]?.ChildExecutionsWithDefinitions?.length || 0
            const childExecutions = data?.[0]?.ChildExecutionsWithDefinitions
            for(let i = 0; i < totalChildExecutions; i++) {
                currentStageId = childExecutions?.[i]?.stageId || "stageId"
                const stageActions = []
                while(i<totalChildExecutions && childExecutions?.[i]?.stageId === currentStageId) {
                    stageActions.push({
                        Id: childExecutions?.[i]?.ActionExecution?.Id || "executionId",
                        ActionGroup: childExecutions?.[i]?.ActionDefinition?.ActionGroup || "Action Group NA",
                        DisplayName: childExecutions?.[i]?.ActionDefinition?.DisplayName || "Name",
                        DefaultActionTemplateId: childExecutions?.[i]?.ActionDefinition?.DefaultActionTemplateId || "templateId",
                        Parameters: [],
                        ExecutionStatus: childExecutions?.[i]?.ActionExecution?.Status || "Created",
                        ExecutionStartedOn: childExecutions?.[i]?.ActionExecution?.ExecutionStartedOn,
                        ExecutionCompletedOn: childExecutions?.[i]?.ActionExecution?.ExecutionCompletedOn,
                        PresentationFormat: childExecutions?.[i]?.ActionDefinition?.PresentationFormat
                    })
                    i++;
                }
                i--;
                const currentStage = workflowContext.stages.find(stage => stage.Id === currentStageId)
                if(!!currentStage) {
                    var completedActions = 0;
                    stageActions.forEach((stageAction, index) => {
                        setWorkflowContext({type: 'UPDATE_CHILD_STATUS', payload: {
                            stageId: currentStageId,
                            actionId: stageAction.Id,
                            actionIndex: index,
                            newStatus: stageAction.ExecutionStatus,
                            ExecutionStartedOn: stageAction.ExecutionStartedOn,
                            ExecutionCompletedOn: stageAction.ExecutionCompletedOn
                        }})
                        if(stageAction.ExecutionStatus === 'Completed' || stageAction.ExecutionStatus === 'Failed') {
                            completedActions++;
                        }
                    })
                    setWorkflowContext({type: 'CHANGE_STAGE_PERCENTAGE', payload: {
                        stageId: currentStageId,
                        percentage: (completedActions/stageActions.length) * 100
                    }})
                } else {
                    setWorkflowContext({type: 'ADD_STAGE', payload: {
                        Name: childExecutions?.[i]?.stageName || "stage",
                        Id: currentStageId,
                        Actions: stageActions
                    }})
                }

            }
            setWorkflowContext({type: 'SET_WORKFLOW_DETAILS', payload: {actionName: data?.[0]?.WorkflowDefinition?.DisplayName || "WorkflowName", description: data?.[0]?.WorkflowDefinition?.Description || "NA"}})
            setWorkflowContext({type: 'CHANGE_EXECUTION_STATUS', payload: {status: data?.[0]?.WorkflowExecution?.Status || "NA"}})
            setWorkflowContext({type: 'SET_DRAGGABLE_PROPERTY', payload: false})
            setWorkflowContext({type: 'SET_APPLICATION_ID', payload: data?.[0]?.WorkflowDefinition?.ApplicationId })
            setWorkflowContext({type: 'SET_ACTION_GROUP', payload: data?.[0]?.WorkflowDefinition?.ActionGroup })
            setWorkflowContext({type: 'CHANGE_DESCRIPTION', payload: { newDescription: data?.[0]?.WorkflowDefinition?.Description||"NA" }})
            setWorkflowContext({type: "SET_PUBLISHED_STATUS", payload: data?.[0]?.WorkflowDefinition?.PublishStatus })
            setWorkflowContext({type: 'SET_WORKFLOW_EXECUTION_STARTED_ON', payload: workflowExecutionStartedOn})
            setWorkflowContext({type: 'SET_MODE', payload: 'EXECUTING'})
            
            setActionContext({ type: "SetActionDefinition", payload: { newActionDefinition: data?.[0]?.WorkflowDefinition}})
            
            setAreChildActionReady(true)   
            checkIfActionsCompleted(data || [])

            if(data?.[0]?.WorkflowExecution?.Status === "Completed" || data?.[0]?.WorkflowExecution?.Status === "Failed") {
                setResultsAvailable(true)
                setWorkflowContext({type: 'SET_WORKFLOW_EXECUTION_COMPLETED_ON', payload: data?.[0]?.WorkflowExecution?.ExecutionCompletedOn || (new Date(Date.now()).getTime())})
            }
        }
        
    }

    const handlePreviewDialogClose = () => {
        setWorkflowContext({type: 'SET_EXECUTION_FOR_PREVIEW', payload: undefined})
    }

    const handleResultsDialogClose = () => {
        setAreActionsCompleted(false)
    }

    const [workflowActionExecutionData, workflowActionExecutionError, workflowActionExecutionLoading] = useGetWorkflowStatus(workflowExecutionId, {enabled: (workflowContext.WorkflowExecutionStatus !== 'Completed' && workflowContext.WorkflowExecutionStatus !== 'Failed'), handleSuccess: handleRefreshQuery})

    if(!areChildActionsReady){
        return <LoadingIndicator/>
    } else if(workflowActionExecutionError) {
        return <NoData/>
    } else {
        return (
            <Box sx={{display: 'flex', minWidth: '100%', minHeight: '100%', flexDirection: 'column', gap: 3, justifyContent: 'center'}}>
                <Dialog open={areActionsCompleted} fullWidth maxWidth="xl" scroll="paper">
                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <IconButton aria-label="close" onClick={handleResultsDialogClose}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                    <DialogTitle sx={{display: 'flex', gap: 20, alignItems: 'center'}}>
                        Results
                        <Box>
                            <ExportAsDashboard executionId={workflowExecutionId} definitionName={workflowContext.Name}/>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{overflow: 'auto', p: 1}}>
                        <ShowWorkflowExecutionOutput/>
                    </DialogContent>
                </Dialog>
                <Dialog open={workflowContext.actionExecutionIdForPreview !== undefined} onClose={handleResultsDialogClose} fullWidth maxWidth="xl" scroll="paper">
                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}} onClick={handlePreviewDialogClose}>
                        <IconButton aria-label="close" >
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                    <DialogTitle>Output preview</DialogTitle>
                    <DialogContent sx={{overflow: 'auto', p: 1, display: 'flex', gap: 2, flexDirection: 'column'}}>
                        <ViewActionExecution actionExecutionId={workflowContext.actionExecutionIdForPreview?.executionId || "executionId"}/>
                    </DialogContent>
                </Dialog>
                <Box sx={{display: 'flex', minWidth: '100%', flex: 1}}>
                    <ActionDefinitionHeroActionContextWrapper mode="READONLY"/>
                </Box>
                <Box sx={{flex: 4, minHeight: '100%', minWidth: '100%', mb: 4}}>
                    {workflowContext.currentSelectedStage ? (
                        <ViewWorkflowStageResults />
                    ) : (
                        <StagesWithActions/>
                    )}
                    
                </Box>
                <Box sx={{mt: 2, mb: 2, display: 'flex', justifyContent: 'flex-end', mr: 2}}>
                    <Button variant="contained" color="primary" disabled={!resultsAvailable} onClick={() => setAreActionsCompleted(true)} size="large">View Results</Button>
                </Box>
            </Box>
        )
    }
}

export const ViewWorkflowExecutionHomePage = () => {
    const match = useRouteMatch<MatchParams>()

    const workflowExecutionId = match.params.workflowExecutionId
    return (
        <WorkflowContextProvider>
            <BuildActionContextProvider>
                {/* <Switch>
                    <Route path={`${match.path}/:workflowExecutionId`} component={ViewWorkflowExecutionNew}/>
                </Switch> */}
                <ViewWorkflowExecutionNew workflowExecutionId={workflowExecutionId} />
            </BuildActionContextProvider>
        </WorkflowContextProvider>
    )
}


export default ViewWorkflowExecutionHomePage