import { Box, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import { StagesWithActions } from "./newStage/StagesWithActions";
import ShowGlobalParameters from "./ShowGlobalParameters";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
);
}

const WorkflowTabs = () => {
    const [tabValue, setTableValue] = React.useState(0)

    return (
        <Box >
            <Tabs value={tabValue} onChange={((event, newValue) => setTableValue(newValue))}>
               <Tab label="Flow" value={0} sx={{
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
                <Tab label="Summary" value={1} sx={{
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
            <Box>
                <TabPanel value={tabValue} index={0}>
                    <Box mt={2}>
                        <StagesWithActions/>
                    </Box>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Box mt={2}>
                        <ShowGlobalParameters/>
                    </Box>
                </TabPanel>
            </Box>
        </Box>
    )
}


export default WorkflowTabs