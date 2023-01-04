import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Dialog, FormControl, IconButton, InputLabel, Menu, MenuItem, Select, TextField} from "@mui/material";
import React from 'react';
import ActionDefinitionVisibility from '../../../enums/ActionDefinitionVisibility';
import CodeIcon from '@mui/icons-material/Code';
import { Application } from '../../../generated/entities/Entities';
import ActionHeroApplicationSelector from '../presentation/custom/ActionHeroApplicationSelector';
import ActionHeroGroupSelector from '../presentation/custom/ActionHeroGroupSelector';
import { ActionHeaderAutocompleteBox, ActionHeaderCard, ActionHeaderCardActionArea, ActionHeaderCardInputArea, ActionPublishStatusBox } from "../presentation/styled_native/ActionHeaderBox";
import { ActionHeaderActionDescriptionLabelTypography, ActionHeaderActionVisibilityTypography } from '../presentation/styled_native/ActionHeaderTypography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import pythonLogo from "../../../../src/images/python.svg";
import sqlLogo from "../../../../src/images/SQL.svg"
import { BuildActionContext, SetBuildActionContext } from '../../../pages/build_action/context/BuildActionContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { RunButton, SaveButton, TestButton } from '../presentation/styled_native/ActionHeaderButton';
import ActionTypeToSupportedRuntimes from '../../../custom_enums/ActionTypeToSupportedRuntimes';
import ConfirmationDialog from '../../../common/components/ConfirmationDialog';
import { triggerAsyncId } from 'async_hooks';
export type ActionHeaderProps = {
    actionName?: string,
    actionDescription?: string,
    group?: string,
    applicationId?: string,
    publishStatus?: string,
    language?: string,
    visibility?: string,
    generatedCodeDialogState: {open: boolean, text: string, loading: boolean},
    onChangeHandlers?: {
        onNameChange?: (newName?: string) => void,
        onDescriptionChange?: (newDescription?: string) => void,
        onGroupChange?: (newGroupName?: string) => void,
        onApplicationChange?: (newApplicationId?: string) => void,
        onVisibilityToggle?: () => void
    },
    actionHandler?: {
        onTest: () => void,
        onSave: () => void,
        onDuplicate: () => void,
        onRun: () => void,
        onGenerateCode: () => void,
        onAppendGeneratedCode: () => void,
        onCloseGeneratedCodeDialog: () => void
    }
}


function ActionHeader(props: ActionHeaderProps) {
    const { generatedCodeDialogState } = props
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props?.onChangeHandlers?.onNameChange?.(event.target.value)
    }
    
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props?.onChangeHandlers?.onDescriptionChange?.(event.target.value)
    }

    const handleApplicationChange = (newApplication?: Application) => {
        props?.onChangeHandlers?.onApplicationChange?.(newApplication?.Id)
    }
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
    const open = Boolean(menuAnchor)
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        setMenuAnchor(event.currentTarget)
        
    }
    
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const onLanguageChange = (newLanguage?: string) => {
        if (!!newLanguage && newLanguage !== "Select") {
            setBuildActionContext({
                type: "SetActionTemplateSupportedRuntimeGroup",
                payload: {
                    templateId: buildActionContext.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId!,
                    newSupportedRuntimeGroup: newLanguage
                }
            })
        }
    }

    const activeTemplateWithParams = buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.activeTemplateId)
    const language = activeTemplateWithParams?.template?.SupportedRuntimeGroup
    const actionType = buildActionContext.actionDefinitionWithTags.actionDefinition.ActionType || "Check"

    return (
        <ActionHeaderCard sx={{ display: "flex", flexDirection: "row" }}>
            <ConfirmationDialog
                dialogOpen={generatedCodeDialogState.open}
                messageHeader="Generated Code"
                messageToDisplay={generatedCodeDialogState.loading ? "Loading..." : generatedCodeDialogState.text}
                acceptString="Append to Code"
                declineString="Close"
                onAccept={props?.actionHandler?.onAppendGeneratedCode}
                onDecline={props?.actionHandler?.onCloseGeneratedCodeDialog}
                onDialogClose={props?.actionHandler?.onCloseGeneratedCodeDialog}
                
            />
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
                        <TextField required placeholder='Add action name here' InputProps={{sx:{
                                                    fontSize:'1.1rem',
                                                    fontWeight:600
                                                    },
                                                    disableUnderline: true,
                                                }} variant='standard' size='small' fullWidth value={props?.actionName || ""} onChange={handleNameChange} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column"}}>
                        <Box sx={{ display: "flex", flexDirection: "row"}}>   
                            <TextField placeholder='Add action description here' InputProps ={{
                                                sx: {
                                                    fontWeight: 500,
                                                    fontSize: "0.8rem",
                                                    color: "ActionDefinationHeroTextColor1.main",
                                                    backgroundColor: "ActionCardBgColor.main",
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
                </ActionHeaderAutocompleteBox>
                <ActionHeaderAutocompleteBox>
                    <ActionHeroApplicationSelector selectedApplicationId={props?.applicationId} onSelectedApplicationChange={handleApplicationChange}/>
                </ActionHeaderAutocompleteBox>
            </ActionHeaderCardInputArea>
            <ActionHeaderCardActionArea sx={{ display: "flex", alignItems: "center",justifyContent:'center' }}>
                {/* <Box sx={{mr:buildActionContext.testMode?0:4}}>
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
                    
                </Box> */}

                <Box sx={{display:'flex',flexDirection: buildActionContext.testMode?'column':'row', gap:buildActionContext.testMode?1:3}}>
                    <TestButton size='small' variant='outlined' color="info" onClick={props?.actionHandler?.onTest}><PlayArrowIcon/>Test</TestButton>
                    <Box sx={{display:'flex',flexDirection:'row',gap:buildActionContext.testMode?1:3}}>
                        <SaveButton size='small' color='success' variant='outlined' onClick={props?.actionHandler?.onSave}> {
                            (buildActionContext.savingAction||buildActionContext.loadingActionForEdit) ? 
                                <InfoIcon sx={{ transform: "scale(0.7)"}}/> 
                                :
                                <CheckCircleIcon sx={{ transform: "scale(0.7)"}}/> }
                                    Save
                        </SaveButton>
                        <RunButton size="small" color='primary' variant='contained' onClick={props?.actionHandler?.onRun}> <PlayCircleOutlineIcon sx={{ transform: "scale(0.8)"}}/>Run</RunButton>
                    </Box>
                </Box>
                <Box sx={{mr:1}}>
                <IconButton onClick={handleMenuOpen}>
                    <MoreVertIcon sx={{color:'white'}}/>
                </IconButton>
                        <Menu
                            anchorEl={menuAnchor} 
                            open={open} 
                            onClose={() => {setMenuAnchor(null)}}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                                }}
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                        }}>
                            <MenuItem sx={{gap:2}} onClick={props?.actionHandler?.onGenerateCode}><CodeIcon/>Generate Code</MenuItem>
                            <MenuItem sx={{gap:2}} onClick={props?.actionHandler?.onTest}><PlayArrowIcon/>Test</MenuItem>
                            <MenuItem sx={{gap:2}} onClick={props?.actionHandler?.onSave}> {(buildActionContext.savingAction||buildActionContext.loadingActionForEdit) ? <InfoIcon sx={{ transform: "scale(0.7)"}}/> : <CheckCircleIcon sx={{ transform: "scale(0.7)"}}/> }Save</MenuItem>
                            <MenuItem sx={{gap:2}}  onClick={props?.actionHandler?.onRun}> <PlayCircleOutlineIcon sx={{ transform: "scale(0.8)"}}/> Run </MenuItem>
                            {buildActionContext.testMode ? (
                                <></>
                            ) : (
                                <MenuItem sx={{gap:2}}  onClick={props.actionHandler?.onDuplicate}><ContentCopyIcon/>Duplicate</MenuItem>
                            )}
                        </Menu>
                </Box>        
            </ActionHeaderCardActionArea>
        </ActionHeaderCard>
    )
    
}

export default ActionHeader;