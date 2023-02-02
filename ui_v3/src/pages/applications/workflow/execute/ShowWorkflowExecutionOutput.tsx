import { Box } from "@mui/material"
import React from "react"
import ActionDefinitionPresentationFormat from "../../../../enums/ActionDefinitionPresentationFormat"
import ActionExecutionStatus from "../../../../enums/ActionExecutionStatus"
import { ActionExecutionDetails } from "../../action_execution/ActionExecutionHomePage"
import { WorkflowContext } from "../context/WorkflowContext"


const ShowWorkflowExecutionOutput = () => {
    const workflowContext = React.useContext(WorkflowContext)
    const lastAction = workflowContext.stages[(workflowContext.stages.length - 1)].Actions[(workflowContext.stages[(workflowContext.stages.length - 1)].Actions.length - 1)];
    return (
        <Box sx={{display: 'flex', flexDirection: 'column',mt:1}}>
            {(
            (lastAction.PresentationFormat === undefined || 
                lastAction.PresentationFormat === ActionDefinitionPresentationFormat.SINGLE_VALUE || 
                lastAction.ExecutionStatus === ActionExecutionStatus.FAILED)?(<Box>Please Check. Something Went wrong</Box>):
                <ActionExecutionDetails actionExecutionId={lastAction.Id}/>
                
)}
        </Box>
    )
}

export default ShowWorkflowExecutionOutput