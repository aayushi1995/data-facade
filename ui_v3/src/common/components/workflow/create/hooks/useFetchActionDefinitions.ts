import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Fetcher } from '../../../../../generated/apis/api';
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
            return Fetcher.fetchData('GET', '/getFilteredActionDefinitions', {})
        }, {
            staleTime: 60*1000
        }
    )

    return [allActionDefinitionsData || [], allActionDefinitionsIsLoading, allActionDefinitionsError]
}

export default useFetchActionDefinitions;