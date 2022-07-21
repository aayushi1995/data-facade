import { Box, Grid, Typography, Divider, Card } from "@mui/material"
import React from "react"
import ActionDefinitionPresentationFormat from "../../../../enums/ActionDefinitionPresentationFormat"
import ActionExecutionStatus from "../../../../enums/ActionExecutionStatus"
import { WorkflowContext } from "../../../../pages/applications/workflow/WorkflowContext"
import ViewExecutionCharts from "../../../ViewExecutionCharts"
import SaveAndBuildChartContextProvider from "../../charts/SaveAndBuildChartsContext"
import SaveAndBuildChartsFromExecution from "../../charts/SaveAndBuildChartsFromExecution"
import ViewActionExecutionOutput from "../../ViewActionExecutionOutput"


const ShowWorkflowExecutionOutput = () => {
    const workflowContext = React.useContext(WorkflowContext)

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
            {workflowContext.stages.slice(0).reverse().map(stage => {
                return stage.Actions.slice(0).reverse().map(actionExecution => {
                    if (actionExecution.PresentationFormat === undefined ||
                        actionExecution.PresentationFormat === ActionDefinitionPresentationFormat.SINGLE_VALUE ||
                        actionExecution.ExecutionStatus === ActionExecutionStatus.FAILED){
                        return (<Box></Box>)
                    }
                    return (
                        <Box sx={{display: 'flex', gap: 2, flexDirection: 'column'}}>
                            <Typography sx={{display: 'flex', justifyContent: 'center'}}>
                                {actionExecution.DisplayName}
                            </Typography>
                            <Divider/>
                            <SaveAndBuildChartContextProvider>
                                <SaveAndBuildChartsFromExecution executionId={actionExecution.Id}/>
                            </SaveAndBuildChartContextProvider>
                            {/* <ViewActionExecutionOutput executionId={actionExecution.Id} presentationFormat={actionExecution.PresentationFormat || "NA"}/> */}
                            <Divider/>
                            {/* <Card sx={{height: '100%', width: '100%'}}>
                                <ViewExecutionCharts executionId={actionExecution.Id}/>
                            </Card> */}
                        </Box>
                    )
                })
            })}
        </Box>
    )
}

export default ShowWorkflowExecutionOutput