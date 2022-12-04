import CloseIcon from '@mui/icons-material/Close';
import SyncIcon from "@mui/icons-material/Sync";
import { Box, Button, Card, CardProps, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, Grid, IconButton, styled, Switch, TextField, Tooltip, Typography, TypographyProps } from "@mui/material";
import Stack from '@mui/material/Stack';
import { DataGrid, DataGridProps, GridCellParams } from "@mui/x-data-grid";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { generatePath, useHistory } from "react-router";
import { v4 as uuidv4 } from 'uuid';
import ConfirmationDialog from "../../../../src/common/components/ConfirmationDialog";
import { DATA_CONNECTION_DETAIL_ROUTE } from "../../../common/components/header/data/DataRoutesConfig";
import LoadingIndicator from "../../../common/components/LoadingIndicator";
import { SetModuleContextState } from "../../../common/components/ModuleContext";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import ActionExecutionStatus from "../../../enums/ActionExecutionStatus";
import { Fetcher } from "../../../generated/apis/api";
import { ActionInstance, ProviderInstance } from "../../../generated/entities/Entities";
import { ProviderCardView, ProviderInstanceStat } from "../../../generated/interfaces/Interfaces";
import labels from "../../../labels/labels";
import { ProviderIcon } from "../../data/components/connections/ConnectionDialogContent";
import { TextCell, TimestampCell } from "../../table_browser/components/AllTableView";
import FetchActionExecutionDetails from "../../view_action_execution/hooks/FetchActionExecutionDetails";
import { ViewFailedActionExecution } from "../../view_action_execution/VIewActionExecution";
import { useDeleteActionInstance } from "./hooks/useDeleteActionInstance";
import useSyncProviderInstance from "./hooks/useSyncProviderInstance";
import useUpdateSyncActionInstance from "./hooks/useUpdateSyncActionInstance";

type DataGridRow = ProviderCardView & {id?: string} & {providerName?: string}

interface ConnectionDataGridProps {
    filter?: ProviderInstance,
    showSyncStatus?: boolean
}

export interface ProviderInstanceConfig {
    SyncActionInstanceId?: string
}

export interface SyncActionExecutionOutput {
    State?: string,
    Value?: {
        TableProperties?: any[]
    } 
}

export const ConnectionsDataGrid = (props: ConnectionDataGridProps) => {
    const providerCardQuery = useQuery([labels.entities.ProviderInstance, "Card", props.filter], () => Fetcher.fetchData("GET", "/providerCardView", { IsVisibleOnUI: true, ...props.filter }))
    const history = useHistory()
    const setModuleContext = React.useContext(SetModuleContextState)
    const [executionId, setExecutionId] = React.useState<string | undefined>()
    const onClickConnectionCard = (selectedConnectionId: string) => history.push(generatePath(DATA_CONNECTION_DETAIL_ROUTE, { ProviderInstanceId: selectedConnectionId }));
    const [rows, setRows] = React.useState<DataGridRow[]>([])
    const [actionExecutionFailed, setActionExecutionFailed] = React.useState(false)
    const [syncActionExecutionConfig, setSyncActionExecutionConfig] = React.useState<{
        creatingExecution: boolean,
        polling: boolean,
        queryEnabled: boolean
    }>({creatingExecution: false, polling: false, queryEnabled: false})

    const [tablesSynced, setTablesSynced] = React.useState<number | undefined>()
    
    const actionExecutionDetailQuery = FetchActionExecutionDetails({actionExecutionId: executionId, queryOptions: {
        enabled: syncActionExecutionConfig.queryEnabled
    }})

    const syncyProviderMutation = useSyncProviderInstance({
        mutationOptions: {
            onMutate: () => {
                setSyncActionExecutionConfig({
                    creatingExecution: true,
                    polling: false,
                    queryEnabled: false
                })
                setTablesSynced(undefined)
            },
            onSettled: () => {
                setSyncActionExecutionConfig({
                    creatingExecution: false,
                    polling: true,
                    queryEnabled: true
                })
            }
        }
    })

    React.useEffect(() => {
        const actionStatus = actionExecutionDetailQuery.data?.ActionExecution?.Status
        if(actionStatus === ActionExecutionStatus.FAILED || actionStatus === ActionExecutionStatus.COMPLETED) {
            setSyncActionExecutionConfig(config => ({
                ...config,
                queryEnabled: false
            }))
            if(actionStatus === ActionExecutionStatus.FAILED) {
                setActionExecutionFailed(true)
            } else {
                const aeOutput = JSON.parse(actionExecutionDetailQuery.data?.ActionExecution?.Output || "{}") as SyncActionExecutionOutput
                setTablesSynced(aeOutput?.Value?.TableProperties?.length || 0)
            }
        }
    }, [actionExecutionDetailQuery.data])

    React.useEffect(() => {
        if(!!providerCardQuery.data){
            setRows(providerCardQuery.data)
        }
    }, [providerCardQuery.data])

    React.useEffect(() => {
        if(props.showSyncStatus && !!providerCardQuery.data) {
            setModuleContext({
                type: 'SetHeader',
                payload: {
                    newHeader: {
                        Title : providerCardQuery.data?.[0]?.ProviderInstance?.Name,
                        SubTitle: providerCardQuery?.data?.[0]?.ProviderDefinition?.UniqueName
                    }
                }
            })
        }
    }, [providerCardQuery.data])

    const handleForceSync = (providerInstanceId?: string) => {
        const executionId = uuidv4()
        setExecutionId(executionId)
        syncyProviderMutation.mutate({
            providerInstanceId: providerInstanceId,
            syncDepthConfig: {
                providerSyncAction: true,
                SyncDepth: "TablesAndColumns"
            },
            withExecutionId: executionId,
            recurrenceConfig: {}
        })
    }

    const handleCellClick = (params: GridCellParams<any, DataGridRow, any>) => {
        if(params.field !== "Connection" && params.field !== "DefaultConnection" && params?.row?.providerName!=="LocalDB") {
            history.push(generatePath(DATA_CONNECTION_DETAIL_ROUTE, { ProviderInstanceId: params.row.ProviderInstance?.Id || "NA" }))
        }
    }

    const dataGridProps: DataGridProps = {
        columns: [
            {
                field: "connectionName",
                headerName: "Name",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <TextCell text={params.row?.providerName} />,
                flex: 1,
                minWidth: 100
            },
            {
                field: "DataSource",
                headerName: "Data Source",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <DataSourceCell providerName={params.row?.ProviderDefinition?.UniqueName} />,
                flex: 1,
                minWidth: 200
            },
            {
                field: "Details",
                headerName: "Details",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <DetailsCell numberOfTables={params.row?.ProviderInstanceStat?.NumberOfTables} providerType={params.row?.ProviderDefinition?.ProviderType}/>,
                flex: 1,
                width: 50
            },
            {
                field: "LastSyncedOn",
                headerName: "Last Synced On",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <TimestampCell timestamp={params.row?.ProviderInstanceStat?.LastSyncedOn}/>,
                flex: 1,
                minWidth: 200
            },
            {
                field: "Connection",
                headerName: "Scheduler and Sync",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <ConnectionCell providerInstance={params?.row?.ProviderInstance} handleForceSync={handleForceSync} syncActionInstance={params?.row?.SyncActionInstance}/>,
                flex: 1,
                width: 300
            },
            {
                field: "JobStatus",
                headerName: "Job Status",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <JobStatusCell providerStats={params?.row?.ProviderInstanceStat} />,
                flex: 2,
                minWidth: 200
            },
            {
                field: "SyncStatus",
                headerName: "Syncing Status",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <SyncStatusCell  providerStats={params?.row?.ProviderInstanceStat}/>,
                flex: 2,
                minWidth: 200,
                hide: !props.showSyncStatus
            },
            {
                field: "DefaultConnection",
                headerName: "Default Connection",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <DefaultProviderCell providerInstance={params?.row?.ProviderInstance!}/>,
                flex: 1,
                minWidth: 100
            }
            
        ],
        rows: rows?.map(row => ({...row, id: row.ProviderInstance?.Id, providerName: row.ProviderInstance?.Name})) || [],
        autoHeight: true,
        sx: {
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},    backgroundColor: 'ActionCardBgColor.main',
            backgroundBlendMode: "soft-light, normal",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
            borderRadius: "10px"
        },
        disableSelectionOnClick: true,
        headerHeight: 70,
        rowsPerPageOptions: [5, 10, 25, 50, 100, 200],
        onCellClick: handleCellClick,
        hideFooterSelectedRowCount: true,
        initialState: {
            pagination: {
                pageSize: 10
            }
        },
        rowHeight: 90
    }
    
    return (
                <ReactQueryWrapper
                    isLoading={providerCardQuery.isLoading}
                    error={providerCardQuery.error}
                    data={providerCardQuery.data}
                    children={() => (
                <Box sx={{minWidth: '100%'}}>
                    <DataGrid {...dataGridProps} components={{
                                    NoRowsOverlay: () => (
                                    <Stack height="100%" fontSize="18px" alignItems="center" justifyContent="center">
                                        No Content ... Sorry !!!!
                                    </Stack>
                                    ),
                                    LoadingOverlay: () => (
                                        <Stack height="100%" fontSize="18px" alignItems="center" justifyContent="center">
                                            Table is Loading.....
                                        </Stack>
                                    )
                                }}/>
                    <Dialog open={syncActionExecutionConfig.creatingExecution} onClose={() => setSyncActionExecutionConfig(config => ({...config, creatingExecution: false}))} fullWidth maxWidth="xl">
                        <LoadingIndicator/>
                    </Dialog>
                    <Dialog open={syncActionExecutionConfig.polling} fullWidth maxWidth="sm">
                        <DialogTitle sx={{display: 'flex', justifyContent: 'center'}}>
                            <Grid item xs={6} sx={{display: 'flex', alignItems: 'center'}}>
                                <Typography variant="heroHeader" sx={{
                                    fontFamily: "'SF Pro Text'",
                                    fontStyle: "normal",
                                    fontWeight: 500,
                                    fontSize: "18px",
                                    lineHeight: "160%",
                                    letterSpacing: "0.15px"}}
                                >
                                    Syncing Connection
                                </Typography>
                            </Grid>
                            <Grid item xs={6} style={{display: 'flex', justifyContent: 'flex-end'}} onClick={() => setSyncActionExecutionConfig(config => ({...config, polling: false}))}>
                                <IconButton aria-label="close" >
                                    <CloseIcon/>
                                </IconButton>
                            </Grid>
                        
                        </DialogTitle>
                        <DialogContent sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3}}>
                            {tablesSynced !== undefined ? (
                                <Typography variant="heroMeta" sx={{fontSize: '30px'}}>
                                    {tablesSynced !==0 ? (
                                        <span>Connecting <b>{tablesSynced}</b> Tables</span>
                                    ) : (
                                        <span>Sync Complete</span>
                                    )}
                                    
                                </Typography>
                            ) : (
                                <React.Fragment>
                                    {actionExecutionFailed ? (
                                        <ViewFailedActionExecution actionExecutionDetail={actionExecutionDetailQuery.data || {}} />
                                    ) : (
                                        <LoadingIndicator/>
                                    )}
                                    
                                </React.Fragment>
                            )}
                            
                        </DialogContent>
                    </Dialog>
                </Box>
                 )}
                 />
            
    )
}

export const DataSourceCell = (props: {providerName?: string}) => {
    return (
        <Box sx={{display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ProviderIcon providerUniqueName={props.providerName} height={35} width={35}/>
            <TextCell text={props.providerName} />
        </Box>
    )
}

export const DetailsCell = (props: {numberOfTables?: number, providerType?: string}) => {
    const relatedEntity = props.providerType === 'DBTRepo' ? 'Application' : 'Table'
    return (
        <Typography variant="tableBrowserContent">
            {props.providerType === 'DBTRepo' ? (
                <></>
            ) : (
                <span>{relatedEntity} <b>{props.numberOfTables}</b></span>
            )}
            
        </Typography>
    )
}



export const ConnectionCell = (props: {providerInstance?: ProviderInstance, syncActionInstance?: ActionInstance, handleForceSync: (providerInstanceId?: string) => void}) => {
    const queryClient = useQueryClient()
    const updateActionInstanceMutation = useUpdateSyncActionInstance({})
    const deleteActionInstanceMutation = useDeleteActionInstance({
        mutationOptions: {
            onSuccess: () => queryClient.invalidateQueries([labels.entities.ProviderInstance, "Card"])
        }
    })
    const deleteActionHandler =()=>{
        deleteActionInstanceMutation.mutate({
            filter: {Id: props.syncActionInstance?.Id},
            hard: true
        })
        handleDialogClose()
    }
    const [createActionInstanceDialog, setCreateActionInstanceDialog] = React.useState(false)
    const syncProviderInstanceScheduled = useSyncProviderInstance({
        mutationOptions: {
            onSuccess: () => {
                queryClient.invalidateQueries([labels.entities.ProviderInstance, "Card"])
                setCreateActionInstanceDialog(false)
            }
        }
    })
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const handleDialogClose = () => setDialogOpen(false)
    const handleDialogOpen = () => setDialogOpen(true)
    const [recurrenceInterval, setRecurrenceInterval] = React.useState<number | undefined>()
    
    const handleUpdateActionInstance = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.checked) {
            if(!!props.syncActionInstance) {
                updateActionInstanceMutation.mutate({
                    newProperties: {IsRecurring: true},
                    filter: {Id: props.syncActionInstance?.Id}
                })
            } else {
                setCreateActionInstanceDialog(true)
                // props?.handleCreateSyncActionInstance?.(props.providerInstance?.Id)
                
            }
        } else {
            if(!!props.syncActionInstance){
                handleDialogOpen()
            }
        }
    }

    const handleForceSync = () => {
        props.handleForceSync(props.providerInstance?.Id)
    }

    const handleRecurrenceChange = (recurrence: number) => {
        setRecurrenceInterval(recurrence > 0 ? recurrence * 60 : undefined)
    }
    
    const handleCreateSyncActionInstance = () => {
        syncProviderInstanceScheduled.mutate({
            providerInstanceId: props.providerInstance?.Id,
            syncDepthConfig: {
                providerSyncAction: true,
                SyncDepth: "TablesAndColumns",
            },
            recurrenceConfig: {
                recurrent: true,
                Interval: recurrenceInterval,
                CopyActionInstanceIdInConfig: true
            }
        })

    }
    let syncing_flag=0
    const getIcon=()=>{
        if(syncing_flag==1){ return (
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
                <SyncIcon/>
            </Box>
        )}else{
            return(
                <Box sx={{
                    height: "24px", 
                    width: "24px"
                }}>
                    <SyncIcon/>
                </Box>
            )
        }
    }
 
    

    return (
        <Box sx={{width: '100%', display: 'flex', gap: 2, px:1}}>
            <Dialog open={createActionInstanceDialog} fullWidth maxWidth="md">
                <DialogTitle sx={{display: 'flex', justifyContent: 'center'}}>
                    <Grid item xs={6} sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography variant="heroHeader" sx={{
                            fontFamily: "'SF Pro Text'",
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "18px",
                            lineHeight: "160%",
                            letterSpacing: "0.15px"}}
                        >
                            Schedule Sync {props.providerInstance?.Name}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <IconButton aria-label="close" onClick={() => setCreateActionInstanceDialog(false)}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                </DialogTitle>
                <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    <TextField fullWidth sx={{height: '100%', m: 1}} label="Recurrence Interval in Minutes" type="number" onChange={(event) => handleRecurrenceChange(event.target.value as unknown as number)}/>
                    <Box sx={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                        {syncProviderInstanceScheduled.isLoading ? (
                            <LoadingIndicator/>
                        ) : (
                            <Button variant="outlined" disabled={!!!recurrenceInterval} onClick={handleCreateSyncActionInstance}>Schedule</Button>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
            <ConfirmationDialog
                messageHeader={'Turn off Sync'}
                messageToDisplay={`Are you sure you want to turn off sync ? This may result in runtime failure for all linked scheduled actions and flows with the connection.`}
                acceptString={'Turn off'}
                declineString={'Cancel'}
                dialogOpen={dialogOpen}
                onDialogClose={handleDialogClose}
                onAccept={deleteActionHandler}
                onDecline={handleDialogClose}
            />

            <Tooltip title="Sync Scheduled">
                <FormGroup>
                    <FormControlLabel control={
                        <Switch 
                            disabled={deleteActionInstanceMutation.isLoading}
                            checked={props.syncActionInstance?.IsRecurring || false}
                            onChange={handleUpdateActionInstance}
                        />}  label=""/>
                </FormGroup>
            </Tooltip>
            <Tooltip title="Sync now">
                <IconButton onClick={handleForceSync} >
                    {getIcon()}
                </IconButton>
            </Tooltip>
            
        </Box>
    )
}


export const JobStatusCell = (props: {providerStats?: ProviderInstanceStat}) => {
    return (
        <Box sx={{display: 'flex', gap: 3, minWidth: '100%'}}>
            <StatusCard text={props.providerStats?.NumberOfRunningExecutions || 0} background='statusCardBgColor1.main' title='Running'/>
            <StatusCard text={props.providerStats?.NumberOfFailedExecutions || 0} background='statusCardBgColor2.main' title='Failed'/>
            <StatusCard text={props.providerStats?.NumberOfCompletedExecutions || 0} background='statusCardBgColor3.main' title='Completed'/>
        </Box>
    )
}

const SyncStatusCell = (props: {providerStats?: ProviderInstanceStat}) => {
    return (
        <Box sx={{display: 'flex', gap: 3, minWidth: '100%'}}>
            <StatusCard text={props.providerStats?.SyncRunning || 0} background='statusCardBgColor1.main' title='Active'/>
            <StatusCard text={props.providerStats?.SyncFailed || 0} background='statusCardBgColor2.main' title='Errors'/>
            <StatusCard text={props.providerStats?.SyncCompleted || 0} background='statusCardBgColor3.main' title='Successful'/>
        </Box>
    )
}


export const StatusCard = (props: {background: string, text: string | number, title?: string}) => {
    return (
        <Tooltip title={props.title || ""}>
            <StatusCardOnly sx={{ backgroundColor: props.background }}>
                <StatusCardTypography>    
                    {props.text} {props.title}
                </StatusCardTypography>
            </StatusCardOnly>
        </Tooltip>
    )
}

const StatusCardOnly = styled(Card)<CardProps>(({ theme }) => ({
    width: "100px",
    height: "36px",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: "0.439891px solid #FFFFFF",
    boxShadow: "0px 5px 10px rgba(54, 48, 116, 0.3)",
    borderRadius: "26.3934px"
}))

const StatusCardTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    fontFamily: "'SF Pro Display'",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "11.5435px",
    lineHeight: "160%",
    letterSpacing: "0.0961957px",
    color: "cardInfoFormCreatedByStringColor.main"
}))

export const DefaultProviderCell = (props: {providerInstance: ProviderInstance}) => {
    const queryClient = useQueryClient()
    const updateProviderInstanceMutation = useMutation(
        (config: {isDefaultProvider: boolean}) => Fetcher.fetchData("PATCH", "/updateProviderInstance", {filter: {Id: props.providerInstance.Id}, newProperties: {IsDefaultProvider: config.isDefaultProvider}}),
        {
            onSuccess: () => queryClient.invalidateQueries([labels.entities.ProviderInstance, "Card"])
        }
    )

    const handleDefaultProviderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateProviderInstanceMutation.mutate({isDefaultProvider: event.target.checked})
    }

    return (
        <Box sx={{ml:5}}>
            <Tooltip title="Default Provider">
                <FormGroup>
                    <FormControlLabel control={
                        <Switch 
                            disabled={updateProviderInstanceMutation.isLoading}
                            checked={props.providerInstance?.IsDefaultProvider || false}
                            onChange={handleDefaultProviderChange}
                        />}  label=""/>
                </FormGroup>
            </Tooltip>
        </Box>
    )
}