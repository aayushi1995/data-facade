import { Box , Grid} from "@mui/material"
import React from "react"
import WorkflowExecutionStage, { WorkflowExecutionStageProps } from "../../../common/components/workflow/execute/WorkflowExecutionStage"
import { WorkflowContext } from "./WorkflowContext"



const WorkflowExecutionStages = () => {
    const workflowContext = React.useContext(WorkflowContext)

    const stagesWithActions: WorkflowExecutionStageProps[] = workflowContext.stages.map(workflowStage => {
        console.log(workflowStage)
        return {
            stageId: workflowStage.Id,
            stageName: workflowStage.Name,
            actionStatuses: workflowStage.Actions.map(actionExecution => actionExecution.ExecutionStatus || "Created"),
            actionExecutionIds: workflowStage.Actions.map(ae => ae.Id),
            stageCompleted: workflowStage.completed || false,
            stageFailed: workflowStage.stageFailed || false,
            stageStarted: workflowStage.stageStarted || false,
            startTime: workflowStage.StartedOn,
            numberOfActions: workflowStage.Actions.length,
            actionCompletionTimes: workflowStage.Actions.map(ae => {
                const time = ((ae.ExecutionCompletedOn || 0) - (ae.ExecutionStartedOn || 0))/1000
                return time 
            })
        }
    })

    return (
        <Box sx={{p: 1}}>
            <Grid container spacing={1}>
                {stagesWithActions.map(stage => (
                    <Grid item xs={12}>
                        <WorkflowExecutionStage {...stage} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default WorkflowExecutionStages