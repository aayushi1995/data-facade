import { Box, Grid, Typography, Divider, Card } from "@mui/material"
import { borderRadius } from "@mui/system"
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
    const lastAction = workflowContext.stages[(workflowContext.stages.length - 1)].Actions[(workflowContext.stages[(workflowContext.stages.length - 1)].Actions.length - 1)];
    return (
        <Box sx={{display: 'flex', flexDirection: 'column',mt:1}}>
            {(
            (lastAction.PresentationFormat === undefined || 
                lastAction.PresentationFormat === ActionDefinitionPresentationFormat.SINGLE_VALUE || 
                lastAction.ExecutionStatus === ActionExecutionStatus.FAILED)?(<Box>Please Check. Something Went wrong</Box>):
                <SaveAndBuildChartContextProvider>
                    <SaveAndBuildChartsFromExecution definitionName={workflowContext.Name} executionId={lastAction.Id}/>
                </SaveAndBuildChartContextProvider>
                
)}
        </Box>
    )
}

export default ShowWorkflowExecutionOutput