import { TabContext, TabPanel } from "@mui/lab";
import { generatePath, useHistory, useRouteMatch } from "react-router";
import { DATA_CONNECTION_DETAIL_TAB, DATA_CONNECTION_DETAIL_TAB_LOGS, DATA_CONNECTION_DETAIL_TAB_OVERVIEW, DATA_CONNECTION_DETAIL_TAB_SETUP } from "../../../common/components/header/data/DataRoutesConfig";
import { Box, Tab, Tabs } from "@mui/material"
import ConnectionOverview from "./ConnectionOverview";
import React from "react";
import ConnectionDetailsSetup from "./ConnectionDetailsSetup";


export const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
};

const CONNECTION_DETAILS_TABS = [
    {
        Label: "Overview",
        View: DATA_CONNECTION_DETAIL_TAB_OVERVIEW
    },
    {
        Label: "Setup",
        View: DATA_CONNECTION_DETAIL_TAB_SETUP
    },
    {
        Label: "Log",
        View: DATA_CONNECTION_DETAIL_TAB_LOGS
    }
]

interface MatchParams {
    ViewName?: string,
    ProviderInstanceId?: string
}

const ConnectionDetails = () => {
    const match = useRouteMatch<MatchParams>()
    const history = useHistory()
    const tabState = CONNECTION_DETAILS_TABS.find(info => info.View === match.params.ViewName)?.View!

    const handleTabChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
        history.replace(generatePath(DATA_CONNECTION_DETAIL_TAB, {
            ProviderInstanceId: match.params.ProviderInstanceId,
            ViewName: newValue
        }))
    }

    return (
        <TabContext value={tabState}>
            <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100%', minWidth: '100%'}}>
                <Tabs
                    indicatorColor="primary"
                    scrollButtons="auto"
                    textColor="primary"
                    variant="scrollable"
                    onChange={handleTabChange}
                    value={tabState}
                >
                    {CONNECTION_DETAILS_TABS.map((tab, index) => (
                        <Tab key={tab.View} value={tab.View} label={tab.Label} {...a11yProps(index)} />
                    ))}
                </Tabs>
                <Box sx={{minWidth: '100%', minHeight: '100%'}}>
                    <TabPanel tabIndex={0} value={DATA_CONNECTION_DETAIL_TAB_OVERVIEW} sx={{minWidth: '100%'}}>
                        <ConnectionOverview ProviderInstanceId={match.params.ProviderInstanceId || 'NA'}/>
                    </TabPanel>
                    <TabPanel value={DATA_CONNECTION_DETAIL_TAB_SETUP}>
                        <ConnectionDetailsSetup ProviderInstanceId={match.params.ProviderInstanceId || 'NA'}/>
                    </TabPanel>
                </Box>
            </Box>
        </TabContext>
    )
}


export default ConnectionDetails


