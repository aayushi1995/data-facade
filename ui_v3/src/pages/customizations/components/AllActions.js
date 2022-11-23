import React from 'react';
import { Grid } from '@mui/material'
import LoadingIndicator from './../../../common/components/LoadingIndicator'
import { AllActionsRowDetails } from './AllActionsRow'
import labels from './../../../labels/labels'
import { useRetreiveData } from './../../../data_manager/data_manager'
import { DataGrid } from "@mui/x-data-grid";
import { Route, Switch, useHistory, useRouteMatch, withRouter } from "react-router-dom";
import { useCustomizationToolBarButtons } from "../UseCustomizationToolBarButtons";
import { CustomToolbar } from "../../../common/components/CustomToolbar";
import RunActionDialog from './RunActionDialog'
import { actionIconMap } from "../../applications/custom-applications/components/WorkflowList";
import { customizationURLSlugObjects } from "../Customizations";

const columns = [
    {
        field: "UniqueName",
        headerName: "Name",
        description: `Name of Check`,
        sortable: true,
        flex: 1,
    }, {
        field: "ActionType",
        headerName: "Action Type",
        description: `Action Type`,
        sortable: true,
        flex: 1,
    }, {
        field: "QueryLanguage",
        headerName: "Query Language",
        description: `Query Language`,
        sortable: true,
        flex: 1,
    }, {
        field: "PresentationFormat",
        headerName: "Presentation Format",
        description: `Presentation Format of check`,
        sortable: true,
        flex: 1,
    }, {
        field: "ActionTemplate",
        headerName: "Action Template",
        description: `ActionTemplate of check`,
        sortable: true,
        flex: 1,
    }, {
        field: "OutputFormat",
        headerName: "Output Format",
        description: `OutputFormat of check`,
        sortable: true,
        flex: 1,
    }, {
        field: "Run",
        headerName: " ",
        flex: 1,
        renderCell: (props) => {
            return (
                <RunActionDialog actionDefinitionId={props.row.Id} actionType={props.row.ActionType}></RunActionDialog>
            )
        }
    }

]

const filterOptionItems = [
    {
        "value": "Action Definition Name",
        "display": "Action Definition Name"
    }
]

const filterOptionsMap = {
    "Action Definition Name": "UniqueName"
}
export const useFetchActionDefinitionQuery = (ActionType, Id, IsWorkflow = false, ActionDefinitionDetailGet = true, { enabled } = { enabled: true }) => useRetreiveData(labels.entities.ActionDefinition, {
    "filter": {
        ActionType,
        Id
    },
    IsWorkflow,
    ActionDefinitionDetailGet
}, { enabled })
const AllActionsInternal = () => {
    const history = useHistory();
    const customizationsToolBarButtons = useCustomizationToolBarButtons();
    const match = useRouteMatch();
    const ActionType = customizationURLSlugObjects.find(({ link }) => link === match.params.customizationsFilter)?.ActionType;
    const [searchQuery, setSearchQuery] = React.useState("")
    const [filterOption, setFilterOption] = React.useState("Action Definition Name")

    const {
        isLoading: isLoadingActionDefinition,
        error: actionDefinitionError,
        data: actionDefinitionData
    } = useFetchActionDefinitionQuery(ActionType);

    const searchResults = (myData) => {
        const filterKey = filterOptionsMap[filterOption]
        return (myData || []).filter(elem =>
            elem.ActionDefinition.model[filterKey].toLowerCase().search(searchQuery.toLowerCase()) >= 0 || searchQuery === ""
        );
    }
    const rows = searchResults(actionDefinitionData)?.reduce((acc, row) => {
        const model = row?.ActionDefinition?.model || {};
        if (actionIconMap[model?.ActionType]) {
            model.id = model?.Id;
            acc.push(model);
        }
        return acc;
    }, []);

    if (isLoadingActionDefinition) {
        return (<LoadingIndicator />)
    } else if (actionDefinitionError) {
        <div>Error</div>
    } else {
        return (
            <React.Fragment>
                <div id="customizationsDataProfiling-container">
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <DataGrid columns={columns} rows={rows}
                                components={{
                                    Toolbar: CustomToolbar(customizationsToolBarButtons)
                                }}
                                autoHeight
                                autoPageSize
                                checkboxSelection
                                disableSelectionOnClick
                                onCellClick={(params) => {
                                    if (params.colDef.field !== 'Run') {
                                        history.push(`${match.url}/${params.row.Id}`)
                                    }
                                }}
                            //   onRowClick={(params) => {
                            //       console.log(params.columns)
                            //       history.push(`${match.url}/${params.row.Id}`)
                            //   }}
                            />
                        </Grid>
                    </Grid>
                </div>

            </React.Fragment>
        )
    }
}
const AllActions = withRouter(function AllActionsRoutes() {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={`${match.path}/:Id`}
                component={AllActionsRowDetails} />
            <Route path={`${match.path}`} exact component={AllActionsInternal} />
        </Switch>
    )
});
export default AllActions;