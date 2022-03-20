import { Box } from "@mui/material";
import React from "react"
import { ActionDetailsForApplication } from "../../../generated/interfaces/Interfaces";
import ApplicationActionCard from "./ApplicationActionCard";


interface ApplicationActionsProps {
    actions: ActionDetailsForApplication[]
}

const ApplicationActions = (props: ApplicationActionsProps) => {
    return (
        <Box sx={{overflowY: 'auto', display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 1, p: 1}}>
            {props.actions.map((action, index) => {
                return (
                    <Box sx={{maxWidth: '100%', mt: 1}}>
                        <ApplicationActionCard action={action}/>
                    </Box>
                )
            })}
        </Box>
    )
}

export default ApplicationActions;