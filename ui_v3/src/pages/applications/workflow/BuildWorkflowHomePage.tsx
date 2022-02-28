import { WorkflowContext, WorkflowContextProvider } from "./WorkflowContext";
import { Box, Button } from "@material-ui/core"
import { AddingActionView } from "../../../common/components/workflow/create/addAction/AddingActionView";
import { StagesWithActions } from "../../../common/components/workflow/create/newStage/StagesWithActions";
import React from "react";
import { makeWorkflowTemplate } from "../../../common/components/workflow/create/util/MakeWorkflowTemplate";
import { useMutation } from "react-query";
import WorkflowDetails from "../../../common/components/workflow/create/addAction/WorkflowDetails";


const BuildWorkflow = () => {
    const workflowContext = React.useContext(WorkflowContext)

    // const useSaveActionDefinition = useMutation()

    const handleSave = () => {
        const workflowActionTemplate = makeWorkflowTemplate(workflowContext)
        console.log(workflowActionTemplate)
    }

    return (
        <>
            {workflowContext.Name === "" ? (
                <Box p={2} sx={{minHeight: '100%'}}>
                    <WorkflowDetails/>
                </Box>
            ) : (
                <>
                {workflowContext.currentSelectedStage ? (
                    <Box pt={1} sx={{maxHeight: 'inherit'}}>
                        <AddingActionView/>
                    </Box>
                ) : (
                    <Box sx={{overflow: 'clip'}}>  
                        <StagesWithActions/>    
                        <Button onClick={handleSave}>
                            save
                        </Button>
                    </Box>
                    
                )}
                </>
            )}
            
        </>
    )
}

const BuildWorkflowHomePage = () => {
    return (
        <WorkflowContextProvider>
            <Box>
                <BuildWorkflow/>
            </Box>
        </WorkflowContextProvider>
    )
}

export default BuildWorkflowHomePage