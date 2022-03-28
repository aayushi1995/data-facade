import { IconButton, Stack, Typography } from "@mui/material";
import { Box, Button, Grid, TextField } from "@mui/material";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import { BuildActionWizardStepProps } from "../BuildActionWizard";

const Congratulations = (props: BuildActionWizardStepProps) => {
    const onContinue = () => {
        props.nextStep()
    }

    return (        
            <Box sx={{ width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row-reverse"}}>
                    <IconButton onClick={onContinue}>
                        <CloseIcon/>
                    </IconButton>
                </Box>
                <Grid container sx={{ height: "100%" }}>
                    <Grid item xs={12} md={6}>
                        
                    </Grid> 
                    <Grid item xs={12} md={6}>
                        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-around", minHeight: "100%"}}>    
                            <Box>
                                <Typography variant="wizardText">CONGRATULATIONS !!! </Typography>
                                <Typography variant="wizardText">You have successfully created your action</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
    )
}

export default Congratulations;