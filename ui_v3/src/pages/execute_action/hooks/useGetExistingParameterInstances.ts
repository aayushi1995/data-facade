import { useQuery, UseQueryOptions } from "react-query"
import dataManager from "../../../data_manager/data_manager"
import { ActionParameterInstance } from "../../../generated/entities/Entities"
import labels from "../../../labels/labels"


interface UseGetExistingParameterInstancesProps {
    filter: ActionParameterInstance,
    queryOptions: UseQueryOptions<unknown, unknown, ActionParameterInstance[], [string, ActionParameterInstance]>
}

const useGetExistingParameterInstances = (params: UseGetExistingParameterInstancesProps) => {
    const fetchedDataManagerInstance = dataManager.getInstance as {retreiveData: Function}

    return useQuery(["ActionParametereInstance", params.filter], 
        () => fetchedDataManagerInstance.retreiveData("ActionParameterInstance", {
            filter: params.filter,
        }), {
            ...params.queryOptions
        }
    )
}

export default useGetExistingParameterInstances