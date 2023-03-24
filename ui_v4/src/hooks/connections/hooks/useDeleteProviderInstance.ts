

import dataManager from "@/api/dataManager"
import { ProviderInstance } from "@/generated/entities/Entities"
import { labels } from "@/helpers/constant"
import { useMutation, UseMutationOptions } from "react-query"



interface DeleteActionInstanceConfig {
    filter?: ProviderInstance
    soft?: boolean,
    hard?: boolean
}
interface DeleteActionInstanceMutationProps {
    mutationOptions?: UseMutationOptions<any, DeleteActionInstanceConfig, any>
}

export const useDeleteProviderInstance = (props: DeleteActionInstanceMutationProps) => {

    const fetchedDataManagerInstance = dataManager.getInstance as { deleteData: Function }

    return useMutation(
        (config: DeleteActionInstanceConfig) => fetchedDataManagerInstance.deleteData(labels.entities.ProviderInstance, {
            ...config
        }),
        {
            ...props.mutationOptions
        }
    )
}