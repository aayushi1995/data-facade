import { Typography } from "@mui/material";
import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React from "react";
import ActionTypeToSupportedRuntimes from "../../../../custom_enums/ActionTypeToSupportedRuntimes";
import TemplateLanguage from "../../../../enums/TemplateLanguage";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import { BuildActionWizardStepProps } from "../BuildActionWizard";

const SetActionTypeAndLanguage = (props: BuildActionWizardStepProps) => {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const getInitialActionType = () => {
        return buildActionContext.actionDefinitionWithTags.actionDefinition.ActionType
    }
    const getInitialTemplateLanguage = () => {
        return buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId)!.template.Language
    }
    const getConfiguredRuntimes = buildActionContext.actionTemplateWithParams.map(at => at.template.SupportedRuntimeGroup)

    const [actionType, setActionType] = React.useState(getInitialActionType())
    const [templateSupportedRuntimeGroup, setTemplateSupportedRuntimeGroup] = React.useState(getInitialTemplateLanguage())
    const [buildNew, setBuildNew] = React.useState(false)
    const [useTemplate, setUseTemplate] = React.useState(false)

    console.log(actionType, templateSupportedRuntimeGroup, buildActionContext)

    const onContinue = () => {
        if (!!actionType && actionType !== "Select") {
            setBuildActionContext({
                type: "SetActionDefinitionActionType",
                payload: {
                    newActionType: actionType
                }
            })
        }
        if (!!templateSupportedRuntimeGroup && templateSupportedRuntimeGroup !== "Select") {
            setBuildActionContext({
                type: "SetActionTemplateSupportedRuntimeGroup",
                payload: {
                    templateId: buildActionContext.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId!,
                    newSupportedRuntimeGroup: templateSupportedRuntimeGroup
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
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 3, height: "100%", p: 3}}>
                    <Box sx={{width: "100%"}}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Action Type</InputLabel>
                            <Select
                                value={actionType || "Select"}
                                onChange={(event) => setActionType(event.target.value)}
                                variant="outlined"
                                label="Action Type"
                                fullWidth
                            >
                                {Object.keys(ActionTypeToSupportedRuntimes).map((actionType) => {
                                    return <MenuItem value={actionType}>{actionType}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{width: "100%"}}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Select your Scripting Language</InputLabel>
                            <Select
                                value={templateSupportedRuntimeGroup|| "Select"}
                                onChange={(event) => setTemplateSupportedRuntimeGroup(event.target.value)}
                                variant="outlined"
                                label="Select your Scripting Language"
                                fullWidth
                            >
                                {ActionTypeToSupportedRuntimes[buildActionContext.actionDefinitionWithTags.actionDefinition.ActionType!].map( runtime => {
                                    return <MenuItem value={runtime}>{runtime}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row", width: "100%", gap: 2, justifyContent: "center", alignItems: "center"}}>
                        <Box>
                            <FormControlLabel
                                control={
                                <Checkbox checked={buildNew} onChange={(event)=> setBuildNew(event.target.checked)} name="jason" />
                                }
                                label="Build New"
                            />
                        </Box>
                        <Box>
                            <FormControlLabel
                                control={
                                <Checkbox checked={useTemplate} onChange={(event)=> setUseTemplate(event.target.checked)} name="jason" />
                                }
                                label="Use Template"
                            />
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", justifyContent: "center"}}>
                        <Button variant="contained" onClick={onContinue}>Continue</Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default SetActionTypeAndLanguage;