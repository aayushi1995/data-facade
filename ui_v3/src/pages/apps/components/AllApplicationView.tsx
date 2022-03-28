import React from "react"
import { Grid, Box, Typography, Dialog, DialogContent, DialogActions, IconButton } from '@mui/material'
import ApplicationHeader from '../../../common/components/application/ApplicationHeader'
import PreBuiltApplications from '../../../common/components/application/PreBuiltApplications'
import ActionInstances from "../../../common/components/application/ActionInstances"
import CloseIcon from "@mui/icons-material/Close"
import ActionDefinitions from "../../../common/components/application/ActionDefinitions"
import ApplicationCreationWizard from "../application_creation_wizard/ApplicationCreationWizard"
import { BuildApplicationContextProvider } from "../application_creation_wizard/context/BuildApplicationContext"

const AllApplicationView = () => {
    const [dialogState, setDialogState] = React.useState<{isOpen: boolean}>({isOpen: false})
    const handleDialogClose = () => setDialogState(oldState => ({...oldState, isOpen: false}))
    const [searchQuery, setSearchQuery] = React.useState("")

    const handleApplicationSearchQuery = (search: string) => {
        setSearchQuery(search)
    }

    const handleDialogOpen = () => {
        setDialogState({isOpen: true})
    }

    return (
        <Box sx={{p: 1, overflowY: 'auto', minHeight: '100%', display: 'flex', gap: 2, flexDirection: 'column'}}>
            <Box sx={{flex: 1}}>
                <ApplicationHeader pageHeader="Application" subHeading="Create, Manage Applications from here" searchQuery={searchQuery} setSearchQuery={handleApplicationSearchQuery} handleDialogOpen={handleDialogOpen}></ApplicationHeader>
            </Box>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 4}}>
                <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
                    <Box sx={{flex: 1}}>
                        <Typography variant="allApplicationViewSectionHeader">
                            Prebuilt Apps
                        </Typography>
                    </Box>
                    <Box sx={{flex: 1, overflowX: 'auto', ml: 2, pr: 2}}>
                        <PreBuiltApplications searchQuery={searchQuery}/>
                    </Box>
                </Box>
                <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
                    <Box sx={{flex: 1}}>
                        <Typography variant="allApplicationViewSectionHeader">
                            Action Instances
                        </Typography>
                    </Box>
                    <Box sx={{flex: 1, overflowX: 'auto', ml: 2, pr: 2}}>
                        <ActionInstances searchQuery={searchQuery}/>
                    </Box>
                </Box>
                <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
                    <Box sx={{flex: 1}}>
                        <Typography variant="allApplicationViewSectionHeader">
                        Action Definitions
                        </Typography>
                    </Box>
                    <Box sx={{flex: 1, overflowX: 'auto', ml: 2, pr: 2}}>
                        <ActionDefinitions searchQuery={searchQuery}/>
                    </Box>
                </Box>
                <Dialog open={dialogState.isOpen} fullWidth maxWidth="xl">
                    <DialogActions>
                        <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
                            <IconButton onClick={handleDialogClose}>
                                <CloseIcon/>
                            </IconButton>
                        </Box>
                    </DialogActions>
                    <DialogContent sx={{minHeight: "800px"}}>
                        <BuildApplicationContextProvider>
                            <ApplicationCreationWizard onCreationComplete={() => handleDialogClose()}/>
                        </BuildApplicationContextProvider>
                    </DialogContent>
                </Dialog>

            </Box>
        </Box>
    )
}

export default AllApplicationView