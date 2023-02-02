import { useMutation } from "react-query"
import dataManager from "../../../../../data_manager/data_manager"
import { ActionParameterInstance } from "../../../../../generated/entities/Entities"
import labels from "../../../../../labels/labels"


export const useReRunWorkflowAction = (props: {mutationName: string}) => {

    const fetchedDataManager = dataManager.getInstance as {retreiveData: Function}

    return useMutation(
        props.mutationName,
        (options: {workflowExecutionId: string, reRunActionindex: number, globalParameterInstance: ActionParameterInstance[]}) => 
            fetchedDataManager.retreiveData(labels.entities.ActionExecution, {
                filter: {
                    Id: options.workflowExecutionId
                },
                withPartialWorkflowExecutionTrigger: true,
                indexToStart: options.reRunActionindex,
                withNewGlobalParameters: options.globalParameterInstance
        }),
    )
}


export default useReRunWorkflowAction

