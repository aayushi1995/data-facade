import { Box, Card, Typography, Slide, Divider } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions";
import React from "react"
import WorkflowStagesWrapper from "../../../../application/common/workflowStages/WorkflowStagesWrapper";
import WorkflowActionContainer from "../../../../pages/applications/workflow/WorkflowActionContainer";
import { SetWorkflowContext, WorkflowContext } from "../../../../pages/applications/workflow/WorkflowContext"
import { WrapInDialog } from "../../../../pages/table_browser/components/AllTableView"
import StepSlider from "../../../StepSlider";
import SaveAndBuildChartContextProvider from "../../charts/SaveAndBuildChartsContext";
import SaveAndBuildChartsFromExecution from "../../charts/SaveAndBuildChartsFromExecution";


export interface ViewWorkflowStageResultsProps {

}

export const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const ViewWorkflowStageResults = (props: ViewWorkflowStageResultsProps) => {
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    

    const handleClose = () => {
        setWorkflowContext({
            type: 'CHANGE_CURRENT_SELECTED_STAGE',
            payload: {stageId: undefined}
        })
        setWorkflowContext({
            type: 'SET_SELECTED_ACTION',
            payload: {
                actionId: "",
                actionIndex: -1
            }
        })
    }   
    console.log(workflowContext.currentSelectedStage)
    const selectedStage = workflowContext.stages.filter(stage => stage.Id === workflowContext.currentSelectedStage).map(stage => ({
        stageId: stage.Id,
        stageName: stage.Name
    }))
    const currentIndex = workflowContext.stages.findIndex(stage => stage.Id === workflowContext.currentSelectedStage)
    console.log(currentIndex)

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

    const numberOfActionINStage = ()=>{
        let ans = 0;
        for(var i=0;i<workflowContext.stages.length;i++){
            ans += workflowContext.stages[i].Actions.length;
        };
        return ans;
    }
    const [initialTime, setInitialTime] = React.useState<number>(Date.now())
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
    return (
        <WrapInDialog dialogProps={{open: true, handleClose: handleClose,label:'DATA FACADE', TransitionComponent: Transition}}>
            <Box sx={{display: 'flex', gap: 1, p: 1, flexDirection: 'column'}}>
                {/* <Card sx={{
                    display: 'flex', alignItems: 'center',
                    backgroundColor: "buildActionDrawerCardBgColor.main",
                    border: "0.439891px solid #FFFFFF",
                    boxShadow: "0px 15px 25px rgba(54, 48, 116, 0.3)",
                    borderRadius: "26.3934px"
                }}>
                    <Box sx={{
                        backgroundColor: "ActionCardBgColor.main",
                        boxShadow:
                        "-10px -10px 15px #FFFFFF, 10px 10px 10px rgba(0, 0, 0, 0.05), inset 10px 10px 10px rgba(0, 0, 0, 0.05), inset -10px -10px 20px #FFFFFF",
                        borderRadius: "15px",
                        m: 2,
                        py: 2
                    }}>
                        <Typography variant="heroHeader" sx={{m: 2, p: 2}}>
                            {workflowContext.Name}
                        </Typography>
                    </Box>
                </Card> */}
                <Box sx={{px:6, display:'flex',flexDirection:'row'}}>
                                    <Box sx={{display:'flex',flexDirection:'column',width:'50%'}}>
                                        <Typography sx={{fontSize:'2rem',fontWeight:700}}>{workflowContext.Name}</Typography>
                                        <Typography sx={{fontSize:'0.8rem',fontWeight:400,width:'70%'}}>{workflowContext.Description} </Typography>
                                    </Box>
                                    <Box sx={{textAlign:'right',display:'flex',flexDirection:'column',width:'50%',pt:5}}>
                                        <Typography sx={{fontSize:'0.9rem',fontWeight:500}}>RUNNING : { workflowContext.stages.length} STAGES | {numberOfActionINStage()} ACTIONS</Typography>
                                        <Typography sx={{color:'blue',fontSize:'0.9rem',fontWeight:500}}>RUN TIME : {getElapsedTime()}</Typography>
                                    </Box>

                    </Box>
                <Box sx={{mt: 1, display: 'flex', flex: 1}}>
                    <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
                        <StepSlider label="Stage" currentIndex={currentIndex} maximumIndex={workflowContext.stages.length - 1} handleNext={handleGoNext} handleBack={handleGoBack}/>
                        <WorkflowStagesWrapper stages={selectedStage} allowEdit={false} percentageWidth='100%'/>
                        <Card sx={{
                            backgroundColor: "ActionDefinationHeroCardBgColor.main",
                            boxShadow:
                            "-4px -6px 16px rgba(255, 255, 255, 0.5), 4px 6px 16px rgba(163, 177, 198, 0.5)",
                            borderRadius: "20px"
                        }}>
                            <WorkflowActionContainer stageId={workflowContext.currentSelectedStage || "stageNA"} handleSelectAction={handleSelectAction}/>
                        </Card>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ml: 3}}/>
                    <Box sx={{flex: 4}}>
                        <SaveAndBuildChartContextProvider>
                            <SaveAndBuildChartsFromExecution executionId={workflowContext.currentSelectedAction?.actionId || "NA"}/>
                        </SaveAndBuildChartContextProvider>
                    </Box>
                </Box>
                
            </Box>
        </WrapInDialog>
    )
}

export default ViewWorkflowStageResults