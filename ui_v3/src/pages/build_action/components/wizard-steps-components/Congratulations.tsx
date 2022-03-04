import { Typography } from "@material-ui/core";
import { Box, Button, Grid, TextField } from "@mui/material";
import React from "react";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import { BuildActionWizardStepProps } from "../BuildActionWizard";

const Congratulations = (props: BuildActionWizardStepProps) => {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const getDefaultName = () => {
        return buildActionContext.actionDefinitionWithTags.actionDefinition.DisplayName||""
    }

    const [actionName, setActionName] = React.useState(getDefaultName())

    const onContinue = () => {
        setBuildActionContext({
            type: "SetActionDefinitionName",
            payload: {
                newName: actionName
            }
        })
        props.nextStep()
    }

    return (
        <Grid container>
            <Grid item xs={12} md={6}>
                IMAGE
            </Grid> 
            <Grid item xs={12} md={6}>
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-around", minHeight: "100%"}}>    
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
                        }}>CONGRATULATIONS !!! </Typography>
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
                        }}>You have successfully created your action</Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Congratulations;