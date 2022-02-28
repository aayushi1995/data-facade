import {Box, Tab, Tabs} from "@material-ui/core";
import {ModuleContext, ModuleSetContext, ModuleType} from "./data/ModuleContext";
import React, {useContext} from "react";
import {ButtonIconWithToolTip} from "../../../pages/table_browser/components/DataSetsTable";
import ModuleSwitcherIcon from './images/module-switcher.svg';
import SettingsIcon from './images/settings.svg';
import {NavLink as RouterLink, Redirect, Switch, useLocation} from 'react-router-dom';
import {Divider} from "@mui/material";
import {tabs} from "./data/DataRoutesConfig";
import {TabsContainerType, TabsTreePropType} from "./schema";
import {ModuleContent} from "./ModuleContent";


function findCurrentSelectedTabIndex({tabs, pathname, level}: TabsTreePropType) {
    return tabs.findIndex(({href}) => {
        const slugs = pathname.split('/').filter(slug => !!slug);
        return '/' + slugs.slice(0, level + 1).join('/') === href
    });
}

function TabsContainer(props: TabsContainerType) {
    const {
        areLeafTabs,
        tabs,
        RightComponent,
        launchSettings,
        activeTab,
        level,
        isOpen,
        toggleModuleSwitch,
        LeftComponent,
        value
    } = props;
    const isFistTab = level === 0;
    return <Box
        sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: level === 0 ? "background.paper" : "background.default",
            flex: (isFistTab && !isOpen) ? 0 : 1,
            position: 'relative'
        }}>
        {isFistTab ? <ButtonIconWithToolTip title="toggle"
                                            Icon={() => <img src={ModuleSwitcherIcon}
                                                             style={{transform: (isOpen ? '' : 'rotate(90deg)')}}
                                                             alt="toggle"
                                                             height={20} width={20}/>}
                                            onClick={toggleModuleSwitch}
        /> : <LeftComponent tab={activeTab}/>}
        {(isFistTab && !isOpen) ? null : <>
            <Tabs value={value}>
                {tabs && tabs?.map(({label, href}) =>
                    <Tab label={label} key={label} sx={{px: 10}} component={RouterLink} to={href}/>
                )}
            </Tabs>
            {isFistTab ? <ButtonIconWithToolTip title="settings"
                                                Icon={() => <img src={SettingsIcon} alt="settings" height={20}
                                                                 width={20}/>}
                                                onClick={launchSettings}
            /> : areLeafTabs ? <RightComponent/> : <div></div>}
        </>}</Box>;
}

const TabsTree = (props: TabsTreePropType) => {
    const {tabs, level, toggleModuleSwitch, isOpen, launchSettings} = props;
    const _activeTabIndex = findCurrentSelectedTabIndex(props);
    const activeTabIndex = _activeTabIndex === -1 ? 0 : _activeTabIndex;
    const activeTab = tabs[activeTabIndex];
    const activeTabChildren = activeTab?.children;
    const areLeafTabs = !activeTabChildren || activeTabChildren?.length === 0;
    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: 1
        }}>

        {areLeafTabs ? <>
            <ModuleContent.ModuleHeader
                tab={activeTab}
            />
            <Divider/></> : null}
        <TabsContainer
            areLeafTabs={areLeafTabs}
            toggleModuleSwitch={toggleModuleSwitch}
            launchSettings={launchSettings}
            level={level}
            activeTabChildren={activeTabChildren}
            LeafHeroComponent={ModuleContent.ModuleHeader}
            activeTab={activeTab}
            isOpen={isOpen}
            LeftComponent={({tab}) => areLeafTabs ? <ModuleContent.ModuleSubHeader/> : <div/>}
            open={isOpen} value={activeTabIndex} tabs={tabs}
            RightComponent={() => <div/>}/>
        <Switch>
            <Redirect exact from={'/data'} to={tabs[0].href}/>
        </Switch>
        {areLeafTabs ?
            <ModuleContent.MainContent/> :
            <TabsTree
                {...props}
                tabs={activeTabChildren}
                level={level + 1}
            />}

    </Box>;
}

export const ModuleSwitcher = () => {
    const currentModule = useContext(ModuleContext);
    const {pathname} = useLocation();
    const isOpen = currentModule.isOpen;
    const setModule = useContext(ModuleSetContext);

    const toggleModuleSwitch = () => {
        setModule((oldModuleState: ModuleType) => ({
            ...oldModuleState,
            isOpen: !oldModuleState.isOpen
        }));
    }

    const launchSettings = () => {
        //todo
    }

    return <TabsTree
        pathname={pathname} tabs={tabs} level={0}
        isOpen={isOpen} launchSettings={launchSettings}
        toggleModuleSwitch={toggleModuleSwitch}
    />;
}


