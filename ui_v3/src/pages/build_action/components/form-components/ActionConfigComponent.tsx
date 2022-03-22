import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import { TabPanel } from "../../../../common/components/workflow/create/SelectAction/SelectAction";
import SetActionParameters from "../common-components/SetActionParameters";
import EditActionTemplates from "./EditActionTemplates";
import TestAndDeploy from "./TestAndDeploy";

const ActionConfigComponent = () => {
    const [activeTab, setActiveTab] = React.useState(1)
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 1, minHeight: "100%"}} className="wa">
            <Box>
                <Tabs value={activeTab} onChange={((event, newValue) => setActiveTab(newValue))}>
                    <Tab label="Parameters" value={0} sx={{
                            fontFamily: "SF Pro Text",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: "14px",
                            lineHeight: "24px",
                            display: "flex",
                            alignItems: "center",
                            textAlign: "center",
                            opacity: 0.7
                    }}/>
                    <Tab label="Code" value={1} sx={{
                            fontFamily: "SF Pro Text",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: "14px",
                            lineHeight: "24px",
                            display: "flex",
                            alignItems: "center",
                            textAlign: "center",
                            opacity: 0.7
                    }}/>
                    <Tab label="Save And Deploy" value={2} sx={{
                            fontFamily: "SF Pro Text",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: "14px",
                            lineHeight: "24px",
                            display: "flex",
                            alignItems: "center",
                            textAlign: "center",
                            opacity: 0.7
                    }}/>
                </Tabs>
            </Box>
            <Box sx={{pt: 2, minHeight: "100%"}}>
                <TabPanel value={activeTab} index={0}>
                    <SetActionParameters/>
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <EditActionTemplates/>
                </TabPanel>
                <TabPanel value={activeTab} index={2}>
                    <TestAndDeploy/>
                </TabPanel>
            </Box>
        </Box>    
    )
}

export default ActionConfigComponent;