import {TabsType, TabType} from "../schema";
const BLANK_STRING = '';

export const getTabByProp = (prop: keyof TabType) =>(value: string)=> {
    let searchedTab;
    const traverseTabs = (tabs: TabsType)=>tabs.forEach((tab)=>{
        if(tab[prop] === value){
            searchedTab = tab
        }
        if(tab?.children && tab?.children?.length>0){
            traverseTabs(tab.children);
        }
    })
    traverseTabs(tabs);
    return searchedTab;
}
export const getTabById = getTabByProp('id');
export const getTabByHref = getTabByProp('href');

export const dataSubTabs: TabsType = [
    {
        id: 'Connections',
        label: 'Connections',
        href: '/data/connections',
        title: BLANK_STRING,
        subTitle: BLANK_STRING,
        children: [
            {
                id: 'Preview',
                label: 'Preview',
                href: '/data/connections/preview',
                title: "DATA",
                subTitle: "Create, Manage, Data connections and data from here"
            }, {
                id: 'Column',
                label: 'Column',
                href: '/data/connections/column',
                title: BLANK_STRING,
                subTitle: BLANK_STRING
            },
        ]
    },
    {
        id: 'Raw',
        label: 'Raw',
        href: '/data/raw',
        title: BLANK_STRING,
        subTitle: BLANK_STRING,
        children: [
            {
                id: 'PreviewR',
                label: 'PreviewR',
                href: '/data/raw/preview',
                title: "DATA",
                subTitle: "Create, Manage, Data connections and data from here"
                //LeafHeroComponent: (tab)=>
                //LeafTabPanel:
                //LeafLeftSideComponent
            }, {
                id: 'ColumnR',
                label: 'ColumnR',
                href: '/data/raw/column',
                title: BLANK_STRING,
                subTitle: BLANK_STRING
            },
        ]
    },
    {
        id: 'Derived',
        label: 'Derived',
        href: '/data/derived',
        title: BLANK_STRING,
        subTitle: BLANK_STRING
    }
];
export const tabs: TabsType = [
    {
        id: 'DATA',
        label: 'DATA',
        href: '/data',
        children: dataSubTabs,
        title: BLANK_STRING,
        subTitle: BLANK_STRING
    },
    {
        id: 'APPLICATION',
        label: 'APPLICATION',
        href: '/application',
        title: BLANK_STRING,
        subTitle: BLANK_STRING
    },
    {
        id: 'INSIGHTS',
        label: 'INSIGHTS',
        href: '/insights',
        title: BLANK_STRING,
        subTitle: BLANK_STRING
    },
]