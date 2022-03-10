import { Typography } from "@material-ui/core";
import { Box, Button } from "@mui/material";
import { BuildApplicationWizardStepProps } from "../ApplicationCreationWizard";


const Welcome1 = (props: BuildApplicationWizardStepProps) => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%"}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", flexGrow: 1}}>
                <Box>
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
                        Welcome to Data Facade APP-Creation widget.
                    </Typography>
                </Box>
                <Box>
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