import { DataGrid } from "@mui/x-data-grid";
import React from 'react';
import { CustomToolbar } from "../../../common/components/CustomToolbar";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import { useRetreiveData } from "../../../data_manager/data_manager";


export const useActionExecution1000RowsQuery = (tableId: string) => useRetreiveData('ActionExecution',
    {
        filter: {
            "TableId": tableId
        },
        TableQuickView: true
    }, { enabled: !!tableId });

const QuickView = (props: { tableId: string }) => {
    const {
        isLoading: actionExecutionLoading,
        error: actionExecutionError,
        data: actionExecutionData
    } = useActionExecution1000RowsQuery(props.tableId);

    return (
        <ReactQueryWrapper isLoading={actionExecutionLoading} error={actionExecutionError || actionExecutionData?.[0]?.Output === undefined}
                           data={actionExecutionData}>
            {() => {
                const output = JSON.parse(actionExecutionData?.[0]?.Output);
                const columns = output?.Value?.schema?.map((column: { columnName: any; }) => {
                    const field = column.columnName;
                    return ({
                        field,
                        sortable: true,
                        hide: field === 'index',
                        width: 200,
                        description: field
                    })
                });
                const rows = output?.Value?.data?.map((d: { index: any; }) => ({ ...d, id: d.index }));
                return <DataGrid
                    components={{
                        Toolbar: CustomToolbar([]),
                    }}
                    autoHeight
                    pagination
                    pageSize={20}
                    rowsPerPageOptions={[20]}
                    columns={columns}
                    rows={rows}
                />
            }}
        </ReactQueryWrapper>
    );
}
export default QuickView