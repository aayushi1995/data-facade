import React, {Suspense} from 'react'
import {Route, Switch, useRouteMatch, withRouter} from 'react-router-dom';
const SingleCustomerView = React.lazy(() => import('./components/SingleCustomerView'));
const  AutoBookCustomers =  React.lazy(() => import('./components/customers'));
const  SingleDataSetView = React.lazy(() => import('./components/SingleDataSetView'));

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