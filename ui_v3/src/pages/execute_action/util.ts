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

export const getDefaultTemplateParameters: (action: ActionDefinitionDetail) => ActionParameterDefinitionWithTags[]|undefined = (action: ActionDefinitionDetail) => {
    const defaultTemplateWithParams: ActionTemplatesWithParameters|undefined = getDefaultTemplateModel(action)
    return defaultTemplateWithParams?.actionParameterDefinitions
}

export const getParameters: (action: ActionDefinitionDetail) => ActionParameterDefinition[]|undefined = (action: ActionDefinitionDetail) => {
    const parameters = getDefaultTemplateParameters(action)
    return parameters?.map(apd => apd.model!)
}

export const constructCreateActionInstanceRequest = (action: ActionDefinitionDetail, actionParameterInstances: ActionParameterInstance[]) => {
    const tableParameterId: string|undefined = getDefaultTemplateParameters(action)?.find(apd => apd.model?.Tag===ActionParameterDefinitionTag.TABLE_NAME)?.model?.Id
    const providerInstanceId: string|undefined = actionParameterInstances.find(api => api.ActionParameterDefinitionId===tableParameterId)?.ProviderInstanceId
    

    const actionInstance: ActionInstance = {
        Id: uuidv4(),
        Name: "Test",
        DisplayName: "Test",
        DefinitionId: action.ActionDefinition?.model?.Id,
        TemplateId: action.ActionDefinition?.model?.DefaultActionTemplateId,
        ProviderInstanceId: providerInstanceId,
        ActionType: action.ActionDefinition?.model?.ActionType
    }

    const apis = actionParameterInstances.map(api => ({
        ...api,
        Id: uuidv4(), 
        ActionInstanceId: actionInstance.Id
    }))

    const request: MutationContext = {
        actionInstance: actionInstance,
        actionParameterInstances: apis
    }

    return request;
}