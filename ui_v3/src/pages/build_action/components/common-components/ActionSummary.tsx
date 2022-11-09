import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React from "react";
import ActionTypeToSupportedRuntimes from "../../../../custom_enums/ActionTypeToSupportedRuntimes";
import getDefaultCode from "../../../../custom_enums/DefaultCode";
import ActionDefinitionPresentationFormat from "../../../../enums/ActionDefinitionPresentationFormat";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";

const ActionSummary = () => {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const [actionName, setActionName] = React.useState("")
    const [actionDescription, setActionDescription] = React.useState("")

    const getInitialActionType = () => {
        return buildActionContext.actionDefinitionWithTags.actionDefinition.ActionType
    }
    const getInitialTemplateLanguage = () => {
        return buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId)!.template?.SupportedRuntimeGroup
    }

    const getInitialReturnType = () => {
        return buildActionContext.actionDefinitionWithTags.actionDefinition.PresentationFormat
    }

    const [actionType, setActionType] = React.useState(getInitialActionType())
    const [templateSupportedRuntimeGroup, setTemplateSupportedRuntimeGroup] = React.useState(getInitialTemplateLanguage())
    const [returnType, setReturnType] = React.useState(getInitialReturnType())
    
    const activeTemplate = (buildActionContext?.actionTemplateWithParams || []).find(at => at.template.Id===buildActionContext.activeTemplateId)?.template
    React.useEffect(() => {
        setBuildActionContext({
            type: "SetActionTemplateText",
            payload: {
                newText: getDefaultCode(actionType, activeTemplate?.SupportedRuntimeGroup)
            }
        })
    }, [actionType, actionName, activeTemplate?.SupportedRuntimeGroup])
    

    const setReturnTypeInContext = () => {
        if (!!returnType && returnType !== "Select") {
            setBuildActionContext({
                type: "SetActionDefinitionReturnType",
                payload: {
                    newReturnType: returnType
                }
            })
        }
    }
    
    const setActionTypeInContext = () => {
        if (!!actionType && actionType !== "Select") {
            setBuildActionContext({
                type: "SetActionDefinitionActionType",
                payload: {
                    newActionType: actionType
                }
            })
        }
    }

    const setTemplateSupportedRuntimeGroupInContext = () => {
        if (!!templateSupportedRuntimeGroup && templateSupportedRuntimeGroup !== "Select") {
            setBuildActionContext({
                type: "SetActionTemplateSupportedRuntimeGroup",
                payload: {
                    templateId: buildActionContext.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId!,
                    newSupportedRuntimeGroup: templateSupportedRuntimeGroup
                }
            })
        }
    }

    const setNameInContext = () => {
        setBuildActionContext({
            type: "SetActionDefinitionName",
            payload: {
                newName: actionName
            }
        })
    }

    const setDescriptionInContext = () => {
        setBuildActionContext({
            type: "SetActionDefinitionDescription",
            payload: {
                newDescription: actionDescription
            }
        })
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 ,minHeight:'180px'}}>
            {/* 
            TODO: Disabling action Type. Defaulting to Profiling. Keeping commented code in case this needs to be re-enabled 
            <Box>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel>Action Type</InputLabel>
                    <Select
                        value={actionType || "Select"}
                        onChange={(event) => setActionType(event.target.value)}
                        onBlur={(event) => setActionTypeInContext()}
                        variant="outlined"
                        label="Action Type"
                        fullWidth
                    >
                        {Object.keys(ActionTypeToSupportedRuntimes).map((actionType) => {
                            return <MenuItem value={actionType}>{actionType}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Box> */}
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "space-around", py: 3 }}>
                <Box sx={{display: "flex", alignItems: "left", flexDirection: "column", gap: 4}}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "left", gap: 1}}>
                        <Box>
                            <TextField fullWidth
                                variant="outlined" 
                                label="Action Name"
                                onBlur={(event) => setNameInContext()} 
                                value={actionName} 
                                onChange={(event => setActionName(event.target.value))}
                            />
                        </Box>
                        <Box>
                            <TextField fullWidth
                                onBlur={(event) => setDescriptionInContext()}
                                variant="outlined" 
                                label="Description" 
                                value={actionDescription} 
                                onChange={(event => setActionDescription(event.target.value))}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel>Select your Scripting Language</InputLabel>
                    <Select
                        value={templateSupportedRuntimeGroup|| "Select"}
                        onChange={(event) => setTemplateSupportedRuntimeGroup(event.target.value)}
                        onBlur={(event) => setTemplateSupportedRuntimeGroupInContext()}
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
            <Box>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel>Return Type</InputLabel>
                    <Select
                        value={returnType || "Select"}
                        onChange={(event) => setReturnType(event.target.value)}
                        onBlur={(event) => setReturnTypeInContext()}
                        variant="outlined"
                        label="Return Type"
                        fullWidth
                    >
                        {/* <MenuItem value={ActionDefinitionPresentationFormat.SINGLE_VALUE}>Single Value</MenuItem>
                        <MenuItem value={ActionDefinitionPresentationFormat.TIME_SERIES}>Time Series</MenuItem>
                        <MenuItem value={ActionDefinitionPresentationFormat.FREQUENCY}>Frequency</MenuItem> */}
                        <MenuItem value={ActionDefinitionPresentationFormat.TABLE_VALUE}>Table</MenuItem>
                        {/* <MenuItem value={ActionDefinitionPresentationFormat.OBJECT}>Object</MenuItem> */}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    )
}

export default ActionSummary;
