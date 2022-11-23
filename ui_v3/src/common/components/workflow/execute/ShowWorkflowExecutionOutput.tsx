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
            {/*workflowContext.stages.slice(0).reverse().map(stage => {
                return stage.Actions.slice(0).reverse().map(actionExecution => {
                    if (actionExecution.PresentationFormat === undefined ||
                        actionExecution.PresentationFormat === ActionDefinitionPresentationFormat.SINGLE_VALUE ||
                        actionExecution.ExecutionStatus === ActionExecutionStatus.FAILED){
                        return (<Box></Box>)
                    }
                    return (
                        <Box sx={{display: 'flex', flexDirection: 'column'}}>
                            <Typography sx={{display: 'flex', 
                                            justifyContent: 'center',
                                            fontSize:'20px',
                                            boxShadow: '-10px -10px 20px #FAFBFF, 10px 10px 20px #A6ABBD',
                                            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #EBECF0',
                                            backgroundBlendMode: 'soft-light, normal',
                                            border: '2px solid rgba(255, 255, 255, 0.4)',
                                            borderRadius:'8px',
                                            py:2,
                                            mx:2
                                            }}>
                                {actionExecution.DisplayName}
                            </Typography>

                            <SaveAndBuildChartContextProvider>
                                <SaveAndBuildChartsFromExecution executionId={actionExecution.Id}/>
                            </SaveAndBuildChartContextProvider>
                            { <ViewActionExecutionOutput executionId={actionExecution.Id} presentationFormat={actionExecution.PresentationFormat || "NA"}/>}
                            { <Card sx={{height: '100%', width: '100%'}}>
                                <ViewExecutionCharts executionId={actionExecution.Id}/>
                            </Card> }
                        </Box>
                    )
                })
            })*/}
        </Box>
    )
}

export default ShowWorkflowExecutionOutput