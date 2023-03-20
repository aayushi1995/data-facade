import { Fetcher } from "@/generated/apis/api"
import { ActionExecutionIncludeDefinitionInstanceDetailsResponse } from "@/generated/interfaces/Interfaces"
import { useQuery, UseQueryOptions } from "react-query"

export interface FetchActionExecutionDetailsParams {
    actionExecutionId?: string,
    refetch?: boolean
    queryOptions: UseQueryOptions<ActionExecutionIncludeDefinitionInstanceDetailsResponse[], unknown, ActionExecutionIncludeDefinitionInstanceDetailsResponse[], (string|undefined)[]>
}


const FetchActionExecutionDetails = (params: FetchActionExecutionDetailsParams) => {
    const { actionExecutionId, queryOptions } = params

    const query = useQuery(["ActionExecutionDetail", actionExecutionId], () => Fetcher.fetchData("GET", "/actionExecutionDetail", {Id: actionExecutionId}, actionExecutionId), 
    {
        ...queryOptions,
        enabled: (!!params.actionExecutionId) && queryOptions.enabled,
        refetchInterval: params.refetch === false ? undefined : 1000
    })

    return { 
        ...query, 
        data: query?.data?.[0] 
    }
}

export default FetchActionExecutionDetails