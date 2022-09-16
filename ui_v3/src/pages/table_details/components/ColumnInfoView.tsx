import FullscreenIcon from '@mui/icons-material/Fullscreen'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Card, IconButton, InputAdornment, TextField } from "@mui/material"
import { DataGrid, DataGridProps, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid"
import { ChangeEvent, useState } from 'react'
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import { lightShadows } from "../../../css/theme/shadows"
import { ColumnProperties } from "../../../generated/entities/Entities"
import { WrapInDialog } from '../../table_browser/components/AllTableView'
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
    const [searchQuery, setSearchQuery] = useState<string|undefined>("")
    const handleSearchChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSearchQuery(event?.target.value)
    }

    const [dialogProps, setDialogProps] = useState({ open: false, label: `All Columns` })

    const dataGridRowsOpt: (ColumnStatViewProps | undefined)[] = props?.Columns?.map?.((colProp, index) => {
        const columnInfoAndStat = props?.TableStats?.ColumnInfoAndStats?.find?.(colIAS => colIAS?.ColumnName===colProp?.UniqueName)
        if(!!columnInfoAndStat) {
            const rowVal: ColumnStatViewProps = { column: colProp, columnStat: columnInfoAndStat?.ColumnStat}
            return rowVal
        }
    }) || []

    const handleDialogClose = () => setDialogProps(old => ({ ...old, open: false }))
    const handleDialogOpen = () => setDialogProps(old => ({ ...old, open: true }))
    
    const dataGridRows = dataGridRowsOpt.filter(x => !!x)

    const dataGridProps: DataGridProps = {
        columns: [
            {
                field: "Info",
                width: 300,
                renderCell: (params: GridRenderCellParams<any, ColumnStatViewProps, any>) => {
                    return !!(params.row?.column?.Id) ? <Box sx={{ py: 2, width: "100%" }}><Box sx={{ backgroundColor: "ActionDefinationTextPanelBgColor.main", height: "100%", width: "100%" }}><TableViewColumnHeader ColumnId={params.row?.column?.Id}/></Box></Box> : <></>
                },
                valueGetter: (params: GridValueGetterParams<any, ColumnStatViewProps>) => params?.row?.column?.UniqueName
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
        autoHeight: true,
        rowsPerPageOptions: [4, 10, 15, 50, 100],
        initialState: {
            pagination: {
                pageSize: 50
            }
        },
        filterModel: { 
            items: [
                {
                    columnField: "Info",
                    operatorValue: "contains",
                    value: searchQuery
                }
            ]
        }
    }

    return (
            <WrapInDialog dialogProps={{ ...dialogProps, handleClose: handleDialogClose }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ flex: 1 }}>
                            <TextField variant="standard" 
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search Columns"
                                sx={{width: '40%', 
                                    backgroundColor: 'allTableTextfieldbgColor1.main',
                                    boxSizing: 'border-box', 
                                    boxShadow: 'inset -4px -6px 16px rgba(255, 255, 255, 0.5), inset 4px 6px 16px rgba(163, 177, 198, 0.5);',
                                    backgroundBlendMode: 'soft-light, normal', 
                                    borderRadius: '26px',
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    minHeight: '50px'}}
                                InputProps={{
                                    disableUnderline: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{marginLeft: 1}}/>
                                        </InputAdornment>
                                    )
                            }}/>
                        </Box>
                        {!dialogProps.open &&
                            <Box>
                                <IconButton onClick={() => handleDialogOpen()}>
                                    <FullscreenIcon/>
                                </IconButton>
                            </Box>
                        }
                    </Box>
                    <Box>
                        <Card sx={{ borderRadius: 2, boxShadow: lightShadows[31] }}>
                            <DataGrid {...dataGridProps} sx={{
                                "& .MuiDataGrid-cell--withRenderer": { p: 0 }
                            }}/>
                        </Card>
                    </Box>
                </Box>
            </WrapInDialog>        
    )
}



export default ColumnInfoView;