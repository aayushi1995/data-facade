import { Box, TextField, Typography } from "@mui/material";
import TemplateSupportedRuntimeGroup from "../../../enums/TemplateSupportedRuntimeGroup";
import { Application } from "../../../generated/entities/Entities";
import ActionHeroApplicationSelector from "../presentation/custom/ActionHeroApplicationSelector";
import ActionHeroGroupSelector from "../presentation/custom/ActionHeroGroupSelector";
import { ActionHeaderAutocompleteBox } from "../presentation/styled_native/ActionHeaderBox";
import TemplateSelector from "../presentation/TemplateSelector";
import CodeIcon from '@mui/icons-material/Code';

export type CreateNewActionProps = {
    name?: string,
    description?: string,
    applicationId?: string,
    group?: string,
    onChangeHandlers: {
        onNameChange?: (newName?: string) => void,
        onDescriptionChange?: (newDescription?: string) => void,
        onApplicationChange: (newApplicationId?: string) => void,
        onGroupChange: (newGroup?: string) => void,
        onLanguageChange: (newSupportedRuntimeGroup?: string) => void
    },
    actionHandlers: {
        onSaveAction: () => void
    }
}

function CreateNewAction(props: CreateNewActionProps) {
    const { name, description, applicationId, group, onChangeHandlers, actionHandlers } = props
    const { onNameChange, onDescriptionChange, onApplicationChange, onGroupChange, onLanguageChange } = onChangeHandlers
    const { onSaveAction } = actionHandlers

    const templateTypes = [
        {
            name: "SQL",
            description: "Query your data connections or dataframes.",
            onClick: () => {
                onLanguageChange(TemplateSupportedRuntimeGroup.COMMON)
                onSaveAction()
            }
        },
        {
            name: "Python",
            description: "Transform your data using python.",
            onClick: () => {
                onLanguageChange(TemplateSupportedRuntimeGroup.PYTHON)
                onSaveAction()
            }
        }
    ]
    
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1,px:5}}>
            <Box sx={{ display: "flex", flexDirection: "row" ,borderBottom:'1px solid #dbd7d7'}}>
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1,width:'50%'}}>
                    <Box>
                        <TextField InputProps ={{
                                                sx: {
                                                    fontWeight: 500,
                                                    fontSize: "2rem",
                                                    color: "ActionDefinationHeroTextColor1.main",
                                                    borderRadius: "5px",
                                                },
                                                disableUnderline: true,
                                            }} variant='standard' 
                                            placeholder="Add Action Name"
                            value={name} onChange={(event) => onNameChange?.(event.target.value) }/>
                    </Box>
                    <Box>
                        <TextField InputProps ={{
                                                sx: {
                                                    fontWeight: 500,
                                                    fontSize: "1rem",
                                                    color: "ActionDefinationHeroTextColor1.main",
                                                    borderRadius: "5px",
                                                },
                                                disableUnderline: true,
                                            }} variant='standard' 
                                            placeholder="Add Action Description" 
                                            value={description} onChange={(event) => onDescriptionChange?.(event.target.value) }/>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 3,width:'50%',justifyContent:'flex-end'}}>
                    <ActionHeaderAutocompleteBox>
                        <ActionHeroApplicationSelector selectedApplicationId={applicationId} onSelectedApplicationChange={(application?: Application) => onApplicationChange?.(application?.Id)}/>
                    </ActionHeaderAutocompleteBox>
                    <ActionHeaderAutocompleteBox>
                        <ActionHeroGroupSelector selectedGroup={group} onSelectedGroupChange={onGroupChange}/>
                    </ActionHeaderAutocompleteBox>
                </Box>
            </Box>
            <Box sx={{justifyContent:'center',width:'100%',textAlign:'center',py:5}}>
                <Box sx={{border:'1px solid black',borderRadius:'50%',width:'30px',height:'30px',margin:'auto'}}>
                    <CodeIcon/>
                </Box>
                <Box>
                    <Typography sx={{fontWeight:300,color:'#585959'}}>
                        Add your action here
                    </Typography>
                    <Typography sx={{fontWeight:600,fontSize:'1.2rem'}}>
                        Flow gives you flexibility of the notebook format but the power of DF Platform
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, justifyContent: "center", width: "100%"}}>
                {templateTypes.map(t => 
                    <TemplateSelector {...t}/>    
                )}
            </Box>
        </Box>
    )
}

export default CreateNewAction;