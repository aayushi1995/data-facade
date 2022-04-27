import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "react-query"
import dataManager from "../../../data_manager/data_manager"
import { ActionDefinition, TableProperties } from "../../../generated/entities/Entities"
import { TableBrowserResponse, TableOOBActionStatus } from "../../../generated/interfaces/Interfaces"
import labels from "../../../labels/labels"

export type UseGetTablesParams = {
    options: UseQueryOptions<TableBrowserResponse[], unknown, TableBrowserResponse[], (string | undefined)[]> 
}
export const useGetTables = (params: UseGetTablesParams) => {
    const fetchedDataManager = dataManager.getInstance as { retreiveData: Function }
    const tableBrowserQuery = useQuery<TableBrowserResponse[], unknown, TableBrowserResponse[], (string | undefined)[]>([labels.entities.TableProperties, "TableBrowser"], 
        () => fetchedDataManager.retreiveData(labels.entities.TableProperties, {
            filter: {},
            TableBrowser: true
        }),
        {
            ...params.options
        } 
    )

    return tableBrowserQuery;
}


export type UseGetTableOOBActionsStatusParams = {
    options: UseQueryOptions<TableOOBActionStatus, unknown, TableOOBActionStatus, (string | undefined)[]>,
    tableId?: string
}
export const useGetTableOOBActionsStatus = (params: UseGetTableOOBActionsStatusParams) => {
    const fetchedDataManager = dataManager.getInstance as { retreiveData: Function }
    const tableBrowserQuery = useQuery<TableBrowserResponse[], unknown, TableOOBActionStatus, (string | undefined)[]>([labels.entities.TableProperties, "OOBActionStatus", params?.tableId], 
        () => fetchedDataManager.retreiveData(labels.entities.TableProperties, {
            filter: { Id: params?.tableId },
            OOBActionsStatus: true
        }, {
            ...params.options,
            enabled: ( !!params.tableId ) && params?.options?.enabled
        }).then((data: TableOOBActionStatus[]) => data[0]) 
    )

    return tableBrowserQuery;
}


export type UseDeleteTablesParams = {
    options: UseMutationOptions<TableProperties, unknown, (string | undefined)[], unknown>,
    tableId?: string
}

export const useDeleteTables = (params: UseDeleteTablesParams) => {
    const queryClient = useQueryClient()
    const fetchedDataManager = dataManager.getInstance as { deleteData: Function }
    const deleteTablePropertiesMutation = useMutation((tablePropertiesIds: (string | undefined)[]) => 
        fetchedDataManager.deleteData("TableProperties",
            {
                filter: {},
                DeleteMultipleById: true,
                Ids: tablePropertiesIds,
                Soft: true
            }
        ), {
            mutationKey: params?.tableId,
            onSuccess: (data, variables, context) => {
                queryClient.invalidateQueries([labels.entities.TableProperties, "TableBrowser"])
                params?.options?.onSuccess?.(data, variables, context)
            },
            ...params?.options
        }
    )
    
    return deleteTablePropertiesMutation
}

export type UseReSyncTablesParams = {
    options: UseMutationOptions<TableProperties, unknown, (string | undefined)[], unknown>,
    tableId?: string
}

export const useReSyncTables = (params: UseReSyncTablesParams) => {
    const queryClient = useQueryClient()
    const fetchedDataManager = dataManager.getInstance as { saveData: Function }
    const reSyncTablePropertiesMutation = useMutation((tablePropertiesIds: (string | undefined)[]) => 
        fetchedDataManager.saveData("ActionExecution",
            {
                entityProperties: {},
                SyncColumns: true,
                TableIds: tablePropertiesIds
            }
        ), {
            mutationKey: params?.tableId,
            onSuccess: (data, variables, context) => {
                queryClient.invalidateQueries([labels.entities.TableProperties, "TableBrowser"])
                params?.options?.onSuccess?.(data, variables, context)
            },
            ...params?.options
        }
    )
    
    return reSyncTablePropertiesMutation
}

export type UseGetTableModelParams = {
    options: UseQueryOptions<TableProperties, unknown, TableProperties, (string | undefined)[]>,
    tableName?: string
}
export const UseGetTableModel = (params: UseGetTableModelParams) => {
    const fetchedDataManager = dataManager.getInstance as { retreiveData: Function }
    const tableBrowserQuery = useQuery<TableProperties, unknown, TableProperties, (string | undefined)[]>([labels.entities.TableProperties, params?.tableName], 
        () => fetchedDataManager.retreiveData(labels.entities.TableProperties, {
            filter: {
                UniqueName: params?.tableName
            }
        }).then((data: TableProperties[]) => data?.[0]),
        {
            ...params.options,
            enabled: (!!params?.tableName) && (params?.options?.enabled)
        }
    )

    return tableBrowserQuery;
}


export type UseActionDefinitionModelParams = {
    options: UseQueryOptions<ActionDefinition, unknown, ActionDefinition, (string | undefined)[]>,
    actionDefinitionId?: string
}
export const UseActionDefinitionModel = (params: UseActionDefinitionModelParams) => {
    const fetchedDataManager = dataManager.getInstance as { retreiveData: Function }
    const tableBrowserQuery = useQuery<ActionDefinition, unknown, ActionDefinition, (string | undefined)[]>([labels.entities.ActionDefinition, params?.actionDefinitionId], 
        () => fetchedDataManager.retreiveData(labels.entities.ActionDefinition, {
            filter: {
                Id: params?.actionDefinitionId
            }
        }).then((data: ActionDefinition[]) => data?.[0]),
        {
            ...params.options,
            enabled: (!!params?.actionDefinitionId) && (params?.options?.enabled)
        }
    )

    return tableBrowserQuery;
}