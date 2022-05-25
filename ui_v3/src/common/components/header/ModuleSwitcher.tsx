import { Box, Button, Popover, Tab, Tabs } from "@mui/material";
import React, { useRef, useState } from "react";
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { ButtonIconWithToolTip } from "../ButtonIconWithToolTip";
import { ModuleContent } from "../ModuleContent";
import { ModuleContext, SetModuleContext } from "./data/ModuleContext";
import { TOP_TAB_ROUTES } from "./data/RoutesConfig";
import ModuleSwitcherIcon from './images/module-switcher.svg';
import SettingsIcon from './images/settings.svg';
import { TabsContainerType, TabsTreePropType } from "./schema";


export function findCurrentSelectedTabIndex({tabs, pathname, level}: Pick<TabsTreePropType, "tabs" | "pathname" | "level">) {
    return tabs.findIndex(({href}) => {
        const slugs = pathname.split('/').filter(slug => !!slug);
        return '/' + slugs.slice(0, level + 1).join('/') === href
    });
}

export function TabsContainer(props: TabsContainerType) {
    // const moduleContext = React.useContext(ModuleContext)
    const {tabs, level, value} = props;

    const isLevel0TabsContainer = level === 0;
    const moduleContext = React.useContext(ModuleContext)
    const setModuleContext = React.useContext(SetModuleContext)
    const [settingPopOverVisibile, setSettingPopOverVisible] = useState(false);
    const anchorRef = useRef(null);



    
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: isLevel0TabsContainer ? "space-between" : "center",
            height: 50,
            position: level === 0 && !moduleContext.tabsVisible ? 'absolute': 'relative',
            width: '100%',
            backgroundColor: level === 0 && moduleContext.tabsVisible ? "background.paper" : "background.default"
         }}>
            { isLevel0TabsContainer && 
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ButtonIconWithToolTip title="toggle"
                        Icon={() => <img src={ModuleSwitcherIcon}
                                        style={{transform: (moduleContext.tabsVisible ? '' : 'rotate(90deg)')}}
                                        alt="toggle"
                                        height={25} width={25}
                                    />}
                        onClick={() => setModuleContext({ type: "ToggleTabsVisibility" })}
                        background={false}
                    />
                </Box>
            }
            {  moduleContext.tabsVisible && 
                <Box>
                    <Box>
                        <Tabs value={value}>
                            {tabs && tabs?.map(({label, href}) => {
                                return <Tab label={label} key={label} sx={{px: 10}} component={RouterLink} to={href}/>
                            }
                            )}
                        </Tabs>
                    </Box>   
                </Box>
            }
            {isLevel0TabsContainer && 
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box ref={anchorRef} onClick={() => setSettingPopOverVisible(true)} >
                        <ButtonIconWithToolTip 
                            title="settings" 
                            Icon={() => <img src={SettingsIcon} 
                                            alt="settings" 
                                            height={25}
                                            width={25}
                                        />}
                            background={false}/>
                    </Box>
                    <Popover
                        anchorEl={anchorRef.current}
                        anchorOrigin={{
                            horizontal: 'center',
                            vertical: 'bottom'
                        }}
                        keepMounted
                        onClose={() => setSettingPopOverVisible(false)}
                        open={settingPopOverVisibile}
                        PaperProps={{
                            sx: {width: 240}
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2}}>
                            <Box sx={{display: "flex"}}>
                                <RouterLink to="/application/jobs">
                                    <Button variant="contained">Jobs And Logs </Button>
                                </RouterLink>
                            </Box>
                            <Box sx={{display: "flex"}}>
                                <RouterLink to="/users">
                                    <Button variant="contained">Users </Button>
                                </RouterLink>
                            </Box>
                        </Box>
                    </Popover>
                </Box>
            }
        </Box>
    )
}

const TabsTree = (props: TabsTreePropType) => {
    const {tabs, level} = props;

    const isFistTab = level === 0;
    const _activeTabIndex = findCurrentSelectedTabIndex(props);
    const activeTabIndex = _activeTabIndex === -1 ? 0 : _activeTabIndex;
    const activeTab = tabs[activeTabIndex];
    const activeTabChildren = activeTab?.children;
    const areLeafTabs = !activeTabChildren || activeTabChildren?.length === 0;

    return (
        <Box sx={{ width: "100%" }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    gap: 1,
                    mx: isFistTab ? 0 : 6
                }}
            >
                <TabsContainer
                    level={level}
                    value={activeTabIndex}
                    tabs={tabs}
                />
                {
                    areLeafTabs ? 
                        <Box>
                            <Box sx={{ mx: isFistTab ? 6: 0 }}>
                                <ModuleContent.Header
                                    tab={activeTab}
                                />
                            </Box>
                            <Box sx={{ px: 2 }}>
                                <ModuleContent.MainContent/> 
                            </Box>
                        </Box>
                        
                    : 
                        activeTabChildren ? 
                            <TabsTree
                                {...props}
                                tabs={activeTabChildren}
                                level={level + 1}
                            />
                        : 
                        null
                }
            </Box>
        </Box>
    )
}

export const ModuleSwitcher = () => {
    const {pathname} = useLocation();


    return(
        <TabsTree 
            pathname={pathname} 
            tabs={TOP_TAB_ROUTES} 
            level={0}
        />
    )
}


