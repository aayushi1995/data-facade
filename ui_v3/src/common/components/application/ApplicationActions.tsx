import { Box, Typography } from "@mui/material";
import React from "react";
import { useQueryClient } from "react-query";
import { ApplicationDetails } from "../../../generated/interfaces/Interfaces";
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
        <Box>
            {(props.application?.actions || []).length === 0 ? (
                <Box sx={{width: '100%', minheight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography variant="heroHeader">No Actions</Typography>
                </Box>
            ) : (
                <Box sx={{overflowY: 'auto', display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 1, p: 1}}>
                    {(props.application?.actions || []).sort((a1, a2) => ((a2?.model?.CreatedOn||0) - (a1?.model?.CreatedOn||0)))?.map((action, index) => {
                        return (
                            <Box sx={{Width: '100%', mt: 1}}>
                                <ApplicationActionCard action={action} handleDeleteAction={handleDeleteAction}/>
                            </Box>
                        )
                    })}
                </Box>
            )}
            
        </Box>
    )
}

export default ApplicationActions;