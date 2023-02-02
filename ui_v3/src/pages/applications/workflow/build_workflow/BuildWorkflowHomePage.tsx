import { Box, Dialog } from "@mui/material";
import React, { useContext } from "react";
import { useQueryClient } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { BuildActionContext, BuildActionContextProvider, SetBuildActionContext } from "../../build_action_old/context/BuildActionContext";
import { WorkflowContext, WorkflowContextProvider } from "../context/WorkflowContext";
import WorkflowDetails from "../create/addAction/WorkflowDetails";
import useSaveWorkflowMutation from "../create/hooks/useSaveWorkflowMutation";

export interface BuildWorkflowHomePageProps {

}

const BuildWorkflowHomePage = (props: BuildWorkflowHomePageProps) => {
    const location = useLocation()
    const applicationId = (location.search ? new URLSearchParams(location.search).get("applicationId")
                            : undefined )



    return (
        <BuildActionContextProvider>
            <WorkflowContextProvider>
                <WorkflowEditor applicationId={applicationId === null ? undefined : applicationId}/>
            </WorkflowContextProvider>
        </BuildActionContextProvider>
    )
}

const WorkflowEditor = (props: {applicationId?: string}) => {
    const history = useHistory()
    const queryClient = useQueryClient()
    const [ dialogopen, setDialogOpen ]  = React.useState(true)
    
    const workflowContext = useContext(WorkflowContext)
    const actionContext = useContext(BuildActionContext)

    const setActionContext = useContext(SetBuildActionContext)

    const saveWorkflowMutation = useSaveWorkflowMutation({mutationName: "CreateWorkflow", applicationId: props.applicationId})

    React.useEffect(() => {
        setActionContext({ type: "SetApplicationId", payload: { newApplicationId: props.applicationId } })
    }, [props.applicationId])

    const handleSave = () => {
        // TODO: CMC
        const definitionId = uuidv4()
        saveWorkflowMutation.mutate(({actionContext: actionContext, workflowContext: workflowContext, definitionId: definitionId}), {
            onSuccess: () => {
                queryClient.invalidateQueries("Application")
                setDialogOpen(false)
                history.push(`/application/edit-workflow/${definitionId}`)
            }
        })
    }

    return (
        <>
            <Dialog open={dialogopen} fullWidth maxWidth="md">
                <Box sx={{minHeight: '400px' , padding:'0px'}}>
                    <WorkflowDetails onContinue={handleSave}/>
                </Box>    
            </Dialog>
        </>
    )
}

export default BuildWorkflowHomePage;