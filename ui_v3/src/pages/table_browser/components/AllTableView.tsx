import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Box, Card, Dialog, DialogContent, IconButton, InputAdornment, LinearProgress, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { TransitionProps } from '@mui/material/transitions';
import { DataGrid, DataGridProps, GridCellParams, GridRowParams, GridValueGetterParams } from "@mui/x-data-grid";
import React, { ChangeEvent, useState } from 'react';
import { generatePath, Route, useHistory } from "react-router";
import { DATA_ALL_TABLES_ROUTE, DATA_TABLE_SYNC_ACTIONS, DATA_TABLE_VIEW } from "../../../common/components/header/data/DataRoutesConfig";
import SyncingLogo from "../../../common/components/logos/SyncingLogo";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import { lightShadows } from "../../../css/theme/shadows";
import TablePropertiesSyncStatus from '../../../enums/TablePropertiesSyncStatus';
import { TableProperties } from '../../../generated/entities/Entities';
import { TableBrowserResponse, TablePropertiesInfo } from "../../../generated/interfaces/Interfaces";
import SyncOOBActionExecutionStatus from '../SyncOOBActionStatus';
import { ReactComponent as DeleteIcon } from "./../../../images/DeleteIcon.svg";
import { useDeleteTables, useGetTables, useReSyncTables } from "./AllTableViewHooks";
import Stack from '@mui/material/Stack';

export type AllTableViewProps = {
    tableFilter?: TableProperties,
    disableCellClick?: boolean
}

type TableBrowserResponseAndCalculatedInfo = TableBrowserResponse & { Health?: number, SyncStatus?: string }

const AllTableView = (props: AllTableViewProps) => {
    const history = useHistory()
    const tableQuery = useGetTables({ options: {}, tableFilter: props?.tableFilter})
    const [searchQuery, setSearchQuery] = useState<string|undefined>("")
    const deleteTableMutation = useDeleteTables({ options: {} })
    const reSyncTablesMutation = useReSyncTables({ options: {} })
    const [dialogProps, setDialogProps] = useState({ open: false, label: "All Tables" })
    const isMutating = deleteTableMutation.isLoading || reSyncTablesMutation.isLoading

    const [rows, setRows] = React.useState<TableBrowserResponseAndCalculatedInfo[]>([])
    React.useEffect(() => {
        if(!!tableQuery.data){
            setRows(
                tableQuery?.data?.map(tableData => {
                    const tableInfo = JSON.parse(tableData?.TableInfo || "{}") as TablePropertiesInfo
                    return {
                        ...tableData,
                        Health: tableInfo?.Health,
                        SyncStatus: tableInfo?.SyncStatus
                    }
                }) || []
            )
        }
    }, [tableQuery.data])
    
    const handleSearchChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSearchQuery(event?.target.value)
    }
    const handleDialogClose = () => setDialogProps(old => ({ ...old, open: false }))
    const handleDialogOpen = () => setDialogProps(old => ({ ...old, open: true }))

    const dataGridProps: DataGridProps = {
        columns: [
            {
                headerName: "Name",
                field: "TableUniqueName",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponseAndCalculatedInfo, any>) => <TextCell text={params.row.TableSchemaName ? params.row.TableSchemaName + "." + params.row.TableUniqueName : params.row.TableUniqueName} />
            },
            {
                headerName: "Data Source",
                field: "ProviderDefinitionName",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponseAndCalculatedInfo, any>) => <TextCell text={params.row.ProviderDefinitionName}/>
            },
            {
                headerName: "Connection Name",
                field: "ProviderInstanceName",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponseAndCalculatedInfo, any>) => <TextCell text={params.row.ProviderInstanceName}/>
            },
            {
                headerName: "CreatedBy",
                field: "TableCreatedBy",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponseAndCalculatedInfo, any>) => <TextCell text={params.row.TableCreatedBy}/>
            },
            {
                field: "Sync Status",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponseAndCalculatedInfo, any>) => <SyncStatusCell SyncStatus={params.row?.SyncStatus}/>
            },
            {
                headerName: "Last Synced On",
                field: "TableLastSyncedOn",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponseAndCalculatedInfo, any>) => <TimestampCell timestamp={params.row?.TableLastSyncedOn}/>
            },
            {
                field: "Health",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponseAndCalculatedInfo, any>) => <HealthCell Health={params.row?.Health} SyncStatus={params.row?.SyncStatus}/>,
                type: "number",
                valueGetter: (params: GridValueGetterParams<any, TableBrowserResponseAndCalculatedInfo>) => params.row?.Health
            },
            {
                field: "Action",
                flex: 1,
                minWidth: 100,
                renderCell: (params: GridCellParams<any, TableBrowserResponseAndCalculatedInfo, any>) => <ActionCell {...params.row}/>
            }
        ],
        rows: (rows.map?.((x, index) => ({ ...x, id: index})) || []),
        sx: {
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},
            backgroundColor: 'ActionCardBgColor.main',
            backgroundBlendMode: "soft-light, normal",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
            borderRadius: "15px",
            height:'500px',
            overflow:'scroll'
        },
        autoHeight: true,
        headerHeight: 70,
        rowsPerPageOptions: [5, 10, 25, 50, 100, 200],
        hideFooterSelectedRowCount: true,
        onRowClick: (params: GridRowParams<TableBrowserResponseAndCalculatedInfo>) => {
            const tableName = params?.row?.TableUniqueName
            const tableId = params?.row?.TableId
            const syncSuccessfully = params?.row?.SyncStatus === TablePropertiesSyncStatus.SYNC_COMPLETE
            const tableDetail = tableQuery?.data?.find( table => table.TableId === tableId)
            if(!!tableName && !!tableId && !!tableDetail && syncSuccessfully===true) { 
                history.push(generatePath(DATA_TABLE_VIEW, { TableName: tableName }))
            }
        },
        filterModel: {
            items: [
                {
                    columnField: "TableUniqueName",
                    operatorValue: "contains",
                    value: searchQuery
                }
            ]
        },
        initialState: {
            pagination: {
                pageSize: 50
            }
        },
        onCellClick: (params: GridCellParams<unknown, TableBrowserResponseAndCalculatedInfo, unknown>, event, details) => {
            if(params.field === "Sync Status" && !!(params?.row?.TableUniqueName) && !props.disableCellClick) {
                event.stopPropagation()
                history.replace(generatePath(DATA_TABLE_SYNC_ACTIONS, { TableName: params?.row?.TableUniqueName }))
            }
        }
    }
    
    const closeSyncActionStatusDialog = () => {
        history.replace(DATA_ALL_TABLES_ROUTE)
    }

    return (
        <>
            <WrapInDialog dialogProps={{ ...dialogProps, handleClose: handleDialogClose }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 5}}>
                {!dialogProps.open &&
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", 
                                position:'sticky',
                                top:'70px' ,  zIndex:1, overflow:'hidden'}}>
                        <Box sx={{ 
                                width:'100%' 
                                
                                }}>
                            <TextField variant="standard" 
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search Tables"
                                sx={{width: '40%', 
                                    backgroundColor: 'allTableTextfieldbgColor1.main',
                                    boxSizing: 'border-box', 
                                    boxShadow: 'inset -4px -6px 16px rgba(255, 255, 255, 0.5), inset 4px 6px 16px rgba(163, 177, 198, 0.5);',
                                    backgroundBlendMode: 'soft-light, normal', 
                                    borderRadius: '26px',
                                    
                                    // display: 'flex', 
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
                            <Box>
                                <IconButton onClick={() => handleDialogOpen()}>
                                    <FullscreenIcon/>
                                </IconButton>
                            </Box>
                    </Box>
                }{
                    dialogProps.open &&
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", 
                                position:'sticky',
                                top:'0px' ,zIndex:1, overflow:'hidden'}}>
                        <Box sx={{ 
                                width:'100%' 
                                
                                }}>
                            <TextField variant="standard" 
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search Tables"
                                sx={{width: '40%', 
                                    backgroundColor: 'allTableTextfieldbgColor1.main',
                                    boxSizing: 'border-box', 
                                    boxShadow: 'inset -4px -6px 16px rgba(255, 255, 255, 0.5), inset 4px 6px 16px rgba(163, 177, 198, 0.5);',
                                    backgroundBlendMode: 'soft-light, normal', 
                                    borderRadius: '26px',
                                    
                                    // display: 'flex', 
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
                        </Box>
                }
                    <Card sx={{ borderRadius: 2, boxShadow: lightShadows[31]}}>
                    <ReactQueryWrapper
                            isLoading={tableQuery.isLoading}
                            error={tableQuery.error}
                            data={tableQuery.data}
                            children={() =>
                                <DataGrid {...dataGridProps} components={{
                                    NoRowsOverlay: () => (
                                      <Stack height="100%" fontSize="18px" alignItems="center" justifyContent="center">
                                        No Table Here 
                                      </Stack>
                                    ),
                                    LoadingOverlay: () => (
                                        <Stack height="100%" fontSize="18px" alignItems="center" justifyContent="center">
                                            Table is Loading.....
                                        </Stack>
                                    )
                                  }}/>
                            }/>
                        
                    </Card>
                </Box>
            </WrapInDialog>
            <Route exact path={DATA_TABLE_SYNC_ACTIONS}>
                <Dialog open={true} onClose={() => closeSyncActionStatusDialog()} maxWidth="lg" fullWidth>
                    <DialogContent sx={{ height: "600px" }}>
                        <SyncOOBActionExecutionStatus/>
                    </DialogContent>
                </Dialog>
            </Route>
        </>
    )
}

const ActionCell = (props?: TableBrowserResponseAndCalculatedInfo) => {
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
                <Tooltip title="ReSync">
                    <IconButton sx={{ width: "40px", height: "40px" }} onClick={ (event) => {event.stopPropagation(); reSyncTable(props?.TableId)} }>
                        <SyncingLogo color="syncingLogoColor1.main" height="24px" width="auto"/>
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

const HealthCell = (props?: { Health?: number, SyncStatus?: string }) => {
    const health = props?.Health
    const SyncStatus = props?.SyncStatus
    const scaledHealth = ((health || 0)*100)

    const formText = () => {
        if(SyncStatus === TablePropertiesSyncStatus.SYNC_COMPLETE && health !== undefined) {
            return `${Math.floor(scaledHealth)} %`
        }
        else if(SyncStatus === TablePropertiesSyncStatus.SYNC_FAILED) {
            return "Health Data Unavaialble"
        }
        else return "Updating Health Data"
    }

    const barColor = `hsl(${scaledHealth * 1.2},100%,50%)`;
    const color = `hsl(${scaledHealth * 1.2},100%,75%)`;

    const formLinearProgressBar = () => {
        if(SyncStatus === TablePropertiesSyncStatus.SYNC_COMPLETE && health !== undefined) {
            return <LinearProgress variant="determinate" value={(health || 0)*100} sx={{ "& .MuiLinearProgress-bar": { backgroundColor: `${barColor} ! important` }, ".MuiLinearProgress-root": { backgroundColor: `${color} ! important` } }}/>
        }
        else if(SyncStatus === TablePropertiesSyncStatus.SYNC_FAILED) {
            return <LinearProgress variant="determinate" value={0} color="error"/>
        }
        else return <LinearProgress variant="indeterminate" color="info"/>
    }

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ width: "100%" }}>
                {formLinearProgressBar()}
            </Box>
            <Box sx={{ width: "100%", textAlign:'center' }}>
                <Typography variant="tableBrowserHealthCell">{formText()}</Typography>
            </Box>
        </Box>
    )
}

const SyncStatusCell = (props?: { SyncStatus?: string }) => {
    const history = useHistory()
    const SyncStatus = props?.SyncStatus
    const getLabel = () => SyncStatus

    const getIcon = () => {
        if(SyncStatus === TablePropertiesSyncStatus.SYNC_COMPLETE) return <CheckCircleIcon height="24px" width="24px" sx={{ color: "syncStatusColor1.main" }}/>
        else if(SyncStatus === TablePropertiesSyncStatus.SYNC_FAILED) return <CancelIcon height="24px" width="24px" sx={{ color: "syncStatusColor2.main" }}/>
        else return (
            <Box sx={{
                animation: "spin 2s linear infinite",
                "@keyframes spin": {
                  "0%": {
                    transform: "rotate(360deg)",
                  },
                  "100%": {
                    transform: "rotate(0deg)",
                  },
                },
                height: "24px", 
                width: "24px"
              }}>
                 <SyncingLogo height="24px" width="24px" color="syncingLogoColor2.main"/>
            </Box>
        )
    }

    const getTooltipText = () => {
        if(SyncStatus === TablePropertiesSyncStatus.SYNC_COMPLETE) return "View Successful Out of Box Actions"
        else if(SyncStatus === TablePropertiesSyncStatus.SYNC_FAILED) return "View Failed Out of Box Actions"
        else return "View Active Out of Box Actions"
    }

    return (
        <Tooltip title={getTooltipText()}>
            <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", alignItems: "center", gap: 1, cursor: "pointer" }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {getIcon()}
                </Box>
                <Box>
                    <Typography variant="tableBrowserContent">
                        {getLabel()}
                    </Typography>
                </Box>
            </Box>
        </Tooltip>
    )
}

export const formDateText = (timestamp?: number) => {
    const dateFormatter = new Intl.DateTimeFormat([], {year: "numeric", month: "short", day: "numeric", weekday: "short",hour: "numeric", minute: "numeric", second: "numeric", hour12: true})
        
    if(timestamp!==undefined){
        return dateFormatter.format(new Date(timestamp))
    } else {
        return ""
    }
}

export const TimestampCell = (props: {timestamp?: number}) => {
    const { timestamp } = props
    const dateString = formDateText(timestamp)

    if( timestamp ) {
        return <TextCell text={dateString}/>
    } else {
        return <TextCell text='NA'/>
    }
}

export const TextCell = (props: { text?: string}) => {
        
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

export const WrapInDialog = (props: { children: JSX.Element, showChild?: boolean, dialogProps: { open: boolean, label?: string, handleClose: Function, TransitionComponent?: React.JSXElementConstructor<TransitionProps & { children: React.ReactElement<any, any> }> } }) => {
    const { children, dialogProps } = props
    let El = <></>;
    if(dialogProps.open) {
        El = (
            <Dialog
                fullScreen
                open={dialogProps.open}
                onClose={() => dialogProps.handleClose()}
                TransitionComponent={dialogProps.TransitionComponent}
            >
                <AppBar sx={{ position: 'relative', backgroundColor: "navbarBgColor.main" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => dialogProps.handleClose()}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography>{dialogProps?.label}</Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent sx={{ my:2 , py:0 }}>
                    {props?.children}
                </DialogContent>
            </Dialog>
        )
    } else {
        El = props?.children
    }
    if(props.showChild === false && dialogProps.open === false) {
        return <></>
    }
    return El;
}

export default AllTableView;