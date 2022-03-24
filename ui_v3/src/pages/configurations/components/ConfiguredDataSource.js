import React, {useState} from 'react'
import {Box, Dialog, Grid, IconButton, Link, Snackbar, Tooltip} from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import ConfiguredDataSourceRow from './ConfiguredDataSourceRow'
import {useMutation} from 'react-query'
import LoadingIndicator from '../../../common/components/LoadingIndicator'
import labels from './../../../labels/labels'
import dataManagerInstance, {useRetreiveData} from './../../../data_manager/data_manager'
import useStyles from './../../../css/configurations/ConfiguredDataSource'
import {Route, Switch, useHistory, useRouteMatch, withRouter} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {PageHeader} from "../../../common/components/header/PageHeader";
import CreateDataSource from "./CreateDataSource";
import {CustomToolbar} from "../../../common/components/CustomToolbar";
import {Alert} from '../../../common/components/Alert';
import SyncIcon from "@mui/icons-material/Sync";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PreviewIcon from "@mui/icons-material/Preview";
import {DATA_CONNECTIONS_ROUTE} from "../../../common/components/header/data/DataRoutesConfig";
import {BaseCard} from "../../../common/components/basecard/BaseCard";
import {ConnectionCard} from "../../data/components/connections/ConnectionCard";
import {ButtonIconWithToolTip} from "../../../common/components/ButtonIconWithToolTip";

const filterOptionsMap = {
    "Instance Name": "Name",
    "Id": "Id"

}
const filterOptionItems = [
    {
        "value": "Instance Name",
        "display": "Instance Name"
    },
    {
        "value": "Id",
        "display": "Id"
    }
]

export const ConfiguredDataSourceInternal = (props) => {
    const classes = useStyles()
    const history = useHistory();
    const [searchQuery, setSearchQuery] = React.useState(props.searchValue)
    const [filterOption, setFilterOption] = React.useState("Instance Name")
    const [displayData, setDisplayData] = React.useState({data: [], displayCount: 10})
    const [providerInstancesSelected, setProviderInstancesSelected] = React.useState([])
    const [notificationState, setNotificationState] = React.useState({open: false})
    const match = useRouteMatch();
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const body = (
        <Box sx={{p: 3}}>
            <CreateDataSource handleClose={handleClose}/>
        </Box>
    );
    const queryKey = "ConfiguredProviders"

    const {isLoading, error, data} = useRetreiveData(labels.entities.ProviderInstance, {
        "filter": {},
        "onlyDataSource": true
    })

    const deleteProviderInstanceMutation = useMutation((tablePropertiesId) => {

        const config = dataManagerInstance.getInstance.deleteData(labels.entities.ProviderInstance, {
            filter: {},
            DeleteMultipleById: true,
            Ids: tablePropertiesId,
            Soft: true
        })

        let response = config.then(res => res.json())
        return response
    })

    const toggleSelectProviderInstanceWithId = React.useCallback(
        actionExecutionId => {
            setProviderInstancesSelected(old => {
                if (old.findIndex(elem => elem === actionExecutionId) === -1) {
                    return [...old, actionExecutionId]
                } else {
                    return old.filter(id => id !== actionExecutionId)
                }
            })
        }, []
    )

    const deleteSelectedEntities = (providerInstancesSelected) => {
        console.log("Deleting", providerInstancesSelected)
        deleteProviderInstanceMutation.mutate(providerInstancesSelected, {
            onSuccess: () => {
                setDisplayData(oldData => {
                    return {
                        ...oldData,
                        data: oldData.data.filter(oldProviders => providerInstancesSelected.findIndex(Id => Id === oldProviders.Id) < 0)
                    }
                })
                setProviderInstancesSelected(old => {
                    setNotificationState({
                        open: true,
                        severity: "success",
                        message: `${old.length} Action Run(s) Deleted`
                    });
                    return old.filter(id => id === undefined)
                })
                console.log("Deleted Successfully")
            },
            onError: () => {
                setNotificationState({
                    open: true,
                    severity: "error",
                    message: `${providerInstancesSelected.length} Action Run(s) Deletetion Failed`
                });
            }
        })
    }

    const selectAll = () => {
        setProviderInstancesSelected(displayData.data.map(providerInstance => providerInstance.Id))
    }

    const removeAll = () => {
        setProviderInstancesSelected([])
    }

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationState({open: false});
    };

    React.useEffect(() => {
        setDisplayData(old => {
            return {...old, data: data || []}
        })
    }, [data, isLoading])

    const searchQueryHandler = (event) => {
        setSearchQuery(event.target.value)
    }

    const filterOptionHandler = (event) => {
        setFilterOption(event.target.value)
    }

    const searchResults = (myData) => {

        const filterKey = filterOptionsMap[filterOption]
        const arr = myData?.filter(elem => {
            if (elem.Name !== undefined)
                return elem?.[filterKey]?.toLowerCase()?.search(searchQuery?.toLowerCase()) >= 0 || searchQuery === ""
            else
                return false
        })
        return arr
    }
    const rows = searchResults(displayData.data)?.map(row => {
        const model = row || {};
        model.id = model.Id;
        return model;
    });
    const columns = [
        {
            field: "Name",
            headerName: "Name",
            description: `UniqueName of Data Source`,
            sortable: true,
            flex: 1,
        }, {
            field: "Id",
            headerName: "Id",
            description: `Id`,
            sortable: true,
            flex: 1,
        }, {
            field: "CreatedOn",
            headerName: "CreatedOn",
            description: `Description`,
            sortable: true,
            flex: 1,
            renderCell: (params) => <span
                style={{fontSize: 16, alignItems: 'center', display: 'flex'}}>
                Created on {new Date(params.row.CreatedOn).toDateString()}
            </span>
        }, {
            field: "SourceURL",
            headerName: "Source URL",
            description: `Source URL`,
            sortable: true,
            flex: 1,
            renderCell: (params) => <Link href={params.row.SourceURL} target="_blank"
                                          rel="noreferrer"> {labels.CreateDataSourceRow.visit_provider} </Link>
        }, {
            field: "",
            headerName: "Actions",
            description: `Buttons to do actions on a data provider instance`,
            flex: 1,
            renderCell: (params) => <Box>
                <ButtonIconWithToolTip title={"sync this data source instance"} Icon={SyncIcon}
                                       onClick={() => alert('sync')}/>
                <ButtonIconWithToolTip title={"add a data source instance"} Icon={AddCircleIcon}
                                       onClick={() => alert('add')}/>
                <ButtonIconWithToolTip title={"delete data provider instance"} Icon={DeleteIcon}
                                       onClick={() => deleteSelectedEntities([params.row])}/>
                <ButtonIconWithToolTip title={"delete data provider instance"} Icon={PreviewIcon}
                                       onClick={() => alert('preview')}/>
            </Box>
        },
    ];
    if (isLoading) {
        return (<LoadingIndicator/>)
    } else if (error) {
        return (<div>Error</div>)
    } else {
        return (
            <>
                <Snackbar open={notificationState.open} autoHideDuration={4000} onClose={handleNotificationClose}>
                    <Alert onClose={handleNotificationClose} severity={notificationState.severity}>
                        {notificationState.message}
                    </Alert>
                </Snackbar>
                <Grid container gap={5}>
                    {rows?.map(card=><Grid item>
                        <ConnectionCard key={card.Id} {...card}/>
                    </Grid>
                    )}
                </Grid>

                {/*<Grid item xs={12}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        onSelectionModelChange={(params) => {
                            toggleSelectProviderInstanceWithId(params[params?.length - 1]);
                        }}
                        components={{
                            Toolbar: CustomToolbar([
                                <Tooltip title="Create data source">
                                    <IconButton
                                        onClick={handleOpen}
                                        color="primary"
                                        aria-label="Create data source"
                                        component="span"
                                    >
                                        <AddIcon/>
                                    </IconButton></Tooltip>,
                                <Tooltip title={labels.ConfiguredDataSource.delete}>
                                    <IconButton
                                        onClick={deleteSelectedEntities}
                                        color="primary"
                                        aria-label={labels.ConfiguredDataSource.delete}
                                        component="span"
                                    >
                                        <DeleteIcon/>
                                    </IconButton></Tooltip>
                            ])
                        }}
                        autoHeight
                        autoPageSize
                        checkboxSelection
                        disableSelectionOnClick
                        onRowClick={(params) => {
                            history.push(`${match.url}/${params.row.id}`)
                        }}
                    />
                    <Dialog
                        fullWidth
                        maxWidth="md"
                        onClose={handleClose}
                        open={open}
                    >
                        {body}
                    </Dialog>
                </Grid>*/}

            </>
        )
    }
}
const ConfiguredDataSource = withRouter(function ConfiguredDataSourceRoutes() {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={`${match.path}/:Id`} component={ConfiguredDataSourceRow}/>
            <Route path={DATA_CONNECTIONS_ROUTE} component={ConfiguredDataSourceInternal}/>
        </Switch>
    )
});
export default ConfiguredDataSource;