import { TabsType } from "../schema";

export const APPLICATION_ROUTE = '/application'

export const APPLICATION_ROUTE_MARKETPLACE = `${APPLICATION_ROUTE}/marketplace`
export const APPLICATION_ROUTE_ALL = `${APPLICATION_ROUTE}/all`
export const APPLICATION_CREATION_WIZARD_ROUTE = `${APPLICATION_ROUTE}/app-builder`
export const APPLICATION_DETAIL_ROUTE_ROUTE = `${APPLICATION_ROUTE}/detail/:applicationId`
export const APPLICATION_EDIT_ACTION_ROUTE_ROUTE = `${APPLICATION_ROUTE}/edit-action/:ActionDefinitionId`
export const APPLICATION_BUILD_ACTION_ROUTE_ROUTE = `${APPLICATION_ROUTE}/build-action`
export const APPLICATION_BUILD_FLOW_ROUTE_ROUTE = `${APPLICATION_ROUTE}/build-workflow`
export const WORKFLOW_EXECUTION_ROUTE = `/application/workflow-execution/:WorkflowExecutionId`
export const ACTION_EXECUTION_ROUTE = `${APPLICATION_ROUTE}/action-execution/:ActionExecutionId`
export const EXECUTE_INSTANCE_ROUTE = `${APPLICATION_ROUTE}/execute-instance/:actionInstanceId`
export const WORKFLOW_EDIT_ROUTE = `${APPLICATION_ROUTE}/edit-workflow/:WorkflowId`
export const APPPLICATION_CREATE_AUTO_FLOW = `${APPLICATION_ROUTE}/create-autoFlow`
export const SCHEDULED_JOBS_ROUTE = `${APPLICATION_ROUTE}/scheduled`
export const EXECUTION_HISTORY_ROUTE = `${APPLICATION_ROUTE}/execution-history`
export const APPLICATION_DETAIL_ROUTE = `${APPLICATION_ROUTE}/detail`
export const APPLICATION_EXECUTE_WORKFLOW = `${APPLICATION_ROUTE}/execute-workflow`
export const APPLICATION_JOBS = `${APPLICATION_ROUTE}/jobs`
export const APPLICATION_EXECUTE_ACTION = `/application/execute-action/:ActionDefinitionId`
export const WORKFLOW_EDIT_ROUTE_ROUTE = `${APPLICATION_ROUTE}/edit-workflow`
export const APPLICATION_SUB_TABS: TabsType = [
    {
        id: 'Packages',
        label: 'Packages',
        href: APPLICATION_ROUTE,
        title: "Packages",
        subTitle: "Create and manage your Packages from here",
    },
    {
        id: 'Scheduled',
        label: 'Scheduled',
        href: SCHEDULED_JOBS_ROUTE,
        title: "Scheduled",
        subTitle: "View Scheduled Jobs from here"
    },
    {
        id: 'History',
        label: 'History',
        href: EXECUTION_HISTORY_ROUTE,
        title: "History",
        subTitle: "View Previously Run Jobs from here"
    }
];


console.log(APPLICATION_SUB_TABS)
