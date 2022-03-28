import { Typography } from "@mui/material";
import { Box, Button } from "@mui/material";
import { BuildApplicationWizardStepProps } from "../ApplicationCreationWizard";


const Welcome2 = (props: BuildApplicationWizardStepProps) => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%"}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", flexGrow: 1}}>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Typography variant="wizardText">
                        Data Facade brings you the power to use
                    </Typography>
                    <Typography variant="wizardText">
                        either a No-code or a Hybrid-code platform to create your actions
                    </Typography>
                    <Typography variant="wizardText">
                        The first step in building your AI App
                    </Typography>
                </Box>
            </Box>
            <Box sx={{flexGrow: 1}}>
                <Button variant="contained" onClick={() => props.nextStep()}>Next</Button>
            </Box>
        </Box>
    )
}

export default Welcome2;