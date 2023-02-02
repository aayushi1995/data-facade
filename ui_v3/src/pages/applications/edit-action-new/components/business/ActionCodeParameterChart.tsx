import { TabContext } from "@mui/lab";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Dialog, DialogContent, Divider, Tab, Tabs } from "@mui/material";
import EditActionChartConfig from "../../../build_action_old/components/form-components/EditActionChartConfig";
import useActionCodeParameter from "../../hooks/useActionCodeParameter";
import { paramChipContainer, tabContainer } from "../../style/ActionCodeParamStyle";
import ActionCode from "../presentation/custom/ActionCode";
import ActionParameter from "../presentation/custom/ActionParameter";
import { ActiveParameterConfiguratorHeaderTypography } from "../presentation/styled_native/ActiveParameterConfiguratorTypography";
import ActionActiveParameterConfigurator from "./ActionActiveParameterConfigurator";
import ActionParameterChip from "./ActionParameterChip";
import ActionParameterConfigurationStepper from "./ActionParameterConfigurationStepper";
import ActionParamterOperationsTop from "./ActionParameterOperationsTop";
import ActionParamterOperationsBottom from "./ActionParamterOperationsBottom";


function ActionCodeParameterChart() {
    const {activeTab, setActiveTab, actionCodeProps, actionParameterProps, actionParameterConfigurationStepperProps, actionParameterOperationsBottomProps, actionParameterOperationsTopProps, activeParameterId, clearActiveParameterId} = useActionCodeParameter({ initialActiveTab: "Code" })
    const closeDialog = () => clearActiveParameterId()

    return (
        <Box>
            <Box sx={{...paramChipContainer}}>
                <ActionParameterChip/>
            </Box>
            <Divider/>
            <Box sx={{...tabContainer}}>
                <Box>
                    <Tabs
                        value={activeTab}
                        onChange={(event, newValue: string) => setActiveTab(newValue)}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                    >
                        <Tab label="Code" value="Code"/>
                        <Tab label="Parameter" value="Parameter"/>
                        <Tab label="Chart" value="Chart"/>
                    </Tabs>
                </Box>
            </Box>
            <TabContext value={activeTab}>
                <TabPanel value="Code">
                    <ActionCode {...actionCodeProps}/>
                </TabPanel>
                <TabPanel value="Parameter">
                    <ActionParameter {...actionParameterProps}/>
                </TabPanel>
                <TabPanel value="Chart">
                    <EditActionChartConfig />
                </TabPanel>
            </TabContext>
            <Dialog  open={activeParameterId!==undefined} onClose={closeDialog} maxWidth='sm' sx={{borderRadius:'0px'}}>
                <DialogContent sx={{borderRadius:'0px'}}>
                    <Box sx={{ display: "flex", flexDirection: "row" ,pl:2}}>
                        <Box sx={{ flex: 1}}>
                            <ActiveParameterConfiguratorHeaderTypography>
                                Parameter Configuration
                            </ActiveParameterConfiguratorHeaderTypography>
                        </Box>
                        <ActionParamterOperationsTop {...actionParameterOperationsTopProps}/>
                    </Box>
                    <ActionParameterConfigurationStepper {...actionParameterConfigurationStepperProps}/>
                    <ActionActiveParameterConfigurator/>
                    <ActionParamterOperationsBottom {...actionParameterOperationsBottomProps}/>
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default ActionCodeParameterChart;