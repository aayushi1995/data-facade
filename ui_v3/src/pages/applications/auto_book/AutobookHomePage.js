import React from 'react'
import {Route, Switch, useRouteMatch, withRouter} from 'react-router-dom';
import SingleCustomerView from './components/SingleCustomerView';
import AutoBookCustomers from './components/customers';
import SingleDataSetView from './components/SingleDataSetView';

export const AutobookHomePage = withRouter(function AutoBookRoutes() {
    const match = useRouteMatch()
    return (
        <Switch>
            <Route path={`${match.path}/:customerName/:customerTab/:tableName`} component={SingleDataSetView}></Route>
            <Route path={`${match.path}/:customerName`} component={SingleCustomerView}></Route>
            <Route path={`${match.path}`} component={AutoBookCustomers}></Route>
        </Switch>
    )
});

export default AutobookHomePage