import React from "react";
export type TabType = { id: string, label: string, href: string, title: string, subTitle: string, children?: TabsType };

export type TabsType = Array<TabType>;
export type TabsTreePropType = {
    tabs: TabsType,
    pathname: string,
    level: number,
    toggleModuleSwitch: any,
    isOpen: boolean,
    launchSettings: any
};
export type ModuleHeaderPropType =  {tab: TabType};
export type TabsContainerType = {
    level: number,
    activeTabChildren?: TabsType,
    activeTab: TabType,
    toggleModuleSwitch: any, open: boolean, value: number,
    isOpen: boolean,
    tabs: TabsType,
    launchSettings: any,
    areLeafTabs: boolean
}