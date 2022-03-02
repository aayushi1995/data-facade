import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ActionDefinition } from '../../../../../generated/entities/Entities';
import labels from '../../../../../labels/labels';
import dataManagerInstance, { useRetreiveData } from './../../../../../data_manager/data_manager'

export interface UseFetchActionDefinitionsProps {
    actionType?: string
}

const useFetchActionDefinitions = (params: UseFetchActionDefinitionsProps): [ActionDefinition[], boolean, any] => {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}

    const {data: allActionDefinitionsData, error: allActionDefinitionsError, isLoading: allActionDefinitionsIsLoading} = useQuery([labels.entities.ActionDefinition, "All"],
        () => {
            return fetchedDataManagerInstance.retreiveData!(labels.entities.ActionDefinition, {
                filter: {}
            })
        },
    )

    return [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError]
}

export default useFetchActionDefinitions;