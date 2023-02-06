import { Box, Card, Grid, IconButton, Tooltip, Typography } from "@mui/material"
import React from "react"
import slideNext from "../../../../../../src/assets/images/new_frame.png"
import WorkflowStagesWrapper from "../../components/WorkflowStagesWrapper"
import { SetWorkflowContext, WorkflowActionDefinition, WorkflowContext } from "../../context/WorkflowContext"
import WorkflowActionContainer from "../../WorkflowActionContainer"

export const StagesWithActions = (props :{showDet: boolean, showStage: boolean}) => {
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const workflowExecuting = workflowContext.mode === 'EXECUTING'
    const [initialTime, setInitialTime] = React.useState((new Date(Date.now()).getTime()))
    if(workflowContext.currentStageView === undefined) {
        setWorkflowContext({type: 'SET_STAGES_IN_VIEW', payload: {startIndex: 0, endIndex: 4}})
    }

    const increaseTime = () => {
        setInitialTime(time => time + 1000)
    }

    React.useEffect(() => {
        setInterval(increaseTime, 1000)
    }, [])
    const currentStages = workflowContext.currentStageView === undefined ? workflowContext.stages.slice(0, 4) : workflowContext.stages.slice(workflowContext.currentStageView.startIndex, workflowContext.currentStageView.endIndex)
    
    const stages = currentStages.map(stage => {
        var runTime = 0
        // var runTime = Math.abs(((stage.Actions[stage.Actions.length-1].ExecutionCompletedOn||0) - (stage.Actions[0].ExecutionStartedOn||0) )/1000);
        for(var i=0;i<stage.Actions.length;i++){
            runTime= Math.floor(((stage.Actions[i].ExecutionCompletedOn || initialTime)))
        }
        runTime-=stage.StartedOn||0;
        const getElapsedTime = () => {
            const timeInSeconds = runTime/1000 || 0
            const m = Math.floor(timeInSeconds / 60).toString().padStart(2,'0')
            const s = Math.floor(timeInSeconds % 60).toString().padStart(2,'0');
    
            return stage.StartedOn?(m + ' MIN ' + s + ' SEC'):'N/A min N/A sec'  
    
        }
        return {
            stageId: stage.Id,
            stageName: stage.Name,
            percentageCompleted: stage.Percentage,
            numberOfActions: stage.Actions.length,
            failed: stage.stageFailed,
            completed: stage.completed,
            totalRunTime: getElapsedTime()
        }
    })

    const handleSlideNext = () => {
        if(workflowContext.currentStageView === undefined) {
            return;
        }
        const newStartIndex = workflowContext?.currentStageView.startIndex + 1
        const newEndIndex = workflowContext?.currentStageView.endIndex + 1

        if(newEndIndex > workflowContext.stages.length) {
            return;
        }

        setWorkflowContext({type: 'SET_STAGES_IN_VIEW', payload: {startIndex: newStartIndex, endIndex: newEndIndex}})
    }

    const handleSlidePrev = () => {
        if(workflowContext.currentStageView === undefined) {
            return;
        }
        const newStartIndex = workflowContext?.currentStageView.startIndex - 1
        const newEndIndex = workflowContext?.currentStageView.endIndex - 1

        if(newStartIndex < 0) {
            return;
        }

        setWorkflowContext({type: 'SET_STAGES_IN_VIEW', payload: {startIndex: newStartIndex, endIndex: newEndIndex}})
    }

    const handleAddStage = (newStage: {Id: string, Name: string, Actions: WorkflowActionDefinition[]}, stageId?: string) => {

        setWorkflowContext({type: 'ADD_STAGE', payload: {...newStage, previousStageId: stageId}})


        if(workflowContext.stages.length >= 5) {
            handleSlideNext()
        }
    }

    const handleDeleteStage = (stageId: string) => {
        setWorkflowContext({type: 'DELETE_STAGE', payload: {stageId: stageId}})

    }

    const isPreviousPossible = (workflowContext?.currentStageView?.startIndex || -1) >= 0
    const isNextPossible = (workflowContext?.currentStageView?.endIndex || workflowContext.stages.length) < workflowContext.stages.length
    const lastStage = ((workflowContext?.currentStageView?.endIndex || workflowContext.stages.length) < workflowContext.stages.length ? (workflowContext?.currentStageView?.endIndex || workflowContext.stages.length) : workflowContext.stages.length)

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', maxWidth: 'inherit'}}>
            {props.showStage?
            <><Grid container direction="row-reverse" sx={{ width: "100%",p:0 }}>
                    <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Previous">
                            <IconButton onClick={handleSlidePrev} disabled={!isPreviousPossible}>
                                <img src={slideNext} alt="previos" style={{ transform: 'rotate(180deg)', opacity: isPreviousPossible ? 1 : 0.2 }} />
                            </IconButton>
                        </Tooltip>
                        <Typography variant="heroMeta" sx={{ display: 'flex', alignItems: 'center' }}>
                            Stage {(workflowContext?.currentStageView?.startIndex || 0) + 1}-{lastStage} / {workflowContext.stages.length}
                        </Typography>
                        <Tooltip title="Next">
                            <IconButton onClick={handleSlideNext} disabled={!isNextPossible}>
                                <img src={slideNext} alt="next" style={{ opacity: isNextPossible ? 1 : 0.2 }} />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={10} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        
                    </Grid>
                </Grid>
                <Box>
                <Box sx={{ mt:-2, dispaly:'flex',flexDirectionL:'row', minHeight: '100px', minWidth: '300px' }}>
                        <WorkflowStagesWrapper stages={[...stages]} maxWidthInPixel={100} onAddStage={handleAddStage}
                            onDeleteStage={handleDeleteStage} numberOfStages={workflowContext.stages.length} allowEdit={!workflowExecuting}></WorkflowStagesWrapper>
                    </Box>
                    </Box>
                    </>:
            <></>
}
            {props.showDet?
            <Grid container>
                {/* <Card sx={{display: 'flex', boxShadow: lightShadows[27], flexDirection: 'column', p: 1, flex: 1}}> */}
                    {currentStages.map(stage => {
                        return (
                            <Grid item xs={3}>
                                <Card sx={{border:'2px solid #fafcfc', boxShadow: '-3.88725px -5.83088px 15.549px rgba(255, 255, 255, 0.5), 3.88725px 5.83088px 15.549px rgba(163, 177, 198, 0.5)', height: '100%', maxWidth: '100%', overflowY: 'auto', borderRadius: '10px', backgroundColor: '#f4f5f7', display: 'flex'}}>
                                    <WorkflowActionContainer {...{stageId: stage.Id, actionSelectable: false}}></WorkflowActionContainer>
                                </Card>
                            </Grid>)
                    })}
                
            </Grid>:<></>
            }
        </Box>
    )

}