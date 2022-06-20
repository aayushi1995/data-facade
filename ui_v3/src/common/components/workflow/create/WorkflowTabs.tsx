import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import ActionDefinitionPublishStatus from "../../../../enums/ActionDefinitionPublishStatus";
import { WorkflowContext } from "../../../../pages/applications/workflow/WorkflowContext";
import { BuildActionContext } from "../../../../pages/build_action/context/BuildActionContext";
import { StagesWithActions } from "./newStage/StagesWithActions";
import ShowGlobalParameters from "./ShowGlobalParameters";
import WorkflowSummary from "./WorkflowSummary";
import ErrorIcon from '@mui/icons-material/Error';
import DoneIcon from '@mui/icons-material/Done';


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

export interface WorfkflowTabsProps {
    onRun?: () => void,
    onSave?: () => void,
    onDuplicate?: () => void,
    onTest?: () => void,
}

const WorkflowTabs = (props: WorfkflowTabsProps) => {
    const [tabValue, setTableValue] = React.useState(0)
    const actionContext = React.useContext(BuildActionContext)
    const workflowContext = React.useContext(WorkflowContext)

    return (
        <Box >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
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
                            <Tab label="Parameters" value={1} sx={{
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
                            <Tab label="Summary" value={2} sx={{
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
                <Box sx={{ display: "flex", flexDirection: "row-reverse", flexGrow: 1, gap: 3 }}>   
                    <Button variant="contained"
                        onClick={() => props?.onRun?.()} 
                        sx={{ 
                            minWidth: "150px",
                            borderRadius: "64px" 
                        }}
                        disabled={actionContext?.actionDefinitionWithTags?.actionDefinition?.PublishStatus !== ActionDefinitionPublishStatus.READY_TO_USE}
                    >
                        Run
                    </Button>
                    <Button variant="contained" onClick={() => props?.onSave?.()} sx={{ 
                        minWidth: "150px", 
                        background: "#56D280",
                        borderRadius: "64px" 
                    }}>
                        Save
                    </Button>
                    <Button variant="contained"
                        onClick={() => props?.onTest?.()}
                        sx={{ 
                        minWidth: "150px",
                        borderRadius: "64px",
                    }}>
                        Test
                    </Button>
                    <Button variant="contained" sx={{ 
                        minWidth: "150px",
                        borderRadius: "64px",
                        background: "#F178B6"
                    }} onClick={() => props?.onDuplicate?.()}>
                        Duplicate
                    </Button>
                    <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
                        {workflowContext.ErrorState ? <ErrorIcon sx={{transform: "scale(1.5)"}}/> : <DoneIcon sx={{ transform: "scale(1.5)"  }}/> }
                    </Box>
                </Box>
            </Box>
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
                <TabPanel value={tabValue} index={2}>
                    <Box mt={2}>
                        <WorkflowSummary/>
                    </Box>
                </TabPanel>
            </Box>
        </Box>
    )
}


export default WorkflowTabs