import { Box, Tabs, Tab, Typography, Button,IconButton ,Collapse } from "@mui/material"
import React,{ useState } from "react"
import LoadingIndicator from '../../../common/components/LoadingIndicator'
import { SetModuleContextState } from '../../../common/components/ModuleContext'
import NoData from "../../../common/components/NoData"
import { ReactQueryWrapper } from '../../../common/components/ReactQueryWrapper'
import ActionDescriptionCard from '../../../common/components/workflow-action/ActionDescriptionCard'
import ExportAsDashboard from '../../../common/components/workflow/execute/ExportAsDashboard'
import useGetWorkflowStatus from "../../../common/components/workflow/execute/hooks/useGetWorkflowStatus"
import ShowWorkflowExecutionOutput from '../../../common/components/workflow/execute/ShowWorkflowExecutionOutput'
import ActionExecutionStatus from '../../../enums/ActionExecutionStatus'
import { WorkflowActionExecutions } from "../../../generated/interfaces/Interfaces"
import ActionExecutionCard from '../../apps/components/ActionExecutionCard'
import { ExecuteWorkflow } from './ExecuteWorkflowHomePage'
import { defaultWorkflowContext, SetWorkflowContext, WorkflowContext, WorkflowContextProvider } from "./WorkflowContext"
import WorkflowExecutionStages from './WorkflowExecutionStages'
import CollapsibleDrawer from "../../../../src/pages/build_action/components/form-components/CollapsibleDrawer"
import DoubeLeftIcon from '../../../../src/images/Group 691.svg';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import WorkflowStagesWrapper from "../../../../src/application/common/workflowStages/WorkflowStagesWrapper"

interface ViewWorkflowExecutionProps {
    workflowExecutionId: string
}

const ViewWorkflowExecutionNew = (props: ViewWorkflowExecutionProps) => {
    const workflowExecutionId = props.workflowExecutionId
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const setModuleStateContext = React.useContext(SetModuleContextState)

    const [initialTime, setInitialTime] = React.useState<number>(Date.now())
    const [showParameters, setShowParameters] = React.useState(false)
    const [tabState, setTabState] = React.useState(0)
    
    const [areChildActionsReady, setAreChildActionReady] = React.useState<boolean>(false)

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
            
            setAreChildActionReady(true)   

            if(data?.[0]?.WorkflowExecution?.Status === "Completed" || data?.[0]?.WorkflowExecution?.Status === "Failed") {
                setTabState(1)
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

    const numberOfActionINStage = ()=>{
        let ans = 0;
        for(var i=0;i<workflowContext.stages.length;i++){
            ans += workflowContext.stages[i].Actions.length;
        };
        return ans;
    }

    const currentStages = workflowContext.currentStageView === undefined ? workflowContext.stages.slice(0, 4) : workflowContext.stages.slice(workflowContext.currentStageView.startIndex, workflowContext.currentStageView.endIndex)

    const stages = currentStages.map(stage => {
        return {
            stageId: stage.Id,
            stageName: stage.Name,
            percentageCompleted: stage.Percentage
        }
    })

    const [userInputOpener , setuserInputOpener] = useState(false);

    const handleInputOpener = () =>{
        setuserInputOpener(userInputOpener=>!userInputOpener)
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
    
                            {/* <ActionDescriptionCard description={workflowContext.Description} mode="READONLY"/> */}
                                <Box sx={{px:6, display:'flex',flexDirection:'row'}}>
                                    <Box sx={{display:'flex',flexDirection:'column',width:'50%'}}>
                                        <Typography sx={{fontSize:'2rem',fontWeight:700}}>{workflowActionExecutionData?.[0]?.WorkflowDefinition?.DisplayName}</Typography>
                                        <Typography sx={{fontSize:'0.8rem',fontWeight:400,width:'70%'}}>{workflowActionExecutionData?.[0]?.WorkflowDefinition?.Description} </Typography>
                                    </Box>
                                    <Box sx={{textAlign:'right',display:'flex',flexDirection:'column',width:'50%',pt:5}}>
                                        <Typography sx={{fontSize:'0.9rem',fontWeight:500}}>RUNNING : { workflowContext.stages.length} STAGES | {numberOfActionINStage()} ACTIONS</Typography>
                                        <Typography sx={{color:'blue',fontSize:'0.9rem',fontWeight:500}}>RUN TIME : {getElapsedTime()}</Typography>
                                    </Box>

                                </Box>

                                <Box sx={{px:6 , width:'100%',py:2}}>
                                    <Box sx={{display:'flex',flexDirection:'column',px:2, backgroundColor:userInputOpener ? "#e3e1de":"#e0ecff" , borderRadius:'5px',boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px' }} >
                                        <Box sx={{display:'flex',flexDirection:'row'}}>
                                            <Button onClick={handleInputOpener}>
                                                {userInputOpener ?<KeyboardArrowDownIcon/>:<ChevronRightIcon/>}
                                            </Button>
                                            <Typography sx={{color:'#f09124',py:1,fontSize:'1.1rem',fontWeight:500}}>Inputs</Typography>
                                        </Box>
                                        <Box sx={{px:'20vw'}}>{userInputOpener?
                                                <WorkflowContextProvider>
                                                    <ExecuteWorkflow workflowId={workflowActionExecutionData?.[0]?.WorkflowDefinition?.Id} previousInstanceId={workflowActionExecutionData?.[0]?.WorkflowExecution?.InstanceId}/>
                                                </WorkflowContextProvider>:<></>
                                            }
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{flex: 1, minHeight: '100px', minWidth: '300px',px:6}}>
                                    {/* <WorkflowStagesWrapper stages={[...stages]} fromAddActionsView={false} maxWidthInPixel={100} numberOfStages={workflowContext.stages.length} allowEdit={false}></WorkflowStagesWrapper> */}
                                    <WorkflowExecutionStages/>
                                </Box>


                                <Box sx={{display:'flex',flexDirection:'column'}}>
                                        {/* <Box sx={{px:6,py:1}}>
                                            <Button color={showParameters ? "success": "secondary"} variant="outlined" onClick={handleShowParameters}>WorkFlow Configarator</Button>
                                        </Box> */}
                                        {/* { (
                                            <WorkflowContextProvider>
                                                <ExecuteWorkflow workflowId={workflowActionExecutionData?.[0]?.WorkflowDefinition?.Id} previousInstanceId={workflowActionExecutionData?.[0]?.WorkflowExecution?.InstanceId}/>
                                            </WorkflowContextProvider>
                                        ) } */}
                                        <Box sx={{display:'flex', flexDirection:'column'}}>
                                            {/* <CollapsibleDrawer
                                                open={opener || false}
                                                openWidth="500px"
                                                closedWidth="50px"
                                                openDrawer={() => {drawerOpenHandler(true)}}
                                                > */}
                                                    {/* <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", flex: 1 }}>
                                                        <IconButton onClick={() => drawerOpenHandler(false)}>
                                                            <img src={DoubeLeftIcon} alt="NA"/>
                                                        </IconButton>
                                                    </Box> */}


                                                    {/* <Box  sx={{display: 'flex', flexDirection: 'column', gap: 1,width:'100%',px:3}}>
                                                        <Box sx={{display:'flex',flexDirection:'row',px:2,mt:2,fontSize:'23px',}}>
                                                            <Box sx={{fontWeight:'600'}}>
                                                                Result 
                                                            </Box>
                                                            <Box sx={{display: 'flex',height:'35px', width: '30%',ml:'auto'}}>
                                                                <ExportAsDashboard executionId={workflowExecutionId} definitionName={workflowContext.Name}/>
                                                            </Box>
                                                        </Box>
                                                        <ShowWorkflowExecutionOutput/>
                                                    </Box> */}




                                                    {/* <Box sx={{display:'flex',flexDirection:'column',width:'100%',px:3}}>
                                                        <Typography sx={{px:2,m:2,fontSize:'23px',fontWeight:'600'}}>Flow</Typography>
                                                        <ActionExecutionCard 
                                                            elapsedTime={getElapsedTime()} 
                                                            actionExecution={workflowActionExecutionData?.[0]?.WorkflowExecution || {}}  
                                                            arrowState={showParameters ? "DOWN": "UP"}
                                                            // handleClickArrow={handleShowParameters}
                                                            terminalState={!!workflowContext.WorkflowExecutionCompletedOn} 
                                                            error={workflowActionExecutionData?.[0]?.WorkflowExecution?.Status === ActionExecutionStatus.FAILED}
                                                            isWorkflow={true}
                                                            handleShowResult={handleShowResults}
                                                            />
                                                        
                                                        <WorkflowExecutionStages/>
                                                    </Box> */}
                                            {/* </CollapsibleDrawer> */}
                                            {/* <Collapse key={stage.stageId} sx={{ 
                                                width: "24.5%", 
                                                height: "100%", 
                                                "& .MuiCollapse-wrapper": { height: "100%"}, 
                                                "& .MuiCollapse-wrapperInner": { height: "100%"}
                                            }}> */}
                                            
                                            {/* </Collapse> */}

                                    </Box>
                                    
                                </Box>
                            
                        </Box>
                    )
                }
            }}
        </ReactQueryWrapper>
    )

}

export default ViewWorkflowExecutionNew