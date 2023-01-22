import { Dialog,DialogTitle, Grid, Typography, DialogContent, IconButton } from "@mui/material"
import { useHistory } from "react-router-dom"
import CloseIcon from "../../../../src/images/close.svg"
import { APPLICATION_ROUTE } from "../../../common/components/header/data/RoutesConfig"
import ApplicationCreationWizard from "../application_creation_wizard/ApplicationCreationWizard"
import { BuildApplicationContextProvider } from "../application_creation_wizard/context/BuildApplicationContext"

const ApplicationCreationWizardDialog = () => {
    const history = useHistory()
    const handleDialogClose = () => {
        history.push(APPLICATION_ROUTE)
    }
    
    return (
        <Dialog open={true} fullWidth maxWidth="lg">
            <DialogTitle sx={{display: 'flex',backgroundColor: "ActionConfigDialogBgColor.main", boxShadow: "inset 0px 15px 25px rgba(54, 48, 116, 0.3)"}}>
                    <Grid item xs={6} sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography variant="heroHeader" sx={{
                            fontFamily: "'SF Pro Text'",
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "18px",
                            lineHeight: "120%",
                            letterSpacing: "0.15px",
                            color: "ActionCardBgColor.main"}}
                        >
                            Application Creator
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ml:'auto'}} style={{display: 'flex', justifyContent: 'flex-end'}} >
                        <IconButton onClick={handleDialogClose}>
                            <img src={CloseIcon} alt="close"/>
                        </IconButton>
                    </Grid>
            </DialogTitle>
            <DialogContent sx={{minHeight: "350px"}}>
                <BuildApplicationContextProvider>
                    <ApplicationCreationWizard onCreationComplete={() => handleDialogClose()}/>
                </BuildApplicationContextProvider>
            </DialogContent>
        </Dialog>
    )
}

export default ApplicationCreationWizardDialog