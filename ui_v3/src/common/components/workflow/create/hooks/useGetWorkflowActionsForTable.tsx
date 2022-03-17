import { useQuery } from "react-query"
import { Fetcher } from "../../../../../generated/apis/api"
import { WorkflowStagesWithActions } from "../../../../../generated/interfaces/Interfaces"
import labels from "../../../../../labels/labels"


const useGetWorkflowActionsForTable = (tableId: string, options: {enabled: boolean, handleSuccess: (data: WorkflowStagesWithActions[]) => void }): [WorkflowStagesWithActions[] | undefined, boolean, object] => {

    const {data: workflowData, isLoading: isLoading, error: error} = useQuery([labels.entities.TableProperties, tableId], 
        () => {
            return Fetcher.fetchData('GET', '/getWorkflowForTableTags', {Id: tableId})
        },
        {
            enabled: options.enabled,
            onSuccess: (data) => {
                options.handleSuccess(data)
            }
        }
    )

    return [workflowData, isLoading, error as object]
}

export default useGetWorkflowActionsForTable
