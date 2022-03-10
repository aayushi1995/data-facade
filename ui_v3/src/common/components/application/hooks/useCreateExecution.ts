import { useMutation, UseMutationOptions, useQuery } from "react-query"
import dataManagerInstance from "../../../../data_manager/data_manager"
import { Fetcher } from "../../../../generated/apis/api"
import { ActionExecution, Application } from "../../../../generated/entities/Entities"
import { ActionInstanceCardViewResponse } from "../../../../generated/interfaces/Interfaces"
import labels from "../../../../labels/labels"

export interface useCreateExecutionParams {
    mutationOptions: UseMutationOptions<ActionExecution[], unknown, useCreateExecutionVariables, unknown>
}

export interface useCreateExecutionVariables {
    actionInstanceId: string
}

export const useCreateExecution = (params: useCreateExecutionParams) => {
    const { mutationOptions } = params
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {executeInstance: Function}

    const mutation = useMutation((variables: useCreateExecutionVariables) => fetchedDataManagerInstance.executeInstance(
        labels.entities.ActionInstance,
        {
            filter: {
                Id: variables.actionInstanceId
            }
        }
    ), {
        ...mutationOptions
    })

    return mutation
}