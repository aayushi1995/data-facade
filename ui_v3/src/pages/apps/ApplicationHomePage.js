import React from 'react'
import {Route, Switch, useRouteMatch, withRouter} from 'react-router-dom'
import EditWorkflowHomePage from '../applications/workflow/EditWorkflowHomePage';
import ExecuteWorkflowHomePage from '../applications/workflow/ExecuteWorkflowHomePage';
import ViewWorkflowExecutionHomePage from '../applications/workflow/ViewWorkflowExecutionHomePage';
import BuildActionHomePage from '../build_action/BuildActionHomePage';
import BuildTableWorkflowHomePage from '../build_workflow/BuildTableWorkflowHomePage';
import BuildWorkflowHomePage from '../build_workflow/BuildWorkflowHomePage';
import EditActionHomePage from '../edit_action/EditActionHomePage';
import ExecuteActionHomePage from '../execute_action/ExecuteActionHomePage';
// import SingleTagView from './components/SingleApplicationView';
import AllApplicationView from './components/AllApplicationView.tsx';
import ApplicationDetailView from './components/ApplicationDetailView';
import Jobs from '../../pages/jobs/Jobs'


export const ApplicationHomePage = withRouter(function TableBrowserRoutes() {
    const match = useRouteMatch()

    return (
        <Switch>
            {/* <Route path={`${match.path}/:applicationName`} component={SingleApplicationView}/> */}
            <Route path='/application/jobs' component={Jobs}/>
            <Route path="/application/build-workflow" component={BuildWorkflowHomePage}/>
            <Route path="/application/build-action" component={BuildActionHomePage}/>
            <Route path="/application/edit-action/:ActionDefinitionId" component={EditActionHomePage}/>
            <Route path="/application/execute-workflow" component={ExecuteWorkflowHomePage}/>
            <Route path="/application/workflow-execution" component={ViewWorkflowExecutionHomePage}/>
            <Route path="/application/execute-action" component={ExecuteActionHomePage}/>
            <Route path="/application/edit-workflow" component={EditWorkflowHomePage}/>
            <Route path="/application/build-table-workflow" component={BuildTableWorkflowHomePage}/>
            <Route path={`${match.path}/:applicationId`} component={ApplicationDetailView}></Route>
            <Route path="/application" component={AllApplicationView}/>
        </Switch>
    )
});

export default ApplicationHomePage;