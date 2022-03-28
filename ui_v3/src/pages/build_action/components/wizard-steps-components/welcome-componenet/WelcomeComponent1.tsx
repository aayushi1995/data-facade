import { Box, Button, Typography } from "@mui/material"
import { BuildActionWizardStepProps } from "../../BuildActionWizard"

const WelcomeComponent2 = (props: BuildActionWizardStepProps) => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4}}>
            <Box sx={{display: "flex", width: "100%", alignItems: "center", justifyContent: "center"}}>
                <Typography variant="wizardText">Welcome to Data Facade Action-Creation widget.</Typography>
            </Box>
            <Box sx={{display: "flex", width: "100%", alignItems: "center", justifyContent: "center"}}>
                <Typography variant="wizardText">Experience a new way in how you write actions</Typography>
            </Box>
            <Box sx={{ width: "75%"}}>
                <Typography variant="wizardText">Data Facade brings you the power to use
                either a No-code or a Hybrid-code platform to create your actions
                The first step in building your AI App</Typography>
            </Box>
            <Box>
                <Button variant="contained" onClick={props.nextStep}>Next</Button>
            </Box>
        </Box>
    )
}

export default WelcomeComponent2