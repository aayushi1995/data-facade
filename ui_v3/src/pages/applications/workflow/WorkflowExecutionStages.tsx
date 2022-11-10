import { Box, Grid } from "@mui/material"
import React from "react"
import WorkflowExecutionStage, { WorkflowExecutionStageProps } from "../../../common/components/workflow/execute/WorkflowExecutionStage"
import WorkflowStage, { WorkflowStageProps } from "../../../../src/application/common/workflowStages/WorkflowStage";
import { WorkflowContext } from "./WorkflowContext"



const WorkflowExecutionStages = () => {
    const workflowContext = React.useContext(WorkflowContext)
    var color = 'pink'
    const workflowStages: any = workflowContext.stages.map((stage, index) => {
        color = index%2===1 ? 'rgba(238, 238, 255, 1)' : 'rgba(166, 206, 227, 1)'
        // const cardButton: string = (index !== workflowContext?.stages?.length-1 ) ? 'minus' : 'plus'
        return {
            color: color,
            // cardButton: cardButton,
            // ...stage
        }
    })
    const stagesWithActions: WorkflowExecutionStageProps[] = workflowContext.stages.map((workflowStage, ind) => {
        var color = 'green'
        var color2 = 'red'
        color = ind%2===1 ? '#3cfa91' : '#41f518'
        color2 = ind%2===1 ? '#f29d9d' : '#fc586e'
        return {
            stageId: workflowStage.Id,
            stageName: workflowStage.Name,
            actionStatuses: workflowStage.Actions.map(actionExecution => actionExecution.ExecutionStatus || "Created"),
            actionExecutionIds: workflowStage.Actions.map(ae => ae.Id),
            stageCompleted: workflowStage.completed || false,
            color:workflowStage.completed?color:color2,
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
                    <Grid sx={{p:0,m:0}} xs={3}>
                        <WorkflowExecutionStage {...stage} />
                        {/* <WorkflowStage {...}/> */}
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default WorkflowExecutionStages