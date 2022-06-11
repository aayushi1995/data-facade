import { TabsType } from "../schema";

const APPLICATION_ROUTE = '/application'

export const APPLICATION_ROUTE_ALL = `${APPLICATION_ROUTE}/all`
export const APPLICATION_CREATION_WIZARD_ROUTE = `${APPLICATION_ROUTE}/app-builder`
export const APPLICATION_DETAIL_ROUTE_ROUTE = `${APPLICATION_ROUTE}/detail/:applicationId`
export const APPLICATION_EDIT_ACTION_ROUTE_ROUTE = `${APPLICATION_ROUTE}/edit-action/:ActionDefinitionId`
export const APPLICATION_BUILD_ACTION_ROUTE_ROUTE = `${APPLICATION_ROUTE}/build-action`
export const WORKFLOW_EXECUTION_ROUTE = `/application/workflow-execution/:WorkflowExecutionId`
export const ACTION_EXECUTION_ROUTE = `${APPLICATION_ROUTE}/action-execution/:ActionExecutionId`
export const EXECUTE_INSTANCE_ROUTE = `${APPLICATION_ROUTE}/execute-instance/:actionInstanceId`
export const WORKFLOW_EDIT_ROUTE = `${APPLICATION_ROUTE}/edit-workflow/:WorkflowId`
export const APPPLICATION_CREATE_AUTO_FLOW = `${APPLICATION_ROUTE}/create-autoFlow`
export const SCHEDULED_JOBS_ROUTE = `${APPLICATION_ROUTE}/scheduled`

export const APPLICATION_SUB_TABS: TabsType = [
    {
        id: 'Models',
        label: 'Models',
        href: APPLICATION_ROUTE,
        title: "Models",
        subTitle: "Create and manage your Models from here",
    },
    {
        id: 'Scheduled',
        label: 'Scheduled',
        href: SCHEDULED_JOBS_ROUTE,
        title: "Scheduled",
        subTitle: "View Scheduled Jobs from here"
    }
];


console.log(APPLICATION_SUB_TABS)

