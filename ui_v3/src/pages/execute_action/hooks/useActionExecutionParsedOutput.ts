import { useQuery, UseQueryOptions } from "react-query";
import { getActionExecutionParsedOutput } from "../../../data_manager/entity_data_handlers/action_execution_data";
import { ActionExecution } from "../../../generated/entities/Entities";

export interface QueryResult extends Omit<ActionExecution, "Output"> {
    Output: Object
}

export interface UseActionExecutionParsedOutputParams {
    actionExecutionFilter?: ActionExecution,
    queryOptions?: UseQueryOptions<ActionExecution, unknown, QueryResult>
}


const useActionExecutionParsedOutput = (params: UseActionExecutionParsedOutputParams) => {
    const {actionExecutionFilter, queryOptions} = params
    const fetchActionExeuctionParsedOutputQuery = useQuery(["ActionExecutionParsedOutput", actionExecutionFilter?.Id], (context) => getActionExecutionParsedOutput({Id: context.queryKey[1]}), {
        ...queryOptions
    })
    return fetchActionExeuctionParsedOutputQuery
}

export default useActionExecutionParsedOutput;