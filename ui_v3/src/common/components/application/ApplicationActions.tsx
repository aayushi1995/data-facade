import { Box } from "@mui/material";
import React from "react"
import { useQueryClient } from "react-query";
import { ActionDetailsForApplication, ApplicationDetails } from "../../../generated/interfaces/Interfaces";
import ApplicationActionCard from "./ApplicationActionCard";


interface ApplicationActionsProps {
    application: ApplicationDetails
}

const ApplicationActions = (props: ApplicationActionsProps) => {

    const queryClient = useQueryClient()

    const handleDeleteAction = (deleteId: string, applicationId: string) => {
        const newActions = props.application?.actions?.filter(action => action?.model?.Id !== deleteId)
        const newData: ApplicationDetails = {...props.application, actions: newActions}
        queryClient.setQueryData(["Application", "details", applicationId], [newData])
    }

    return (
        <Box sx={{overflowY: 'auto', display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 1, p: 1}}>
            {props.application?.actions?.map((action, index) => {
                return (
                    <Box sx={{maxWidth: '100%', mt: 1}}>
                        <ApplicationActionCard action={action} handleDeleteAction={handleDeleteAction}/>
                    </Box>
                )
            })}
        </Box>
    )
}

export default ApplicationActions;