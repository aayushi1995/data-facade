import { Box } from "@mui/material";
import { useContext, useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { ACTION_EXECUTION_ROUTE, APPLICATION_BUILD_ACTION_ROUTE_ROUTE, APPLICATION_CREATION_WIZARD_ROUTE, APPLICATION_DETAIL_ROUTE_ROUTE, APPLICATION_EDIT_ACTION_ROUTE_ROUTE, APPLICATION_ROUTE_MARKETPLACE, APPLICATION_SUB_TABS, APPLICATION_WEB_APP_BUILD_ROUTE, APPLICATION_WEB_APP_EDIT_ROUTE, APPPLICATION_CREATE_AUTO_FLOW, EXECUTION_HISTORY_ROUTE, SCHEDULED_JOBS_ROUTE } from '../../common/components/header/data/ApplicationRoutesConfig';
import { findTab } from '../../common/components/header/data/DataRoutesConfig';
import { APPLICATION_ROUTE } from '../../common/components/header/data/RoutesConfig';
import { SetModuleContextState } from '../../common/components/ModuleContext';
import EditActionPageNew from "../../edit-action-new/EditActionPageNew";
import BuildWebAppHomePage from "../../web-app/build/BuildWebAppHomePage";
import WebAppEditHomePage from "../../web-app/edit/WebAppEditHomePage";
import ExecuteInstanceHomePage from '../applications/execute-instance/ExecuteInstanceHomePage';
import EditWorkflowHomePage from '../applications/workflow/EditWorkflowHomePage';
import ExecuteWorkflowHomePage from '../applications/workflow/ExecuteWorkflowHomePage';
import ViewWorkflowExecutionHomePage from '../applications/workflow/ViewWorkflowExecutionHomePage';
import BuildActionHomePage from '../build_action/BuildActionHomePage';
import BuildAutoFlow from '../build_auto_flow/BuildAutoFlow';
import BuildWorkflowHomePage from '../build_workflow/BuildWorkflowHomePage';
import EditActionHomePage from '../edit_action/EditActionHomePage';
import ExecuteActionHomePage from '../execute_action/ExecuteActionHomePage';
import Jobs from '../jobs/Jobs';
import ActionExecutionHomePage from './components/ActionExecutionHomePage';
import AllApplicationView from './components/AllApplicationView';
import ApplicationCreationWizardDialog from './components/ApplicationCreationWizardDialog';
import ApplicationDetailView from './components/ApplicationDetailView';
import ApplicationMarketplace from './components/ApplicationMarketplpace';
import ApplicationRunsByMe from './components/ApplicationRunsByMe';
import ScheduledJobsView from './components/ScheduledJobsView';


export const ApplicationContent = withRouter(function TableBrowserRoutes() {
    const setModuleContext = useContext(SetModuleContextState)

    return (
        <Switch>
            <Box sx={{mx:6}}>
            <Route path='/application/jobs' component={Jobs}/>
            <Route path={APPLICATION_ROUTE_MARKETPLACE} component={ApplicationMarketplace}/>
            <Route path="/application/build-workflow" component={BuildWorkflowHomePage}/>
            <Route path={APPLICATION_BUILD_ACTION_ROUTE_ROUTE} component={BuildActionHomePage}/>
            <Route path={APPLICATION_EDIT_ACTION_ROUTE_ROUTE} component={EditActionHomePage}/>
            <Route path="/application/execute-workflow" component={ExecuteWorkflowHomePage}/>
            <Route path="/application/workflow-execution/:workflowExecutionId" component={ViewWorkflowExecutionHomePage}/>
            <Route path="/application/execute-action/:ActionDefinitionId" component={ExecuteActionHomePage}/>
            <Route path="/application/edit-workflow" component={EditWorkflowHomePage}/>
            <Route path="/application/execute-instance" component={ExecuteInstanceHomePage}/>
            <Route path={APPLICATION_DETAIL_ROUTE_ROUTE} component={ApplicationDetailView}></Route>
            <Route path={APPLICATION_CREATION_WIZARD_ROUTE} component={ApplicationCreationWizardDialog}></Route>
            <Route path={ACTION_EXECUTION_ROUTE} component={ActionExecutionHomePage}/>
            <Route path={APPPLICATION_CREATE_AUTO_FLOW} component={BuildAutoFlow}/>
            <Route path={EXECUTION_HISTORY_ROUTE} component={ExecutionHistory}/>
            <Route path={SCHEDULED_JOBS_ROUTE} component={ScheduledJobsWrapper} />
            <Route path={APPLICATION_WEB_APP_EDIT_ROUTE} component={WebAppEditHomePage} />
            <Route path={APPLICATION_WEB_APP_BUILD_ROUTE} component={BuildWebAppHomePage} />
            <Route exact path={APPLICATION_ROUTE} component={AllApplicationViewWrapper}/>
            </Box>
        </Switch>
    )
});

export const AllApplicationViewWrapper = () => {
    const setModuleContext = useContext(SetModuleContextState)
    useEffect(() => {
        const tab = findTab(APPLICATION_SUB_TABS, APPLICATION_ROUTE)
        console.log(tab)
        setModuleContext({
            type: "SetHeader",
            payload: {
                newHeader: {
                    Title: tab?.title,
                    SubTitle: tab?.subTitle
                }
            }
        })
    }, [])

    return <Box sx={{mx:-6}}> <AllApplicationView/></Box>
}

export const ScheduledJobsWrapper = () => {
    const setModuleContext = useContext(SetModuleContextState)
    useEffect(() => {
        const tab = findTab(APPLICATION_SUB_TABS, SCHEDULED_JOBS_ROUTE)
        console.log(tab)
        setModuleContext({
            type: "SetHeader",
            payload: {
                newHeader: {
                    Title: tab?.title,
                    SubTitle: tab?.subTitle
                }
            }
        })
    }, [])

    return <ScheduledJobsView /> 
}

export const ExecutionHistory = () => {
    const setModuleContext = useContext(SetModuleContextState)
    useEffect(() => {
        const tab = findTab(APPLICATION_SUB_TABS, EXECUTION_HISTORY_ROUTE)
        console.log(tab)
        setModuleContext({
            type: "SetHeader",
            payload: {
                newHeader: {
                    Title: tab?.title,
                    SubTitle: tab?.subTitle
                }
            }
        })
    }, [])

    return <ApplicationRunsByMe fetchAll={true}/>
}

export default ApplicationContent;  
