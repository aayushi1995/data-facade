import { useQuery } from 'react-query';
import dataManagerInstance from '@api/dataManager';
import { Fetcher } from '../../generated/apis/api';
import { ActionDefinition } from '../../generated/entities/Entities';
import { ActionDefinitionDetail } from '../../generated/interfaces/Interfaces';
import labels from '../../utils/labels';

export interface UseFetchActionDefinitionsProps {
    filter?: ActionDefinition,
    handleSuccess?: (data: ActionDefinitionDetail[]) => void
}

const useFetchActionDefinitions = (params: UseFetchActionDefinitionsProps): [ActionDefinitionDetail[], boolean, any] => {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}

    const {data: allActionDefinitionsData, error: allActionDefinitionsError, isLoading: allActionDefinitionsIsLoading} = 
    useQuery([labels.entities.ActionDefinition, "All", params.filter || "No filter"],
        () => {
            return Fetcher.fetchData('GET', '/getActionDefinitionDetails', params.filter || {})
        }, {
            staleTime: 60*10*1000,
            onSuccess: (data) => {
                params.handleSuccess?.(data)
            }
        }
    )

    return [allActionDefinitionsData || [], allActionDefinitionsIsLoading, allActionDefinitionsError]
}

export default useFetchActionDefinitions;

export const fetchAllActions = async (params:any) => {
    await Fetcher.fetchData('GET', '/getActionDefinitionDetails', params.filter || {}).then((response) => {
        return response
    }).catch((error) => {
        console.log(error)
    })
}