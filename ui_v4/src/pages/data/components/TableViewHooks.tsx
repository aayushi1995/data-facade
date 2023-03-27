import dataManager from "@/api/dataManager";
import { ColumnProperties } from "@/generated/entities/Entities";
import { TableView } from "@/generated/interfaces/Interfaces";
import { labels } from "@/helpers/constant";
import ActionExecutionStatus from "@/helpers/enums/ActionExecutionStatus";
import { TableOutputSuccessfulFormat, TablePreview } from "@/pages/chat/chatActionOutput/successActionOutput";
import { TablePaginationConfig} from "antd/es/table";
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "react-query";
import { TableViewColumnHeader } from "./TableView";

export const useTableView = (params: {TableId?: string, options?: UseQueryOptions<TableView, unknown, TableView, (string | undefined)[]>}) => {
    const fetchedDataManagerInstance = dataManager.getInstance as {retreiveData: Function}
    
    const query = useQuery([labels.entities.TableProperties, "TableView", params?.TableId], () => {
        return fetchedDataManagerInstance.retreiveData(labels.entities.TableProperties, {
            filter: {
                Id: params?.TableId
            },
            TableView: true
        }).then((data: TableView[]) => data[0])
    }, {
        ...params?.options
    })

    return query
}

export const formDataGridPropsFromResponse = (response?: TableView, searchQuery?: string) => {
    if(!!response) {
        const tableData: TableOutputSuccessfulFormat = JSON.parse(response?.TableData?.Output || "{}")
        const tablePreview: TablePreview = JSON.parse(tableData.preview || "{}")

        const rows = tablePreview.data?.map((row, i) => ({key: (i+1),...row}))
        
        
        const columns: any[] = response?.Columns?.filter(columnInfo => columnInfo?.ColumnProperties?.UniqueName!=="index" && columnInfo?.ColumnProperties?.UniqueName?.includes(searchQuery || "")).sort((c1, c2) => (c1?.ColumnProperties?.ColumnIndex || 0) - (c2?.ColumnProperties?.ColumnIndex || 1))?.map(columnInfo => ({
            title: columnInfo.ColumnProperties?.UniqueName,
            key:columnInfo.ColumnProperties?.UniqueName,
            dataIndex: columnInfo.ColumnProperties?.UniqueName,
            // render: () => !!columnInfo?.ColumnProperties?.Id ? <TableViewColumnHeader ColumnId={columnInfo?.ColumnProperties?.Id}/> : <></>,
        })) || []
        const dataGridProps: any = {
            dataSource: rows,
            columns: columns
        }
        return dataGridProps
    } else {
        return {
            dataSource: [],
            columns: []
        }
    } 
}

export const isDataGridRenderPossible = (response?: TableView) => {
    return true || !!response && response?.TableData?.Status===ActionExecutionStatus.COMPLETED
}

export type UseColumnDataTypeMutationVariables = {
    columnId?: string,
    newDataType: string
}

export const useColumn = (params: { ColumnId?: string, options: UseQueryOptions<ColumnProperties, unknown, ColumnProperties, (string|undefined)[]>}) => {
    const fetchedDataManager = dataManager.getInstance as { retreiveData: Function }
    const query = useQuery([labels.entities.ColumnProperties, params?.ColumnId], () => fetchedDataManager.retreiveData(labels.entities.ColumnProperties, {
        filter: {
            Id: params?.ColumnId
        }
    }).then((data: ColumnProperties[]) => data[0]), {
        enabled: !!params?.ColumnId,
        ...params?.options
    })

    return query
}

export const useColumnDataTypeMutation = (params: { options: UseMutationOptions<ColumnProperties, unknown, UseColumnDataTypeMutationVariables, unknown>}) => {
    const fetchedDataManagerInstance = dataManager.getInstance as {patchData: Function}
    
    const mutation = useMutation((variables: UseColumnDataTypeMutationVariables) => {
        return fetchedDataManagerInstance.patchData(labels.entities.ColumnProperties, {
            filter: {
                Id: variables?.columnId
            }, newProperties: {
                Datatype: variables.newDataType
            }
        }).then((data: ColumnProperties[]) => data[0])
    }, {
        ...params.options
    })

    return mutation
}