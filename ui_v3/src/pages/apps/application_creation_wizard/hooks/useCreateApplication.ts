import { useMutation, UseMutationOptions, useQueryClient } from "react-query";
import { Fetcher } from "../../../../generated/apis/api";
import { Application, Tag } from "../../../../generated/entities/Entities";


export interface CreateApplicationMutationVariable {
    application: Application,
    tags: Tag[]
}

export interface UseCreateApplicationParams {
    mutationOptions: UseMutationOptions<Application[], unknown, CreateApplicationMutationVariable, unknown>
}


const useCreateApplication = (params: UseCreateApplicationParams) => {
    const { mutationOptions } = params
    const queryClient = useQueryClient()
    const createApplicationMutation = useMutation((variable: CreateApplicationMutationVariable) => Fetcher.fetchData("POST", "/createApplication", {
        tags: variable.tags,
        model: variable.application
    })
    ,{
        ...mutationOptions,
        onSuccess: (data, variable, context) => {
            queryClient.invalidateQueries(["Applications", "All"])
            mutationOptions?.onSuccess?.(data, variable, context)
        }
    })

    return createApplicationMutation;
}

export default useCreateApplication;