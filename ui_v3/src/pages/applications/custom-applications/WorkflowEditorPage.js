import React from 'react'
import { Route, Switch, useRouteMatch, withRouter } from 'react-router-dom';
import WorkflowEditor from './components/WorkflowEditor';
import WorkflowBuilder from './components/WorkflowBuilderPage';

export const WorkflowEditorPage = withRouter(function CustomApplicationRoutes(props) {
    const match = useRouteMatch()
    return (
        <Switch>
            <Route path={`${match.path}/:workflowDefinitionId`} render={() => <WorkflowBuilder name={props?.location?.state?.name} />} /> {/* code duplicacy here onwards in both pages */}
            <Route path={`${match.path}`} render={() => <WorkflowBuilder name={props?.location?.state?.name} />} /> {/* code duplicacy here onwards in both pages */}
        </Switch>
    )
});

export default WorkflowEditorPage