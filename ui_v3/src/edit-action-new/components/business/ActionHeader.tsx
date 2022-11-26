import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import React from 'react';
import ActionDefinitionVisibility from '../../../enums/ActionDefinitionVisibility';
import { Application } from '../../../generated/entities/Entities';
import ActionHeroApplicationSelector from '../presentation/custom/ActionHeroApplicationSelector';
import ActionHeroGroupSelector from '../presentation/custom/ActionHeroGroupSelector';
import { ActionHeaderAutocompleteBox, ActionHeaderCard, ActionHeaderCardActionArea, ActionHeaderCardInputArea, ActionPublishStatusBox } from "../presentation/styled_native/ActionHeaderBox";
import { ActionHeaderActionDescriptionLabelTypography, ActionHeaderActionVisibilityTypography, ActionHeaderLanguageTypography } from '../presentation/styled_native/ActionHeaderTypography';


export type ActionHeaderProps = {
    actionName?: string,
    actionDescription?: string,
    group?: string,
    applicationId?: string,
    publishStatus?: string,
    language?: string,
    visibility?: string,
    onChangeHandlers?: {
        onNameChange?: (newName?: string) => void,
        onDescriptionChange?: (newDescription?: string) => void,
        onGroupChange?: (newGroupName?: string) => void,
        onApplicationChange?: (newApplicationId?: string) => void,
        onVisibilityToggle?: () => void
    },
    actionHandler?: {
        onTest: () => void,
        onSave: () => void
    }
}


function ActionHeader(props: ActionHeaderProps) {
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props?.onChangeHandlers?.onNameChange?.(event.target.value)
    }
    
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props?.onChangeHandlers?.onDescriptionChange?.(event.target.value)
    }

    const handleApplicationChange = (newApplication?: Application) => {
        props?.onChangeHandlers?.onApplicationChange?.(newApplication?.Id)
    }

    const handleGroupChange = (newGroup?: string) => {
        props?.onChangeHandlers?.onGroupChange?.(newGroup)
    }

    const toggleVisibility = () => props?.onChangeHandlers?.onVisibilityToggle?.()

    return (
        <ActionHeaderCard sx={{ display: "flex", flexDirection: "row" }}>
            <ActionHeaderCardInputArea sx={{ display: "flex", flexDirection: "row", height: "100%", gap: 2}}>
                <Box sx={{ display: "flex", alignItems: "center"}}>
                    <KeyboardArrowDownIcon/>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", height: "70%", alignItems: "center" }}>
                            <ActionHeaderLanguageTypography>SQL</ActionHeaderLanguageTypography>
                    </Box>
                    <Box sx={{ display: "flex", height: "30%", alignItems: "center" }}>
                        <ActionPublishStatusBox publishStatus={props?.publishStatus}/>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <Box>
                        <TextField fullWidth value={props?.actionName || ""} onChange={handleNameChange} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box>
                                <ActionHeaderActionDescriptionLabelTypography>DESCRIPTION:</ActionHeaderActionDescriptionLabelTypography>
                            </Box>
                            <Box>
                                <ActionHeaderActionVisibilityTypography>PUBLIC</ActionHeaderActionVisibilityTypography>
                            </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>   
                            <TextField fullWidth multiline minRows={1} maxRows={3} value={props?.actionDescription || ""} onChange={handleDescriptionChange}/>
                        </Box>
                    </Box>
                </Box>  
                <ActionHeaderAutocompleteBox>
                    <ActionHeroApplicationSelector selectedApplicationId={props?.applicationId} onSelectedApplicationChange={handleApplicationChange}/>
                </ActionHeaderAutocompleteBox>
                <ActionHeaderAutocompleteBox>
                    <ActionHeroGroupSelector selectedGroup={props?.group} onSelectedGroupChange={handleGroupChange}/>
                </ActionHeaderAutocompleteBox>
            </ActionHeaderCardInputArea>
            <ActionHeaderCardActionArea sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch checked={props?.visibility === ActionDefinitionVisibility.ORG} onClick={toggleVisibility}/> 
                            }
                            label="Make Public" 
                            labelPlacement="bottom"
                        />
                    </FormGroup>
                    
                </Box>
                <Box>
                    <Button onClick={props?.actionHandler?.onTest}>Test</Button>
                </Box>
                <Box>
                    <Button onClick={props?.actionHandler?.onSave}>Save</Button>
                </Box>
            </ActionHeaderCardActionArea>
        </ActionHeaderCard>
    )
    
}

export default ActionHeader;