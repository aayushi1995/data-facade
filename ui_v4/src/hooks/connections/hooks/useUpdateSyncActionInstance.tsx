import { Fetcher } from "@/generated/apis/api";
import { ActionInstance } from "@/generated/entities/Entities";
import { labels } from "@/helpers/constant";
import { useMutation, UseMutationOptions, useQueryClient } from "react-query";

interface UpdateSyncActionInstanceConfig {
    filter: ActionInstance,
    newProperties: ActionInstance
}

interface UpdateActionInstanceProps {
    mutationOptions?: UseMutationOptions<unknown, unknown, UpdateSyncActionInstanceConfig>
}

const useUpdateSyncActionInstance = (props: UpdateActionInstanceProps) => {

    const queryClient = useQueryClient()
    return useMutation(
        (config: UpdateSyncActionInstanceConfig) => Fetcher.fetchData('PATCH', '/updateActionInstance', {filter: config.filter, newProperties: config.newProperties}),
        {
            onSuccess: () => queryClient.invalidateQueries([labels.entities.ProviderInstance, "Card"])
        }
    )
} 

export default useUpdateSyncActionInstance