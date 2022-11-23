import React from 'react'
import { Route, Switch, useRouteMatch, withRouter } from 'react-router-dom';
import { PageHeader } from '../../../../common/components/header/PageHeader';
import { Card, Grid } from '@mui/material'
import { WorkflowList } from './WorkflowList';
import { WorkflowMeta } from "./WorkflowMeta";
import { ReactQueryWrapper } from '../../../../common/components/ReactQueryWrapper';
import { useRunWorkflow } from "../hooks/UseRunWorkflow.js";

export const RUN_WORKFLOW_VIEWS = {
    INSTANCES: "Instance",
    EXECUTION_RESULT: "ExecutionResult"
};

const RunWorkflow = (props) => {
    const {
        tableMeta,
        currentView,
        viewsDataMap,
        saveCreateActionInstanceFormConfig,
        ActionParameterInstancesMap,
        actionDefinitions
    } = useRunWorkflow(props);

    const data = viewsDataMap[currentView]?.data;
    return (
        <Grid container spacing={0}>
            <PageHeader pageHeading={`Workflow: Action ${currentView} List`} />
            <Grid item container xs={12} xl={10} style={{ margin: "auto" }}>
                {tableMeta?.Table && <Grid item xs={12} justifyContent="center">
                    <WorkflowMeta tableMeta={tableMeta} />
                </Grid>}
                <Grid item xs={5} />
                <Grid item xs={12} justifyContent="center">
                    <ReactQueryWrapper
                        data={data}
                        isLoading={!data || data?.length<=0}
                    >{() =>
                    viewsDataMap[currentView]?.data?.length>0 ? <WorkflowList
                            ActionDefinitions={actionDefinitions}
                            ActionParameterInstancesMap={ActionParameterInstancesMap}
                            tableMeta={tableMeta}
                            currentView={currentView}
                            saveCreateActionInstanceFormConfig={saveCreateActionInstanceFormConfig}
                            {...viewsDataMap[currentView]}
                        />: null}
                    </ReactQueryWrapper>
                </Grid>
            </Grid>
        </Grid>
    )
}

export const RunWorkflowHomePage = withRouter(function RunWorkflowRoutes(props) {
    const match = useRouteMatch()
    return (
        <Switch>
            <Route path={`${match.path}/:workflowId`} render={() => {
                return <RunWorkflow
    tableMeta={{Table: props?.location?.state?.tableMeta}}
    runtimeWorkflow={props?.location?.state?.runtimeWorkflow}
    actionExecutionFromProps={props?.location?.state?.actionExecutionFromProps}/>
            }} />
        </Switch>
    )
});

export default RunWorkflowHomePage