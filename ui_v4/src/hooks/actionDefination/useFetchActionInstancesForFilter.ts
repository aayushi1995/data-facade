import { useQuery, UseQueryOptions } from "react-query"
import dataManager from "@api/dataManager"
import { ActionInstance } from "@/generated/entities/Entities"
import labels from "@helpers/labels"


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