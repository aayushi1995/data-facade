import { TabsType } from "../schema";

export const DATA_ROUTE = '/data';
export const DATA_CONNECTIONS_ROUTE = '/data/connections';
export const DATA_RAW_ROUTE = '/data/raw';
export const DATA_DERIVED_ROUTE = '/data/derived';

export const DATA_TABLE_VIEW = `${DATA_RAW_ROUTE}/:TableName`
export const DATA_TABLE_TAB = `${DATA_TABLE_VIEW}/View/:ViewName`

export const DATA_TABLE_TAB_SUMMARY = "Summary"
export const DATA_TABLE_TAB_COLUMNS = "Columns"
export const DATA_TABLE_TAB_QUICK_VIEW = "QuickView"
export const DATA_TABLE_TAB_QUICK_STATS = "QuickStats"
export const DATA_TABLE_TAB_CHECKS = "Checks"
export const DATA_TABLE_TAB_DATA_CLEAN_ACTIONS = "DataCleanActions"
export const DATA_TABLE_TAB_ACTION_INSTANCES = "ActionInstances"
export const DATA_TABLE_TAB_INTERMEDIARY_TABLES = "IntermediaryTables"
export const DATA_TABLE_TAB_DEFAULT = `${DATA_TABLE_VIEW}/View/${DATA_TABLE_TAB_SUMMARY}`

export const DATA_COLUMN_VIEW = `${DATA_TABLE_VIEW}/Column/:ColumnName`
export const DATA_COLUMN_TAB = `${DATA_COLUMN_VIEW}/View/:ViewName`

export const DATA_COLUMN_TAB_QUICK_STATS = `QuickStats`
export const DATA_COLUMN_TAB_CHECKS = `Checks`
export const DATA_COLUMN_TAB_DEFAULT = `${DATA_COLUMN_VIEW}/View/${DATA_COLUMN_TAB_QUICK_STATS}`


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

