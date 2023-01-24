/*
Business logic for ui_v3/src/edit-action-new/EditActionForm.tsx
*/

import React from "react"
import { useMutation } from "react-query"
import { generatePath, useHistory } from "react-router"
import { APPLICATION_EDIT_ACTION_ROUTE_ROUTE } from "../../common/components/header/data/ApplicationRoutesConfig"
import { BuildActionContext, SetBuildActionContext, UseActionHooks } from "../../pages/build_action/context/BuildActionContext"
import { ActionHeaderProps } from "../components/business/ActionHeader"
import dataManager from '../../data_manager/data_manager'
import { CollectionsOutlined } from "@mui/icons-material"

type UseEditActionFormParams = {

}

function useEditActionForm(params?: UseEditActionFormParams) {
    const actionHeaderProps = getActionHeaderProps()

    return [actionHeaderProps]
}

function getActionHeaderProps(): ActionHeaderProps {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const useActionHooks = React.useContext(UseActionHooks)
    const [generatedCodeDialogState, setGeneratedCodeDialogState] = React.useState({ open: false, text: "", loading: false})
    const history = useHistory()
    const fetchedDataManagerInstance = dataManager.getInstance as {getGeneratedActionTemplate: Function}
    const promptSQLMutation = useMutation<any, unknown, {prompt: string, prompt_type: string}, unknown>("PromptSQL", ({prompt, prompt_type}) => 
        fetchedDataManagerInstance.getGeneratedActionTemplate({input: prompt, input_type: prompt_type}), {
        onMutate: () => setGeneratedCodeDialogState(oldState => ({ ...oldState, text: "", loading: true, open: true}))
    })

    const onTest = () => {
        setBuildActionContext({
            type: 'SetTestMode',
            payload: false
        })
        useActionHooks.useActionDefinitionFormSave?.mutate(buildActionContext, {
            onSuccess: () => {
                setBuildActionContext({
                    type: 'SetTestMode',
                    payload: true
                })
            }
        })
    }

    const onDuplicate = () => {
        useActionHooks.duplicateActionMutation?.mutate({actionDefinitionId: buildActionContext.actionDefinitionWithTags.actionDefinition.Id!}, {
            onSuccess: (data) => {
                history.push(generatePath(APPLICATION_EDIT_ACTION_ROUTE_ROUTE, {ActionDefinitionId: data?.[0]?.Id}))
            }
        })
    }

    const onSave = () => {
        useActionHooks.useActionDefinitionFormSave?.mutate(buildActionContext)
    }

    const onGenerateCode = () => {
        let actionDescription = buildActionContext.actionDefinitionWithTags.actionDefinition.Description || "Generate a SQL"
        // TODO (Cleanup Code Duplicate): This is duplicated in useActionDefinitionFormSave.ts
        const activeTemplate = (buildActionContext?.actionTemplateWithParams || []).find(at => at.template.Id===buildActionContext.activeTemplateId)?.template
        let action_language = activeTemplate?.Language || "sql"
        promptSQLMutation.mutate({prompt: actionDescription, prompt_type: action_language}, {
            onSuccess: (data, variables, context) => setGeneratedCodeDialogState(oldState => ({ 
                ...oldState,
                open: true, 
                text: data?.["template"] || "", 
                loading: false
            })),
            onError: (error) => setGeneratedCodeDialogState(oldState => ({ 
                ...oldState, 
                open: true, 
                text: "Error fetching generated code", 
                loading: false
            }))
        })        
    }

    const closeGeneratedDialog = () => setGeneratedCodeDialogState((oldState) => ({
        ...oldState,
        open: false
    }))

    const appendGeneratedCode = () => {
        setBuildActionContext({
            type: 'AddGenerateCode',
            payload: {
                generatedCode: generatedCodeDialogState.text
            }
        })

        closeGeneratedDialog()
    }

    const actionHeaderProps: ActionHeaderProps = {
        actionName: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.DisplayName,
        actionDescription: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.Description,
        group: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.ActionGroup,
        applicationId: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.ApplicationId,
        publishStatus: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.PublishStatus,
        language: buildActionContext?.actionTemplateWithParams?.[0]?.template?.Language,
        visibility: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.Visibility,
        generatedCodeDialogState: generatedCodeDialogState,
        onChangeHandlers: {
            onNameChange: (newName?: string) => setBuildActionContext({ type: "SetActionDefinitionName", payload: { newName: newName } }),
            onDescriptionChange: (newDescription?: string) => setBuildActionContext({ type: "SetActionDefinitionDescription", payload: { newDescription: newDescription } }),
            onGroupChange: (newGroupName?: string) => setBuildActionContext({ type: "SetActionGroup", payload: { newGroup: newGroupName } }),
            onApplicationChange: (newApplicationId?: string) => setBuildActionContext({ type: "SetApplicationId", payload: { newApplicationId: newApplicationId } }),
            onVisibilityToggle: () => setBuildActionContext({ type: "ToggleVisibility"})
        },
        actionHandler: {
            onTest: onTest,
            onSave: () => {
                const actionId = buildActionContext?.actionDefinitionWithTags?.actionDefinition?.Id
                const actionName = buildActionContext?.actionDefinitionWithTags?.actionDefinition?.DisplayName
                history.push(`/application/edit-action/${actionId}?name=${actionName}`)
                onSave()
            },
            onDuplicate: onDuplicate,
            onRun: () => {
                useActionHooks.useActionDefinitionFormSave?.mutate(buildActionContext, {
                    onSuccess: () => {
                        const actionId = buildActionContext?.actionDefinitionWithTags?.actionDefinition?.Id
                        const actionName = buildActionContext?.actionDefinitionWithTags?.actionDefinition?.DisplayName
                        if(!!actionId) {
                            history.push(`/application/execute-action/${actionId}?name=${actionName}`)
                        }
                    }
                })
                
            },
            onGenerateCode: onGenerateCode,
            onCloseGeneratedCodeDialog: closeGeneratedDialog,
            onAppendGeneratedCode: appendGeneratedCode
        }
    }

    return actionHeaderProps
}

export default useEditActionForm;
