import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import TemplateSupportedRuntimeGroup from "../../../enums/TemplateSupportedRuntimeGroup";
import { Application } from "../../../generated/entities/Entities";
import ActionHeroApplicationSelector from "../presentation/custom/ActionHeroApplicationSelector";
import ActionHeroGroupSelector from "../presentation/custom/ActionHeroGroupSelector";
import { ActionHeaderAutocompleteBox } from "../presentation/styled_native/ActionHeaderBox";
import TemplateSelector from "../presentation/TemplateSelector";
import CodeIcon from '@mui/icons-material/Code';
import TemplateLanguage from "../../../enums/TemplateLanguage";
import labels from "../../../labels/labels";
import { CodeIconBox } from "../presentation/styled_native/ActionAddCodeIconBox";
import AddActionContext from "../../../pages/upload_table/components/AddActionContext";
import React from "react";
import dataManager from "../../../data_manager/data_manager";
import { useMutation } from "react-query";
import LoadingIndicator from "../../../common/components/LoadingIndicator";

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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, px: 5 }}>
            {promptSQLMutation.isLoading ?
                <Dialog open={promptSQLMutation.isLoading}>
                    <Box sx={{ p: 3 }}>
                        <LoadingIndicator />
                        <Typography sx={{ fontSize: '0.9rem', color: '#383d59', textAlign: 'center' }}>Please wait while we generate the initial boilerplate code for you based on the description. </Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: '#40424a', textAlign: 'center' }}>It can take few minutes</Typography>
                    </Box>
                </Dialog>
                : <></>}
                <Dialog open={generatedCodeDialogState.open}>
                    <Box>
                        {generatedCodeDialogState.text}
                    </Box>
                </Dialog>

            <Box sx={{ display: "flex", flexDirection: "row", borderBottom: '1px solid #dbd7d7' }}>
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1, width: '50%' }}>
                    <Box sx={{ width: '100%' }}>
                        <TextField InputProps={{
                            sx: {
                                fontWeight: 500,
                                fontSize: "2rem",
                                color: "ActionDefinationHeroTextColor1.main",
                                borderRadius: "5px",
                                width: '50vw'
                            },
                            disableUnderline: !name ? false : true,
                            error: !name
                        }} variant='standard'
                            placeholder="Add Action Name"
                            value={name} onChange={(event) => onNameChange?.(event.target.value)} error={name === undefined ? true : false} />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <TextField InputProps={{
                            sx: {
                                fontWeight: 500,
                                fontSize: "1rem",
                                color: "ActionDefinationHeroTextColor1.main",
                                borderRadius: "5px",
                                width: '50vw'
                            },
                            disableUnderline: true,
                        }} variant='standard'
                            placeholder="Add Action Description"
                            value={description || ActionMaker} onChange={(event) => onDescriptionChange?.(event.target.value)} multiline />
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 3, width: '50%', justifyContent: 'flex-end' }}>
                    <ActionHeaderAutocompleteBox>
                        <ActionHeroApplicationSelector selectedApplicationId={applicationId} onSelectedApplicationChange={(application?: Application) => onApplicationChange?.(application?.Id)} />
                    </ActionHeaderAutocompleteBox>
                    <ActionHeaderAutocompleteBox>
                        <ActionHeroGroupSelector selectedGroup={group} onSelectedGroupChange={onGroupChange} />
                    </ActionHeaderAutocompleteBox>
                </Box>
            </Box>
            <Box sx={{ justifyContent: 'center', width: '100%', textAlign: 'center' }}>
                <CodeIconBox>
                    <CodeIcon />
                </CodeIconBox>
                <Box>
                    <Typography sx={{ fontWeight: 300, color: '#585959' }}>
                        {labels.AddActionPage.addActionMsg1}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
                        {labels.AddActionPage.addActionMsg2}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, justifyContent: "center", width: "100%" }}>
                {templateTypes.map(t =>
                    <TemplateSelector {...t} />
                )}
            </Box>
        </Box>
    )
}

export default CreateNewAction;