import React from 'react'
import {useMutation} from 'react-query'

import {Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Tooltip} from '@material-ui/core'
import {DataGrid} from "@material-ui/data-grid";
import {makeStyles} from "@material-ui/styles";
import CloseIcon from '@material-ui/icons/Close';
import {useHistory, useRouteMatch} from 'react-router-dom'
import dataManagerInstance, {useRetreiveData} from './../../../data_manager/data_manager'
import labels from './../../../labels/labels'

import LoadingIndicator from '../../../common/components/LoadingIndicator'
import NoData from '../../../common/components/NoData'
import {PageHeader} from "../../../common/components/header/PageHeader";
import '../../../css/table_browser/TableBrowser.css'
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {CustomToolbar} from "../../../common/components/CustomToolbar";


// Styles
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
    },
    dialogPaper: {
        minWidth: 500
    },
    disabledButton: {
        background: "#classes"
    }
}));

const AllApplicationView = (props) => {
    const classes = useStyles()

    const [apps, setApps] = React.useState([])
    const [selectedAppIds, setSelectedAppIds] = React.useState([])
    const {isLoading: allApplicationLoading, error: allApplicationError, data: allApplicationData, isFetching} = useRetreiveData(
        "Application", {
            "filter": {}, "AllApplicationView": true
        })
    
    const match = useRouteMatch();
    
    React.useEffect(() => {setApps((allApplicationData||[]))}, [allApplicationData, isFetching])
    // DataGrid Columns
    const columns = [
        {
            field: "Name",
            headerName: "Name",
            description: `Application Name`,
            sortable: true,
            flex: 1,
        },
        {
            field: "Version",
            headerName: "Version",
            description: `Application Version`,
            sortable: true,
            flex: 1,
        },
        {
            field: "Actions",
            headerName: "Actions",
            description: `Contained Actions`,
            sortable: true,
            flex: 1,
        },
        {
            field: "Tags",
            headerName: "Tags",
            description: `Contained Tags`,
            sortable: true,
            flex: 1,
        }
    ];

    const deleteSelectedApplication = () => {
        deleteApplicationMutation.mutate(
            selectedAppIds,
            {
                onSuccess: (data, variable, context) => {
                    const deletedAppIds = data.map(x => x.Id)
                    setApps((oldApps) => {
                        return oldApps.filter(app => !deletedAppIds.includes(app.Id))
                    })
                }
            }
        )
    }

    const deleteApplicationMutation = useMutation("DeleteApplication", 
        (appIds) => {
            const deletedApps = dataManagerInstance.getInstance.deleteData(labels.entities.APPLICATION,
                {
                    filter: {},
                    DeleteMultipleById: true,
                    Ids: appIds,
                    Soft: true
                }
            )
            return deletedApps
        }
    )

    if(allApplicationLoading){
        return <LoadingIndicator/>
    } else if(allApplicationError) {
        return <NoData/> 
    } else {
        return(
            <Grid container>
                <Grid item xs={12}>
                    <PageHeader path={match.path} url={match.url}/>
                </Grid>
                <DataGrid
                    selectionModel={selectedAppIds}
                    onSelectionModelChange={(rowIds) => {
                        setSelectedAppIds(rowIds)
                    }}
                    components={{
                        Toolbar: CustomToolbar([
                        <Tooltip title="Delete Applications">
                            <IconButton
                                color="primary"
                                aria-label="Delete Applications"
                                component="span"
                                onClick={deleteSelectedApplication}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>,
                        ])
                    }}
                    autoHeight
                    autoPageSize
                    checkboxSelection
                    disableSelectionOnClick
                    columns={columns}
                    onCellClick={() => {}}
                    rows={apps.map(application => {
                        return {...application, id: application.Id}
                    })}
                />
            </Grid>
        )
    }
}

export default AllApplicationView;