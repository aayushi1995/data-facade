import React from 'react'
import { Box, Container, Dialog, Grid, IconButton, Tooltip, Button, DialogTitle } from '@mui/material'
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from '@mui/material/Autocomplete';
import { PageHeader } from "../../../../common/components/header/PageHeader";
import { useHistory, useRouteMatch, Link } from 'react-router-dom'
import { makeStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { CustomToolbar } from "../../../../common/components/CustomToolbar";
import { TextField } from "@mui/material";
import dataManagerInstance, { useRetreiveData } from '../../../../data_manager/data_manager';
import LoadingIndicator from '../../../../common/components/LoadingIndicator';
import NoData from '../../../../common/components/NoData';
import DeleteIcon from "@mui/icons-material/Delete";
import {useMutation} from 'react-query'
import CustomApplicationsHomePage from '../CustomApplicationsHomePage';
import PreviewIcon from "@mui/icons-material/Preview";


const useStyles = makeStyles((theme) => {
    return ({
        disabledButton: {
            background: "#classes"
        },
        dialogPaper: {
            minWidth: 500
        },
        textField: {
            [`& fieldset`]: {
                borderRadius: 10,
            },
        },
        input: {
            color: `${theme.palette.text.primary}!important`
        }
    })
});

const columnFields = [
    {
        field: "DisplayName",
        headerName: "Application Name",
        description: `Name of the Custom Application`,
        sortable: true,
        flex: 1
    },
    {
        field: "CreatedBy",
        headerName: "Created By",
        description: "Customer Created By",
        sortable: true,
        flex: 1,
    },
    {
        field: "Description",
        headerName: "Description",
        sortable: true,
        editable: true,
        flex: 1
    },
    {
        field: "RunWorkflow",
        headerName: " ",
        flex: 0.5,
        renderCell: (props) => {
            return (<RunWorkflow {...props} />)
        }
    }
]

export const RunWorkflow = (props) => {
    
    const history = useHistory();
    return (
        <Grid>
            <IconButton
                color="primary"
                aria-label="Run workflow"
                // to={{pathname: `run-workflow/${props.id}`}}
                // component={Link}
                onClick={(e) => {
                    e.stopPropagation();
                    console.log(props)
                    // props?.api?.componentsProps.setTableSelectDialog()
                    // props?.api?.componentsProps?.setWorkflowIdToRun(props.id)
                    history.push(`/application/execute-workflow/${props.id}`)
                }}
            >
                <PlayArrowIcon />
            </IconButton>
            <Tooltip title="View Previous Worklow Instances">
                <IconButton
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        history.push(`view-workflow/${props.id}`)
                        // redirect to worklow instances
                    }}
                >
                    <PreviewIcon/>
                </IconButton>
            </Tooltip>
        </Grid>
    )
}

const CustomApplications = () => {
    const { isLoading, data: customApplications, errors } = useRetreiveData(
        "ActionDefinition",
        {
            filter: {
                ActionType: "Workflow"
            }
        }
    )

    const { isLoading: tableDataLoading, data: tableData, error: tableGetError } = useRetreiveData(
        "TableProperties",
        {
            filter: {

            }
        }
    )

    const deleteWorkflowsMutation = useMutation((workflowIds) => {

        const deleteFunc = dataManagerInstance.getInstance.deleteData("ActionDefinition", {
            filter: {},
            DeleteMultipleById: true,
            Ids: workflowIds,
            Soft: true
        })
        let response = deleteFunc.then(res => res)
        return response
    })

    const [openCreateDialog, setCreateDialog] = React.useState(false)
    const [tableSelectDialog, setTableSelectDialog] = React.useState(false)
    const [workflowIdToRun, setWorkflowIdToRun] = React.useState()
    const [selectedTable, setSelectedTable] = React.useState()
    const [selectedWorkflows, setSelectedWorkflows] = React.useState([])
    const [applications, setApplications] = React.useState()
    const classes = useStyles()
    const history = useHistory()
    const match = useRouteMatch();
    const [workflowName, setWorkflowName] = React.useState("name")

    React.useEffect(() => {
        setApplications(customApplications)
    }, [customApplications])

    const handleOpenDialog = () => {
        history.push('/build-workflow')
    }

    const handleDialogClose = () => {
        setCreateDialog(false)
    }

    const handleCellClick = (click) => {
        console.log(click)
        if (click.colDef?.field !== "Description") {
            history.push(`${match.url}/${click?.row?.Name}`)
        }
    }

    const handleTableSelectDialogClose = () => {
        setTableSelectDialog(false)
    }

    const handleOpenTableSelectDialog = () => {
        setTableSelectDialog(true)
    }

    const handleTableChange = (event, table) => {
        setSelectedTable(table)
    }

    const deleteSelectedEntities = () => {
        console.log(selectedWorkflows)
        deleteWorkflowsMutation.mutate(selectedWorkflows, {
            onSuccess: (data, variables, context) => {
                console.log("DELETED")
                var oldWorkflows = customApplications
                selectedWorkflows.forEach(adId => {
                    oldWorkflows = oldWorkflows.filter(workflow => workflow.Id !== adId)
                })
                setApplications(oldWorkflows)

            },
            onError: () => {
                console.log("ERROR")
            }
        })
    }

    if (applications) {
        const filteredActions = applications.filter(ad => ad.Id !== "20")
        return (
            <Grid container spacing={0}>
                <Dialog open={tableSelectDialog} onClose={handleTableSelectDialogClose} classes={{ paper: classes.dialogPaper }} scroll="paper" title="Select Table">
                    <Grid container>
                        <Grid item xs={11}>
                            <DialogTitle>Select Table</DialogTitle>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton aria-label="close" onClick={handleTableSelectDialogClose}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12}>
                            <Box m={1}>
                                <Autocomplete
                                    onChange={handleTableChange}
                                    getOptionLabel={table => table.DisplayName}
                                    disableClearable={true}
                                    selectOnFocus
                                    options={tableData}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Table Name"
                                            className={classes.textField}
                                            InputProps={{
                                                ...params?.InputProps,
                                                classes: {
                                                    input: classes.input
                                                }
                                            }}
                                        />
                                    )}
                                ></Autocomplete>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box p={1}>
                                <Button variant="contained" to={{
                                    pathname: `run-workflow/${workflowIdToRun}`, state: {
                                        tableMeta: selectedTable
                                    }
                                }} component={Link}>Run Workflow</Button>
                            </Box>
                        </Grid>

                    </Grid>
                </Dialog>
                <Dialog open={openCreateDialog} onClose={handleDialogClose} classes={{ paper: classes.dialogPaper }}
                    scroll="paper">
                    <Container>
                        <h2>
                            <Grid justifyContent="space-between" container>
                                <Grid item>Create Application</Grid>
                                <Grid item>
                                    <IconButton aria-label="close" onClick={handleDialogClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </h2>
                        <TextField
                            value={workflowName}
                            fullWidth
                            label="Application Name"
                            variant="outlined"
                            InputProps={{
                                classes: {
                                    input: classes.input
                                }
                            }}
                            onChange={(e) => {
                                setWorkflowName(e?.target?.value)
                            }}
                        />
                        <Box my={3}>
                            <Button variant="contained" to={{ pathname: "/workflow-editor", state: { name: workflowName } }} component={Link}>
                                Create
                            </Button>
                        </Box>
                    </Container>
                </Dialog>
                <Grid item xs={12}>
                    <PageHeader pageHeading={"Custom Applications List"} path={match.path} url={match.url} isApplication={false} />
                </Grid>
                <DataGrid
                    autoHeight
                    disableSelectionOnClick
                    autoPageSize
                    checkboxSelection
                    columns={columnFields}
                    onSelectionModelChange={(params) => {setSelectedWorkflows(params)}}
                    componentsProps={{
                        setTableSelectDialog: handleOpenTableSelectDialog,
                        setWorkflowIdToRun: setWorkflowIdToRun
                    }}
                    components={{
                        Toolbar: CustomToolbar([
                            <Tooltip title="Delete">
                                <IconButton
                                    color="primary"
                                    aria-label="Delete"
                                    component="span"
                                    onClick={deleteSelectedEntities}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>,
                            <Tooltip title="Add Application">
                                <IconButton
                                    color="primary"
                                    aria-label="Add Application"
                                    component="span"
                                    onClick={handleOpenDialog}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        ])
                    }}
                    rows={filteredActions.map(application => {
                        return {
                            ...application,
                            id: application.Id
                        }
                    })}
                    onRowClick={({ row }) => {
                        history.push(`/workflow-editor/${row.id}`, { name: row.DisplayName });
                    }}
                />
            </Grid>
        );
    }
    else if (errors) {
        return (<NoData />)
    }
    else {
        return (<LoadingIndicator />)
    }
}


export default CustomApplications
