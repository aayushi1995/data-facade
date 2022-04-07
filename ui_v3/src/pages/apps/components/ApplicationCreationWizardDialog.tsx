import CloseIcon from "@mui/icons-material/Close"
import { Box, Dialog, DialogActions, DialogContent, IconButton } from "@mui/material"
import { useHistory } from "react-router-dom"
import { APPLICATION_ROUTE } from "../../../common/components/header/data/RoutesConfig"
import ApplicationCreationWizard from "../application_creation_wizard/ApplicationCreationWizard"
import { BuildApplicationContextProvider } from "../application_creation_wizard/context/BuildApplicationContext"

const ApplicationCreationWizardDialog = () => {
    const history = useHistory()
    const handleDialogClose = () => {
        history.push(APPLICATION_ROUTE)
    }
    
    return (
        <Dialog open={true} fullWidth maxWidth="xl">
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
    )
}

export default ApplicationCreationWizardDialog