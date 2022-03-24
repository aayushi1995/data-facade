import { Typography } from "@mui/material";
import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import { BuildActionWizardStepProps } from "../BuildActionWizard";

const SetActionName = (props: BuildActionWizardStepProps) => {
    const {nextStep, previousStep} = props
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const getDefaultName = () => {
        return buildActionContext.actionDefinitionWithTags.actionDefinition.DisplayName||""
    }

    const [actionName, setActionName] = React.useState(getDefaultName())

    const saveActionName = () => {
        setBuildActionContext({
            type: "SetActionDefinitionName",
            payload: {
                newName: actionName
            }
        })
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 3, width: "100%"}}>
            <Box>
                <Typography sx={{
                    fontFamily: "SF Compact Display",
                    fontStyle: "normal",
                    fontWeight: 300,
                    fontSize: "25px",
                    lineHeight: "45px",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    color: "#A7A9AC"
                }}>
                    Type your Action Name
                </Typography>
            </Box>
            <Box>
                <TextField onBlur={saveActionName} variant="outlined" label="Action Name" value={actionName} onChange={(event => setActionName(event.target.value))}>

                </TextField>
            </Box>
            <Box>
                <Button onClick={nextStep} variant="contained">
                    Continue
                </Button>
            </Box>
        </Box>
    )
}

export default SetActionName;