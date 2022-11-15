import React from 'react'
import {Grid} from '@mui/material'
import AlertDetails from './components/AlertDetails'
import {Route, Switch, useHistory, useRouteMatch, withRouter} from 'react-router-dom'
import LoadingIndicator from '../../common/components/LoadingIndicator'
import NoData from '../../common/components/NoData'
import {useRetreiveData} from './../../data_manager/data_manager'
import './../../css/alerts/Alert.css'
import labels from './../../labels/labels'
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {formDateOrReturnDefault} from "../jobs/components/JobsRow";
import {PageHeader} from "../../common/components/header/PageHeader";

/* Alerts page container */


const filterOptionItems = [
    {
        "value": "Alert Id",
        "display": "Alert Id"
    },
    {
        "value": "Table Id",
        "display": "Table Id"
    }
]

const filterOptionsMap = {
    "Alert Name": "Name",
    "Table Id": "TableId"
}

const isDataEmpty = (data) => {
    if (data !== undefined && data.length > 0)
        return false
    else
        return true
}

const columns = [
    {
        field: "ShortDescription",
        headerName: "Description",
        description: `Description of Alert`,
        sortable: true,
        flex: 1,
        valueGetter: (cell) => cell?.value || "NA"
    },
    {
        field: "CreatedOn",
        headerName: "Created On",
        description: `Date this Alert was created on`,
        sortable: true,
        flex: 1,
        valueGetter: (cell) => formDateOrReturnDefault(cell?.value, "NA"),
    },
    {
        field: "Id",
        headerName: "Alert Id",
        description: `Id of this alert`,
        sortable: true,
        flex: 1,
        hide: true
    },
    {
        field: "TableId",
        headerName: "Table Id",
        description: `TableId of this alert`,
        sortable: true,
        flex: 1,
        hide: true
    },
]
const _Alerts = (props) => {

    const match = useRouteMatch()


    const searchValue = props?.location?.state?.search || ""
    const filter = props?.location?.state?.filter || "Action Instance Name"
    const [searchQuery, setSearchQuery] = React.useState(searchValue)
    const [filterOption, setFilterOption] = React.useState(filter)
    const searchQueryHandler = (event) => {
        setSearchQuery(event.target.value)
    }

    const filterOptionHandler = (event) => {
        setFilterOption(event.target.value)
    }

    const searchResults = (myData) => {
        const filterKey = filterOptionsMap[filterOption];
        return myData?.filter(elem =>
            elem?.[filterKey]?.toLowerCase()?.search(searchQuery?.toLowerCase()) >= 0 || searchQuery === ""
        )
    }

    const {isLoading, error, data} = useRetreiveData(labels.entities.Alert, {"filter": {}});

    const history = useHistory();

    const rows = searchResults(data)?.map((d, index) => ({...d, id: d.Id}));
    if (isLoading) {
        return <LoadingIndicator/>
    } else if (error) {
        return <NoData/>
    } else {
        if (!isDataEmpty(data)) {
            data.sort((a, b) => a.CreatedOn - b.CreatedOn)
            data.reverse()

            return (
                <React.Fragment>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <PageHeader path={match.path} url={match.url}/>
                        </Grid>
                    </Grid>

                    <div id="alerts-container">
                        <Grid container spacing={0} style={{marginTop: 0, marginBottom: 0}}>
                            <Grid item xs={12}>
                                <DataGrid
                                    components={{
                                        Toolbar: GridToolbar,
                                    }}
                                    {
                                        ...filterOption ? {
                                            filterModel: {
                                                items: [{
                                                    columnField: filterOption,
                                                    operatorValue: 'contains',
                                                    value: searchValue
                                                }],
                                            }
                                        } : {}
                                    }
                                    autoHeight
                                    pagination
                                    pageSize={10}
                                    rowsPerPageOptions={[10]}
                                    disableSelectionOnClick
                                    columns={columns}
                                    rows={rows}
                                    onRowClick={(params) => {
                                        history.push(`${match.url}/${params.row.Id}`)
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </React.Fragment>
            )
        } else {
            return <NoData/>
        }
    }

}


const Alerts = withRouter(function AlertsRoutes() {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={`${match.path}/:alertId`} component={AlertDetails}/>
            <Route path="/alerts" component={_Alerts}/>
        </Switch>
    )
});

export default Alerts;