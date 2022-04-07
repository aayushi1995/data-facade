import { TabsType } from "../schema";
import { DATA_SUB_TABS } from "./DataRoutesConfig";

export const BLANK_STRING = '';
export const APPLICATION_ROUTE = '/application';
export const INSIGHTS_ROUTE = '/insights';
export const DATA_ROUTE = '/data/raw';

export const tabs: TabsType = [
    {
        id: 'DATA',
        label: 'DATA',
        href: DATA_ROUTE,
        children: DATA_SUB_TABS,
        title: BLANK_STRING,
        subTitle: BLANK_STRING
    },
    {
        id: 'APPLICATION',
        label: 'APPLICATION',
        href: APPLICATION_ROUTE,
        title: "Application",
        subTitle: "Create, Manage Applications from here"
    },
    {
        id: 'INSIGHTS',
        label: 'INSIGHTS',
        href: INSIGHTS_ROUTE,
        title: BLANK_STRING,
        subTitle: BLANK_STRING
    },
]