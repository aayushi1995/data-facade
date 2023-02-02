import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import React from "react";
import { BuildActionContext, SetBuildActionContext } from "../../../../build_action_old/context/BuildActionContext";
import ActionHeroGroupSelector from "./ActionHeroGroupSelector";

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
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const { pinned, published, onPinToggle, onPublishToggle, language, onLanguageChange, actionType } = props
    const group = buildActionContext?.actionDefinitionWithTags?.actionDefinition?.ActionGroup
    const handleGroupChange =  (newGroupName?: string) => setBuildActionContext({ type: "SetActionGroup", payload: { newGroup: newGroupName } })
    return (
        <Box sx={{py:1}}>
            <Box sx={{py:1,borderBottom:'3px solid #e3e3e3',px:3}}>
                <Typography sx={{fontSize:'1.2rem',fontWeight:600}}>
                    Action config
                </Typography>
            </Box>
            <Box sx={{px:3,borderBottom:'3px solid #e3e3e3',py:2}}>
                <Box sx={{mt:2}}>
                    <ActionHeroGroupSelector selectedGroup={group} onSelectedGroupChange={handleGroupChange}/>
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