import CloseIcon from '@mui/icons-material/Close'
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Button, Typography, Card, Divider, Tooltip } from "@mui/material"
import React, { useState } from "react"
import { RouteComponentProps, useLocation, useRouteMatch } from "react-router-dom"
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
import { defaultWorkflowContext, SetWorkflowContext, WorkflowContext, WorkflowContextProvider } from "./WorkflowContext"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ExecuteWorkflow } from './ExecuteWorkflowHomePage'
import ActionExecutionStatus from '../../../enums/ActionExecutionStatus'
import { SetModuleContextState } from '../../../common/components/ModuleContext'
import StepSlider from '../../../common/StepSlider'
import WorkflowStagesWrapper from '../../../application/common/workflowStages/WorkflowStagesWrapper'
import SaveAndBuildChartContextProvider from '../../../common/components/charts/SaveAndBuildChartsContext'
import SaveAndBuildChartsFromExecution from '../../../common/components/charts/SaveAndBuildChartsFromExecution'
import WorkflowActionContainer from './WorkflowActionContainer'
import leftExpandIcon from '../../../../src/images/left expand.svg'
import RightExpandIcon from '../../../../src/images/right expand.svg'
import { ActionParameterInstance } from '../../../generated/entities/Entities'
import useReRunWorkflowAction from '../../../common/components/workflow/execute/hooks/useReRunWorkflowAction'
import { ActionExecutionDetails } from '../../apps/components/ActionExecutionHomePage'

interface MatchParams {
    workflowExecutionId: string
}

interface ViewWorkflowExecutionProps {
    workflowExecutionId: string,
    handleReceivePreviousInstanceId?: (previousInstanceId: string) => void
}

export const ViewWorkflowExecution = (props: ViewWorkflowExecutionProps) => {
    const location = useLocation()
    const workflowExecutionId = props.workflowExecutionId
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const [actionParameterInstances, setActionParameterInstances] = React.useState<ActionParameterInstance[]>([])
    const resultsView = React.useRef<HTMLDivElement | null>(null)
    const reRunWorkflowAction = useReRunWorkflowAction({mutationName: "ReRunFlowAction"})

    const setModuleStateContext = React.useContext(SetModuleContextState)
    const [areChildActionsReady, setAreChildActionReady] = React.useState<boolean>(false)



    const handleRefreshQuery = (data?: WorkflowActionExecutions[]) => {

        if(data?.[0]?.ChildExecutionsWithDefinitions?.length || 0 > 0) {
            if(areChildActionsReady === false) {
                setWorkflowContext({type: 'DELETE_STAGE', payload: {stageId: workflowContext.stages[0].Id}})
                props?.handleReceivePreviousInstanceId?.(data?.[0]?.WorkflowExecution?.InstanceId || "ID")
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
            
            setAreChildActionReady(true)   

            if(data?.[0]?.WorkflowExecution?.Status === "Completed" || data?.[0]?.WorkflowExecution?.Status === "Failed") {
                // setTabState(1)
                setWorkflowContext({type: 'SET_WORKFLOW_EXECUTION_COMPLETED_ON', payload: data?.[0]?.WorkflowExecution?.ExecutionCompletedOn || (new Date(Date.now()).getTime())})
            }
        }
        
    }
    


    const [initialTime, setInitialTime] = React.useState((new Date(Date.now()).getTime()))
    const increaseTime = () => {
        if(!workflowContext.WorkflowExecutionCompletedOn){
            setInitialTime(time => time + 1000)
        }
    }
    const getElapsedTime = () => {
        const finalTime = workflowContext.WorkflowExecutionCompletedOn || initialTime
        const timeInMilliseconds = finalTime - (workflowContext.WorkflowExecutionStartedOn || 0)

        const timeInSeconds = timeInMilliseconds/1000
        const m = Math.floor(timeInSeconds / 60).toString().padStart(2,'0')
        const s = Math.floor(timeInSeconds % 60).toString().padStart(2,'0');

        return m + ' MIN ' + s + ' SEC'

    }

    const handleParameterInstancesChange = (newParameterInstances: ActionParameterInstance[]) => {
        console.log(newParameterInstances)
        setActionParameterInstances(newParameterInstances)
    }

    const numberOfActionINStage = ()=>{
        let ans = 0;
        for(var i=0;i<workflowContext.stages.length;i++){
            ans += workflowContext.stages[i].Actions.length;
        };
        return ans;
    }
    const [userInputOpener , setuserInputOpener] = useState(false);

    const handleInputOpener = () =>{
        setuserInputOpener(userInputOpener=>!userInputOpener)
    }
    const handleBoxIPopener = ()=>{
        if(!userInputOpener) {setuserInputOpener(true)}
    }
    const currentIndex = workflowContext.stages.findIndex(stage => stage.Id === workflowContext.currentSelectedStage)

    const handleGoNext = () => {
        setWorkflowContext({
            type: 'GO_TO_NEXT_STAGE',
            payload: {}
        })
    }

    const handleGoBack = () => {
        setWorkflowContext({
            type: 'GO_TO_PREV_STAGE',
            payload: {}
        })
    }

    const handleSelectAction = (actionId: string, actionIndex: number) => {
        setWorkflowContext({
            type: 'SET_SELECTED_ACTION',
            payload: {
                actionId: actionId,
                actionIndex: actionIndex
            }
        })
    }

    const selectedStage = workflowContext.stages.filter(stage => stage.Id === workflowContext.currentSelectedStage).map(stage => ({
        stageId: stage.Id,
        stageName: stage.Name,
        numberOfActions: stage.Actions.length,
        totalRunTime: '32 SEC'
    }))
    const [finalOutputOpener , setFinalOutputOpener] = useState(false);
    const [flowOpener , setFlowOpener] = useState(true);
    const [flowResultOpener , setFlowResultOpener] = useState(true)
    const handlefinalOutputOpener = () =>{
        setFinalOutputOpener(true);
        setFlowOpener(false);
        setWorkflowContext({
            type: 'CHANGE_CURRENT_SELECTED_STAGE',
            payload: {
                stageId: undefined
            }
        })
    }
    const handleFlowOpener = ()=>{
        setFinalOutputOpener(false);
        setFlowOpener(true);

        setWorkflowContext({
            type: 'CHANGE_CURRENT_SELECTED_STAGE',
            payload: {
                stageId: undefined
            }
        })
    }


    const [workflowActionExecutionData, workflowActionExecutionError, workflowActionExecutionLoading] = useGetWorkflowStatus(workflowExecutionId, {enabled: (workflowContext.WorkflowExecutionStatus !== 'Completed' && workflowContext.WorkflowExecutionStatus !== 'Failed'), handleSuccess: handleRefreshQuery})

    React.useEffect(() => {
        setInitialTime(Date.now())
        setInterval(increaseTime, 1000)
        setAreChildActionReady(false)
        setWorkflowContext({
            type: 'SET_ENTIRE_CONTEXT',
            payload: defaultWorkflowContext
        })

    }, [workflowExecutionId])

    React.useEffect(() => {
        if(areChildActionsReady === true) {
            const currentComponent: React.ReactNode = resultsView.current
            if (currentComponent) {
                (currentComponent as {scrollIntoView: Function})?.scrollIntoView?.({
                    behavior: 'smooth',
                    block: 'start',
                })
            }
        }
    }, [areChildActionsReady])

    React.useEffect(() => {
        if(workflowContext.reRunActionIndex !== undefined) {
            reRunWorkflowAction.mutate({workflowExecutionId: workflowExecutionId, reRunActionindex: workflowContext.reRunActionIndex, globalParameterInstance: actionParameterInstances}, {
                onSuccess: () => {
                    setWorkflowContext({
                        type: 'SET_ENTIRE_CONTEXT',
                        payload: defaultWorkflowContext
                    })
                    setAreChildActionReady(false)
                }
            })
        }
    }, [workflowContext.reRunActionIndex])

    if(!areChildActionsReady){
        return <LoadingIndicator/>
    } else if(workflowActionExecutionError) {
        return <NoData/>
    } else {
        return (
            <div ref={resultsView}>
                <Box sx={{display: 'flex', minWidth: '100%', minHeight: '100%', flexDirection: 'column', gap: 3, justifyContent: 'center'}}>
                    <Dialog open={reRunWorkflowAction.isLoading}>
                        <DialogTitle>
                            Creating new executions
                        </DialogTitle>
                        <DialogContent>
                            <LoadingIndicator />
                        </DialogContent>
                    </Dialog>
                    <Box sx={{display: 'flex',flexDirection:'column', minWidth: '100%',height:'100%'}}>
                        {/* <ActionDefinitionHeroActionContextWrapper mode="READONLY"/> */}
                        <Box sx={{display:'flex',flexDirection:'row', pl: 2}}>
                            <Box sx={{textAlign:'left',display:'flex',flexDirection:'column',width:'50%',pt:5}}>
                                <Typography sx={{fontSize:'0.9rem',fontWeight:500}}>RUNNING : { workflowContext.stages.length} STAGES | {numberOfActionINStage()} ACTIONS</Typography>
                                <Typography sx={{color:'blue',fontSize:'0.9rem',fontWeight:500}}>RUN TIME : {getElapsedTime()}</Typography>

                            </Box>

                        </Box>
                        {/* <Box sx={{cursor:'pointer',display:'flex',flexDirection:'column',mx:9,mt:4,py:2, backgroundColor:userInputOpener ? "#e3e1de":"#e0ecff" , borderRadius:'5px',boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px' }} >
                            <Box sx={{display:'flex',flexDirection:'row'}}>
                                <Button onClick={handleInputOpener}>
                                    {userInputOpener ?<KeyboardArrowDownIcon/>:<ChevronRightIcon/>}
                                </Button>
                                <Typography sx={{color:'#f09124',py:1,fontSize:'1.1rem',fontWeight:500}}>Inputs</Typography>
                            </Box>
                            <Box sx={{px:'20vw'}}>{userInputOpener?
                                    <WorkflowContextProvider>
                                        <ExecuteWorkflow  workflowId={workflowActionExecutionData?.[0]?.WorkflowDefinition?.Id} previousInstanceId={workflowActionExecutionData?.[0]?.WorkflowExecution?.InstanceId} onParameterInstancesChange={handleParameterInstancesChange}/>
                                    </WorkflowContextProvider>:<></>
                                }
                            </Box>
                        </Box> */}
                    <Box sx={{display:'flex',flexDirection:'column'}}>
                        <Box>
                            <StagesWithActions showStage={true} showDet={false}/>
                        </Box>
                        <Box sx={{display:'flex',flexDirection:'row',minHeight:'60vh',gap:2,px:2}}>
                            <Box sx={{transitionDuration:'0.5s',ml:(workflowContext.currentSelectedStage?0:(flowOpener?10:0)), width:(!workflowContext.currentSelectedStage && flowOpener)?"100%":"3vw",minHeight:'100%',backgroundColor:(!workflowContext.currentSelectedStage && flowOpener)?"#f4f5f7":"#8dcce3", borderRadius:'10px',boxShadow:(!workflowContext.currentSelectedStage &&flowOpener)? "":"-5px -5px 10px #FAFBFF, 5px 5px 10px #A6ABBD",}}>
                                {(workflowContext.currentSelectedStage || !flowOpener)?
                                <Button sx={{display:'flex',flexDirection:'column',p:0,mt:2}} onClick={handleFlowOpener} ><img width='40px' height='40px' src={leftExpandIcon} alt="Open"/> <Typography sx={{p:1,transform:'rotate(270deg)',fontSize:'0.9rem',fontWeight:'600',color:'#575757'}}>Detailed Output</Typography></Button>:<></>
                                }
                                    {(!workflowContext.currentSelectedStage && flowOpener)?
                                        <Box sx={{flex: 4, mb: 4}}>
                                            <StagesWithActions showStage={false} showDet={true}/>
                                        </Box>
                                    :
                                    <></>
                                }
                            </Box>
                            {workflowContext.currentSelectedStage ? (
                                        //    <ViewWorkflowStageResults />
                                        <>
                                        <Box sx={{mt: 1, display: 'flex', flex: 1,gap:3,px:2}}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2,width:'20vw'}}>
                                                <Card sx={{
                                                    backgroundColor: '#f4f5f7',
                                                    border:'2px solid #fafcfc',
                                                    boxShadow:"-4px -6px 16px rgba(255, 255, 255, 0.5), 4px 6px 16px rgba(163, 177, 198, 0.5)",
                                                    borderRadius: "10px",
                                                    height:'100%',
                                                }}>
                                                    <WorkflowActionContainer stageId={workflowContext.currentSelectedStage || "stageNA"} handleSelectAction={handleSelectAction}/>
                                                    <StepSlider label="Stage" currentIndex={currentIndex} maximumIndex={workflowContext.stages.length - 1} handleNext={handleGoNext} handleBack={handleGoBack}/>
                                                </Card>
                                                
                                            </Box>
                                            <Box sx={{display:'flex',flexDirection:'column',width:'62vw'}}>
                                                {/* <SaveAndBuildChartContextProvider>
                                                    <SaveAndBuildChartsFromExecution executionId={workflowContext.currentSelectedAction?.actionId || "NA"}/>
                                                </SaveAndBuildChartContextProvider> */}
                                                <ActionExecutionDetails actionExecutionId={workflowContext.currentSelectedAction?.actionId || "NA"}/>
                                                
                                                </Box>
                                        </Box>
                                        </>
                                        ) : (
                                            <></>
                                        )}
                            <Box sx={{transitionDuration:'0.5s',mr:finalOutputOpener?10:0,width:(!workflowContext.currentSelectedStage && finalOutputOpener)?"100%":"3vw",minHeight:'100%',backgroundColor:(!workflowContext.currentSelectedStage && finalOutputOpener)?"#f4f5f7":"#8dcce3", borderRadius:'10px',boxShadow:finalOutputOpener?"": "-5px -5px 10px #FAFBFF, 5px 5px 10px #A6ABBD"}}>
                                {workflowContext.currentSelectedStage ||!finalOutputOpener?
                                    <Button sx={{display:'flex',flexDirection:'column',p:0,mt:2}} onClick={handlefinalOutputOpener} ><img width='50px' height='50px' src={RightExpandIcon} alt="Open"/><Typography sx={{p:1,transform:'rotate(90deg)',fontSize:'0.9rem',fontWeight:'600',color:'#575757'}}>Final Output</Typography></Button>:<></>
                                }
                                {!workflowContext.currentSelectedStage && finalOutputOpener?(
                                    <Box sx={{width:'100%'}}>
                                        <Box sx={{overflow: 'auto', px: 2}}>
                                            <ShowWorkflowExecutionOutput/>
                                        </Box>
                                    </Box>)
                                        :
                                        <></>
                                }
                            </Box> 
                        </Box>
                    </Box>
                </Box>
                </Box>
            </div>
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
                <ViewWorkflowExecution workflowExecutionId={workflowExecutionId} />
            </BuildActionContextProvider>
        </WorkflowContextProvider>
    )
}


export default ViewWorkflowExecutionHomePage
