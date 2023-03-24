import dataManager from "@/api/dataManager"
import { ActionInstance } from "@/generated/entities/Entities"
import { labels } from "@/helpers/constant"
import { useMutation, UseMutationOptions } from "react-query"




interface DeleteActionInstanceConfig {
    filter?: ActionInstance
    soft?: boolean,
    hard?: boolean
}
interface DeleteActionInstanceMutationProps {
    mutationOptions?: UseMutationOptions<any, DeleteActionInstanceConfig, any>
}

export const useDeleteActionInstance = (props: DeleteActionInstanceMutationProps) => {

    const fetchedDataManagerInstance = dataManager.getInstance as { deleteData: Function }

    return useMutation(
        (config: DeleteActionInstanceConfig) => fetchedDataManagerInstance.deleteData(labels.entities.ActionInstance, {
            ...config
        }),
        {
            ...props.mutationOptions
        }
    )
}