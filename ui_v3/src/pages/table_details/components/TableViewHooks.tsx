import { DataGridProps, GridColDef } from "@mui/x-data-grid";
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "react-query";
import dataManager from "../../../data_manager/data_manager";
import { ColumnProperties } from "../../../generated/entities/Entities";
import { ColumnInfo, TableView } from "../../../generated/interfaces/Interfaces";
import labels from "../../../labels/labels";
import { TableOutputFormat, TablePreview } from "../../view_action_execution/ViewActionExecutionOutput";
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

export interface DataGridColumn extends GridColDef {
    columInfo?: ColumnInfo
}
export const formDataGridPropsFromResponse = (response?: TableView) => {
    if(!!response) {
        const tableData: TableOutputFormat = JSON.parse(response?.TableData?.Output || "{}")
        const tablePreview: TablePreview = JSON.parse(tableData.preview)

        const rows = tablePreview.data?.map((row, i) => ({...row, id: i}))

        const columns: GridColDef[] = response?.Columns?.filter(columnInfo => columnInfo?.ColumnProperties?.UniqueName!=="index")?.map(columnInfo => ({
            field: columnInfo.ColumnProperties?.UniqueName!,
            disableColumnMenu: true,
            sortable: false,
            renderHeader: (params) => <TableViewColumnHeader gridColumnHeaderParams={params} columnInfo={columnInfo}/>,
            flex: 1
        })) || []

        const dataGridProps: DataGridProps = {
            rows: rows,
            columns: columns,
            autoHeight: true,
            headerHeight: "120px",
            rowsPerPageOptions: [5, 10]
        }
        console.log(rows, columns)
        return dataGridProps
    } else {
        return {
            rows: [],
            columns: []
        }
    }
    
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