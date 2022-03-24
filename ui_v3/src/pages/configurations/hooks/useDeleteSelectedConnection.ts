import {useMutation, useQueryClient} from "react-query";
import dataManagerInstance from "../../../data_manager/data_manager";
import labels from "../../../labels/labels";
import {useContext} from "react";
import {ConnectionsContext, ConnectionsSetNotificationContext, ProviderInstanceKey} from "../context/ConnectionsContext";



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
    const setNotificationState = useContext(ConnectionsSetNotificationContext);
    const {providerInstanceDetailsQueryData} = useContext(ConnectionsContext);
    const queryClient = useQueryClient();
    const deleteSelectedEntities = (selectedConnectionId?: string) => {
        const providerInstancesSelected = providerInstanceDetailsQueryData?.data?.find(connection=>connection?.model?.Id === selectedConnectionId);
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