import React from 'react'
import {Route, Switch, useRouteMatch, withRouter} from 'react-router-dom'
import ExecuteWorkflowHomePage from '../applications/workflow/ExecuteWorkflowHomePage';
import ViewWorkflowExecutionHomePage from '../applications/workflow/ViewWorkflowExecutionHomePage';
import BuildActionHomePage from '../build_action/BuildActionHomePage';
import BuildWorkflowHomePage from '../build_workflow/BuildWorkflowHomePage';
import ExecuteActionHomePage from '../execute_action/ExecuteActionHomePage';
// import SingleTagView from './components/SingleApplicationView';
import AllApplicationView from './components/AllApplicationView.tsx';
import ApplicationDetailView from './components/ApplicationDetailView';


export const ApplicationHomePage = withRouter(function TableBrowserRoutes() {
    const match = useRouteMatch()

    return (
        <Switch>
            {/* <Route path={`${match.path}/:applicationName`} component={SingleApplicationView}/> */}
            <Route path="/application/build-workflow" component={BuildWorkflowHomePage}/>
            <Route path="/application/build-action" component={BuildActionHomePage}/>
            <Route path="/application/execute-workflow" component={ExecuteWorkflowHomePage}/>
            <Route path="/application/workflow-execution" component={ViewWorkflowExecutionHomePage}/>
            <Route path="/application/execute-action" component={ExecuteActionHomePage}/>
            <Route path={`${match.path}/:applicationId`} component={ApplicationDetailView}></Route>
            <Route path="/application" component={AllApplicationView}/>
        </Switch>
    )
});

export default ApplicationHomePage;