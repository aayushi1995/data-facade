import { ActionDetailsForApplication } from "../../../generated/interfaces/Interfaces"
import { Box } from "@mui/material"
import ApplicationActionCard from "./ApplicationActionCard"

interface ApplicationWorkflowProps {
    workflows: ActionDetailsForApplication[]
}

const ApplicationWorkflows = (props: ApplicationWorkflowProps) => {
    return (
        <Box sx={{overflowY: 'auto', display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 1, p: 1}}>
            {props.workflows.map((workflow, index) => {
                return (
                    <Box sx={{maxWidth: '100%', mt: 1}}>
                        <ApplicationActionCard action={workflow} isWorkflow={true}/>
                    </Box>
                )
            })}
        </Box>
    )
}

export default ApplicationWorkflows