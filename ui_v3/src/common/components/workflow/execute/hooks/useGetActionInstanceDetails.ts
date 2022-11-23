import { useQuery, UseQueryOptions } from "react-query"
import { Fetcher } from "../../../../../generated/apis/api"
import { ActionInstance } from "../../../../../generated/entities/Entities"
import { ActionInstanceDetails } from "../../../../../generated/interfaces/Interfaces"
import labels from "../../../../../labels/labels"


interface UseGetActionInstanceDetailsParams {
    filter: ActionInstance,
    options: UseQueryOptions<unknown, unknown, ActionInstanceDetails[], [string, ActionInstance]>
}

const useGetActionInstanceDetails = (params: UseGetActionInstanceDetailsParams) => {

    return useQuery(
        [labels.entities.ActionInstance, params.filter],
        () => Fetcher.fetchData("GET", "/getActionInstancesDetail", params.filter),
        {
            ...params.options
        }
    )
}

export default useGetActionInstanceDetails