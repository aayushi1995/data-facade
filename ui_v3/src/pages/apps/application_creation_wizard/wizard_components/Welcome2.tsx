import { Typography } from "@mui/material";
import { Box, Button } from "@mui/material";
import { BuildApplicationWizardStepProps } from "../ApplicationCreationWizard";


const Welcome2 = (props: BuildApplicationWizardStepProps) => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%"}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", flexGrow: 1}}>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Typography sx={{
                        fontFamily: "'SF Compact Display'",
                        fontStyle: "normal",
                        fontWeight: 900,
                        fontSize: "25px",
                        lineHeight: "45px",
                        display: "flex",
                        alignItems: "center",
                        textAlign: "center",
                        color: "#A7A9AC"
                    }}>
                        Data Facade brings you the power to use
                    </Typography>
                    <Typography sx={{
                        fontFamily: "'SF Compact Display'",
                        fontStyle: "normal",
                        fontWeight: 900,
                        fontSize: "25px",
                        lineHeight: "45px",
                        display: "flex",
                        alignItems: "center",
                        textAlign: "center",
                        color: "#A7A9AC"
                    }}>
                        either a No-code or a Hybrid-code platform to create your actions
                    </Typography>
                    <Typography sx={{
                        fontFamily: "'SF Compact Display'",
                        fontStyle: "normal",
                        fontWeight: 900,
                        fontSize: "25px",
                        lineHeight: "45px",
                        display: "flex",
                        alignItems: "center",
                        textAlign: "center",
                        color: "#A7A9AC"
                    }}>
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