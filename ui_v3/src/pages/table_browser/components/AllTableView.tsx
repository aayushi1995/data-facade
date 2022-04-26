import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Card, IconButton, InputAdornment, LinearProgress, TextField, Tooltip, Typography } from "@mui/material";
import { DataGrid, DataGridProps, GridCellParams, GridRowParams } from "@mui/x-data-grid";
import { ChangeEvent, useState } from 'react';
import { generatePath, useHistory } from "react-router";
import { DATA_TABLE_VIEW } from "../../../common/components/header/data/DataRoutesConfig";
import SyncingLogo from "../../../common/components/logos/SyncingLogo";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import { lightShadows } from "../../../css/theme/shadows";
import ActionExecutionStatus from '../../../enums/ActionExecutionStatus';
import { TableBrowserResponse, TableOOBActionStatus } from "../../../generated/interfaces/Interfaces";
import { useTableAndColumnStats } from "../../table_details/components/ColumnInfoViewHooks";
import { ReactComponent as DeleteIcon } from "./../../../images/DeleteIcon.svg";
import { ReactComponent as WeirdIcon } from "./../../../images/WeirdIcon.svg";
import { useDeleteTables, useGetTableOOBActionsStatus, useGetTables, useReSyncTables } from "./AllTableViewHooks";

export type AllTableViewProps = {}

const AllTableView = (props: AllTableViewProps) => {
    const history = useHistory()
    const tableQuery = useGetTables({ options: {}})
    const [searchQuery, setSearchQuery] = useState<string|undefined>("")
    const deleteTableMutation = useDeleteTables({ options: {} })
    const reSyncTablesMutation = useReSyncTables({ options: {} })
    const isMutating = deleteTableMutation.isLoading || reSyncTablesMutation.isLoading
    const handleSearchChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSearchQuery(event?.target.value)
    }
    const dataGridProps: DataGridProps = {
        columns: [
            {
                headerName: "Name",
                field: "TableUniqueName",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponse, any>) => <TextCell text={params.row.TableUniqueName}/>
            },
            {
                headerName: "Data Source",
                field: "ProviderDefinitionName",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponse, any>) => <TextCell text={params.row.ProviderDefinitionName}/>
            },
            {
                headerName: "Connection Name",
                field: "ProviderInstanceName",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponse, any>) => <TextCell text={params.row.ProviderInstanceName}/>
            },
            {
                headerName: "CreatedBy",
                field: "TableCreatedBy",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponse, any>) => <TextCell text={params.row.TableCreatedBy}/>
            },
            {
                field: "Sync Status",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponse, any>) => <SyncStatusCell {...params.row}/>
            },
            {
                headerName: "Last Synced On",
                field: "TableLastSyncedOn",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponse, any>) => <LastSyncedCell {...params.row}/>
            },
            {
                field: "Health",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponse, any>) => <HealthCell {...params.row}/>
            },
            {
                field: "Action",
                flex: 1,
                minWidth: 150,
                renderCell: (params: GridCellParams<any, TableBrowserResponse, any>) => <ActionCell {...params.row}/>
            }
        ],
        rows: (tableQuery?.data?.map?.((x, index) => ({ ...x, id: index})) || []),
        sx: {
            minHeight: "500px",
            maxHeight: "700px",
            "& .MuiDataGrid-columnHeaders": { background: "#E8E8E8"}
        },
        headerHeight: 70,
        rowsPerPageOptions: [5, 10, 20, 50 ,100],
        hideFooterSelectedRowCount: true,
        onRowClick: (params: GridRowParams<TableBrowserResponse>) => {
            const tableName = params?.row?.TableUniqueName
            const tableId = params?.row?.TableId
            if(!!tableName && !!tableId) { 
                history.push(generatePath(DATA_TABLE_VIEW, { TableName: tableName }))
            }
        },
        disableColumnFilter: true,
        filterModel: {
            items: [
                {
                    columnField: "TableUniqueName",
                    operatorValue: "contains",
                    value: searchQuery
                }
            ]
        }
    }
    
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 5}}>
            <Box>
                <TextField variant="standard" 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search Tables"
                    multiline={true}
                    sx={{width: '40%', 
                        background: '#E0E5EC',
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
            <Card sx={{ borderRadius: 2, boxShadow: lightShadows[31]}}>
                <ReactQueryWrapper
                    isLoading={tableQuery.isLoading}
                    error={tableQuery.error}
                    data={tableQuery.data}
                    children={() =>
                        <DataGrid {...dataGridProps}/>
                    }
                />
        </Card>
       </Box>
    )
}

const ActionCell = (props?: TableBrowserResponse) => {
    const deleteTableMutation = useDeleteTables({ options: {}, tableId: props?.TableId })
    const reSyncTablesMutation = useReSyncTables({ options: {}, tableId: props?.TableId })

    const deleteTable = (tableId?: string) => {
        deleteTableMutation.mutate([tableId])
    }

    const reSyncTable = (tableId?: string) => {
        reSyncTablesMutation.mutate([tableId])
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "space-around", width: "100%" }}>
            <Box>
                <Tooltip title="Don't Know">
                    <IconButton sx={{ width: "40px", height: "40px" }} onClick={ (event) => {event.stopPropagation(); console.log("New Button")} }>
                        <WeirdIcon/>
                    </IconButton>
                </Tooltip>
                {false && <LinearProgress variant="indeterminate"/>}
            </Box>
            <Box>
                <Tooltip title="ReSync">
                    <IconButton sx={{ width: "40px", height: "40px" }} onClick={ (event) => {event.stopPropagation(); reSyncTable(props?.TableId)} }>
                        <SyncingLogo color="#000000" height="24px" width="auto"/>
                    </IconButton>
                </Tooltip>
                {reSyncTablesMutation.isLoading && <LinearProgress variant="indeterminate"/>}
            </Box>
            <Box>
                <Tooltip title="Delete">
                    <IconButton sx={{ width: "40px", height: "40px" }} onClick={ (event) => {event.stopPropagation(); deleteTable(props?.TableId)} }>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
                {deleteTableMutation.isLoading && <LinearProgress variant="indeterminate"/>}
            </Box>
        </Box>
    )
}

const HealthCell = (props?: TableBrowserResponse) => {
    const oobActionsStatus = useGetTableOOBActionsStatus({ options: {}, tableId: props?.TableId })
    const tableFullStats = useTableAndColumnStats({ TableId: props?.TableId })
    const allComplete = areAllOOBActionsCompleted(oobActionsStatus.data)
    const anyFailed = anyOOBActionFailed(oobActionsStatus.data)

    const formText = () => {
        if(allComplete) {
            const rowCount = tableFullStats?.data?.TableStat?.RowCount
            return `${!!rowCount ? 88 : 30} %`
        }
        else if(anyFailed) {
            return "Health Data Unavaialble"
        }
        else return "Updating Health Data"
    }

    const formLinearProgressBar = () => {
        if(allComplete) {
            const rowCount = tableFullStats?.data?.TableStat?.RowCount
            const health = !!rowCount ? 88 : 30
            return <LinearProgress variant="determinate" value={health} color="success"/>
        }
        else if(anyFailed) {
            return <LinearProgress variant="determinate" value={0} color="error"/>
        }
        else return <LinearProgress variant="indeterminate" color="info"/>
    }

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ width: "100%" }}>
                {formLinearProgressBar()}
            </Box>
            <Box sx={{ width: "100%" }}>
                <Typography variant="tableBrowserHealthCell">{formText()}</Typography>
            </Box>
        </Box>
    )
}

const SyncStatusCell = (props?: TableBrowserResponse) => {
    const oobActionsStatus = useGetTableOOBActionsStatus({ options: {}, tableId: props?.TableId })
    const allComplete = areAllOOBActionsCompleted(oobActionsStatus.data)
    const anyFailed = anyOOBActionFailed(oobActionsStatus.data)


    const getLabel = () => {
        if(allComplete) return "Sync Complete"
        else if(anyFailed) return "Sync Failed"
        else return "Syncing"
    }

    const getIcon = () => {
        if(allComplete) return <CheckCircleIcon height="24px" width="24px" sx={{ color: "#00AA11" }}/>
        else if(anyFailed) return <CancelIcon height="24px" width="24px" sx={{ color: "#FF0000" }}/>
        else return <SyncingLogo height="24px" width="24px" color="#FA9705"/>
    }

    return (
        <ReactQueryWrapper
            isLoading={oobActionsStatus.isLoading}
            error={oobActionsStatus.error}
            data={oobActionsStatus.data}
            children={() => 
                <Box sx={{ width: "100%", display: "flex", flexDirection: "row", gap: 1}}>
                    <Box>
                        {getIcon()}
                    </Box>
                    <Box>
                        <Typography variant="tableBrowserContent">
                            {getLabel()}
                        </Typography>
                    </Box>
                </Box>
            }
        />
    )
}

const LastSyncedCell = (props?: TableBrowserResponse) => {
    const getDateString = (timestamp?: number) => {
        const dateFormatter = new Intl.DateTimeFormat([], {year: "numeric", month: "long", day: "numeric", weekday: "short",hour: "numeric", minute: "numeric", second: "numeric", hour12: true})
        
        if(timestamp!==undefined){
            return dateFormatter.format(new Date(timestamp))
        } else {
            return ""
        }
    }

    if( props?.TableLastSyncedOn ) {
        return <TextCell text={getDateString(props?.TableLastSyncedOn)}/>
    } else {
        return <></>
    }
}

const TextCell = (props: { text?: string}) => {
        
    const textComponent = <Typography variant="tableBrowserContent">
                            {props?.text}
                        </Typography>
    
    if(!!props?.text) {
        return (
            <Tooltip title={props?.text}>
                {textComponent}
            </Tooltip>
        )
    } else {
        return textComponent
    }
}

const areAllOOBActionsCompleted = (response?: TableOOBActionStatus) => response?.OOBActionsStatus?.every((value, index, arr) => value.ActionExecutionStatus===ActionExecutionStatus.COMPLETED)
const anyOOBActionFailed = (response?: TableOOBActionStatus) => response?.OOBActionsStatus?.some((value, index, arr) => value.ActionExecutionStatus===ActionExecutionStatus.FAILED)

export default AllTableView;