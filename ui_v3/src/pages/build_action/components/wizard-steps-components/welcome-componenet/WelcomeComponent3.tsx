import { Box, Button, Typography } from "@mui/material"
import { BuildActionWizardStepProps } from "../../BuildActionWizard"

const WelcomeComponent3 = (props: BuildActionWizardStepProps) => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%"}}>
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
                }}>Please answer the following questions to help you create your first action</Typography>
            </Box>
            <Box>
                <Button variant="contained" onClick={props.nextStep}>Next</Button>
            </Box>
        </Box>
    )
}

export default WelcomeComponent3