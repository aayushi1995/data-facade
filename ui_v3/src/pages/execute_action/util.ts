import { ActionParameterDefinition } from "../../generated/entities/Entities"
import { ActionDefinitionDetail, ActionTemplatesWithParameters } from "../../generated/interfaces/Interfaces"

export const getDefaultTemplateId: (action: ActionDefinitionDetail) => string|undefined = (action: ActionDefinitionDetail) => {
    return action.ActionDefinition?.model?.DefaultActionTemplateId
}

export const getDefaultTemplateModel: (action: ActionDefinitionDetail) => ActionTemplatesWithParameters|undefined = (action: ActionDefinitionDetail) => {
    const defaultTemplateId = getDefaultTemplateId(action)
    return action.ActionTemplatesWithParameters?.find(at => at.model?.Id === defaultTemplateId)
}

export const getDefaultTemplateParameters: (action: ActionDefinitionDetail) => ActionParameterDefinition[] = (action: ActionDefinitionDetail) => {
    const defaultTemplateWithParams: ActionTemplatesWithParameters|undefined = getDefaultTemplateModel(action)
    return (defaultTemplateWithParams?.actionParameterDefinitions||[]).map(apd => apd.model!)
}

export const safelyParseJSON = (json?: string) => {
    try {
        return JSON.parse(json || "{}")
    } catch (e) {
        return {}
    }   
}