import { Box, Card } from "@mui/material"
import { DataGrid, DataGridProps, GridRenderCellParams } from "@mui/x-data-grid"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import { lightShadows } from "../../../css/theme/shadows"
import { ColumnProperties } from "../../../generated/entities/Entities"
import { TableAndColumnStats, useAllColumns, useTableAndColumnStats } from "./ColumnInfoViewHooks"
import { ColumnStatView, ColumnStatViewProps } from "./ColumnStatView"
import { TableViewColumnHeader } from "./TableView"

export type ColumnGridViewProps = {
    TableId: string
}

const ColumnInfoView = (props: ColumnGridViewProps) => {
    const columnQuery = useAllColumns({ TableId: props.TableId})
    const tableFullStats = useTableAndColumnStats({ TableId: props.TableId })
    return (
        <ReactQueryWrapper
            isLoading={columnQuery?.isLoading}
            error={columnQuery?.error}
            data={columnQuery?.data}
            children={() => 
                <ReactQueryWrapper
                    isLoading={tableFullStats?.isLoading}
                    error={tableFullStats?.error}
                    data={tableFullStats?.data}
                    children={() => 
                        <ColumnInfoDataGrid Columns={columnQuery?.data} TableStats={tableFullStats?.data} />
                    }
                />
            }
        />
    )
}

type ColumnInfoDataGridProps = {
    Columns?: ColumnProperties[],
    TableStats?: TableAndColumnStats
}

const ColumnInfoDataGrid = (props: ColumnInfoDataGridProps) => {
    const dataGridRowsOpt: (ColumnStatViewProps | undefined)[] = props?.Columns?.map?.((colProp, index) => {
        const columnInfoAndStat = props?.TableStats?.ColumnInfoAndStats?.find?.(colIAS => colIAS?.ColumnName===colProp?.UniqueName)
        if(!!columnInfoAndStat) {
            const rowVal: ColumnStatViewProps = { column: colProp, columnStat: columnInfoAndStat?.ColumnStat}
            return rowVal
        }
    }) || []
    
    const dataGridRows = dataGridRowsOpt.filter(x => !!x)

    const dataGridProps: DataGridProps = {
        columns: [
            {
                field: "Info",
                width: 300,
                renderCell: (params: GridRenderCellParams<any, ColumnStatViewProps, any>) => {
                    return !!(params.row?.column?.Id) ? <Box sx={{ py: 2, width: "100%" }}><Box sx={{ background: "#E8E8E8", height: "100%", width: "100%" }}><TableViewColumnHeader ColumnId={params.row?.column?.Id}/></Box></Box> : <></>
                }
            },
            {
                field: "Stats",
                flex: 1,
                renderCell: (params: GridRenderCellParams<any, ColumnStatViewProps, any>) => {
                    return !!(params.row?.column?.Id) ? <ColumnStatView column={params.row?.column} columnStat={params.row?.columnStat}/> : <></>
                }
            }
        ],
        rows: dataGridRows.map((elem, i) => ({...elem, id: i})),
        rowHeight: 150,
        rowsPerPageOptions: [5, 10, 15, 50, 100]
    }

    return (
        <Card sx={{ borderRadius: 2, boxShadow: lightShadows[31], height: "650px"}}>
            <DataGrid {...dataGridProps} sx={{
                "& .MuiDataGrid-cell--withRenderer": { p: 0 }
            }}/>
        </Card>
    )
}



export default ColumnInfoView;