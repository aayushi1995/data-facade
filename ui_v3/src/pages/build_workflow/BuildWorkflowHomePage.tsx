import { Box, Button, Dialog, DialogActions, DialogContent, IconButton } from "@mui/material";
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
import React from "react";
import { ArrowRight } from "@mui/icons-material";
import CollapsibleDrawer from "../build_action/components/form-components/CollapsibleDrawer";
import SelectActionDrawer from "../../common/components/common/SelectActionDrawer";
import WorkflowSideDrawer from "../../common/components/workflow/create/SelectAction/WorkflowSideDrawer";
import {v4 as uuidv4} from "uuid"

export interface BuildWorkflowHomePageProps {

}

const BuildWorkflowHomePage = (props: BuildWorkflowHomePageProps) => {
    const location = useLocation()
    const applicationId = location.state as string
    console.log(applicationId)
    return (
        <WorkflowContextProvider>
            <Box sx={{display: 'flex', gap: 1, flexDirection: 'row', width: '100%', height: '100%', overflowY: 'clip'}}>
                <WorkflowSideDrawer/>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1, px: 2, py:1, width: '100%'}}>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <WorkflowHeroWrapper />
                    </Box>
                    <Box>
                        <WorkflowEditor applicationId={applicationId}/>
                    </Box>
                </Box>
            </Box>
        </WorkflowContextProvider>
    )
}

export const WorkflowHeroWrapper = (props: {handleSave?: () => void, handleRun?: () => void, showButton?: boolean}) => {
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
        }),
        handleSave: props.handleSave,
        handleRun: props.handleRun,
        showButtons: props.showButton,
        lastSyncOn: workflowState.UpdatedOn,
        usageState: workflowState.PublishStatus
    }

    return (
        <WorkflowHero {...worflowHeroProps}/>
    )
}

const WorkflowEditor = (props: {applicationId?: string}) => {
    const history = useHistory()
    const queryClient = useQueryClient()
    const [ dialogopen, setDialogOpen ]  = React.useState(true)
    const workflowContext = useContext(WorkflowContext)
    const setWorkflowState: SetWorkflowContextType = useContext(SetWorkflowContext)
    const saveWorkflowMutation = useSaveWorkflowMutation({mutationName: "CreateWorkflow", applicationId: props.applicationId})

    const handleSave = () => {
        setWorkflowState({type: 'SET_APPLICATION_ID', payload: props.applicationId})
        const definitionId = uuidv4()
        saveWorkflowMutation.mutate(({workflowContext: workflowContext, definitionId: definitionId}), {
            onSuccess: () => {
                console.log("SUCCESS")
                queryClient.invalidateQueries("Application")
                setDialogOpen(false)
                history.push(`/application/edit-workflow/${definitionId}`)
            }
        })
    }

    return (
        <>
            <Dialog open={dialogopen} fullWidth maxWidth="md">
                <DialogContent>
                    <Box p={2} sx={{minHeight: '100%'}}>
                        <WorkflowDetails onContinue={handleSave}/>
                    </Box>    
                </DialogContent>
            </Dialog>
            {workflowContext.currentSelectedStage ? (
                <Box pt={1} sx={{maxHeight: 'inherit', overflowY: 'clip'}}>
                    <AddingActionView/>
                </Box>
            ) : (
                <Box sx={{overflow: 'clip', flexDirection: 'column', gap: 3}}>  
                    <Box p={2}>
                        <WorkflowTabs/>
                    </Box>  
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 3, mr: 5, gap: 2, pb: 2}}>
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
    )
}

export default BuildWorkflowHomePage;