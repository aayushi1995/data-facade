import { useMutation, UseMutationOptions, useQuery, useQueryClient } from "react-query"
import { ActionDefinition, ActionParameterDefinition, ActionTemplate, Tag } from "../../../generated/entities/Entities"
import labels from "../../../labels/labels"
import dataManagerInstance, { useRetreiveData } from './../../../data_manager/data_manager'


export type ActionDefinitionFormPayload = {
    ActionDefinition: {
        model: ActionDefinition;
        tags: Tag[];
    };
    ActionTemplatesWithParameters: {
        model: ActionTemplate;
        tags: never[];
        actionParameterDefinitions: {
            model: ActionParameterDefinition,
            tags: Tag[]
        }[];
    }[];
}

export interface UseActionDefinitionFormCreateProps {
    options: UseMutationOptions<ActionDefinitionFormPayload, unknown, unknown, unknown>
}

const useActionDefinitionFormCreate = (props: UseActionDefinitionFormCreateProps) => {
    const {options} = props
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}

    const mutation = useMutation((payload: ActionDefinitionFormPayload) => 
        fetchedDataManagerInstance.saveData(labels.entities.ActionDefinition, {
            ...payload,
            CreateActionDefinitionForm: true,
            entityProperties: {}
        }),{
            ...options
        }
    )
    return {mutation}
}

export default useActionDefinitionFormCreate;