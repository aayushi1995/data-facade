import { Box, Typography } from "@mui/material"
import { ActionDetailsForApplication } from "../../../generated/interfaces/Interfaces"
import ApplicationActionCard from "./ApplicationActionCard"

interface ApplicationWorkflowProps {
    workflows: ActionDetailsForApplication[]
}

const ApplicationWorkflows = (props: ApplicationWorkflowProps) => {
    return (
        <Box>
            {(props.workflows || []).length === 0 ? (
                <Box sx={{width: '100%', minheight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography variant="heroHeader">No Flows</Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 1, p: 1}}>
                    {(props.workflows || []).sort((a1, a2) => ((a2?.model?.CreatedOn||0) - (a1?.model?.CreatedOn||0)))?.map((workflow, index) => {
                        return (
                            <Box sx={{Width: '100%', mt: 1}}>
                                <ApplicationActionCard action={workflow} isWorkflow={true}/>
                            </Box>
                        )
                    })}
                </Box>
            )}
        </Box>
    )
}

export default ApplicationWorkflows