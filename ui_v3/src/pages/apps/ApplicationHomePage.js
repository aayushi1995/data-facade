import React from 'react'
import {Route, Switch, useRouteMatch, withRouter} from 'react-router-dom'
// import SingleTagView from './components/SingleApplicationView';
import AllApplicationView from './components/AllApplicationView.tsx';
import ApplicationDetailView from './components/ApplicationDetailView';


export const ApplicationHomePage = withRouter(function TableBrowserRoutes() {
    const match = useRouteMatch()

    return (
        <Switch>
            {/* <Route path={`${match.path}/:applicationName`} component={SingleApplicationView}/> */}
            <Route path={`${match.path}/:applicationId`} component={ApplicationDetailView}></Route>
            <Route path="/application" component={AllApplicationView}/>
        </Switch>
    )
});

export default ApplicationHomePage;