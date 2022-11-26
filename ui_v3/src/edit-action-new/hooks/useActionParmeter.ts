/*
Business logic for ui_v3/src/edit-action-new/components/presentation/custom/ActionParameter.tsx
*/

import React from "react"
import ActionDefinitionPublishStatus from "../../enums/ActionDefinitionPublishStatus"
import { ActionParameterDefinition, Tag } from "../../generated/entities/Entities"
import { ViewActionParametersProps } from "../../pages/build_action/components/common-components/ViewActionParameters"
import { BuildActionContext, BuildActionContextState, SetBuildActionContext, SetBuildActionContextState } from "../../pages/build_action/context/BuildActionContext"
import { ActionConfigProps } from "../components/presentation/custom/ActionConfig"
import { ActionTagProps } from "../components/presentation/custom/ActionTag"

type UseActionParameterParams = {
    onParameterClick: (parameterId?: string) => void
}

function useActionParameter(params: UseActionParameterParams) {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    
    const viewActionParameterProps = getViewActionParameterProps(buildActionContext, setBuildActionContext, params?.onParameterClick)
    const actionConfigProps = getActionConfigProps(buildActionContext, setBuildActionContext)
    const actionTagProps = getActionTagProps(buildActionContext, setBuildActionContext)

    return {
        viewActionParameterProps,
        actionConfigProps,
        actionTagProps
    }
}

function getViewActionParameterProps(buildActionContext: BuildActionContextState, setBuildActionContext: SetBuildActionContextState, onParameterClick: (parameterId?: string) => void): ViewActionParametersProps {
    const activeTemplateWithParams = buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.activeTemplateId)

    const viewActionParameterProps = {
        templateLanguage: activeTemplateWithParams?.template?.Language,
        paramsWithTag: activeTemplateWithParams?.parameterWithTags,
        paramsAdditionalConfig: activeTemplateWithParams?.parameterAdditionalConfig,
        onDeleteParameters: (deletedParams: ActionParameterDefinition[]) => setBuildActionContext({
            type: "RemoveActionParameterDefinitions",
            payload: {
                actionParameterDefinitions: deletedParams
            }
        }),
        onParameterReset: () => setBuildActionContext({
            type: "ResetActionParameterDefinitionsAction",
            payload: {
                templateId: activeTemplateWithParams?.template?.Id
            }
        }),
        onParameterEdit: (newParameter: ActionParameterDefinition) => setBuildActionContext({
            type: "SetParameterDetails",
            payload: {
                newParamConfig: newParameter
            }
        }),
        onTagsChange: (parameterId?: string, newTags?: Tag[]) => {
            if(!!parameterId && !!newTags){
                setBuildActionContext({
                    type: "SetActionParameterDefintionTags",
                    payload: {
                        parameterId: parameterId!,
                        newTags
                    }
                })
            }
        },
        onParameterTypeEdit: (newParameter: ActionParameterDefinition) => setBuildActionContext({
            type: "SetParameterType",
            payload: {
                newParamConfig: newParameter
            }
        }),
        onParameterDuplicate: (parametersToDuplicate: ActionParameterDefinition[]) => setBuildActionContext({
            type: "DuplicateActionParameterDefinitions",
            payload: {
                actionParameterDefinitions: parametersToDuplicate
            }
        }),
        onCreateNewParameter: () => setBuildActionContext({
            type: "AddActionParameterDefinition",
            payload: {
                templateId: buildActionContext.activeTemplateId
            }
        }),
        onParameterClick: onParameterClick
    }

    return viewActionParameterProps;
}

function getActionConfigProps(buildActionContext: BuildActionContextState, setBuildActionContext: SetBuildActionContextState): ActionConfigProps {
    const pinned = buildActionContext?.actionDefinitionWithTags?.actionDefinition?.PinnedToDashboard
    const published =  buildActionContext?.actionDefinitionWithTags?.actionDefinition?.PublishStatus === ActionDefinitionPublishStatus.READY_TO_USE
    const actionType = buildActionContext?.actionDefinitionWithTags?.actionDefinition?.ActionType

    const onPinToggle = () => setBuildActionContext({ type: "TogglePinnedToDashboard"})
    const onPublishToggle = () => setBuildActionContext({ type: "TogglePublishStatus"})

    const activeTemplateWithParams = buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.activeTemplateId)
    const language = activeTemplateWithParams?.template?.SupportedRuntimeGroup
    const returnType = buildActionContext.actionDefinitionWithTags.actionDefinition.PresentationFormat

    const onReturnTypeChange = (newReturnType?: string) => {
        if (!!newReturnType && returnType !== "Select") {
            setBuildActionContext({
                type: "SetActionDefinitionReturnType",
                payload: {
                    newReturnType: newReturnType
                }
            })
        }
    }

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

    return {
        pinned,
        published,
        onPinToggle,
        onPublishToggle,
        language,
        actionType,
        onLanguageChange,
        returnType,
        onReturnTypeChange
    }
}

function getActionTagProps(buildActionContext: BuildActionContextState, setBuildActionContext: SetBuildActionContextState): ActionTagProps {
    return {
        selectedTags: buildActionContext.actionDefinitionWithTags.tags,
        onSelectedTagsChange: (newTags?: Tag[]) => {
            setBuildActionContext({
                type: "ReAssignActionDefinitionTag",
                payload: {
                    newTags: newTags || []
                }
            })
        }
    }
}

export default useActionParameter;