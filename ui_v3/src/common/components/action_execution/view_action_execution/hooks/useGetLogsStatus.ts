import { useQuery, UseQueryOptions } from "react-query";
import { Fetcher } from "../../../../../generated/apis/api";
import { ActionExecution } from "../../../../../generated/entities/Entities";
import { ExecutionLogsStatus } from "../../../../../generated/interfaces/Interfaces";
import labels from "../../../../../labels/labels";


const useGetLogStatus = (props: {filter: ActionExecution, options?: UseQueryOptions<unknown, unknown, ExecutionLogsStatus[], [string, ActionExecution, string]>}) => {

    const query = useQuery([labels.entities.ActionExecution, props.filter, "LogStatus"], 
        () => Fetcher.fetchData("GET", "/checkIfExecutionLogsPresent", props.filter),
        {
            ...props.options
        }
    )

    return query
}

export default useGetLogStatus