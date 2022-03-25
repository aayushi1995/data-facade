import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import dataManager from "../../../../data_manager/data_manager"
import labels from "../../../../labels/labels"

export interface UseDeleteApplicationParams {
    mutationOptions: UseMutationOptions<unknown, unknown, (string|undefined)[], unknown>
}

const useDeleteApplication = (params: UseDeleteApplicationParams) => {
    const queryClient = useQueryClient()
    const fetchedDataManagerInstance = dataManager.getInstance as { deleteData: Function }

    const deleteApplicationMutation = useMutation("DeleteApplication", 
        (appIds) => {
            const deletedApps = fetchedDataManagerInstance.deleteData(labels.entities.APPLICATION,
                {
                    filter: {},
                    DeleteMultipleById: true,
                    Ids: appIds,
                    Soft: true
                }
            )
            return deletedApps
        },
        {
            ...params.mutationOptions,
            onSuccess: (data, variables, context) => {
                queryClient.invalidateQueries(["Applications", "All", "PreBuilt", "CardView"])
                params.mutationOptions?.onSuccess?.(data, variables, context)
            }
        }
    )

    return deleteApplicationMutation
}

export default useDeleteApplication;