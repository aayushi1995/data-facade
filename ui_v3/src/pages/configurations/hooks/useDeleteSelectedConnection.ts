import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import dataManagerInstance from "../../../data_manager/data_manager";
import labels from "../../../labels/labels";
import { ConnectionSetNotificationContext, ConnectionStateContext, ProviderInstanceKey } from "../context/ConnectionsContext";



export const useDeleteSelectedConnection = () =>{
    const deleteProviderInstanceMutation = useMutation(labels.entities.ProviderInstance,(tablePropertiesId: string) => {
        // @ts-ignore
        const config = dataManagerInstance.getInstance.deleteData(labels.entities.ProviderInstance, {
            filter: {},
            DeleteMultipleById: true,
            Ids: tablePropertiesId,
            Soft: true
        })
        return config;
    });
    const setNotificationState = useContext(ConnectionSetNotificationContext);
    const connectionState = useContext(ConnectionStateContext);
    const queryClient = useQueryClient();
    const deleteSelectedEntities = (selectedConnectionId?: string) => {
        const providerInstancesSelected = undefined
        if(providerInstancesSelected){
            // @ts-ignore
            deleteProviderInstanceMutation.mutate(providerInstancesSelected, {
                onSuccess: () => {
                    queryClient.invalidateQueries(ProviderInstanceKey);
                    setNotificationState({
                        open: true,
                        severity: "success",
                        message: `Connection Instance Deleted`
                    });
                    console.log("Deleted Successfully")
                },
                onError: () => {
                    setNotificationState({
                        open: true,
                        severity: "error",
                        message: `Connection Instance Deletion Failed`
                    });
                }
            })
        }else{
            setNotificationState({
                open: true,
                severity: "error",
                message: `No Connection Instance Selected`
            });
        }

    }
    return deleteSelectedEntities;
}