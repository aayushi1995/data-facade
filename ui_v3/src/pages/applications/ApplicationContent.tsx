import { Box } from "@mui/material";
import { useContext, useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { SetModuleContextState } from '../../common/components/main_module/context/ModuleContext';
import { ACTION_EXECUTION_ROUTE, APPLICATION_BUILD_ACTION_ROUTE_ROUTE, APPLICATION_CREATION_WIZARD_ROUTE, APPLICATION_DETAIL_ROUTE_ROUTE, APPLICATION_EDIT_ACTION_ROUTE_ROUTE, APPLICATION_EXECUTE_ACTION, APPLICATION_EXECUTE_WORKFLOW, APPLICATION_ROUTE_MARKETPLACE, APPLICATION_SUB_TABS, APPLICATION_WEB_APP_BUILD_ROUTE, APPLICATION_WEB_APP_EDIT_ROUTE, APPPLICATION_CREATE_AUTO_FLOW, EXECUTE_INSTANCE_ROUTE, EXECUTION_HISTORY_ROUTE, SCHEDULED_JOBS_ROUTE, WORKFLOW_EDIT_ROUTE_ROUTE, WORKFLOW_EXECUTION_ROUTE } from '../../common/components/route_consts/data/ApplicationRoutesConfig';
import { findTab } from '../../common/components/route_consts/data/DataRoutesConfig';
import { APPLICATION_ROUTE } from '../../common/components/route_consts/data/RoutesConfig';
import Jobs from '../jobs/Jobs';
import ActionExecutionHomePage from './action_execution/ActionExecutionHomePage';
import ApplicationDetailView from './application_detail/ApplicationDetailView';
import BuildActionHomePage from './build_action_old/BuildActionHomePage';
import BuildAutoFlow from './build_auto_flow/BuildAutoFlow';
import AllApplicationView from './components/AllApplicationView';
import ApplicationCreationWizardDialog from './components/ApplicationCreationWizardDialog';
import ApplicationMarketplace from './components/ApplicationMarketplpace';
import ApplicationRunsByMe from './components/ApplicationRunsByMe';
import ScheduledJobsView from './components/ScheduledJobsView';
import EditActionPageNew from "./edit-action-new/EditActionPageNew";
import ExecuteInstanceHomePage from './execute-instance/ExecuteInstanceHomePage';
import ExecuteActionHomePage from './execute_action/ExecuteActionHomePage';
import BuildWebAppHomePage from "./web-app/build/BuildWebAppHomePage";
import WebAppEditHomePage from "./web-app/edit/WebAppEditHomePage";
import BuildWorkflowHomePage from './workflow/build_workflow/BuildWorkflowHomePage';
import EditWorkflowHomePage from './workflow/EditWorkflowHomePage';
import ExecuteWorkflowHomePage from './workflow/ExecuteWorkflowHomePage';
import ViewWorkflowExecutionHomePage from './workflow/ViewWorkflowExecutionHomePage';


export const ApplicationContent = withRouter(function TableBrowserRoutes() {
    const setModuleContext = useContext(SetModuleContextState)

    return (
        <Switch>
            <Box>
                <Route path='/application/jobs' component={Jobs}/>
                <Route path={APPLICATION_ROUTE_MARKETPLACE} component={ApplicationMarketplace}/>
                <Route path="/application/build-workflow" component={BuildWorkflowHomePage}/>
                <Route path={APPLICATION_BUILD_ACTION_ROUTE_ROUTE} component={BuildActionHomePage}/>
                {/* <Route path={APPLICATION_EDIT_ACTION_ROUTE_ROUTE} component={EditActionHomePage}/> */}
                <Route path={APPLICATION_EXECUTE_WORKFLOW} component={ExecuteWorkflowHomePage}/>
                <Route path={WORKFLOW_EXECUTION_ROUTE} component={ViewWorkflowExecutionHomePage}/>
                <Route path={APPLICATION_EXECUTE_ACTION} component={ExecuteActionHomePage}/>
                <Route path={WORKFLOW_EDIT_ROUTE_ROUTE} component={EditWorkflowHomePage}/>
                <Route path={EXECUTE_INSTANCE_ROUTE} component={ExecuteInstanceHomePage}/>
                <Route path={APPLICATION_EDIT_ACTION_ROUTE_ROUTE} component={EditActionPageNew}/>
                {/* <Route path={APPLICATION_DETAIL_ROUTE_ROUTE} component={ApplicationDetailView}></Route> */}
                <Route path={APPLICATION_CREATION_WIZARD_ROUTE} component={ApplicationCreationWizardDialog}></Route>
                <Route path={ACTION_EXECUTION_ROUTE} component={ActionExecutionHomePage}/>
                <Route path={APPPLICATION_CREATE_AUTO_FLOW} component={BuildAutoFlow}/>
                <Route path={EXECUTION_HISTORY_ROUTE} component={ExecutionHistory}/>
                <Route path={SCHEDULED_JOBS_ROUTE} component={ScheduledJobsWrapper} />
                <Route path={APPLICATION_WEB_APP_EDIT_ROUTE} component={WebAppEditHomePage} />
                <Route path={APPLICATION_WEB_APP_BUILD_ROUTE} component={BuildWebAppHomePage} />
                <Route exact path={APPLICATION_ROUTE} component={AllApplicationView}/>
                <Route exact path={APPLICATION_DETAIL_ROUTE_ROUTE} component={AllApplicationViewWrapper}/>
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
    const panelStyle = {
        width:'50%',
        height:'90vh',
        overflow:'scroll',
        p:1,
        backgroundColor:'#EAEBEF',
        boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.15), -2px -2px 2px rgba(154, 161, 169, 0.2)",
        borderRadius:'5px'
    }
    const panelStyle2 = {
        width:'50%',
        height:'90vh',
        overflow:'scroll',
        p:1,
        backgroundColor:'#EFF3FB',
        boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.15), -2px -2px 2px rgba(154, 161, 169, 0.2)",
        borderRadius:'5px'
    }
    return <Box sx={{mx:-1,display:'flex',flexDirection:'row',gap:1,}}> 
                <Box sx={{...panelStyle}}>
                <AllApplicationView/>
                </Box>
                <Box sx={panelStyle2}>
                <Switch>       
                    <Route path={APPLICATION_DETAIL_ROUTE_ROUTE} component={ApplicationDetailView}/>
                </Switch>
                </Box>
            </Box>
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
