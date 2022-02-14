import React from 'react'
import {Box, Grid, Tab, Tabs} from '@material-ui/core'
import {useRetreiveData} from '../../../../data_manager/data_manager'
import {PageHeader} from "../../../../common/components/header/PageHeader";
import {Redirect, Route, Switch, useHistory, useRouteMatch, withRouter} from 'react-router-dom'
import LoadingIndicator from '../../../../common/components/LoadingIndicator';
import NoData from '../../../../common/components/NoData'
import {DataGrid} from "@material-ui/data-grid";
import {customerSubRoutes} from "../../../../common/components/header/DataFacadeAppBar";
import * as PropTypes from "prop-types";

const customerTabs = Object.values(customerSubRoutes);
const locationParam = ':customerTab';
const columns = [
    {
        field: "FileName",
        headerName: "File Name",
        description: `Name of the table uploaded`,
        sortable: true,
        flex: 1
    },
    {
        field: "CreatedBy",
        headerName: "Created By",
        description: `Table Created By`,
        sortable: true,
        flex: 1
    },
    {
        field: "FYYear",
        headerName: "Financial Year",
        description: `Financial Year`,
        sortable: true,
        flex: 1
    },
    {
        field: "Subsidiary",
        headerName: "Subsidiary",
        description: `Subsidiary of data set`,
        sortable: true,
        flex: 1
    },
    {
        field: "FileType",
        headerName: "File Type",
        description: `File type of data set`,
        sortable: true,
        flex: 1
    }

]

const Files = (props) => <DataGrid
    autoHeight
    disableSelectionOnClick
    autoPageSize
    checkboxSelection
    rows={props.customerDataSets?.map(dataSet => {
        return {...dataSet, id: dataSet?.TablePropertiesId}
    })}
    columns={columns}
    onRowClick={props.onRowClick}>
</DataGrid>;

Files.propTypes = {
    customerDataSets: PropTypes.any,
    prop1: PropTypes.func,
    onRowClick: PropTypes.func
};
const SingleCustomerViewInternal = (props) => {
    const match = useRouteMatch()
    const history = useHistory()

    const {isLoading: customerDataLoading, isError: customerDataError, data: customerDataSets} = useRetreiveData(
        "Tag",
        {
            "filter": {
                "Name": match.params.customerName
            },
            "WithCustomerDetail": true
        }
    )
    const handleClick = (click) => {
        history.push(`${match.url}/${click?.row?.FileName}`)
    }

    function CustomerTabPanels(props) {
        const value = props.value;
        if (customerDataLoading) {
            return <LoadingIndicator/>
        } else if (customerDataError) {
            return <NoData/>
        }
        return <Grid item xs={12} sx={{mt: 3}}>
            {value === customerTabs[0].link && <Files customerDataSets={customerDataSets} onRowClick={handleClick}/>}
            {value === customerTabs[1].link && <div>Workflows To go here</div>}
            {value === customerTabs[2].link && <div>Reports To go here</div>}
            {value === customerTabs[3].link && <div>Subsidiary To go here</div>}
        </Grid>;
    }

    const value = match.params.customerTab;
    const onClickHandler = (index) => () => {
        const matchedPath = match.path;
        console.log("onClickHandler: ",  matchedPath, locationParam);
        const nextPath = `${matchedPath.replace(
            locationParam, customerTabs[index].link).replace(":customerName", match.params.customerName)}`
        history.replace(nextPath);
    }
    if (customerDataSets) {
        return (
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <PageHeader pageHeading={`Customer : ${match.params.customerName} ${value}`} path={match.path}
                                url={match.url} isApplication={true}/>
                </Grid>
                <Grid item xs={12}>
                    <Tabs
                        variant="scrollable"
                        value={customerTabs.findIndex(v => v.link === value)}
                    >
                        {
                            customerTabs.map(({link, displayName}, index)=><Tab label={displayName}
                            onClick={onClickHandler(index)}
                            />)
                        }
                    </Tabs>
                </Grid>
                <Grid container>
                    <Box style={{width: '100%'}}>
                        <CustomerTabPanels value={value}/>
                    </Box>
                </Grid>
            </Grid>
        )
    } else if (customerDataLoading) {
        return <LoadingIndicator/>
    } else if (customerDataError) {
        return <NoData/>
    }

}

export const SingleCustomerViewPage = withRouter(function AutoBookRoutes() {
    const match = useRouteMatch()
    return (
        <Switch>
            <Route path={`${match.path}/${locationParam}`} component={SingleCustomerViewInternal}/>
            <Redirect to={`${match.path}/${customerTabs[0].link}`} component={SingleCustomerViewInternal}/>
        </Switch>
    )
});

export default SingleCustomerViewPage