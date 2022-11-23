import { Box, IconButton, Tooltip, Typography } from "@mui/material"
import React from "react"
import WorkflowStagesWrapper from "../../../../../application/common/workflowStages/WorkflowStagesWrapper"
import slideNext from '../../../../../images/new_frame.png'
import { SetWorkflowContext, WorkflowContext } from "../../../../../pages/applications/workflow/WorkflowContext"
import NoData from "../../../NoData"
import { AddActionToWorkflowStage } from "./AddActionToWorkflowStage"

export const AddingActionView = (props: { onBack: Function, saving?: boolean }) => {
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)

    const allStages = workflowContext.stages.map(stage => {
        return {
            stageName: stage.Name,
            stageId: stage.Id
        }
    })
    const currentStage = workflowContext.stages.filter(stage => stage.Id === workflowContext.currentSelectedStage)
    const selectedStage = currentStage.length > 0 ? (
        {
            stageName: currentStage[0].Name,
            stageId: currentStage[0].Id
        }
    ) : ( undefined )

    const handleGoBack = () => props.onBack()

    if(selectedStage) {
        return (
            <Box sx={{maxHeight: '100%', display: 'flex', flexDirection: 'column', gap: 1}}>
                <Box sx={{flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                    <Tooltip title="Go Back">
                        <IconButton onClick={handleGoBack}>
                            <img src={slideNext} style={{transform: 'rotate(180deg)'}} alt="go back"/>
                        </IconButton>
                    </Tooltip>
                    <Typography sx={{fontFamily: 'SF Pro Text', fontWeight: 300}}>
                        {props.saving ? <>Saving...</> : <>Go Back to Save</> }
                        
                    </Typography>
                </Box>
                <Box sx={{flex: 1, minHeight: '100px'}}>
                    <WorkflowStagesWrapper stages={allStages} selectedStage={selectedStage} maxWidthInPixel={100} numberOfStages={1} fromAddActionsView={true}></WorkflowStagesWrapper>
                </Box>
                <Box sx={{flex: 2, display: 'flex'}}>
                    <AddActionToWorkflowStage stageId={workflowContext.currentSelectedStage !== undefined ? workflowContext.currentSelectedStage: ""}></AddActionToWorkflowStage>
                </Box>
                
            </Box>
        )

    } else {
        return <NoData/>
    }
}