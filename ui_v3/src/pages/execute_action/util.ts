import ActionParameterDefinitionTag from "../../enums/ActionParameterDefinitionTag"
import {v4 as uuidv4} from 'uuid'
import { ActionInstance, ActionParameterDefinition, ActionParameterInstance } from "../../generated/entities/Entities"
import { ActionDefinitionDetail, ActionParameterDefinitionWithTags, ActionTemplatesWithParameters } from "../../generated/interfaces/Interfaces"
import { MutationContext } from "./hooks/useCreateActionInstance"

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