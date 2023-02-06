
import { useQuery, useQueryClient } from 'react-query';
import dataManagerInstance from '../../../../../../data_manager/data_manager';
import { ActionDefinition, ActionParameterDefinition, ActionTemplate, Tag } from '../../../../../../generated/entities/Entities';
import labels from '../../../../../../labels/labels';

export interface UseViewActionParams{
    actionDefinitionId: string,
    expectUniqueResult: boolean,
    handleSuccess?: (data: ActionDetail | ActionDetail[]) => void
}

export interface TemplateWithParams {
    model: ActionTemplate,
    tags: Tag[],
    actionParameterDefinitions: {
        model: ActionParameterDefinition,
        tags: Tag[]
    }[]
}

export interface ActionDefinitionWithTags {
    model: ActionDefinition,
    tags: Tag[]
}

export interface ActionDetail {
    ActionDefinition: ActionDefinitionWithTags,
    ActionTemplatesWithParameters: TemplateWithParams[]
}

type ActionDetailWithDefaultTemplate = ActionDetail & {DefaultActionTemplateWithParameters: TemplateWithParams}

export interface ViewActionResult {
    isLoading: boolean,
    error: object,
    data: ActionDetail | ActionDetail[] | undefined,
}

function useViewAction(params: UseViewActionParams): ViewActionResult {
    const { actionDefinitionId, expectUniqueResult } = params
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}
    const queryClient = useQueryClient()

    const validateDataAndSelectUnique = (data: ActionDetail[]) => !!data ? (expectUniqueResult ? data[0] : data) : undefined
    const {data, error, isLoading} = useQuery([labels.entities.ActionDefinition, params.actionDefinitionId],
        () => {
            return fetchedDataManagerInstance.retreiveData(labels.entities.ActionDefinition, {
                filter: {
                    Id: params.actionDefinitionId
                },
                ActionDefinitionDetailGet: true
            })
        },
        {
            onSuccess: (data) => params.handleSuccess?.(validateDataAndSelectUnique(data) || [])
        })
    
    return {
        isLoading: isLoading, 
        error: error as object, 
        data: validateDataAndSelectUnique(data)
    }
}

export default useViewAction;






