import { TabsType } from "../schema";
import { APPLICATION_SUB_TABS } from "./ApplicationRoutesConfig";
import { DATA_CONNECTIONS_ROUTE, DATA_SUB_TABS } from "./DataRoutesConfig";

export const BLANK_STRING = '';
export const APPLICATION_ROUTE = '/application';
export const APPLICATION_DETAIL_ROUTE = '/application/detail';
export const INSIGHTS_ROUTE = '/insights';
export const USER_ROUTE = '/users';
export const LEARN_ROUTE = '/learn';
export const HOME_ROUTE = '/'
export const TOP_TAB_ROUTES: TabsType = [
    {
        id: 'DATA',
        label: 'DATA',
        href: DATA_CONNECTIONS_ROUTE,
        children: DATA_SUB_TABS,
        title: BLANK_STRING,
        subTitle: BLANK_STRING
    },
    {
        id: 'APPLICATION',
        label: 'APPLICATION',
        href: APPLICATION_ROUTE,
        title: BLANK_STRING,
        subTitle: BLANK_STRING,
        children: APPLICATION_SUB_TABS
    },
    {
        id: 'INSIGHTS',
        label: 'INSIGHTS',
        href: INSIGHTS_ROUTE,
        title: "Insights",
        subTitle: "Create, Manage Insights from here"
    },

]