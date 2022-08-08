import CloseIcon from '@mui/icons-material/Close'
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Button } from "@mui/material"
import React from "react"
import { Route, RouteComponentProps, Switch, useRouteMatch } from "react-router-dom"
import LoadingIndicator from '../../../common/components/LoadingIndicator'
import { SetModuleContextState } from '../../../common/components/ModuleContext'
import NoData from "../../../common/components/NoData"
import { ReactQueryWrapper } from '../../../common/components/ReactQueryWrapper'
import ViewActionExecutionOutput from "../../../common/components/ViewActionExecutionOutput"
import ActionDescriptionCard from '../../../common/components/workflow-action/ActionDescriptionCard'
import { StagesWithActions } from "../../../common/components/workflow/create/newStage/StagesWithActions"
import ExportAsDashboard from '../../../common/components/workflow/execute/ExportAsDashboard'
import useGetWorkflowStatus from "../../../common/components/workflow/execute/hooks/useGetWorkflowStatus"
import ShowWorkflowExecutionOutput from '../../../common/components/workflow/execute/ShowWorkflowExecutionOutput'
import ActionExecutionStatus from '../../../enums/ActionExecutionStatus'
import { WorkflowActionExecutions } from "../../../generated/interfaces/Interfaces"
import ActionExecutionCard from '../../apps/components/ActionExecutionCard'
import { BuildActionContext, BuildActionContextProvider, SetBuildActionContext } from '../../build_action/context/BuildActionContext'
import ViewActionExecution from '../../view_action_execution/VIewActionExecution'
import { ExecuteWorkflow } from './ExecuteWorkflowHomePage'
import { defaultWorkflowContext, SetWorkflowContext, WorkflowContext, WorkflowContextProvider } from "./WorkflowContext"
import WorkflowExecutionStages from './WorkflowExecutionStages'

interface ViewWorkflowExecutionProps {
    workflowExecutionId: string
}

const ViewWorkflowExecutionNew = (props: ViewWorkflowExecutionProps) => {
    const workflowExecutionId = props.workflowExecutionId
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const setModuleStateContext = React.useContext(SetModuleContextState)

    const actionContext = React.useContext(BuildActionContext)
    const setActionContext = React.useContext(SetBuildActionContext)
    const [initialTime, setInitialTime] = React.useState<number>(Date.now())
    const [showParameters, setShowParameters] = React.useState(false)
    
    const [areChildActionsReady, setAreChildActionReady] = React.useState<boolean>(false)
    const [resultsAvailable, setResultsAvailable] = React.useState<boolean>(false)

    const handleRefreshQuery = (data?: WorkflowActionExecutions[]) => {
        setModuleStateContext({
            type: 'SetHeader',
            payload: {
                newHeader: {
                    Title: data?.[0]?.WorkflowExecution?.ActionInstanceName,
                    SubTitle: "Run on " + (new Date(data?.[0]?.WorkflowExecution?.ScheduledTime || Date.now()).toString())
                }
            }
        })

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
                        } else if(stageAction.ExecutionStatus === ActionExecutionStatus.STARTED) {
                            if(currentStage.stageStarted !== true) {
                                setWorkflowContext({
                                    type: 'SET_STAGE_STARTED_TIME',
                                    payload: {
                                        stageId: currentStageId,
                                        startedOn: Date.now()
                                    }
                                })
                            }
                        } 
                        if(stageAction.ExecutionStatus === ActionExecutionStatus.FAILED) {
                            setWorkflowContext({
                                type: 'SET_STAGE_FAILED',
                                payload: {
                                    stageId: currentStageId
                                }
                            })
                        }
                    })
            
                    if(completedActions === currentStage.Actions.length) {
                        setWorkflowContext({
                            type: 'SET_STAGE_COMPLETED',
                            payload: {
                                stageId: currentStageId
                            }
                        })
                    }
                } else {
                    setWorkflowContext({type: 'ADD_STAGE', payload: {
                        Name: childExecutions?.[i]?.stageName || "stage",
                        Id: currentStageId,
                        Actions: stageActions,
                        completed: data?.[0]?.WorkflowExecution?.Status === ActionExecutionStatus.COMPLETED || data?.[0]?.WorkflowExecution?.Status === ActionExecutionStatus.FAILED
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

            if(data?.[0]?.WorkflowExecution?.Status === "Completed" || data?.[0]?.WorkflowExecution?.Status === "Failed") {
                setResultsAvailable(true)
                setWorkflowContext({type: 'SET_WORKFLOW_EXECUTION_COMPLETED_ON', payload: data?.[0]?.WorkflowExecution?.ExecutionCompletedOn || (new Date(Date.now()).getTime())})
            }
        }
        
    }

    const handlePreviewDialogClose = () => {
        setWorkflowContext({type: 'SET_EXECUTION_FOR_PREVIEW', payload: undefined})
    }

    const increaseTime = () => {
        if(!workflowContext.WorkflowExecutionCompletedOn){
            setInitialTime(time => time + 1000)
        }
    }

    React.useEffect(() => {
        setInitialTime(Date.now())
        setInterval(increaseTime, 1000)
        setAreChildActionReady(false)
        setShowParameters(false)
        setWorkflowContext({
            type: 'SET_ENTIRE_CONTEXT',
            payload: defaultWorkflowContext
        })

    }, [props.workflowExecutionId])

    const [workflowActionExecutionData, workflowActionExecutionError, workflowActionExecutionLoading] = useGetWorkflowStatus(workflowExecutionId, {enabled: (workflowContext.WorkflowExecutionStatus !== 'Completed' && workflowContext.WorkflowExecutionStatus !== 'Failed'), handleSuccess: handleRefreshQuery})

    const getElapsedTime = () => {
        const finalTime = workflowContext.WorkflowExecutionCompletedOn || initialTime
        console.log(finalTime, initialTime)
        const timeInMilliseconds = finalTime - (workflowContext.WorkflowExecutionStartedOn || 0)

        const timeInSeconds = timeInMilliseconds/1000
        const m = Math.floor(timeInSeconds / 60).toString().padStart(2,'0')
        const s = Math.floor(timeInSeconds % 60).toString().padStart(2,'0');

        return m + ' MIN ' + s + ' SEC'

    }

    const handleShowParameters = () => {
        setShowParameters(showParameters => !showParameters)
    }
    const handleShowResults = () => {
        setResultsAvailable(true)
    }

    return (
        <ReactQueryWrapper isLoading={workflowActionExecutionLoading} error={workflowActionExecutionError} data={workflowActionExecutionData}>
            {() => {
                if(!areChildActionsReady){
                    return <LoadingIndicator/>
                } else if(workflowActionExecutionError) {
                    return <NoData/>
                } else {
                    return (
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                            <Dialog open={resultsAvailable} onClose={() => setResultsAvailable(false)} fullWidth maxWidth="xl">
                                <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <IconButton aria-label="close" onClick={() => setResultsAvailable(false)}>
                                        <CloseIcon/>
                                    </IconButton>
                                </Grid>
                                <DialogTitle sx={{display: 'flex', gap: 20, alignItems: 'center'}}>
                                    Results
                                    <Box>
                                        <ExportAsDashboard executionId={workflowExecutionId} definitionName={workflowContext.Name}/>
                                    </Box>
                                </DialogTitle>
                                <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                    <ShowWorkflowExecutionOutput/>
                                </DialogContent>
                            </Dialog>
                            <ActionDescriptionCard description={workflowContext.Description} mode="READONLY"/>
                            <ActionExecutionCard 
                                elapsedTime={getElapsedTime()} 
                                actionExecution={workflowActionExecutionData?.[0]?.WorkflowExecution || {}}  
                                arrowState={showParameters ? "DOWN": "UP"}
                                handleClickArrow={handleShowParameters}
                                terminalState={!!workflowContext.WorkflowExecutionCompletedOn} 
                                error={workflowActionExecutionData?.[0]?.WorkflowExecution?.Status === ActionExecutionStatus.FAILED}
                                isWorkflow={true}
                                handleShowResult={handleShowResults}
                                />
                            {showParameters ? (
                                <WorkflowContextProvider>
                                    <ExecuteWorkflow workflowId={workflowActionExecutionData?.[0]?.WorkflowDefinition?.Id} previousInstanceId={workflowActionExecutionData?.[0]?.WorkflowExecution?.InstanceId}/>
                                </WorkflowContextProvider>
                            ) : (<></>)}
                            <WorkflowExecutionStages/>
                        </Box>
                    )
                }
            }}
        </ReactQueryWrapper>
    )

}

export default ViewWorkflowExecutionNew