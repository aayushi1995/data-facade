/*
Business logic for ui_v3/src/edit-action-new/components/business/ActionCodeParameter.tsx
*/

import React from "react";
import ActionDefinitionQueryLanguage from "../../enums/ActionDefinitionQueryLanguage";
import { BuildActionContext, BuildActionContextState, SetBuildActionContext, SetBuildActionContextState } from "../../pages/build_action/context/BuildActionContext";
import { ActionParameterConfigurationStepperProps } from "../components/business/ActionParameterConfigurationStepper";
import { ActionParameterOperationsTopProps } from "../components/business/ActionParameterOperationsTop";
import { ActionParameterOperationsBottomProps } from "../components/business/ActionParamterOperationsBottom";
import { ActionCodeProps } from "../components/presentation/custom/ActionCode";
import { ActionParameterProps } from "../components/presentation/custom/ActionParameter";

type UseActionCodeParameterParams = {
    initialActiveTab: string
}

function useActionCodeParameter(props: UseActionCodeParameterParams) {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const [activeTab, setActiveTab] = React.useState(props.initialActiveTab)
    
    const activeTemplateWithParams = buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.activeTemplateId)
    const activeParameterId = activeTemplateWithParams?.activeParameterId
    const clearActiveParameterId = () => setBuildActionContext({ type: "SetActiveParameterId", payload: { newActiveParameterId: undefined }})

    const actionCodeProps = getActionCodeProps(buildActionContext, setBuildActionContext) 
    const actionParameterProps = getActionParameterProps( setBuildActionContext )
    const actionParameterConfigurationStepperProps = getActionParameterConfigurationStepperProps(buildActionContext)
    const actionParameterOperationsBottomProps = getActionParameterOperationsBottomProps(buildActionContext, setBuildActionContext)
    const actionParameterOperationsTopProps = getActionParameterOperationsTopProps(buildActionContext, setBuildActionContext)

    return {activeTab, setActiveTab, actionCodeProps, actionParameterProps, actionParameterConfigurationStepperProps, actionParameterOperationsBottomProps, actionParameterOperationsTopProps, activeParameterId, clearActiveParameterId}
}

function getActionCodeProps(buildActionContext: BuildActionContextState, setBuildActionContext: SetBuildActionContextState): ActionCodeProps {

    
    const activeTemplateWithParams = buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.activeTemplateId)

    const actionCodeProps = {
        readOnly: false,
        code: activeTemplateWithParams?.template?.Text || "",
        onCodeChange: (newCode: string) => setBuildActionContext({
            type: "SetActionTemplateText",
            payload: {
                newText: newCode
            }
        }),
        language: activeTemplateWithParams?.template?.Language || ActionDefinitionQueryLanguage.SQL,
        hidden: !activeTemplateWithParams
    }
    return actionCodeProps;
}

function getActionParameterProps(setBuildActionContext: SetBuildActionContextState): ActionParameterProps {
    // TODO: filter row click calls then change here
    const setActiveParameterId = (parameterId?: string) => setBuildActionContext({ type: "SetActiveParameterId", payload: { newActiveParameterId: undefined }})

    return {
        onParameterClick: (parameterId?: string) => setActiveParameterId(parameterId)   
    }
}

function getActionParameterConfigurationStepperProps(buildActionContext: BuildActionContextState): ActionParameterConfigurationStepperProps {
    const activeTemplateWithParams = buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.activeTemplateId)

    return {
        parameterNames: activeTemplateWithParams?.parameterWithTags?.map(paramWithTag => paramWithTag?.parameter?.ParameterName),
        parameterIds: activeTemplateWithParams?.parameterWithTags?.map(paramWithTag => paramWithTag?.parameter?.Id),    
    }
}

function getAddParamFunction(buildActionContext: BuildActionContextState, setBuildActionContext: SetBuildActionContextState) {
    const addParam = () => setBuildActionContext({
        type: "AddActionParameterDefinition",
        payload: {
            templateId: buildActionContext.activeTemplateId
        }
    })

    return addParam;
}

function getActionParameterOperationsBottomProps(buildActionContext: BuildActionContextState, setBuildActionContext: SetBuildActionContextState): ActionParameterOperationsBottomProps {
    const addParam = () => getAddParamFunction(buildActionContext, setBuildActionContext)

    return {
        addParam
    }
}

function getActionParameterOperationsTopProps(buildActionContext: BuildActionContextState, setBuildActionContext: SetBuildActionContextState): ActionParameterOperationsTopProps {
    const addParam = () => getAddParamFunction(buildActionContext, setBuildActionContext)

    return {
        addParam
    }
}



export default useActionCodeParameter;