import {Box, Button, Popover, Tab, Tabs} from "@mui/material";
import {ModuleContext, ModuleSetContext, ModuleType} from "./data/ModuleContext";
import React, {useContext, useRef, useState} from "react";
import ModuleSwitcherIcon from './images/module-switcher.svg';
import SettingsIcon from './images/settings.svg';
import {NavLink as RouterLink, useLocation} from 'react-router-dom';
import {TabsContainerType, TabsTreePropType} from "./schema";
import {ModuleContent} from "../ModuleContent";
import {ButtonIconWithToolTip} from "../ButtonIconWithToolTip";
import {tabs} from "./data/RoutesConfig";


export function findCurrentSelectedTabIndex({tabs, pathname, level}: Pick<TabsTreePropType, "tabs" | "pathname" | "level">) {
    return tabs.findIndex(({href}) => {
        const slugs = pathname.split('/').filter(slug => !!slug);
        return '/' + slugs.slice(0, level + 1).join('/') === href
    });
}

export function TabsContainer(props: TabsContainerType) {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const {
        areLeafTabs,
        tabs,
        launchSettings,
        level,
        isOpen,
        toggleModuleSwitch,
        value
    } = props;
    const isFistTab = level === 0;
    return (
        <>
            <Box
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
                                                                height={25} width={25}/>}
                                                onClick={toggleModuleSwitch}
                                                background={false}
            /> : areLeafTabs ?  <div/>: <ModuleContent.ModuleSubHeader/>}
            {(isFistTab && !isOpen) ? null : <>
                <Tabs value={value}>
                    {tabs && tabs?.map(({label, href}) =>
                        <Tab label={label} key={label} sx={{px: 10}} component={RouterLink} to={href}/>
                    )}
                </Tabs>
                {isFistTab ? <Box ref={anchorRef} onClick={handleOpen}><ButtonIconWithToolTip title="settings" 
                                                    Icon={() => <img src={SettingsIcon} alt="settings" height={25}
                                                                    width={25}/>}
                                                    onClick={launchSettings}
                                                    background={false}
                /></Box>: <div/>}
            </>}</Box>
            <Popover
                anchorEl={anchorRef.current}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom'
                }}
                keepMounted
                onClose={handleClose}
                open={open}
                PaperProps={{
                    sx: {width: 240}
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2}}>
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{display: "flex"}}>
                            <RouterLink to="/application/jobs">
                                <Button variant="contained">Jobs And Logs </Button>
                            </RouterLink>
                        </Box>
                    </Box>
                </Box>
            </Popover>
        </>
    )
}

const TabsTree = (props: TabsTreePropType) => {
    const {tabs, level, toggleModuleSwitch, isOpen, launchSettings} = props;
    const isFistTab = level === 0;
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
            gap: 1,
            mx: isFistTab? 0: 6
        }}>
        <TabsContainer
            areLeafTabs={areLeafTabs}
            toggleModuleSwitch={toggleModuleSwitch}
            launchSettings={launchSettings}
            level={level}
            activeTabChildren={activeTabChildren}
            activeTab={activeTab}
            isOpen={isOpen}
            open={isOpen}
            value={activeTabIndex}
            tabs={tabs}/>
        {areLeafTabs ? <ModuleContent.ModuleHeader
            tab={activeTab}
        />: null}
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


