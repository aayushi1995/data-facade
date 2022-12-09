import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, FormControlLabel, FormGroup, Switch, TextField, Typography } from "@mui/material";
import React from 'react';
import ActionDefinitionVisibility from '../../../enums/ActionDefinitionVisibility';
import { Application } from '../../../generated/entities/Entities';
import ActionHeroApplicationSelector from '../presentation/custom/ActionHeroApplicationSelector';
import ActionHeroGroupSelector from '../presentation/custom/ActionHeroGroupSelector';
import { ActionHeaderAutocompleteBox, ActionHeaderCard, ActionHeaderCardActionArea, ActionHeaderCardInputArea, ActionPublishStatusBox } from "../presentation/styled_native/ActionHeaderBox";
import { ActionHeaderActionDescriptionLabelTypography, ActionHeaderActionVisibilityTypography, ActionHeaderLanguageTypography } from '../presentation/styled_native/ActionHeaderTypography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import pythonLogo from "../../../../src/images/python.svg";
import sqlLogo from "../../../../src/images/SQL.svg"
import { BuildActionContext } from '../../../pages/build_action/context/BuildActionContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
    const buildActionContext = React.useContext(BuildActionContext)
    return (
        <ActionHeaderCard sx={{ display: "flex", flexDirection: "row" }}>
            <ActionHeaderCardInputArea sx={{ display: "flex", flexDirection: "row", height: "100%", gap: 2,px:2,py:3}}>
                <Box sx={{ display: "flex", alignItems: "center"}}>
                    <KeyboardArrowDownIcon/>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex",pt:3, height: "80%", alignItems: "center" }}>
                        <img width='30px' src={props.language=='python'?pythonLogo:sqlLogo} alt="" />
                    </Box>
                    <Box sx={{ display: "flex", height: "20%", alignItems: "center",mt:1 }}>
                        <ActionPublishStatusBox publishStatus={props?.publishStatus}/>
                    </Box>
                </Box>
                <Box sx={{ display: "flex",width:'50%', flexDirection: "column" }}>
                    <Box>
                        <TextField InputProps={{sx:{
                                                    fontSize:'1.1rem',
                                                    fontWeight:600
                                                    },
                                                    disableUnderline: true,
                                                }} variant='standard' size='small' fullWidth value={props?.actionName || ""} onChange={handleNameChange} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column"}}>
                        <Box sx={{ display: "flex", flexDirection: "row"}}>   
                            <Box>
                                <ActionHeaderActionDescriptionLabelTypography>DESCRIPTION:</ActionHeaderActionDescriptionLabelTypography>
                            </Box>
                            <TextField InputProps ={{
                                                sx: {
                                                    fontWeight: 500,
                                                    fontSize: "0.8rem",
                                                    color: "ActionDefinationHeroTextColor1.main",
                                                    borderRadius: "5px",
                                                    backgroundColor: "ActionCardBgColor.main",
                                                    px:2
                                                },
                                                disableUnderline: true,
                                            }} variant='standard' size='small' fullWidth multiline minRows={1} maxRows={3} value={props?.actionDescription || ""} onChange={handleDescriptionChange}/>
                        </Box>
                        <Box>
                            <ActionHeaderActionVisibilityTypography sx={{mt:1}}>PUBLIC</ActionHeaderActionVisibilityTypography>
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
                <Box sx={{mr:buildActionContext.testMode?0:4}}>
                    <FormGroup>
                        <FormControlLabel
                            sx={{color:'white'}}
                            control={
                                <Switch checked={props?.visibility === ActionDefinitionVisibility.ORG} onClick={toggleVisibility}/> 
                            }
                            label={<Typography sx={{fontSize:'0.7rem',alignItems:'center'}}>Make Public</Typography>} 
                            labelPlacement="bottom"
                        />
                    </FormGroup>
                    
                </Box>
                <Box sx={{display:'flex',flexDirection: buildActionContext.testMode?'column':'row',gap:1}}>
                    <Box>
                        <Button size='small' variant='outlined' sx={{gap:1,minWidth:'4vw',color:'white',borderColor:'white',borderRadius:'0px',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',mr:2}} color="info" onClick={props?.actionHandler?.onTest}><PlayArrowIcon/>Test</Button>
                    </Box>
                    <Box>
                        <Button size='small' sx={{minWidth:'4vw',color:'white',borderColor:'lime'}} color='success' variant='outlined' onClick={props?.actionHandler?.onSave}>Save</Button>
                    </Box>
                </Box>
                <Box>
                    <MoreVertIcon sx={{color:'white',transform:'scale(1.5)',ml:buildActionContext.testMode?0:10,mt:1}}/>
                </Box>
            </ActionHeaderCardActionArea>
        </ActionHeaderCard>
    )
    
}

export default ActionHeader;