import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, Typography } from "@mui/material";
import React from "react";
import ActionTypeToSupportedRuntimes from "../../../../custom_enums/ActionTypeToSupportedRuntimes";
import getDefaultCode from "../../../../custom_enums/DefaultCode";
import { BuildActionContext, SetBuildActionContext, UseActionHooks } from "../../../../pages/build_action/context/BuildActionContext";

export type ActionConfigProps = {
    pinned?: boolean,
    published?: boolean,
    onPinToggle: () => void,
    onPublishToggle: () => void,
    language?: string,
    actionType?: string,
    onLanguageChange?: (newLanguage?: string) => void,
    returnType?: string,
    onReturnTypeChange?: (newReturnType?: string) => void
}

function ActionConfig(props: ActionConfigProps) {
    const { pinned, published, onPinToggle, onPublishToggle, language, onLanguageChange, actionType } = props
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const useActionHooks = React.useContext(UseActionHooks)
    const currentActionName = buildActionContext.actionDefinitionWithTags.actionDefinition.UniqueName
    const [actionName, setActionName] = React.useState(currentActionName ?? "")
    const activeTemplate = (buildActionContext?.actionTemplateWithParams || []).find(at => at.template.Id===buildActionContext.activeTemplateId)?.template
    const getInitialActionType = () => {
        return buildActionContext.actionDefinitionWithTags.actionDefinition.ActionType
    }
    const getInitialTemplateLanguage = () => {
        return buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId)!.template?.SupportedRuntimeGroup
    }

    const getInitialReturnType = () => {
        return buildActionContext.actionDefinitionWithTags.actionDefinition.PresentationFormat
    }
    const [templateSupportedRuntimeGroup, setTemplateSupportedRuntimeGroup] = React.useState(getInitialTemplateLanguage())
    const [returnType, setReturnType] = React.useState(getInitialReturnType())
    React.useEffect(() => {
        setBuildActionContext({
            type: "SetActionTemplateText",
            payload: {
                newText: getDefaultCode(actionType, activeTemplate?.SupportedRuntimeGroup)
            }
        })
    }, [actionType, actionName, activeTemplate?.SupportedRuntimeGroup])
    return (
        <Box sx={{py:1}}>
            <Box sx={{py:1,borderBottom:'3px solid #e3e3e3',px:3}}>
                <Typography sx={{fontSize:'1.2rem',fontWeight:600}}>
                    Action config
                </Typography>
            </Box>
            <Box sx={{px:3,borderBottom:'3px solid #e3e3e3',py:2}}>
                <Box sx={{mt:2}}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Select your Scripting Language</InputLabel>
                        <Select
                            value={language|| "Select"}
                            onChange={(event) => onLanguageChange?.(event.target.value)}
                            variant="outlined"
                            label="Select your Scripting Language"
                            fullWidth
                        >
                            {ActionTypeToSupportedRuntimes[actionType].map( runtime => {
                                return <MenuItem value={runtime}>{runtime}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    {/* <Autocomplete/> */}
                </Box>
            </Box>
            <Box sx={{display:'flex',flexDirection:'row',px:3,gap:4}}>
                <Box>
                <FormControlLabel
                    control={
                        <Switch checked={pinned||false} onChange={() => onPinToggle?.()} name="jason" />
                    }
                    label="Pin to App Home Page"
                />
                </Box>
                <Box>
                <FormControlLabel
                    control={
                        <Switch checked={published||false} onChange={() => onPublishToggle?.()} name="jason" />
                    }
                    label="Publish"
                />
                </Box>
            </Box>
        </Box>
    )
}

export default ActionConfig;