import React from 'react'
import {createSvgIcon, Grid, IconButton, Snackbar, Tooltip} from '@mui/material'
import {useHistory, useRouteMatch} from 'react-router-dom'
import {formDateOrReturnDefault, formTimeStampOrReturnDefault, getExecutionTime, getStatusIndicatorComponent} from './JobsRow'
import {useMutation, useQueryClient} from 'react-query'
import LoadingIndicator from '../../../common/components/LoadingIndicator'
import NoData from './../../../common/components/NoData'
import dataManagerInstance, {
    usePrefetchMultipleRetreiveData,
    useRetreiveData
} from './../../../data_manager/data_manager'
import labels from './../../../labels/labels'
import * as PropTypes from "prop-types";
import {DataGrid} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import {CustomToolbar} from "../../../common/components/CustomToolbar";
import { Alert } from '../../../common/components/Alert';

const columns = [
    {
        field: "ActionInstanceName",
        headerName: "Action Instance Name",
        description: `Action Instance Name of data set`,
        sortable: true,
        flex: 1,
        valueGetter: (cell) => cell?.value || "Queued Task"
    }, {
        field: "ScheduledTime",
        headerName: "Created",
        description: `Creation Time of Action`,
        sortable: true,
        flex: 1,
        valueGetter: (cell) => formTimeStampOrReturnDefault(cell?.value, "NA"),
    }, {
        field: "ExecutionCompletedOn",
        headerName: "Completed",
        description: `Completion Time of Action`,
        sortable: true,
        flex: 1,
        valueGetter: (cell) => formTimeStampOrReturnDefault(cell?.value, "NA"),
    }, {
        field: "Duration",
        headerName: "Duration",
        description: `Runtime Duration of Action`,
        sortable: true,
        flex: 1,
        valueGetter: (params) => getExecutionTime(params.row),
    }, {
        field: "Id",
        headerName: "Id",
        description: `Id of data set`,
        hide: true
    }, {
        field: "InstanceId",
        headerName: "ActionInstanceName",
        description: `ActionInstanceName of data set`,
        sortable: true,
        flex: 1,
        hide: true
    }, {
        field: "Status",
        headerName: "Status",
        description: `Status of data set`,
        sortable: true,
        flex: 1,
        renderCell: (cell) => getStatusIndicatorComponent(cell?.value)
    }
]


export function JobsHeader(props) {
    return <Grid container spacing={0}>
        <Grid item xs={12} className={props.classes.grid_root}>
            <Grid container spacing={2}>
                <Grid xs={12} spacing={2} container className="grid_root" justifyContent="flex-end">
                    <Tooltip title="Delete">
                        <IconButton
                            onClick={props.onClick1}
                            color="secondary"
                            aria-label="Delete"
                            component="span"
                        >
                            <DeleteIcon/>
                        </IconButton></Tooltip>
                </Grid>
            </Grid>
        </Grid>
    </Grid>;
}

JobsHeader.propTypes = {
    classes: PropTypes.any,
    filterOptionHandler: PropTypes.func,
    filterOption: PropTypes.any,
    searchQueryHandler: PropTypes.func,
    searchValue: PropTypes.any,
    onClick: PropTypes.func,
    buttonState: PropTypes.shape({mode: PropTypes.number}),
    selectallmode: PropTypes.number,
    onClick1: PropTypes.func
};


export function JobsFiltered(props) {
    const actionProperties = {...props.actionProperties, "excludeExecutionOutput": true}
    console.log(actionProperties)
    const jobsKey = [labels.entities.ActionExecution,
        actionProperties];
    const {isLoading, error, data = [], isFetched} = useRetreiveData(...jobsKey);
    const statuses = [
        "Completed",
        "Created",
        "Started",
        "WaitingForUpstream",
        "Failed",
        "WorkflowRunning"
    ];

    usePrefetchMultipleRetreiveData(statuses.filter(status => status !== props.actionProperties.filter.Status).map((Status) => [
        labels.entities.ActionExecution,
        {
            "filter": {
                Status
            },
            "columnsToRetrieve": [
                {
                    UniqueName: "ActionInstanceName"
                },
                {
                    UniqueName: "ScheduledTime"
                },
                {
                    UniqueName: "ExecutionCompletedOn"
                },
                {
                    UniqueName: "Id"
                },
                {
                    UniqueName: "InstanceId"
                },
                {
                    UniqueName: "Status"
                }
            ],
            "excludeExecutionOutput": true
        }
    ]), !!isFetched);
    const searchValue = props?.location?.state?.search ?? ""
    const filter = props?.location?.state?.filter ?? "Action Instance Name"



    const [filterOption] = React.useState(filter)
    const [actionExecutionsSelected, setActionExecutionsSelected] = React.useState([])
    const [notificationState, setNotificationState] = React.useState({open: false})
    const searchResults = () => {
        return data.map((d) => ({...d, id: d.Id}));
    }

    const toggleSelectActionExecutionWithId = React.useCallback(
        actionExecutionId => {
            setActionExecutionsSelected(old => {
                if (old.findIndex(elem => elem === actionExecutionId) === -1) {
                    return [...old, actionExecutionId]
                } else {
                    return old.filter(id => id !== actionExecutionId)
                }
            })
        }, []
    )
    const queryClient = useQueryClient();
    const deleteSelectedEntities = () => {
        deleteActionExecutionJobBaseMutation.mutate(actionExecutionsSelected, {
            onSuccess: () => {
                queryClient.setQueryData(jobsKey, (data) => data.filter(oldActionExecution => actionExecutionsSelected.findIndex(Id => Id === oldActionExecution.Id) < 0));

                setActionExecutionsSelected(old => {
                    setNotificationState({
                        open: true,
                        severity: "success",
                        message: `${old.length} Action Run(s) Deleted`
                    });
                    return old.filter(id => id === undefined)
                })
            },
            onError: () => {
                setNotificationState({
                    open: true,
                    severity: "error",
                    message: `${actionExecutionsSelected.length} Action Run(s) Deletetion Failed`
                });
            }
        })
    }


    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationState({open: false});
    };

    const match = useRouteMatch()

    const deleteActionExecutionJobBaseMutation = useMutation((actionExecutionIds) => {

        const deleteFunc = dataManagerInstance.getInstance.deleteData(labels.entities.ActionExecution, {
            filter: {},
            DeleteMultipleById: true,
            Ids: actionExecutionIds,
            Soft: true
        })
        let response = deleteFunc.then(res => res)
        return response
    })


    
    const history = useHistory();
    if (isLoading) {
        return (<LoadingIndicator/>)
    } else if (error) {
        return (<NoData/>)
    } else {
        return (
            <React.Fragment>
                <Snackbar open={notificationState.open} autoHideDuration={4000} onClose={handleNotificationClose}>
                    <Alert onClose={handleNotificationClose} severity={notificationState.severity}>
                        {notificationState.message}
                    </Alert> 
                </Snackbar>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div id="jobs-container">
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <DataGrid
                                        components={{
                                            Toolbar: CustomToolbar([
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        onClick={deleteSelectedEntities}
                                                        color="primary"
                                                        aria-label="Delete"
                                                        component="span"
                                                    >
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                            ]),
                                        }}                        
                                        onSelectionModelChange={(params) => {
                                            toggleSelectActionExecutionWithId(params[params?.length - 1]);
                                        }}
                                        autoHeight
                                        pagination
                                        pageSize={10}
                                        rowsPerPageOptions={[10]}
                                        checkboxSelection
                                        disableSelectionOnClick
                                        columns={columns}
                                        rows={searchResults()}
                                        onRowClick={(params) => {
                                            history.push(`${match.url}/${params.row.Id}`)
                                        }}

                                        sx={{
                                            "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},
                                            // background: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%)",
                                            backgroundColor: 'ActionCardBgColor.main',
                                            backgroundBlendMode: "soft-light, normal",
                                            border: "2px solid rgba(255, 255, 255, 0.4)",
                                            boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
                                            borderRadius: "10px"
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}
