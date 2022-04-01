import { useMutation, UseMutationOptions } from "react-query"
import dataManager from "../../../../data_manager/data_manager"



const useDeleteAction = (params: {mutationName: string, mutationOptions?: UseMutationOptions<unknown, unknown, ({idsToDelete: string[]|undefined}), unknown>}) => {
    const fetchedDataManagerInstance = dataManager.getInstance as { deleteData: Function }

    return useMutation(
        params.mutationName,
        (options: {idsToDelete: string[]}) => {
            return fetchedDataManagerInstance.deleteData(
                    "ActionDefinition",
                    {
                        Soft: true,
                        DeleteMultipleById: true,
                        Ids: options.idsToDelete,
                        filter: {}
                    }
            )
        }, {
            ...params.mutationOptions
        }
    )
}

export default useDeleteAction