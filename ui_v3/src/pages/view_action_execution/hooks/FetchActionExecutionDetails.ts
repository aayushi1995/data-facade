import { useQuery, UseQueryOptions } from "react-query"
import { Fetcher } from "../../../generated/apis/api"
import { ActionExecutionIncludeDefinitionInstanceDetailsResponse } from "../../../generated/interfaces/Interfaces"

export interface FetchActionExecutionDetailsParams {
    actionExecutionId?: string,
    queryOptions: UseQueryOptions<ActionExecutionIncludeDefinitionInstanceDetailsResponse[], unknown, ActionExecutionIncludeDefinitionInstanceDetailsResponse[], (string|undefined)[]>
}


const FetchActionExecutionDetails = (params: FetchActionExecutionDetailsParams) => {
    const { actionExecutionId, queryOptions } = params

    const query = useQuery(["ActionExecutionDetail", actionExecutionId], () => Fetcher.fetchData("GET", "/actionExecutionDetail", {Id: actionExecutionId}), 
    {
        ...queryOptions,
        enabled: (!!params.actionExecutionId) && queryOptions.enabled,
        refetchInterval: 1000
    })

    return { 
        ...query, 
        data: query?.data?.[0] 
    }
}

export default FetchActionExecutionDetails