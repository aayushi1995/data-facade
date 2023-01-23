import { useQuery, UseQueryOptions } from "react-query"
import { Fetcher } from "../../generated/apis/api"
import { ActionDefinition } from "../../generated/entities/Entities"
import { ActionDependency } from "../../generated/interfaces/Interfaces"
import labels from "../../labels/labels"


interface UseFetchActionDependenciesProps {
    filter: ActionDefinition,
    queryParams?: UseQueryOptions<unknown, unknown, ActionDependency[], [string, string, ActionDefinition]>
}

const useFetchActionDependencies = (params: UseFetchActionDependenciesProps) => {

    return useQuery([labels.entities.ActionDefinition, "Dependecies", params.filter], 
        () => Fetcher.fetchData("GET", "/getActionDependencies", params.filter), {
            ...params.queryParams
        }
    )

}

export default useFetchActionDependencies