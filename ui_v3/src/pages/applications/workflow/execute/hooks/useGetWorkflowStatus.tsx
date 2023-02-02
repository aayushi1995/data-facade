import { useQuery } from "react-query"
import { Fetcher } from "../../../../../generated/apis/api"
import { WorkflowActionExecutions } from "../../../../../generated/interfaces/Interfaces"
import labels from "../../../../../labels/labels"


const useGetWorkflowStatus = (workflowExecutionId: string, options: {enabled: boolean, handleSuccess: (data?: WorkflowActionExecutions[]) => void}): [WorkflowActionExecutions[] | undefined, any, boolean]=> {
    const {data: workflowExecutionData, error: workflowExecutionError, isLoading: workflowExecutionLoading} = useQuery([labels.entities.ActionExecution, workflowExecutionId], 
            () => {
                return Fetcher.fetchData('GET', '/workflowActionExecutionsStatus', {Id: workflowExecutionId})
            }, 
            {
                refetchInterval: 500,
                enabled: options.enabled,
                onSuccess: (data: WorkflowActionExecutions[]) => {
                    options.handleSuccess(data)
                }
            }
            
        )
    return [workflowExecutionData, workflowExecutionError, workflowExecutionLoading]

}

export default useGetWorkflowStatus