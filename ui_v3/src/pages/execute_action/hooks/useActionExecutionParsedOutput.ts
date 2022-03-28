import { useQuery, UseQueryOptions } from "react-query";
import { getActionExecutionParsedOutput, getActionExecutionParsedOutputNew } from "../../../data_manager/entity_data_handlers/action_execution_data";
import { ActionExecution } from "../../../generated/entities/Entities";

export interface QueryResult extends Omit<ActionExecution, "Output"> {
    Output: Object
}

export interface UseActionExecutionParsedOutputParams {
    actionExecutionFilter?: ActionExecution,
    queryOptions?: UseQueryOptions<ActionExecution, unknown, QueryResult, [string, undefined|string]>
}


const useActionExecutionParsedOutput = (params: UseActionExecutionParsedOutputParams) => {
    const {actionExecutionFilter, queryOptions} = params
    const fetchActionExeuctionParsedOutputQuery = useQuery(["ActionExecutionParsedOutput", actionExecutionFilter?.Id], (context) => getActionExecutionParsedOutput({Id: context.queryKey[1]}), {
        ...queryOptions
    })
    return fetchActionExeuctionParsedOutputQuery
}

export const useActionExecutionParsedOutputNew = (params: UseActionExecutionParsedOutputParams) => {
    const {actionExecutionFilter, queryOptions} = params
    const fetchActionExeuctionParsedOutputQuery = useQuery(["ActionExecutionParsedOutputNew", actionExecutionFilter?.Id], (context) => getActionExecutionParsedOutputNew({Id: context.queryKey[1]}), {
        ...queryOptions
    })
    return fetchActionExeuctionParsedOutputQuery
}


export default useActionExecutionParsedOutput;