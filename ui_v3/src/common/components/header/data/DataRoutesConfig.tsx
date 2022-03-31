import {TabsType} from "../schema";

export const DATA_ROUTE = '/data';
export const DATA_CONNECTIONS_ROUTE = '/data/connections';
export const DATA_RAW_ROUTE = '/data/raw';
export const DATA_DERIVED_ROUTE = '/data/derived';

export const DATA_CONNECTIONS_UPLOAD_ROUTE = '/data/connections/upload-file';
export const DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE = `${DATA_CONNECTIONS_UPLOAD_ROUTE}/preview`;
export const DATA_CONNECTIONS_UPLOAD_COLUMNS_ROUTE = `${DATA_CONNECTIONS_UPLOAD_ROUTE}/columns`;
export const BLANK_STRING = '';

export const DATA_SUB_TABS: TabsType = [
    {
        id: 'Connections',
        label: 'Connections',
        href: DATA_CONNECTIONS_ROUTE,
        title: "Extenal Connections",
        subTitle: "Create, Manage, Data connections and data from here",
    },
    {
        id: 'Raw',
        label: 'Raw',
        href: DATA_RAW_ROUTE,
        title: "Ingested Tables",
        subTitle: "Create, Manage, Dataset from here"
    },
    {
        id: 'Derived',
        label: 'Derived',
        href: DATA_DERIVED_ROUTE,
        title: "Derived Tables",
        subTitle: BLANK_STRING
    }
];

