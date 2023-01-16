import { useQuery, UseQueryOptions } from "react-query"
import { Fetcher } from "../../../../generated/apis/api"
import { ActionDefinition } from "../../../../generated/entities/Entities"
import { ActionDefinitionDetail } from "../../../../generated/interfaces/Interfaces"
import labels from "../../../../labels/labels"


interface UseFetchDeepDiveActionsProps {
    filter: ActionDefinition,
    options?: UseQueryOptions<unknown, unknown, ActionDefinitionDetail[], [string, string, ActionDefinition]>
}

const useFetchDeepDiveActions = (params: UseFetchDeepDiveActionsProps) => {

    return useQuery(
        [labels.entities.ActionDefinition, "DeepDive", params.filter],
        () => Fetcher.fetchData("GET", "/getDeepDiveActions", params.filter), {
            ...params.options
        }
    )

}

export default useFetchDeepDiveActions