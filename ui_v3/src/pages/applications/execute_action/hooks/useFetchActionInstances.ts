import { useQuery, UseQueryOptions } from "react-query"
import dataManager from "../../../../data_manager/data_manager"
import { ActionInstance } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"


interface UseGetFetchActionInstances {
    filter: ActionInstance,
    queryParams: UseQueryOptions<unknown, unknown, ActionInstance[], [string, ActionInstance]>
}

const useFetchActionInstancesForFilter = (params: UseGetFetchActionInstances) => {

    const fetchedDataManager = dataManager.getInstance as {retreiveData: Function}

    return useQuery([labels.entities.ActionInstance, params.filter], 
        () => fetchedDataManager.retreiveData(labels.entities.ActionInstance, {
            filter: params.filter
        }),{
            ...params.queryParams
        }     
    )
}

export default useFetchActionInstancesForFilter