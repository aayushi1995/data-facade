import { Typography } from "@mui/material";
import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import { BuildActionWizardStepProps } from "../BuildActionWizard";
import SetActionParameters from "../common-components/SetActionParameters";

const SetActionParametersWizardWrapper = (props: BuildActionWizardStepProps) => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 5, width: "100%"}}>
            <Box sx={{width: "100%"}}>
                <SetActionParameters/>
            </Box>
            <Box sx={{width: "100%"}}>
                <Button variant="contained" onClick={props.nextStep}>Continue</Button>
            </Box>
        </Box>
    )
}

export default SetActionParametersWizardWrapper;