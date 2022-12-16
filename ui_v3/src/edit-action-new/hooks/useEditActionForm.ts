/*
Business logic for ui_v3/src/edit-action-new/EditActionForm.tsx
*/

import React from "react"
import { generatePath, useHistory } from "react-router"
import { APPLICATION_EDIT_ACTION_ROUTE_ROUTE } from "../../common/components/header/data/ApplicationRoutesConfig"
import { BuildActionContext, SetBuildActionContext, UseActionHooks } from "../../pages/build_action/context/BuildActionContext"
import { ActionHeaderProps } from "../components/business/ActionHeader"

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
    const history = useHistory()

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

    const actionHeaderProps: ActionHeaderProps = {
        actionName: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.DisplayName,
        actionDescription: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.Description,
        group: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.ActionGroup,
        applicationId: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.ApplicationId,
        publishStatus: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.PublishStatus,
        language: buildActionContext?.actionTemplateWithParams?.[0]?.template?.Language,
        visibility: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.Visibility,
        onChangeHandlers: {
            onNameChange: (newName?: string) => setBuildActionContext({ type: "SetActionDefinitionName", payload: { newName: newName } }),
            onDescriptionChange: (newDescription?: string) => setBuildActionContext({ type: "SetActionDefinitionDescription", payload: { newDescription: newDescription } }),
            onGroupChange: (newGroupName?: string) => setBuildActionContext({ type: "SetActionGroup", payload: { newGroup: newGroupName } }),
            onApplicationChange: (newApplicationId?: string) => setBuildActionContext({ type: "SetApplicationId", payload: { newApplicationId: newApplicationId } }),
            onVisibilityToggle: () => setBuildActionContext({ type: "ToggleVisibility"})
        },
        actionHandler: {
            onTest: onTest,
            onSave: onSave,
            onDuplicate: onDuplicate,
            onRun: () => {
                onSave()
                const actionId = buildActionContext?.actionDefinitionWithTags?.actionDefinition?.Id
                if(!!actionId) {
                    history.push(`/application/execute-action/${actionId}`)
                }
                
            }
        }
    }

    return actionHeaderProps
}

export default useEditActionForm;