import { ActionParameterDefinition } from "@/generated/entities/Entities"
import { ActionDefinitionDetail, ActionTemplatesWithParameters } from "@/generated/interfaces/Interfaces"

const setLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, value)
}

const removeLocalStorage = (key: string) => {
    localStorage.removeItem(key)
}

const getLocalStorage = (key: string) => {
    return localStorage.getItem(key)
}


const getDefaultTemplateId: (action: ActionDefinitionDetail) => string | undefined = (action: ActionDefinitionDetail) => {
    return action.ActionDefinition?.model?.DefaultActionTemplateId
}

const getDefaultTemplateModel: (action: ActionDefinitionDetail) => ActionTemplatesWithParameters | undefined = (action: ActionDefinitionDetail) => {
    const defaultTemplateId = getDefaultTemplateId(action)
    return action.ActionTemplatesWithParameters?.find(at => at.model?.Id === defaultTemplateId)
}


const getDefaultTemplateParameters: (action: ActionDefinitionDetail) => ActionParameterDefinition[] = (action: ActionDefinitionDetail) => {
    const defaultTemplateWithParams: ActionTemplatesWithParameters | undefined = getDefaultTemplateModel(action)
    return (defaultTemplateWithParams?.actionParameterDefinitions || []).map(apd => apd.model!)
}

const safelyParseJSON = (json?: string) => {
    try {
        return JSON.parse(json || "{}")
    } catch (e) {
        return {}
    }
}

export { setLocalStorage, getLocalStorage, removeLocalStorage, getDefaultTemplateParameters, safelyParseJSON }
