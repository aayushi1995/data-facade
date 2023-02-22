import dataManager from "@/api/dataManager";
import { ActionExecution } from "@/generated/entities/Entities";
import { useQuery, UseQueryOptions } from "react-query";

export interface QueryResult extends Omit<ActionExecution, "Output"> {
    Output: Object
}

export interface UseActionExecutionParsedOutputParams {
    actionExecutionFilter?: ActionExecution,
    queryOptions?: UseQueryOptions<ActionExecution, unknown, QueryResult, [string, undefined|string]>
}

export const getActionExecutionParsedOutput= (actionExecutionFilter: ActionExecution) => {
    const response = dataManager.getInstance.retreiveData(
        "ActionExecution",
        {
            filter: {Id: actionExecutionFilter.Id},
            "getExecutionParsedOutput": true
        }
    ).then((response: any) => {
        const actionExecution = response[0]
        if(actionExecution?.Status === 'Failed') {
            return actionExecution
        }
        const actionExecutionOutput = JSON.parse(actionExecution.Output)
        actionExecution.Output = actionExecutionOutput
        return actionExecution
    })
    return response
}

export const useActionExecutionParsedOutput = (params: UseActionExecutionParsedOutputParams) => {
    const {actionExecutionFilter, queryOptions} = params
    const fetchActionExeuctionParsedOutputQuery = useQuery(["ActionExecutionParsedOutputNew", actionExecutionFilter?.Id], (context) => getActionExecutionParsedOutput({Id: context.queryKey[1]}), {
        ...queryOptions
    })
    return fetchActionExeuctionParsedOutputQuery
}