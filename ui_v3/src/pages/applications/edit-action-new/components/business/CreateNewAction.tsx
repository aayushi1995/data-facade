import CodeIcon from '@mui/icons-material/Code';
import { Box, Dialog, TextField, Typography } from "@mui/material";
import React from "react";
import { useMutation } from "react-query";
import LoadingIndicator from "../../../../../common/components/LoadingIndicator";
import dataManager from "../../../../../data_manager/data_manager";
import TemplateLanguage from "../../../../../enums/TemplateLanguage";
import TemplateSupportedRuntimeGroup from "../../../../../enums/TemplateSupportedRuntimeGroup";
import labels from "../../../../../labels/labels";
import AddActionContext from "../../../../data/upload_table/components/AddActionContext";
import { ActionTypeTamplateContainer, columnFlexBox, CreateActionDialogTypo1, CreateActionDialogTypo2, CreateActionMainContainer, CreateActionMSG1Typo, CreateActionMSG2Typo, DescriptionTextField, MainContainerBox, NameTextField } from "../../style/CreateActionStyle";
import { CodeIconBox } from "../presentation/styled_native/ActionAddCodeIconBox";
import { ActionHeaderCard, ActionHeaderCardInputArea } from "../presentation/styled_native/ActionHeaderBox";
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
        onSaveAction: (templateSupportedRuntimeGroup: string, language: string, genCode?: string) => void
    }
}

function CreateNewAction(props: CreateNewActionProps) {
    const { name, description, applicationId, group, onChangeHandlers, actionHandlers } = props
    const { onNameChange, onDescriptionChange, onApplicationChange, onGroupChange, onLanguageChange } = onChangeHandlers
    const { onSaveAction } = actionHandlers
    const [generatedCodeDialogState, setGeneratedCodeDialogState] = React.useState({ open: false, text: "", loading: false })
    const fetchedDataManagerInstance = dataManager.getInstance as { getGeneratedActionTemplate: Function }
    const promptSQLMutation = useMutation<any, unknown, { prompt: string, prompt_type: string }, unknown>("PromptSQL", ({ prompt, prompt_type }) =>
        fetchedDataManagerInstance.getGeneratedActionTemplate({ input: prompt, input_type: prompt_type }), {
        onMutate: () => setGeneratedCodeDialogState(oldState => ({ ...oldState, text: "", loading: true, open: true }))
    })

    const onGenerateCode = (description: string, lang: string) => {
        let actionDescription = description || "Generate a SQL"
        let action_language = lang || "sql"
        promptSQLMutation.mutate({ prompt: actionDescription, prompt_type: action_language }, {
            onSuccess: (data, variables, context) => onSaveAction(lang == 'sql' ? TemplateSupportedRuntimeGroup.COMMON : TemplateSupportedRuntimeGroup.PYTHON, lang == 'sql' ? TemplateLanguage.SQL : TemplateLanguage.PYTHON, data?.["template"] || ""),
            onError: (error) => onSaveAction(lang == 'sql' ? TemplateSupportedRuntimeGroup.COMMON : TemplateSupportedRuntimeGroup.PYTHON, lang == 'sql' ? TemplateLanguage.SQL : TemplateLanguage.PYTHON)
        })
    }
    const templateTypes = [
        {
            name: "SQL",
            description: "Query your data connections or dataframes.",
            onClick: () => {
                if (!name) {
                    return;
                }
                onGenerateCode(description || "make a dummy action", "sql")
            }
        },
        {
            name: "Python",
            description: "Transform your data using python.",
            onClick: () => {
                if (!name) {
                    return;
                }

                onGenerateCode(description || "make a dummy action", "python")
            }
        }
    ]

    const { ActionMaker, setActionMaker } = React.useContext(AddActionContext);
    if (ActionMaker) {
        onNameChange?.(ActionMaker)
        onDescriptionChange?.(ActionMaker)
    }
    setActionMaker("")
    return (
        <Box sx={{...MainContainerBox}}>
            {promptSQLMutation.isLoading ?
                <Dialog open={promptSQLMutation.isLoading}>
                    <Box sx={{ p: 3 }}>
                        <LoadingIndicator />
                        <Typography sx={{...CreateActionDialogTypo1}}>Please wait while we generate the initial boilerplate code for you based on the description. </Typography>
                        <Typography sx={{...CreateActionDialogTypo2}}>It can take few minutes</Typography>
                    </Box>
                </Dialog>
                : <></>}
            <Dialog open={generatedCodeDialogState.open}>
                <Box>
                    {generatedCodeDialogState.text}
                </Box>
            </Dialog>
            <Box sx={{...CreateActionMainContainer}}>
                <CodeIconBox>
                    <CodeIcon />
                </CodeIconBox>
                <Box>
                    <Typography sx={{...CreateActionMSG1Typo}}>
                        {labels.AddActionPage.addActionMsg1}
                    </Typography>
                    <Typography sx={{...CreateActionMSG2Typo}}>
                        {labels.AddActionPage.addActionMsg2}
                    </Typography>
                </Box>
            </Box>
            <ActionHeaderCard >
                <ActionHeaderCardInputArea sx={{ p:2}}>
                    <Box sx={{... columnFlexBox}}>
                        <Box>
                            <TextField InputProps={{
                                sx: {...NameTextField},
                                disableUnderline: !name?false:true,
                                error: !name
                            }} variant='standard'
                                placeholder="Add Action Name *"
                                value={name} onChange={(event) => onNameChange?.(event.target.value)} error={name === undefined ? true : false} />
                        </Box>
                        <Box>
                            <TextField InputProps={{
                                sx: {...DescriptionTextField},
                                disableUnderline: true,
                            }} variant='standard'
                                placeholder="Add Action Description"
                                value={description || ActionMaker} onChange={(event) => onDescriptionChange?.(event.target.value)} multiline />
                        </Box>
                    </Box>
                    
                </ActionHeaderCardInputArea>
                {/* <Box sx={{...SelectorsContainer}}>
                    <ActionHeaderAutocompleteBox>
                        <ActionHeroApplicationSelector selectedApplicationId={applicationId} onSelectedApplicationChange={(application?: Application) => onApplicationChange?.(application?.Id)} />
                    </ActionHeaderAutocompleteBox>
                    <ActionHeaderAutocompleteBox>
                        <ActionHeroGroupSelector selectedGroup={group} onSelectedGroupChange={onGroupChange} />
                    </ActionHeaderAutocompleteBox>
                </Box> */}
                <Box sx={{...ActionTypeTamplateContainer}}>
                        {templateTypes.map(t =>
                            <TemplateSelector {...t} />
                        )}
                    </Box>
            </ActionHeaderCard>
        </Box>



    )
}

export default CreateNewAction;