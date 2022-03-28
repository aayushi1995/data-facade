import { Typography } from "@mui/material";
import { Box, Button } from "@mui/material";
import { BuildApplicationWizardStepProps } from "../ApplicationCreationWizard";


const Welcome1 = (props: BuildApplicationWizardStepProps) => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%"}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", flexGrow: 1}}>
                <Box>
                    <Typography variant="wizardText">
                        Welcome to Data Facade APP-Creation widget.
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="wizardText">
                        Experience a new way in how you create apps 
                    </Typography>
                </Box>
            </Box>
            <Box sx={{flexGrow: 1}}>
                <Button variant="contained" onClick={() => props.nextStep()}>Next</Button>
            </Box>
        </Box>
    )
}

export default Welcome1;