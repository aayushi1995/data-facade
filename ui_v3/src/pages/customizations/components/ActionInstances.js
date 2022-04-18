import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, Grid, IconButton } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { makeStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";
import React, { useCallback, useEffect } from 'react';
import { useMutation } from 'react-query';
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { CustomToolbar } from "../../../common/components/CustomToolbar";
import LoadingIndicator from '../../../common/components/LoadingIndicator';
import QueryData from "../../../common/components/QueryData";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import { WorkflowActionButtons } from "../../applications/custom-applications/components/WorkflowActionButtons";
import { ACTION_EXECUTION_STATUS } from "../../applications/custom-applications/hooks/useRunActions";
import { useCustomizationToolBarButtons } from "../UseCustomizationToolBarButtons";
import dataManagerInstance, { useRetreiveData } from './../../../data_manager/data_manager';
import { getActionExecutionParsedOutput } from './../../../data_manager/entity_data_handlers/action_execution_data';
import labels from './../../../labels/labels';
import { ActionInstanceDetails } from './ActionInstancesRow';


const useStyles = makeStyles(() => ({
    dialogPaper: {
        minHeight: '80vh',
        maxHeight: '80vh',
        minWidth: 1000
    }

}));


const filterOptionsMap = {
    "Action Instance Id": "Id",
    "Action Instance Name": "Name",
    "Action Type": "ActionType"
}


export const useFetchActionInstancesQuery = (filter = {}) => useRetreiveData(labels.entities.ActionInstance, {
    filter,
    "withDetail": true
});

const columns = [
    {
        field: "DisplayName",
        headerName: "Action Instance Name",
        description: `Name of Action Instance`,
        sortable: true,
        flex: 2,
    }, {
        field: "RenderedTemplate",
        headerName: "Rendered Template",
        description: `Rendered Template of Action Instance`,
        sortable: true,
        flex: 3,
    }, {
        field: "UniqueName",
        headerName: "Action Definition Name",
        description: `Name of Action Definition`,
        sortable: true,
        flex: 2,
    },
    {
        field: "RunAndDelete",
        headerName: "Actions",
        flex: 1,
        renderCell: (props) => {
            return <RunAndDeleteActionInstance actionInstance={props?.row?.ActionInstance} whole={props}/>
        }
    }
]

const RunAndDeleteActionInstance = (props) => {
    const fetchActionExecutionWithOutputMutation = useMutation(getActionExecutionParsedOutput)

    const createActionExecutionMutation = useMutation((execution) => {
        const config = dataManagerInstance.getInstance.saveData(execution.entityName, {
            "entityProperties": execution.entityProperties
        })

        return config.then(res => res)
    })

    const deleteActionInstanceMutation = useMutation((instance) => {
        const deleteInstance = dataManagerInstance.getInstance.deleteData(
            "ActionInstance",
            {
                filter: {
                    Id: instance.Id
                },
                Soft: true
            }
        )

        return deleteInstance.then(res => res)
    })

    const handleCreateActionExecution = (event) => {
        console.log(props)

        const actionExecutionProperties = {}
        actionExecutionProperties["Id"] = uuidv4()
        actionExecutionProperties["ExecutionStartedOn"] = parseInt(Date.now() / 1000)
        actionExecutionProperties["Status"] = "Created"
        actionExecutionProperties["InstanceId"] = props?.actionInstance?.Id
        actionExecutionProperties["ActionInstanceName"] = props?.actionInstance?.Name
        actionExecutionProperties["IsSynchronous"] = true

        createActionExecutionMutation.mutate({
            "entityName": labels.entities.ActionExecution,
            "entityProperties": actionExecutionProperties
        }, {
            onSuccess: (data, variables, context) => {
                props?.whole?.api?.componentsProps?.setDialogOpen(true)
                props?.whole?.api?.componentsProps?.setFetching(true)
                console.log(data)

                fetchActionExecutionWithOutputMutation.mutate(props?.row, {
                    onSuccess: (outputData, variables, context) => {
                        const preview = data.Output
                        props?.whole?.api?.componentsProps?.setQueryData(outputData)
                    },
                    onSettled: () => {
                        props?.api?.componentsProps?.setFetching(false)
                    }
                })  
                // setQueryData(data)
                // setIsDialogOpen(true)
            },

        })
    }
    const handleDeleteActionInstance = () => {
        deleteActionInstanceMutation.mutate({
            ...props?.actionInstance
        }, {
            onSuccess: (data, variables, context) => {
                console.log("DELETED")
                props?.whole?.api?.componentsProps?.handleActionInstancesAfterDelete(props?.actionInstance?.Id)
            },
            onError: (error, variables, context) => {
                console.log("ERROR", error)
            }
        })
    }

    return (
        <Grid container>
            <WorkflowActionButtons status={ACTION_EXECUTION_STATUS.SUCCESS}
                                   onDeleteHandler={handleDeleteActionInstance}
                                   onCreateHandler={handleCreateActionExecution}
                                   actionInstanceData={props.whole.row}
                                   xs={12}
            />
            {
                (createActionExecutionMutation.isLoading || deleteActionInstanceMutation.isLoading) ? (
                    <Box sx={{display: "block", width: '100%'}}>
                        <LinearProgress/>
                    </Box>
                ) : (<></>)
            }
        </Grid>
    )
}

const ActionInstancesInternal = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const [isDataDialogOpen, setIsDataDialogOpen] = React.useState(false)
    const [queryData, setQueryData] = React.useState({})
    const searchString = props?.state?.search ?? ""
    const [searchQuery] = React.useState(searchString)
    const [filterOption] = React.useState(props?.state?.filter ?? "Action Instance Name")
    const {isLoading, error, data} = useFetchActionInstancesQuery({TableId: props.tableId});
    const [fetchingActionexecutionOutput, setFetchingActionexecutionOutput] = React.useState(false)
    const customizationsToolBarButtons = useCustomizationToolBarButtons();

    const searchResults = useCallback(() => {

        const filterKey = filterOptionsMap[filterOption]
        return data?.filter(elem => {
            switch (filterOption) {
                case "Query Type" :
                    return elem?.["ActionDefinition"]?.[filterKey]?.toLowerCase()?.search(searchQuery?.toLowerCase()) >= 0 || searchQuery === ""
                case "Action Instance Name" :
                    if (elem?.["ActionInstance"]?.[filterKey] === undefined) return false
                    return elem?.["ActionInstance"]?.[filterKey]?.toLowerCase()?.search(searchQuery?.toLowerCase()) >= 0 || searchQuery === ""
                case "Action Instance Id" :
                    return elem?.["ActionInstance"]?.[filterKey]?.toLowerCase()?.search(searchQuery?.toLowerCase()) >= 0 || searchQuery === ""
                default :
                    return false

            }
        })
    }, [data, filterOption, searchQuery])

    const handleActionInstancesAfterDelete = (id) => {
        const newRows = dataGridRows.filter(row => row.id !== id)
        setDataGridRows(newRows)
    }


    const [dataGridRows, setDataGridRows] = React.useState([]);

    useEffect(() => {
        const rows = searchResults()?.map(row => {
            return {
                UniqueName: row?.ActionDefinition?.UniqueName,
                RenderedTemplate: row?.ActionInstance.RenderedTemplate,
                DisplayName: row?.ActionInstance.DisplayName,
                id: row?.ActionInstance?.Id,
                ...row
            };
        }) ||  [];
        setDataGridRows(rows);
    }, [data, searchResults]);
    const handleQueryDataDialogClose = () => {
        setIsDataDialogOpen(false)
    }
        return (
            <ReactQueryWrapper data={dataGridRows} error={error} isLoading={isLoading}>
                {() => <Grid>
                    <Dialog onClose={handleQueryDataDialogClose} open={isDataDialogOpen} fullWidth
                            classes={{paper: classes.dialogPaper}} scroll="paper">
                        <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <IconButton aria-label="close" onClick={handleQueryDataDialogClose}>
                                <CloseIcon/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={12}>
                            {fetchingActionexecutionOutput ? 
                                <Box mx={2} my={1}>
                                    <QueryData props={queryData}/>
                                </Box>
                                :
                                <LoadingIndicator/>
                            }    
                        </Grid>
                    </Dialog>
                    <DataGrid columns={columns} rows={dataGridRows}
                              autoHeight
                              autoPageSize
                              checkboxSelection
                              disableSelectionOnClick
                              pageSize={10}
                              rowsPerPageOptions={[10]}
                              components={{
                                  Toolbar: CustomToolbar(customizationsToolBarButtons)
                              }}
                              componentsProps={{
                                  setQueryData: setQueryData,
                                  setDialogOpen: setIsDataDialogOpen,
                                  handleActionInstancesAfterDelete: handleActionInstancesAfterDelete,
                                  setFetching: setFetchingActionexecutionOutput
                              }}
                              onCellClick={(params) => {
                                  if (params?.colDef?.field !== 'RunAndDelete') {
                                      history.push(`/customizations/action-instances/${params.row.id}`)
                                  }
                              }}
                    />

                </Grid>}
            </ReactQueryWrapper>
        );
}

const ActionInstances = (props: { tableId: string }) => {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={`/customizations/action-instances/:Id`} component={ActionInstanceDetails}/>
            <Route path={`${match.path}`}
                   render={() => <ActionInstancesInternal tableId={props.tableId}/>}/>
        </Switch>
    )
};

export default ActionInstances;