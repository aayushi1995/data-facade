import {Link, useHistory, useRouteMatch} from 'react-router-dom'

import {useMutation} from 'react-query'
import CloseIcon from '@material-ui/icons/Close';
import {Dialog, Grid, IconButton, Snackbar, Tooltip} from '@material-ui/core'
import CreateActionInstanceFormNew from './../../../common/components/CreateActionInstanceFormNew'
import './../../../css/table_browser/Row.css'
import dataManagerInstance from './../../../data_manager/data_manager'
import React from 'react';
import labels from './../../../labels/labels';
import {DataGrid} from "@material-ui/data-grid";
import {makeStyles} from "@material-ui/styles";
import SyncIcon from '@material-ui/icons/Sync';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {TABLE_CHECKS} from "../../table_details/TableDetails";
import {CustomToolbar} from "../../../common/components/CustomToolbar";
import { Alert } from '../../../common/components/Alert';

const rowStyle = {};
const cellStyle = {};
const useStyles = makeStyles(() => ({
    columnHeader: cellStyle,
    row: rowStyle,
    cell: cellStyle,
    iconText: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        aspectRatio: 1,
        fontSize: "0.85rem",
        lineHeight: 0.5
    }
}));


const getCellClassName = (classes) => (params) => {
    if (params.field === 'city') {
        return '';
    }
    return classes.cell;
};
const getRowClassName = (classes) => (params) => {
    return classes.row;
};

export const ButtonIconWithToolTip = ({
                                   title, onClick = () => {
    }, Icon
                               }) => <Tooltip title={title}>
    <IconButton
        onClick={onClick}
        color="primary"
        aria-label={title}
        component="span"
    >
        <Icon/>
    </IconButton></Tooltip>;
const DataSetsTable = (props) => {
    const classes = useStyles();
    const history = useHistory();

    const getLastFullSyncedOn = function (cell) {
        const value = cell?.value;
        if (value) {
            const fullSyncedOn = value

            if (isDummyRow(cell)) {
                return fullSyncedOn === undefined ? labels.TableBrowserRow.syncing : `Uploading ${new Date(value).toDateString()}`
            } else {
                return fullSyncedOn === undefined ? labels.TableBrowserRow.syncing : `${new Date(value).toDateString()}`
            }
        } else {
            return value;
        }
    }
    const hide = props.simplified;
    const columns = [
        {
            field: "TableUniqueName",
            headerName: "Name",
            description: `Name of data set`,
            sortable: true,
            flex: 1,
        }, {
            field: "FullSyncedOn",
            headerName: "Last Synced Date",
            description: `Data set last synced on`,
            sortable: true,
            flex: 0.5,
            valueGetter: getLastFullSyncedOn,
            hide
        }, {
            field: "CreatedBy",
            headerName: "Created By",
            description: `Data set Created by`,
            sortable: true,
            flex: 0.5,
            hide
        }, {
            field: "TotalExecutions",
            headerName: labels.TableBrowserRow.jobs,
            description: `Total Jobs`,
            sortable: true,
            flex: 0.3,
            hide,
            renderCell: (cell) => {
                return (<Link
                    style={{textDecoration: "none"}}
                    onClick={(e) => e.stopPropagation()}
                    to={{
                        pathname: '/jobs',
                        state: {
                            "search": cell?.row?.TableId,
                            "from": 'table_browser_row',
                            "filter": 'Table Id',
                            "tabIndex": 0
                        }

                    }}
                    className="link"
                >
                    <ButtonIconWithToolTip
                        title={`There are ${cell?.value} jobs on this data set`}
                        Icon={() => <span className={classes.iconText}>{cell?.value}</span>}/>
                </Link>);
            }
        }, {
            field: "Alerts",
            headerName: labels.TableBrowserRow.alerts,
            description: `Data set Alerts`,
            sortable: true,
            flex: 0.3,
            hide,
            renderCell: (cell => {
                return (<Link
                    onClick={(e) => e.stopPropagation()}
                    style={{textDecoration: "none"}}
                    to={{
                        pathname: '/alerts',
                        state: {
                            "search": cell?.row?.TableId,
                            "from": 'table_browser_row',
                            "filter": 'Table Id',
                            "tabIndex": 0
                        }

                    }}
                    className="link"
                >
                    <ButtonIconWithToolTip
                        title={`There are ${cell?.value} alerts on this data set`}
                        Icon={() => <span className={classes.iconText}>{cell?.value}</span>}/>
                </Link>);
            })
        },
        {
            field: "Checks",
            headerName: labels.TableBrowserRow.checks,
            description: `Data set Checks`,
            sortable: true,
            flex: 0.4,
            hide,
            renderCell: (cell => {
                return (<Link
                    onClick={(e) => e.stopPropagation()}
                    style={{textDecoration: "none"}}
                    to={{
                        pathname: `${match.url}/${cell.row.TableUniqueName}`,
                        state: {
                            "search": cell?.row?.TableId,
                            "from": 'table_browser_row',
                            "filter": 'Table Id',
                            "tabIndex": TABLE_CHECKS
                        }

                    }}
                    className="link"
                >
                    <ButtonIconWithToolTip
                        title={`There are ${cell?.value} checks on this data set`}
                        Icon={() => <span className={classes.iconText}>{cell?.value}</span>}/>
                </Link>);
            })
        },
        {
            field: "TableId",
            headerName: "Actions",
            description: `Actions on this data set`,
            sortable: true,
            flex: 0.4,
            hide,
            renderCell: (cell) => {
                return <>
                    <ButtonIconWithToolTip title={labels.TableBrowserRow.sync} Icon={SyncIcon}
                                           onClick={syncTable(cell)}/>
                    <ButtonIconWithToolTip title={labels.TableBrowserRow.add_action} Icon={AddCircleIcon}
                                           onClick={handleCreateActionInstanceOpen}/>

                    <Dialog onClose={handleCreateActionInstanceClose} open={createActionInstanceDialog} fullWidth
                            alignContent="flex-end">
                        <Grid item container justify="flex-end">
                            <IconButton aria-label="close" onClick={handleCreateActionInstanceClose}>
                                <CloseIcon/>
                            </IconButton>
                        </Grid>
                        <CreateActionInstanceFormNew fromTableBrowser={{
                            tableName: cell.row.TableUniqueName,
                            providerId: cell.row.ProviderInstanceID
                        }} onCloseDialog={handleCreateActionInstanceClose}/>
                    </Dialog>
                </>
            }
        }
    ];
    const [tablePropertiesSelected, setTablePropertiesSelected] = React.useState([])
    const [notificationState, setNotificationState] = React.useState({open: false})
    const [createActionInstanceDialog, setCreateActionInstanceDialog] = React.useState(false)

    const isDummyRow = (cell) => {
        return cell?.row?.TableId === undefined
    }
    let match = useRouteMatch();

    const resyncTablePropertiesMutation = useMutation((tablePropertiesIds) => {
        const resync = dataManagerInstance
            .getInstance
            .saveData(labels.entities.ActionExecution,
                {
                    entityProperties: {},
                    SyncColumns: true,
                    TableIds: tablePropertiesIds
                })

        let response = resync.then(res => res.json())
        return response
    })

    const handleNotificationClose = (event, reason) => {
        event?.stopPropagation();
        if (reason === 'clickaway') {
            return;
        }
        setNotificationState({open: false});
    };

    const handleCreateActionInstanceOpen = (e) => {
        e?.stopPropagation();
        setCreateActionInstanceDialog(true);
    }
    const handleCreateActionInstanceClose = (e) => {
        e?.stopPropagation();
        setCreateActionInstanceDialog(false)
    }


    const syncTable = (cell) => (event) => {
        event?.stopPropagation();
        const tablePropertiesSelected = [cell.row.TableId]
        console.log("ReSyncing", tablePropertiesSelected)
        resyncTablePropertiesMutation.mutate(tablePropertiesSelected, {
            onSuccess: () => {
                setTablePropertiesSelected(old => {
                    setNotificationState({
                        open: true,
                        severity: "success",
                        message: labels.TableBrowserRow.one_table_sync
                    });
                    return old.filter(id => id === undefined)
                })
                console.log("ReSynced Successfully")
            },
            onError: () => {
                setNotificationState({
                    open: true,
                    severity: "error",
                    message: `${tablePropertiesSelected.length} ${labels.TableBrowserRow.table_sync_failed}`
                });
            }
        })
    }

    const selectedRowColor = {
        margin: "0",
        minWidth: 700,
        overflowX: 'auto'
    }

    return (
        <>
            <Snackbar open={notificationState.open} autoHideDuration={4000} onClose={handleNotificationClose}>
                <Alert onClose={handleNotificationClose} severity={notificationState.severity}>
                    {notificationState.message}
                </Alert>
            </Snackbar>
            <DataGrid
                onSelectionModelChange={(params) => {
                    props.ToggleSelect(params[params?.length - 1]);

                }}
                components={{
                    Toolbar: CustomToolbar(props.toolBarButtons)
                }}
                autoHeight
                autoPageSize
                checkboxSelection={!hide}
                disableSelectionOnClick
                columns={columns}
                getRowClassName={getRowClassName(classes)}
                getCellClassName={getCellClassName(classes)}
                onRowClick={(params) => {
                    history.push(`${match.url}/${params.row.TableUniqueName}`)
                }}
                {...props}
            />
        </>
    )

}

function MemoizedDataSetsTable(props) {

    return React.useMemo(() => {
        return <DataSetsTable
            {...props}
        />
    }, [props])
}

export default MemoizedDataSetsTable