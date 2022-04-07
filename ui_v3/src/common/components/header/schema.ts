export type TabType = { id: string, label: string, href: string, title: string, subTitle: string, children?: TabsType };

export type TabsType = Array<TabType>;
export type TabsTreePropType = {
    tabs: TabsType,
    pathname: string,
    level: number
};
export type ModuleHeaderPropType =  {tab: TabType};
export type TabsContainerType = {
    level: number,
    value: number,
    tabs: TabsType,
}