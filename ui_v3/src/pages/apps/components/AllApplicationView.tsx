import React from "react"
import { Grid, Box, Typography, Dialog, DialogContent } from '@mui/material'
import ApplicationHeader from '../../../common/components/application/ApplicationHeader'
import PreBuiltApplications from '../../../common/components/application/PreBuiltApplications'
import ActionInstances from "../../../common/components/application/ActionInstances"
import ActionDefinitions from "../../../common/components/application/ActionDefinitions"
import ApplicationCreationWizard from "../application_creation_wizard/ApplicationCreationWizard"
import { BuildApplicationContextProvider } from "../application_creation_wizard/context/BuildApplicationContext"

const AllApplicationView = () => {
    const [dialogState, setDialogState] = React.useState<{isOpen: boolean}>({isOpen: true})
    const handleDialogClose = () => setDialogState(oldState => ({...oldState, isOpen: false}))
    const [searchQuery, setSearchQuery] = React.useState("")

    const handleApplicationSearchQuery = (search: string) => {
        setSearchQuery(search)
    }

    return (
        <Box sx={{p: 1, overflowY: 'auto', minHeight: '100%', display: 'flex', gap: 2, flexDirection: 'column'}}>
            <Box sx={{flex: 1}}>
                <ApplicationHeader pageHeader="Application" subHeading="Create, Manage Applications from here" searchQuery={searchQuery} setSearchQuery={handleApplicationSearchQuery}></ApplicationHeader>
            </Box>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 4}}>
                <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
                    <Box sx={{flex: 1}}>
                        <Typography sx={{color: '#304FFE'}}>
                            Prebuilt Apps
                        </Typography>
                    </Box>
                    <Box sx={{flex: 1, overflowX: 'auto'}}>
                        <PreBuiltApplications searchQuery={searchQuery}/>
                    </Box>
                </Box>
                <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
                    <Box sx={{flex: 1}}>
                        <Typography sx={{color: '#304FFE'}}>
                            Action Instances
                        </Typography>
                    </Box>
                    <Box sx={{flex: 1, overflowX: 'auto'}}>
                        <ActionInstances searchQuery={searchQuery}/>
                    </Box>
                </Box>
                <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
                    <Box sx={{flex: 1}}>
                        <Typography sx={{color: '#304FFE'}}>
                        Action Definitions
                        </Typography>
                    </Box>
                    <Box sx={{flex: 1, overflowX: 'auto'}}>
                        <ActionDefinitions searchQuery={searchQuery}/>
                    </Box>
                </Box>
                <Dialog open={dialogState.isOpen} onClose={handleDialogClose} fullWidth maxWidth="xl">
                    <DialogContent sx={{minHeight: "800px"}}>
                        <BuildApplicationContextProvider>
                            <ApplicationCreationWizard/>
                        </BuildApplicationContextProvider>
                    </DialogContent>
                </Dialog>

            </Box>
        </Box>
    )
}

export default AllApplicationView