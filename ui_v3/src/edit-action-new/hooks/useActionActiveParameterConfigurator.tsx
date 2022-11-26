/*
Business logic for ui_v3/src/edit-action-new/components/business/ActionActiveParameterConfigurator.tsx
*/

import React from "react";
import useFetchVirtualTags from "../../common/components/tag-handler/hooks/useFetchVirtualTags";
import { getAttributesFromInputType } from "../../custom_enums/ActionParameterDefinitionInputMap";
import { ActionParameterDefinition, Tag } from "../../generated/entities/Entities";
import { BuildActionContext, SetBuildActionContext } from "../../pages/build_action/context/BuildActionContext";

export type ActionActiveParameterConfiguratorParams = {
    
}

function useActionActiveParameterConfigurator(params: ActionActiveParameterConfiguratorParams) {

    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const activeTemplateWithParams = buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.activeTemplateId)
    const templateLanguage = activeTemplateWithParams?.template?.Language
    const activeParameterWithTags = activeTemplateWithParams?.parameterWithTags?.find(apwt => apwt?.parameter?.Id === activeTemplateWithParams?.activeParameterId)

    const allParamDefs = activeTemplateWithParams?.parameterWithTags?.map(paramWithTag => paramWithTag?.parameter)

    const activeParamDef = activeParameterWithTags?.parameter
    const activeParameterId = activeParamDef?.Id
    const activeParamAdditionalConfig =  activeTemplateWithParams?.parameterAdditionalConfig?.find(paramAdditionalConfig => paramAdditionalConfig?.parameterDefinitionId===activeParameterId)

    
    const handleParameterChange = (newParameterDefinition?: ActionParameterDefinition) => {
        setBuildActionContext({
            type: "SetParameterDetails",
            payload: {
                newParamConfig: {
                    ...activeParamDef,
                    ...newParameterDefinition
                }
            }
        })
    }

    const handleParameterInputTypeChange = (newInputType?: string) => {
        const parameterDefinition = activeParameterWithTags?.parameter

        setBuildActionContext({
            type: "SetParameterType",
            payload: {
                newParamConfig: {
                    ...parameterDefinition,
                    ...getAttributesFromInputType(newInputType, templateLanguage)
                }
            }
        })
    }

    const handleParameterNameChange = (newParameterName?: string) => handleParameterChange({ ParameterName: newParameterName })
    const handleParameterDisplayNameChange = (newParameterDisplayName?: string) => handleParameterChange({ DisplayName: newParameterDisplayName })
    const handleParameterDescriptionChange = (newParameterDescription?: string) => handleParameterChange({ Description: newParameterDescription })
    const handleDefaultValueChange = (newDefaultValue?: string) => handleParameterChange({ DefaultParameterValue: newDefaultValue })
    const handleParameterTagsChange = (newTags?: Tag[]) => {
        console.log(newTags, activeParameterId)
        if(!!activeParameterId && !!newTags){
            setBuildActionContext({
                type: "SetActionParameterDefintionTags",
                payload: { parameterId: activeParameterId, newTags }
            })
        }
    }

    const [activeParamTags, availableTagsForActiveParam, isActiveParamTagsLoading, isActiveParamTagsMutating, activeParamTagsError, deleteActiveParamTag, addActiveParamTag, createAndAddActiveParamTag] = useFetchVirtualTags({ selectedTags: (activeParameterWithTags?.tags || []), onSelectedTagsChange: handleParameterTagsChange, tagFilter: {}})

    const activeParamTagNames = activeParamTags?.map(tag => tag?.Name)
    const availableActiveParamTagNames = availableTagsForActiveParam?.map(tag => tag?.Name)

    return {
        templateLanguage,
        activeParamDef,
        allParamDefs,
        activeParamAdditionalConfig,
        activeParamTagNames,
        availableActiveParamTagNames,
        deleteActiveParamTag,
        addActiveParamTag,
        createAndAddActiveParamTag,
        handleParameterNameChange,
        handleParameterDisplayNameChange,
        handleParameterDescriptionChange,
        handleParameterInputTypeChange,
        handleParameterTagsChange,
        handleParameterChange,
        handleDefaultValueChange
    }
}

export default useActionActiveParameterConfigurator;