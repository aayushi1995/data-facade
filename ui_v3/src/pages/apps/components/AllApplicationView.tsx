import React from "react"
import { Grid, Box, Typography, Dialog, DialogContent, DialogActions, IconButton } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close"
import ApplicationCreationWizard from "./../application_creation_wizard/ApplicationCreationWizard"
import { BuildApplicationContextProvider } from "../application_creation_wizard/context/BuildApplicationContext"
import PinnedActionDefinitions from "../../../common/components/application/rows/PinnedActionDefinitions"
import PreBuiltApplications from "../../../common/components/application/rows/PreBuiltApplications"
import PinnedActionInstances from "../../../common/components/application/rows/PinnedActionInstances"
import ApplicationHeader from "../../../common/components/application/ApplicationHeader"
import OrgActionInstances from "../../../common/components/application/rows/OrgActionInstances"
import OrgActionDefinitions from "../../../common/components/application/rows/OrgActionDefinitions"

interface AllApplicationViewRow {
    component: (props: AllApplicationRowProps) => React.ReactNode,
    label: string
}

export interface AllApplicationRowProps {
    searchQuery?: string
}

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

    const rows: AllApplicationViewRow[] = [
        {
            component: (props) => <PreBuiltApplications {...props}/>,
            label: "Prebuilt Apps"
        },
        {
            component: (props) => <PinnedActionDefinitions {...props}/>,
            label: "My Action Definitions"
        },
        {
            component: (props) => <PinnedActionInstances {...props}/>,
            label: "My Action Instances"
        },
        {
            component: (props) => <OrgActionDefinitions {...props}/>,
            label: "Org Action Definitions"
        },
        {
            component: (props) => <OrgActionInstances {...props}/>,
            label: "Org Action Definitions"
        }
    ]

    const rowProp: AllApplicationRowProps = {
        searchQuery: searchQuery
    }

    return (
        <Box sx={{p: 1, overflowY: 'auto', minHeight: '100%', display: 'flex', gap: 2, flexDirection: 'column'}}>
            <Box sx={{flex: 1}}>
                <ApplicationHeader pageHeader="Application" subHeading="Create, Manage Applications from here" searchQuery={searchQuery} setSearchQuery={handleApplicationSearchQuery} handleDialogOpen={handleDialogOpen}></ApplicationHeader>
            </Box>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 4}}>
                {rows.map(row => 
                    <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
                        <Box>
                            <Typography variant="allApplicationViewSectionHeader">
                                {row.label}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", overflowX: 'auto', p: 2, pt: 0 }}>
                            {row.component(rowProp)}
                        </Box>
                    </Box>    
                )}
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