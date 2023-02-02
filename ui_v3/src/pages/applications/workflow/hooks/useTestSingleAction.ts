import { useMutation } from "react-query"
import dataManager from "../../../../data_manager/data_manager"
import labels from "../../../../labels/labels"


const useTestSingleActionInFlow = () => {

    const fetchedDataManagerInstance = dataManager.getInstance as {retreiveData: Function}

    return useMutation(
        (options: {workflowId: string, testActionReferenceId: string, globalParametersChanged: string[]}) => {

            return fetchedDataManagerInstance.retreiveData(labels.entities.ActionDefinition, {
                filter: {
                    Id: options.workflowId
                },
                withTestActionReferenceId: options.testActionReferenceId,
                withGlobalParameterChanged: options.globalParametersChanged,
                TestSingleActionFlow: true
            })
        }
    )
}

export default useTestSingleActionInFlow
