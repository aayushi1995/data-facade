import { Box, Button } from "@material-ui/core";
import { useContext } from "react";
import { AddingActionView } from "../../common/components/workflow/create/addAction/AddingActionView";
import { WorkflowContext, SetWorkflowContext, WorkflowContextProvider, WorkflowContextType, SetWorkflowContextType } from "../applications/workflow/WorkflowContext";
import { StagesWithActions } from '../../common/components/workflow/create/newStage/StagesWithActions'
import WorkflowHero, { WorkflowHeroProps } from "../../common/components/workflow-editor/WorkflowHero";
import WorkflowDetails from "../../common/components/workflow/create/addAction/WorkflowDetails";
import { makeWorkflowTemplate } from "../../common/components/workflow/create/util/MakeWorkflowTemplate";
import useSaveWorkflowMutation from "../../common/components/workflow/create/hooks/useSaveWorkflowMutation";

export interface BuildWorkflowHomePageProps {

}

const BuildWorkflowHomePage = (props: BuildWorkflowHomePageProps) => {
    return (
        <WorkflowContextProvider>
            <Box sx={{display: "flex", flexDirection: "column", gap: 4, px: 2, py:2}}>
                <Box>
                    <WorkflowHeroWrapper/>
                </Box>
                <Box>
                    <WorkflowEditor/>
                </Box>
            </Box>
        </WorkflowContextProvider>
    )
}

const WorkflowHeroWrapper = () => {
    const workflowState: WorkflowContextType = useContext(WorkflowContext)
    const setWorkflowState: SetWorkflowContextType = useContext(SetWorkflowContext)
    const worflowHeroProps: WorkflowHeroProps = {
        readonly: false,
        Name: workflowState.Name,
        Description: workflowState.Description,
        Author: workflowState.Author,
        onNameChange: (newName: string) => setWorkflowState({
            type: "CHANGE_NAME",
            payload: {
                newName: newName
            }
        }),
        onDescriptionChange: (newDescription: string) => setWorkflowState({
            type: "CHANGE_DESCRIPTION",
            payload: {
                newDescription: newDescription
            }
        })
    }
    return (
        <WorkflowHero {...worflowHeroProps}/>
    )
}

const WorkflowEditor = () => {
    const workflowContext = useContext(WorkflowContext)
    const saveWorkflowMutation = useSaveWorkflowMutation({mutationName: "CreateWorkflow"})

    const handleSave = () => {
        const workflowActionTemplate = makeWorkflowTemplate(workflowContext)
        saveWorkflowMutation.mutate(workflowContext, {
            onSuccess: () => console.log("SUCCESS")
        })
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

export default BuildWorkflowHomePage;