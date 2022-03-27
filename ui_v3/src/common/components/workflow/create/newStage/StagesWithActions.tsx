import { Box, Card, Grid, IconButton, DialogTitle, Dialog, Tooltip } from "@mui/material"
import React, { ReactElement } from "react"
import WorkflowStagesWrapper from "../../../../../application/common/workflowStages/WorkflowStagesWrapper"
import WorkflowActionContainer from "../../../../../pages/applications/workflow/WorkflowActionContainer"
import { SetWorkflowContext, WorkflowActionDefinition, WorkflowContext } from "../../../../../pages/applications/workflow/WorkflowContext"
import { lightShadows } from "../../../../../../src/css/theme/shadows"
import slideNext from "../../../../../../src/images/new_frame.png"
import BuildActionFromWorkflow from "../addAction/BuildActionFromWorkflow"

export const StagesWithActions = () => {
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    if(workflowContext.currentStageView === undefined) {
        setWorkflowContext({type: 'SET_STAGES_IN_VIEW', payload: {startIndex: 0, endIndex: 4}})
    }

    const currentStages = workflowContext.currentStageView === undefined ? workflowContext.stages.slice(0, 4) : workflowContext.stages.slice(workflowContext.currentStageView.startIndex, workflowContext.currentStageView.endIndex)

    const stages = currentStages.map(stage => {
        // console.log(stage)
        return {
            stageId: stage.Id,
            stageName: stage.Name,
            percentageCompleted: stage.Percentage
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

    const handleStageNameChange = (stageId: string, stageName: string) => {
        setWorkflowContext({type: 'STAGE_NAME_CHANGE', payload: {stageId: stageId, Name: stageName}})
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', maxWidth: 'inherit'}}>
            <Box sx={{ display: 'flex', flexDirection: "row-reverse", width: "100%"}}>
                <Box>
                    <Tooltip title="Previous">
                        <IconButton onClick={handleSlidePrev}>
                            <img src={slideNext} alt="previos" style={{transform: 'rotate(180deg)'}}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Next">
                        <IconButton onClick={handleSlideNext}>
                            <img src={slideNext} alt="next"/>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Box sx={{flex: 1, minHeight: '100px', minWidth: '300px'}}>
                <WorkflowStagesWrapper stages={[...stages]} maxWidthInPixel={100} onAddStage={handleAddStage} 
                onDeleteStage={handleDeleteStage} numberOfStages={workflowContext.stages.length} handleStageNameChange={handleStageNameChange}></WorkflowStagesWrapper>
            </Box>
            <Box sx={{flex: 1, display: 'flex', mt: 1, p: 1, flexDirection: 'column'}}>
                {/* <Card sx={{display: 'flex', boxShadow: lightShadows[27], flexDirection: 'column', p: 1, flex: 1}}> */}
                    <Grid container spacing={1} sx={{flex: 1}}>
                    {currentStages.map(stage => {
                        return (
                            <Grid sx={{flex: 1,}} item xs={3}>
                                <Card sx={{ boxShadow: '-3.88725px -5.83088px 15.549px rgba(255, 255, 255, 0.5), 3.88725px 5.83088px 15.549px rgba(163, 177, 198, 0.5)', height: '100%', maxWidth: '100%', overflowY: 'auto', borderRadius: '20px', background: '#F5F9FF'}}>
                                    <WorkflowActionContainer {...{stageId: stage.Id, actionSelectable: false}}></WorkflowActionContainer>
                                </Card>
                            </Grid>)
                    })}
                    </Grid>
                {/* </Card> */}
                
            </Box>
        </Box>
    )

}
