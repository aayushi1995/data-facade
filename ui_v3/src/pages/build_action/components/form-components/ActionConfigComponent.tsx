import DoneIcon from '@mui/icons-material/Done';
import { Box, Button, Tab, Tabs } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import LoadingIndicator from "../../../../common/components/LoadingIndicator";
import useCopyAndSaveDefinition from '../../../../common/components/workflow/create/hooks/useCopyAndSaveDefinition';
import { TabPanel } from "../../../../common/components/workflow/create/SelectAction/SelectAction";
import ActionDefinitionPublishStatus from '../../../../enums/ActionDefinitionPublishStatus';
import { BuildActionContext, SetBuildActionContext, UseActionHooks } from "../../context/BuildActionContext";
import SetActionParameters from "../common-components/SetActionParameters";
import EditActionChartConfig from './EditActionChartConfig';
import EditActionTemplates from "./EditActionTemplates";
import TagsAndSummary from "./TagsAndSummary";

const ActionConfigComponent = () => {
    const history = useHistory()
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const useActionHooks = React.useContext(UseActionHooks)
    const [activeTab, setActiveTab] = React.useState(1)
    const copyActionDefinition = useCopyAndSaveDefinition({mutationName: "CopyWhileEditingAction"})

    const onActionSave = () => {
        useActionHooks.useActionDefinitionFormSave?.mutate(buildActionContext)
    }

    const OnRunAction = () => {
        onActionSave()
        const actionId = buildActionContext?.actionDefinitionWithTags?.actionDefinition?.Id
        if(!!actionId) {
            history.push(`/application/execute-action/${actionId}`)
        }
    }

    const handleDuplicate = () => {
        copyActionDefinition.mutate(
            {actionDefinitionId: buildActionContext.actionDefinitionWithTags.actionDefinition.Id!}, {
                onSuccess: (data) => {
                    history.push(`/application/edit-action/${data?.[0]?.Id}`)
                }
            }
        )
    }

    const onTestAction = () => {
        setBuildActionContext({
            type: 'SetTestMode',
            payload: false
        })
        useActionHooks.useActionDefinitionFormSave?.mutate(buildActionContext, {
            onSuccess: () => {
                setBuildActionContext({
                    type: 'SetTestMode',
                    payload: true
                })
            }
        })
    }



    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 1, minHeight: "100%"}} className="wa">
            <Box sx={{ display: "flex", flexDirection: "row" }}>
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
                        <Tab label="Config" value={2} sx={{
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
                        <Tab label="Charts" value={3} sx={{
                            fontFamily: "SF Pro Text",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: "14px",
                            lineHeight: "24px",
                            display: "flex",
                            alignItems: "center",
                            textAlign: "center",
                            opacity: 0.7,
                            color: '#DB8C28'
                        }}/>
                    </Tabs>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row-reverse", flexGrow: 1, gap: 3 }}>   
                    {buildActionContext.testMode ? <></> : (
                        <Button variant="contained" 
                            disabled={buildActionContext?.actionDefinitionWithTags?.actionDefinition?.PublishStatus!==ActionDefinitionPublishStatus.READY_TO_USE} 
                            onClick={OnRunAction} 
                            sx={{ 
                                minWidth: "150px",
                                borderRadius: "64px" 
                            }}
                        >
                            Run
                        </Button>
                    )}
                    
                    {buildActionContext.testMode ? (
                        <></>
                    ) : (
                        <Button variant="contained" onClick={onActionSave} sx={{ 
                            minWidth: "150px", 
                            backgroundColor: "ActionConfigComponentBtnColor1.main",
                            borderRadius: "64px" 
                        }}>
                            Save
                        </Button>
                    )}
                    <Button variant="contained" onClick={onTestAction} sx={{ 
                        minWidth: "150px",
                        borderRadius: "64px",
                    }}>
                        Test
                    </Button>  
                    {buildActionContext.testMode ? <></> : (
                        <Button variant="contained" sx={{ 
                            minWidth: "150px",
                            borderRadius: "64px",
                            backgroundColor: "ActionConfigComponentBtnColor2.main"
                        }} onClick={handleDuplicate}>
                            Duplicate
                        </Button>
                    )}
                    
                    <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
                        {(buildActionContext.savingAction||buildActionContext.loadingActionForEdit) ? <LoadingIndicator/> : <DoneIcon sx={{ transform: "scale(1.5)"  }}/> }
                    </Box>
                </Box>
            </Box>
            <Box sx={{pt: 2, minHeight: "100%"}}>
                <TabPanel value={activeTab} index={0}>
                    <SetActionParameters/>
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <EditActionTemplates/>
                </TabPanel>
                <TabPanel value={activeTab} index={2}>
                    <TagsAndSummary/>
                </TabPanel>
                <TabPanel value={activeTab} index={3}>
                    <EditActionChartConfig />
                </TabPanel>
            </Box>
        </Box>    
    )
}

export default ActionConfigComponent;
