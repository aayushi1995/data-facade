import { Box, Button } from "@material-ui/core";
import { useContext } from "react";
import { AddingActionView } from "../../common/components/workflow/create/addAction/AddingActionView";
import { WorkflowContext, SetWorkflowContext, WorkflowContextProvider, WorkflowContextType, SetWorkflowContextType } from "../applications/workflow/WorkflowContext";
import { StagesWithActions } from '../../common/components/workflow/create/newStage/StagesWithActions'
import WorkflowHero, { WorkflowHeroProps } from "../../common/components/workflow-editor/WorkflowHero";
import WorkflowDetails from "../../common/components/workflow/create/addAction/WorkflowDetails";
import { makeWorkflowTemplate } from "../../common/components/workflow/create/util/MakeWorkflowTemplate";
import useSaveWorkflowMutation from "../../common/components/workflow/create/hooks/useSaveWorkflowMutation";
import {RouteComponentProps, useHistory, useLocation} from "react-router-dom"
import { useQueryClient } from "react-query";
import WorkflowTabs from "../../common/components/workflow/create/WorkflowTabs";

export interface BuildWorkflowHomePageProps {

}

const BuildWorkflowHomePage = (props: BuildWorkflowHomePageProps) => {
    const location = useLocation()
    const applicationId = location.state as string
    console.log(applicationId)
    return (
        <WorkflowContextProvider>
            <Box sx={{display: "flex", flexDirection: "column", gap: 4, px: 2, py:2}}>
                <Box>
                    <WorkflowHeroWrapper />
                </Box>
                <Box>
                    <WorkflowEditor applicationId={applicationId}/>
                </Box>
            </Box>
        </WorkflowContextProvider>
    )
}

export const WorkflowHeroWrapper = () => {
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
    if(workflowState.Name === "") {
        return <></>
    }
    return (
        <WorkflowHero {...worflowHeroProps}/>
    )
}

const WorkflowEditor = (props: {applicationId?: string}) => {
    const history = useHistory()
    const queryClient = useQueryClient()
    console.log(props)
    const workflowContext = useContext(WorkflowContext)
    const setWorkflowState: SetWorkflowContextType = useContext(SetWorkflowContext)
    const saveWorkflowMutation = useSaveWorkflowMutation({mutationName: "CreateWorkflow", applicationId: props.applicationId})

    const handleSave = () => {
        setWorkflowState({type: 'SET_APPLICATION_ID', payload: props.applicationId})
        saveWorkflowMutation.mutate(workflowContext, {
            onSuccess: () => {
                console.log("SUCCESS")
                queryClient.invalidateQueries("Application")
                history.goBack()
            }
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
                    <Box sx={{overflow: 'clip', flexDirection: 'column', gap: 3}}>  
                        <Box p={2}>
                            <WorkflowTabs/>
                            {/* <StagesWithActions/>   */}
                        </Box>  
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 3, mr: 5, gap: 2}}>
                            <Button onClick={handleSave} color="primary" variant="contained">
                                Test and Save
                            </Button>
                            <Button variant="contained" sx={{background: "#F178B6"}} disabled>
                                Save for later
                            </Button>
                        </Box>
                    </Box>
                    
                )}
                </>
            )}
        </>
    )
}

export default BuildWorkflowHomePage;