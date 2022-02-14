import { Route, Switch, useRouteMatch, withRouter, useHistory } from 'react-router-dom';
import dataManager, { useRetreiveData } from '../../../data_manager/data_manager';
import React from 'react';
import labels from '../../../labels/labels';
import { Card, Grid, IconButton } from '@material-ui/core'
import { DataGrid } from "@material-ui/data-grid";
import { PageHeader } from "../../../common/components/header/PageHeader";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@material-ui/icons/Delete";
import LoadingIndicator from '../../../common/components/LoadingIndicator';
import NoData from '../../../common/components/NoData';
import { useMutation } from 'react-query';

const columns = [
    {
        field: "DisplayName",
        headerName: "Workflow Run Name",
        flex: 1
    },
    {
        field: "Name",
        headerName: "Workflow Name",
        flex: 1
    },
    {
        field: "Run Workflow",
        headerName: " ",
        flex: 0.5,
        renderCell: (props) => {
            return (<RunAndDeleteWorklowInstance {...props}/>)
        }
    }
]

const RunAndDeleteWorklowInstance = (props) => {
    const match = useRouteMatch();
    const history = useHistory();
    const executeInstanceMutation = useMutation((config) => {
        console.log(config)
        return dataManager.getInstance.executeInstance(config.entityName, config.actionProperties)
    })

    const handleRunInstance = () => {
        const actionInstanceId = props.id
        const actionProperties = {
            filter: {
                "Id": actionInstanceId
            }
        }
        executeInstanceMutation.mutate(({
                entityName: "ActionInstance", 
                actionProperties: actionProperties}), 
        {
            onSuccess: (data) => {
                console.log(data)
                history.push({
                    pathname: `/run-workflow/${match.params.workflowId}`,
                    state: {actionExecutionFromProps: data}
                })
            },
            onError: (errors) => {
                console.log("ERROR")
            }
        })

    }

    return (
        <Grid container>
            <IconButton
                onClick={handleRunInstance}
                color="primary"
                aria-label="Run workflow"
            >
                <PlayArrowIcon/>
            </IconButton>
            <IconButton
                color="primary"
                aria-label="Run workflow"
            >
                <DeleteIcon/>
            </IconButton>
        </Grid>
    )
}

const ViewWorkflowActionInstances = () => {
    const match = useRouteMatch()
    const workflowId = match.params.workflowId
    const [actionInstances, setActionInstances] = React.useState()
    const {data, isLoading, errors} = useRetreiveData(
        labels.entities.ActionInstance,
        {
            filter: {
                "DefinitionId": workflowId
            }
        }
    )

    React.useEffect(() => {
        if(data) {
            setActionInstances(data)
            console.log(data)
        }
    }, [data])

    if(actionInstances) {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <PageHeader pageHeading={"Workflow Action Instances"} path={match.path} url={match.url} isApplication={false} />
                </Grid>
                <DataGrid
                    rows={actionInstances.map(ai => {
                        return {...ai, id: ai.Id}
                    })}
                    columns={columns}
                    autoHeight
                    disableSelectionOnClick
                    autoPageSize
                    checkboxSelectionautoHeight
                    disableSelectionOnClick
                    autoPageSize
                    checkboxSelection
                ></DataGrid>
            </Grid>
        )
    } else if(isLoading) {
        return <LoadingIndicator/>
    } else {
        return <NoData/>
    }
}


const ViewWorkflowHomePage = () => {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.path}/:workflowId`} component={ViewWorkflowActionInstances}></Route>
        </Switch>
    )
}

export default ViewWorkflowHomePage