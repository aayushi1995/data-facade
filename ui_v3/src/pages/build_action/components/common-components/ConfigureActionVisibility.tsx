import { Box, FormControlLabel, FormGroup, Switch } from "@mui/material";
import { useContext } from "react";
import ActionDefinitionPublishStatus from "../../../../enums/ActionDefinitionPublishStatus";
import ActionDefinitionVisibility from "../../../../enums/ActionDefinitionVisibility";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";

const ConfigureActionVisibility = () => {
    const buildActionContext = useContext(BuildActionContext)
    const setBuildActionContext = useContext(SetBuildActionContext)

    const getActionDefinitionPinnedToDashboard = () => buildActionContext?.actionDefinitionWithTags?.actionDefinition?.PinnedToDashboard
    const getActionDefinitionVisibility = () => buildActionContext?.actionDefinitionWithTags?.actionDefinition?.Visibility
    const getActionDefinitionPublishStatus = () => buildActionContext?.actionDefinitionWithTags?.actionDefinition?.PublishStatus


    const toggleActionDefinitionPinnedToDashboard = () => setBuildActionContext({ type: "TogglePinnedToDashboard"})
    const toggleActionDefinitionVisibility = () => setBuildActionContext({ type: "ToggleVisibility"})
    const toggleActionDefinitionPublishStatus = () => setBuildActionContext({ type: "TogglePublishStatus"})
    
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
            <Box>
                <FormGroup>
                    <FormControlLabel control={
                        <Switch 
                            checked={getActionDefinitionPinnedToDashboard()}
                            onClick={toggleActionDefinitionPinnedToDashboard}
                        />} 
                        label="Pin to App Home Page" />
                </FormGroup>
            </Box>
            <Box>
                <FormGroup>
                    <FormControlLabel control={
                        <Switch 
                            checked={getActionDefinitionVisibility()===ActionDefinitionVisibility.ORG}
                            onClick={toggleActionDefinitionVisibility}
                        />} 
                        label="Make Public" />
                </FormGroup>
            </Box>
            <Box>
                <FormGroup>
                    <FormControlLabel control={
                        <Switch 
                            checked={getActionDefinitionPublishStatus()===ActionDefinitionPublishStatus.READY_TO_USE}
                            onClick={toggleActionDefinitionPublishStatus}
                        />} 
                        label="Publish" />
                </FormGroup>
            </Box>
        </Box>
    )
}

export default ConfigureActionVisibility;