import { useQuery, UseQueryOptions } from "react-query"
import { Fetcher } from "../../generated/apis/api"
import { ActionDefinition } from "../../generated/entities/Entities"
import { WebAppDetails } from "../../generated/interfaces/Interfaces"
import labels from "../../labels/labels"

export interface UseGetWebAppDetailsParams {
    filter: ActionDefinition,
    options: UseQueryOptions<unknown, unknown, WebAppDetails[], [string, string, ActionDefinition]>
}

const useGetWebAppDetails = (params: UseGetWebAppDetailsParams) => {

    return useQuery([labels.entities.ActionDefinition, "WebApp", params.filter],
        () => Fetcher.fetchData("GET", "/getWebAppDetails", params.filter),
        {
            ...params.options
        }
    )

}

export default useGetWebAppDetails