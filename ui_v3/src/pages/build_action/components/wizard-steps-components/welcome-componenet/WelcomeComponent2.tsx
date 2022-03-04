import { Box, Button, Typography } from "@mui/material"
import { BuildActionWizardStepProps } from "../../BuildActionWizard"

const WelcomeComponent2 = (props: BuildActionWizardStepProps) => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <Box>
                <Typography sx={{
                      fontFamily: "SF Compact Display",
                      fontStyle: "normal",
                      fontWeight: 900,
                      fontSize: "25px",
                      lineHeight: "45px",
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                      color: "#A7A9AC"
                }}>Data Facade brings you the power to use
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