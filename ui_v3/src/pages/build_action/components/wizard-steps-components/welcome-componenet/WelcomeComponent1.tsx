import { Box, Button, Typography } from "@mui/material"
import { BuildActionWizardStepProps } from "../../BuildActionWizard"

const WelcomeComponent1 = (props: BuildActionWizardStepProps) => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "space-around", justifyContent: "flex-start", width: "100%"}}>
            <Box sx={{display: "flex", flexDirection: "column", flexGrow: 1, width: "100%"}}>
                <Box sx={{display: "flex", width: "100%", alignItems: "center", justifyContent: "center"}}>
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
                    }}>Welcome to Data Facade Action-Creation widget.</Typography>
                </Box>
                <Box sx={{display: "flex", width: "100%", alignItems: "center", justifyContent: "center"}}>
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
                    }}>Experience a new way in how you write actions</Typography>
                </Box>
            </Box>
            <Box sx={{display: "flex", flexGrow: 1, width: "100%", alignItems: "center", justifyContent: "center"}}>
                <Button variant="contained" onClick={props.nextStep}>Next</Button>
            </Box>
        </Box>
    )
}

export default WelcomeComponent1