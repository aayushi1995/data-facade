import {TabsType} from "../schema";

const BLANK_STRING = '';
export const DATA_ROUTE = '/data';
export const DATA_CONNECTIONS_ROUTE = '/data/connections';
export const DATA_RAW_ROUTE = '/data/raw';
export const DATA_DERIVED_ROUTE = '/data/derived';

export const APPLICATION_ROUTE = '/application';
export const INSIGHTS_ROUTE = '/insights';

export const dataSubTabs: TabsType = [
    {
        id: 'Connections',
        label: 'Connections',
        href: DATA_CONNECTIONS_ROUTE,
        title: "DATA",
        subTitle: "Create, Manage, Data connections and data from here",
    },
    {
        id: 'Raw',
        label: 'Raw',
        href: DATA_RAW_ROUTE,
        title: "DATASET DETAILS",
        subTitle: "Create, Manage, Dataset from here"
    },
    {
        id: 'Derived',
        label: 'Derived',
        href: DATA_DERIVED_ROUTE,
        title: BLANK_STRING,
        subTitle: BLANK_STRING
    }
];

export const tabs: TabsType = [
    {
        id: 'DATA',
        label: 'DATA',
        href: DATA_ROUTE,
        children: dataSubTabs,
        title: BLANK_STRING,
        subTitle: BLANK_STRING
    },
    {
        id: 'APPLICATION',
        label: 'APPLICATION',
        href: APPLICATION_ROUTE,
        title: BLANK_STRING,
        subTitle: BLANK_STRING
    },
    {
        id: 'INSIGHTS',
        label: 'INSIGHTS',
        href: INSIGHTS_ROUTE,
        title: BLANK_STRING,
        subTitle: BLANK_STRING
    },
]