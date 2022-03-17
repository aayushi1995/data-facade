import { Box, Card, IconButton } from "@material-ui/core"
import React from "react"
import WorkflowStagesWrapper from "../../../../../application/common/workflowStages/WorkflowStagesWrapper"
import { SetWorkflowContext, WorkflowContext } from "../../../../../pages/applications/workflow/WorkflowContext"
import NoData from "../../../NoData"
import { AddActionToWorkflowStage } from "./AddActionToWorkflowStage"
import slideNext from '../../../../../images/new_frame.png'

export const AddingActionView = () => {
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

    const handleGoBack = () => {
        setWorkflowContext({type: 'CHANGE_CURRENT_SELECTED_STAGE', payload: {stageId: undefined}})
    }

    if(selectedStage) {
        return (
            <Box sx={{maxHeight: '100%', display: 'flex', flexDirection: 'column'}}>
                <Box sx={{flex: 1}} >
                    <IconButton onClick={handleGoBack}>
                        <img src={slideNext} style={{transform: 'rotate(180deg)'}} alt="go back"/>
                    </IconButton>
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