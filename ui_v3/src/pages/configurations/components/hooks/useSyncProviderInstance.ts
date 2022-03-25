import { useMutation, UseMutationOptions } from "react-query";
import dataManager from "../../../../data_manager/data_manager";
import labels from "../../../../labels/labels";

export interface SyncProviderinstanceConfig {
    providerInstanceId?: string,
    syncDepthConfig: {
        providerSyncAction: boolean,
        SyncDepth: "Tables" | "TablesAndColumns",
    },
    recurrenceConfig: Object
}
export interface UseSyncProviderInstanceParams {
    mutationOptions: UseMutationOptions<unknown, unknown, SyncProviderinstanceConfig>
}

const useSyncProviderInstance = (params: UseSyncProviderInstanceParams) => {
    const fetchedDataManagerInstance = dataManager.getInstance as { saveData: Function }

    const syncProviderInstanceMutation = useMutation((config) => fetchedDataManagerInstance.saveData(labels.entities.ActionInstance, {
            entityProperties: {
                Id: config.providerInstanceId
            },
            ...config.syncDepthConfig,
            ...config.recurrenceConfig
        }), {
            ...params.mutationOptions
        }
    )

    return syncProviderInstanceMutation
}

export default useSyncProviderInstance;