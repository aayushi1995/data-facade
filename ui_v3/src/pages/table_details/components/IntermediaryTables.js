import React from "react"
import LoadingIndicator from "../../../common/components/LoadingIndicator"
import NoData from "../../../common/components/NoData"
import dataManager, { useRetreiveData } from "../../../data_manager/data_manager"
import { DataGrid } from "@material-ui/data-grid";
import { CustomToolbar } from "../../../common/components/CustomToolbar";
import { useCustomizationToolBarButtons } from "../../customizations/UseCustomizationToolBarButtons";
import { Dialog, Grid, Link, Tooltip, TextField, Button } from "@material-ui/core"
import { formTimeStampOrReturnDefault } from '../../jobs/components/JobsRowJobDetail'
import { Box, IconButton } from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";
import { makeStyles } from '@material-ui/styles'
import QueryData from '../../../common/components/QueryData'
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@mui/material/DialogTitle';
import {v4 as uuidv4} from 'uuid'
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import {getActionExecutionParsedOutput} from "../../../data_manager/entity_data_handlers/action_execution_data"

const columns = [
    {
        field: "ActionInstanceName",
        headerName: "Name",
        description: "Name of action",
        flex: 0.5
    },
    {
        field: "ExecutionCompletedOn",
        headerName: "Action Completion Time",
        flex: 1,
        valueGetter: (cell) => formTimeStampOrReturnDefault(cell?.value, "NA")
    },
    {
        field: "PreviewTable",
        headerName: "Preview Table",
        flex: 0.5,
        renderCell: (props) => {
            return <PreviewTable {...props}/>
        }
    },
    {
        field: "ImportExecutionOutput",
        headerName: "Import Execution Output",
        flex: 0.5,
        renderCell: (props) => {
            return <ImportTable {...props}/>
        }
    }
]

const useStyles = makeStyles(() => ({
    dialogPaper: {
        minHeight: '60vh',
        maxHeight: '70vh',
        minWidth: 1100
    },
    dialogTable: {
        minWidth: 500,
    }
}))



export const PreviewTable = (props) => {
    const fetchActionExecutionWithOutputMutation = useMutation(getActionExecutionParsedOutput)
    const handlePreviewClick = () => {
        console.log("TERM")
        props?.api?.componentsProps?.setFetching(true)
        props?.api?.componentsProps?.setDataDialogOpen(true)
        fetchActionExecutionWithOutputMutation.mutate(props?.row, {
            onSuccess: (data, variables, context) => {
                const preview = data.Output
                props?.api?.componentsProps?.setQueryData(preview)
            },
            onSettled: () => {
                props?.api?.componentsProps?.setFetching(false)
            }
        })
    }
    return (
        <Tooltip title="Preview Table">
            <IconButton
                color="primary"
                aria-label="Preview Table"
                onClick={handlePreviewClick}
            >
                <PreviewIcon/>
            </IconButton>
        </Tooltip>
    )
}

export const ImportTable = (props) => {
    
    const handleImportTable = () => {
        props.api.componentsProps.setSelectedExecution(props.id)
        props.api.componentsProps.setImportAsTableDialog(true)
    }
    
    return (
        <Link onClick={handleImportTable}>Import As Table</Link>
    )
}

const IntermediaryTables = (props) => {
    
    const classes = useStyles()
    const history = useHistory()
    const tableId = props?.table?.Id
    const providerInstanceId = props?.table?.ProviderInstanceID
    const {isLoading, data, errors} = useRetreiveData(
        "TableProperties",
        {
            filter: {
                Id: tableId
            },
            "withIntermediaryTableExecutions": true
        }
    )

    const saveAsTableActionInstance = useMutation(({actionInstance, actionParameterInstances}) => {
        console.log(actionInstance)
        console.log(actionParameterInstances)
        const response = dataManager.getInstance.saveData(
            "ActionInstance",
            {
                entityProperties: actionInstance,
                "withActionParameterInstance": true,
                "ActionParameterInstanceEntityProperties": actionParameterInstances,
                "SynchronousActionExecution": true
            }
        )
        return response
    })

    const [actionExecutions, setActionExecutions] = React.useState()
    const [dataDialogOpen, setDataDialogOpen] = React.useState(false)
    const [queryData, setQueryData] = React.useState([])
    const [importAsTableDialog, setImportAsTableDialog] = React.useState(false)
    const [selectedExecution, setSelectedExecution] = React.useState()
    const [tableName, setTableName] = React.useState()
    const [fetchingActionexecutionOutput, setFetchingActionexecutionOutput] = React.useState(false)
    
    
    React.useEffect(() => {
        if(data) {
            setActionExecutions(data.map(executions => {return {...executions, id: executions?.Id}}))
        }
    }, [data])

    const handleName = (event) => {
        setTableName(event.target.value)
    }

    const handleDialogClose = () => {
        setDataDialogOpen(false)
    }

    const handleSaveAsTable = () => {
        const actionInstance = {
            Id: uuidv4(),
            Name: `Load table ${tableName} from execution output`,
            DisplayName: `Load table ${tableName} from execution output`,
            ProviderInstanceId: providerInstanceId,
            DefinitionId: "21"
        }
        const actionParameterInstances = [
            {
                Id: uuidv4(),
                ActionInstanceId: actionInstance.Id,
                ParameterValue: tableName,
                ActionParameterDefinitionId: "22"
            },
            {
                Id: uuidv4(),
                ActionInstanceId: actionInstance.Id,
                ParameterValue: selectedExecution,
                ActionParameterDefinitionId: "21"
            }
        ]

        saveAsTableActionInstance.mutate({actionInstance, actionParameterInstances}, 
            {
                onSettled: () => {},
                onSuccess: (data) => {
                    setImportAsTableDialog(false)
                    history.goBack()
                }
            }
        )

    }

    if(actionExecutions) {
        return (
            <Grid container>
                <Dialog open={importAsTableDialog} onClose={() => {setImportAsTableDialog(false)}} fullWidth
                    classes={{paper: classes.dialogTable}} scroll="paper"
                >
                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <IconButton aria-label="close" onClick={() => {setImportAsTableDialog(false)}}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                    <DialogTitle>
                        Save Output As table
                    </DialogTitle>
                    <Grid container>
                        <Grid item xs={12}>
                            <Box m={2}>
                                <TextField
                                    value={tableName}
                                    onChange={handleName}
                                    variant="outlined"
                                    label="Table Name"
                                    fullWidth
                                ></TextField>
                                <Box mt={2}>
                                    <Grid item xs={6}>
                                        <Button variant="contained" component="label" classes={{root: "select-all"}} onClick={handleSaveAsTable}>
                                            Save
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {saveAsTableActionInstance?.isLoading ? (<LoadingIndicator/>): (<></>)}
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Dialog>
                <Dialog open={dataDialogOpen} onClose={handleDialogClose} fullWidth
                classes={{paper: classes.dialogPaper}} scroll="paper" title={"Table Preview"}>
                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <IconButton aria-label="close" onClick={handleDialogClose}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                    <DialogTitle>{"Table Preview"}</DialogTitle>
                    <Grid item xs={12}>
                        {fetchingActionexecutionOutput ?
                            <LoadingIndicator/>
                            :
                            <Box mx={2} my={1}>
                                <QueryData props={[queryData]}></QueryData>
                            </Box>
                        }  
                    </Grid>
                </Dialog>
                <Grid item xs={12}>
                    <DataGrid
                        columns={columns} rows={actionExecutions}
                        autoHeight
                        autoPageSize
                        rowsPerPageOptions={[20]}
                        checkboxSelection
                        disableSelectionOnClick
                        components={{
                            Toolbar: CustomToolbar()
                        }}
                        componentsProps={{
                            setDataDialogOpen: setDataDialogOpen,
                            setQueryData: setQueryData,
                            setImportAsTableDialog: setImportAsTableDialog,
                            setSelectedExecution: setSelectedExecution,
                            setFetching: setFetchingActionexecutionOutput
                        }}
                    ></DataGrid>
                </Grid>
            </Grid> 
        )   
    } else if(errors) {
        return <NoData/>
    } else {
        return <LoadingIndicator/>
    }

}

export default IntermediaryTables