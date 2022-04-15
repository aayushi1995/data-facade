import { Box, Grid, Typography, Divider, Card } from "@mui/material"
import React from "react"
import { WorkflowContext } from "../../../../pages/applications/workflow/WorkflowContext"
import ViewExecutionCharts from "../../../ViewExecutionCharts"
import ViewActionExecutionOutput from "../../ViewActionExecutionOutput"


const ShowWorkflowExecutionOutput = () => {
    const workflowContext = React.useContext(WorkflowContext)
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
            {workflowContext.stages.map(stage => {
                return stage.Actions.map(actionExecution => {
                    return (
                        <Box sx={{display: 'flex', gap: 2, flexDirection: 'column'}}>
                            <Typography sx={{display: 'flex', justifyContent: 'center'}}>
                                {actionExecution.DisplayName}
                            </Typography>
                            <Divider/>
                            <ViewActionExecutionOutput executionId={actionExecution.Id} presentationFormat={actionExecution.PresentationFormat || "NA"}/>
                            <Divider/>
                            <Card>
                                <ViewExecutionCharts executionId={actionExecution.Id}/>
                            </Card>
                        </Box>
                    )
                })
            })}
        </Box>
    )
}

export default ShowWorkflowExecutionOutput