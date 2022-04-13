import React from 'react';
import { Route, Switch, useRouteMatch, withRouter } from 'react-router-dom';
import { APPLICATION_BUILD_ACTION_ROUTE_ROUTE, APPLICATION_CREATION_WIZARD_ROUTE, APPLICATION_DETAIL_ROUTE_ROUTE, APPLICATION_EDIT_ACTION_ROUTE_ROUTE } from '../../common/components/header/data/ApplicationRoutesConfig';
import { APPLICATION_ROUTE } from '../../common/components/header/data/RoutesConfig';
import ExecuteInstanceHomePage from '../applications/execute-instance/ExecuteInstanceHomePage';
import EditWorkflowHomePage from '../applications/workflow/EditWorkflowHomePage';
import ExecuteWorkflowHomePage from '../applications/workflow/ExecuteWorkflowHomePage';
import ViewWorkflowExecutionHomePage from '../applications/workflow/ViewWorkflowExecutionHomePage';
import BuildActionHomePage from '../build_action/BuildActionHomePage';
import BuildWorkflowHomePage from '../build_workflow/BuildWorkflowHomePage';
import EditActionHomePage from '../edit_action/EditActionHomePage';
import ExecuteActionHomePage from '../execute_action/ExecuteActionHomePage';
import Jobs from '../jobs/Jobs';
import AllApplicationView from './components/AllApplicationView';
import ApplicationCreationWizardDialog from './components/ApplicationCreationWizardDialog';
import ApplicationDetailView from './components/ApplicationDetailView';


export const ApplicationContent = withRouter(function TableBrowserRoutes() {
    const match = useRouteMatch()

    return (
        <Switch>
            <Route path='/application/jobs' component={Jobs}/>
            <Route path="/application/build-workflow" component={BuildWorkflowHomePage}/>
            <Route path={APPLICATION_BUILD_ACTION_ROUTE_ROUTE} component={BuildActionHomePage}/>
            <Route path={APPLICATION_EDIT_ACTION_ROUTE_ROUTE} component={EditActionHomePage}/>
            <Route path="/application/execute-workflow" component={ExecuteWorkflowHomePage}/>
            <Route path="/application/workflow-execution" component={ViewWorkflowExecutionHomePage}/>
            <Route path="/application/execute-action" component={ExecuteActionHomePage}/>
            <Route path="/application/edit-workflow" component={EditWorkflowHomePage}/>
            <Route path="/application/execute-instance" component={ExecuteInstanceHomePage}/>
            <Route path={APPLICATION_DETAIL_ROUTE_ROUTE} component={ApplicationDetailView}></Route>
            <Route path={APPLICATION_CREATION_WIZARD_ROUTE} component={ApplicationCreationWizardDialog}></Route>
            <Route path={APPLICATION_ROUTE} component={AllApplicationView}/>
        </Switch>
    )
});

export default ApplicationContent;