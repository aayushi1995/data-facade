import { useQuery, UseQueryOptions } from "react-query"
import dataManager from "@api/dataManager"
import { ActionParameterInstance } from "@/generated/entities/Entities"


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