import { Typography } from "@mui/material";
import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React from "react";
import ActionTypeToSupportedRuntimes from "../../../../custom_enums/ActionTypeToSupportedRuntimes";
import ActionDefinitionPresentationFormat from "../../../../enums/ActionDefinitionPresentationFormat";
import TemplateLanguage from "../../../../enums/TemplateLanguage";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import { BuildActionWizardStepProps } from "../BuildActionWizard";

const SetActionReturnType = (props: BuildActionWizardStepProps) => {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const getInitialReturnType = () => {
        return buildActionContext.actionDefinitionWithTags.actionDefinition.PresentationFormat
    }

    const [returnType, setReturnType] = React.useState(getInitialReturnType())
    const [visualizeUsingDashboardNew, setVisualizeUsingDashboardNew] = React.useState(false)
    const [defaultValue, setDefaultValue] = React.useState(false)

    const onContinue = () => {
        if (!!returnType && returnType !== "Select") {
            setBuildActionContext({
                type: "SetActionDefinitionReturnType",
                payload: {
                    newReturnType: returnType
                }
            })
        }
        props.nextStep()
    }

    return (
        <Grid container>
            <Grid item xs={12} md={6}>

            </Grid>
            <Grid item xs={12} md={6}>
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 3, minHeight: "100%"}}>
                    <Box sx={{width: "100%"}}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Return Type</InputLabel>
                            <Select
                                value={returnType || "Select"}
                                onChange={(event) => setReturnType(event.target.value)}
                                variant="outlined"
                                label="Return Type"
                                fullWidth
                            >
                                <MenuItem value={ActionDefinitionPresentationFormat.SINGLE_VALUE}>Single Value</MenuItem>
                                <MenuItem value={ActionDefinitionPresentationFormat.TIME_SERIES}>Time Series</MenuItem>
                                <MenuItem value={ActionDefinitionPresentationFormat.FREQUENCY}>Frequency</MenuItem>
                                <MenuItem value={ActionDefinitionPresentationFormat.TABLE_VALUE}>Table</MenuItem>
                                <MenuItem value={ActionDefinitionPresentationFormat.OBJECT}>Object</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", width: "100%", gap: 2}}>
                        <Box>
                            <FormControlLabel
                                control={
                                <Checkbox checked={visualizeUsingDashboardNew} onChange={(event)=> setVisualizeUsingDashboardNew(event.target.checked)} name="jason" />
                                }
                                label="Visualize using Dashboard"
                            />
                        </Box>
                        <Box>
                            <FormControlLabel
                                control={
                                <Checkbox checked={defaultValue} onChange={(event)=> setDefaultValue(event.target.checked)} name="jason" />
                                }
                                label="Default Output"
                            />
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", justifyContent: "center", width: "100%"}}>
                        <Button variant="contained" onClick={onContinue}>Continue</Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default SetActionReturnType;