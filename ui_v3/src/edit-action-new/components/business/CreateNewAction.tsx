import { Box, TextField } from "@mui/material";
import TemplateSupportedRuntimeGroup from "../../../enums/TemplateSupportedRuntimeGroup";
import { Application } from "../../../generated/entities/Entities";
import ActionHeroApplicationSelector from "../presentation/custom/ActionHeroApplicationSelector";
import ActionHeroGroupSelector from "../presentation/custom/ActionHeroGroupSelector";
import { ActionHeaderAutocompleteBox } from "../presentation/styled_native/ActionHeaderBox";
import TemplateSelector from "../presentation/TemplateSelector";

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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1}}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1, gap: 1}}>
                    <Box>
                        <TextField value={name} onChange={(event) => onNameChange?.(event.target.value) }/>
                    </Box>
                    <Box>
                        <TextField value={description} onChange={(event) => onDescriptionChange?.(event.target.value) }/>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 3}}>
                    <ActionHeaderAutocompleteBox>
                        <ActionHeroApplicationSelector selectedApplicationId={applicationId} onSelectedApplicationChange={(application?: Application) => onApplicationChange?.(application?.Id)}/>
                    </ActionHeaderAutocompleteBox>
                    <ActionHeaderAutocompleteBox>
                        <ActionHeroGroupSelector selectedGroup={group} onSelectedGroupChange={onGroupChange}/>
                    </ActionHeaderAutocompleteBox>
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