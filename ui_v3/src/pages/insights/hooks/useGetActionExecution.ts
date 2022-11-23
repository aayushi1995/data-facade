import { useQuery } from "react-query";
import dataManager from "../../../data_manager/data_manager";
import { ActionExecution } from "../../../generated/entities/Entities";
import labels from "../../../labels/labels";


interface UseGetActionExecutionProps {
    filter: ActionExecution
}

const useGetActionExecution = (props: UseGetActionExecutionProps): [ActionExecution[], boolean, object] => {
    const fetchedDataManager = dataManager.getInstance as {retreiveData: Function}

    const {data, isLoading, error} = useQuery([labels.entities.ActionExecution, props.filter], 
        () => fetchedDataManager.retreiveData(
            labels.entities.ActionExecution,
            {
                filter: props.filter
            }
        )
    )

    return [data || [], isLoading, error as object]
}

export default useGetActionExecution