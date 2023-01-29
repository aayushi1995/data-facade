import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Box, Card, Dialog, DialogContent, Grid, IconButton, InputAdornment, LinearProgress, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import Stack from '@mui/material/Stack';
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
import useFeatureConfig from './useFeatureConfig';
import SyncIcon from '@mui/icons-material/Sync';
export type AllTableViewProps = {
    tableFilter?: TableProperties,
    disableCellClick?: boolean
}

type TableBrowserResponseAndCalculatedInfo = TableBrowserResponse & { Health?: number, SyncStatus?: string }

const AllTableView = (props: AllTableViewProps) => {
    const featureConfigQuery = useFeatureConfig()
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
                headerName: "Created By",
                field: "TableCreatedBy",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponseAndCalculatedInfo, any>) => <TextCell text={params.row.TableCreatedBy}/>
            },
            featureConfigQuery?.data?.tableStats===true && {
                field: "Status",
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
            featureConfigQuery?.data?.tableStats===true && {
                field: "Health",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, TableBrowserResponseAndCalculatedInfo, any>) => <HealthCell Health={params.row?.Health} SyncStatus={params.row?.SyncStatus}/>,
                // type: "number",
                valueGetter: (params: GridValueGetterParams<any, TableBrowserResponseAndCalculatedInfo>) => params.row?.Health
            },
            {
                field: "Action",
                flex: 1,
                minWidth: 100,
                renderCell: (params: GridCellParams<any, TableBrowserResponseAndCalculatedInfo, any>) => <ActionCell {...params.row}/>
            }
        ].filter(c => c!==undefined),
        rows: (rows.map?.((x, index) => ({ ...x, id: index})) || []),
        sx: {
            "& .MuiDataGrid-columnHeaders": { 
                backgroundColor: "#c3d7f7",
                fontFamily:'sans-serif',
                fontSize:'14px',
                fontWeight:800,
                textTransform: 'uppercase',
                letterSpacing:'2px',
                color:'#797a7a',
            },
            "& .MuiDataGrid-row": {
                border: '0px solid black !important',
              },
            backgroundColor: 'ActionCardBgColor.main',
            height:900,
            overflow:'scroll',
            border: '0 !important',
        },
        checkboxSelection:true,
        headerHeight: 80,
        rowsPerPageOptions: [5, 10, 25, 50, 100, 200],
        onRowClick: (params: GridRowParams<TableBrowserResponseAndCalculatedInfo>) => {
            const tableName = params?.row?.TableUniqueName
            const tableId = params?.row?.TableId
            const syncSuccessfully = params?.row?.SyncStatus === TablePropertiesSyncStatus.SYNC_COMPLETE
            const tableDetail = tableQuery?.data?.find( table => table.TableId === tableId)

            if(!!tableName && !!tableId && !!tableDetail && syncSuccessfully===true && featureConfigQuery?.data?.tableStats===true) { 
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
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1}}>
                {!dialogProps.open &&
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", 
                                position:'sticky',
                                top:'10px' ,  zIndex:1, overflow:'hidden'}}>
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
                                    borderRadius: '8px',
                                    
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
                                    borderRadius: '8px',
                                    
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
                    <ReactQueryWrapper
                            isLoading={tableQuery.isLoading}
                            error={tableQuery.error}
                            data={tableQuery.data}
                            children={() =>
                                <Grid container sx={{height:900,overflow:'scroll',display:'flex',borderRadius:'5px',border:'none'}}>
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
                                  </Grid>
                            }/>
                        
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
    const getLabel = () => {
        if(SyncStatus === TablePropertiesSyncStatus.SYNC_COMPLETE) return ("Synced")
        else if(SyncStatus === TablePropertiesSyncStatus.SYNC_FAILED) return ("Failed")
        else return("In Progress")
    }
    const getColor = () => {
        if(SyncStatus === TablePropertiesSyncStatus.SYNC_COMPLETE) return ("#0bbf17")
        else if(SyncStatus === TablePropertiesSyncStatus.SYNC_FAILED) return ("#bf0b1a")
        else return("#142cc9")
    }
    const getSize = () => {
        if(SyncStatus === TablePropertiesSyncStatus.SYNC_COMPLETE || SyncStatus === TablePropertiesSyncStatus.SYNC_FAILED) return ("80px")
        else return("150px")
    }

    const getBGColor = SyncStatus === TablePropertiesSyncStatus.SYNC_COMPLETE?'#d0facf':(SyncStatus === TablePropertiesSyncStatus.SYNC_FAILED?'#facfd8':'#cfdcfa')

    const getIcon = () => {
        if(SyncStatus === TablePropertiesSyncStatus.SYNC_COMPLETE) return <></>//<CheckCircleIcon sx={{ fontSize:'0px', color: "syncStatusColor1.main" }}/>
        else if(SyncStatus === TablePropertiesSyncStatus.SYNC_FAILED) return <></>//<CancelIcon  sx={{ color: "syncStatusColor2.main" }}/>
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
                 {/* <SyncingLogo height="24px" width="24px" color="syncingLogoColor2.main"/> */}
                 <SyncIcon/>
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
            <Box sx={{ width: getSize(), height: "30px",borderRadius:'20px',backgroundColor:getBGColor ,display: "flex", flexDirection: "row", justifyContent:'center',alignItems:'center', gap: 1, cursor: "pointer" }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {getIcon()}
                </Box>
                <Box>
                    <Typography sx={{color:getColor(),fontSize:'0.9rem',fontWeight:600}} variant="tableBrowserContent">
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
        
    const textComponent = <Typography sx={{fontFamily:'sans-serif',fontSize:'0.9rem'}}>
                            {props?.text}
                        </Typography>
    
    if(!!props?.text) {
        return (
            <Box sx={{px:2,overflow:'hidden'}}>
            <Tooltip title={props?.text}>
                {textComponent}
            </Tooltip>
            </Box>
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