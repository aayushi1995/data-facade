import { useMutation, UseMutationOptions } from "react-query"
import dataManagerInstance from "../../../../data_manager/data_manager"
import { ActionExecution } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"

export interface useCreateExecutionParams {
    mutationOptions: UseMutationOptions<ActionExecution[], unknown, useCreateExecutionVariables, unknown>
}

export interface useCreateExecutionVariables {
    actionInstanceId: string,
    options?: object
}

export const useCreateExecution = (params: useCreateExecutionParams) => {
    const { mutationOptions } = params
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {executeInstance: Function}

    const mutation = useMutation((variables: useCreateExecutionVariables) => fetchedDataManagerInstance.executeInstance(
        labels.entities.ActionInstance,
        {
            ...variables.options,
            filter: {
                Id: variables.actionInstanceId
            }
        }
    ), {
        ...mutationOptions
    })

    return mutation
}