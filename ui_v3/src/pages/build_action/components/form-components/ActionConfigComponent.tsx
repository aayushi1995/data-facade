import DoneIcon from '@mui/icons-material/Done';
import { Box, Button, Tab, Tabs } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import LoadingIndicator from "../../../../common/components/LoadingIndicator";
import useCopyAndSaveDefinition from '../../../../common/components/workflow/create/hooks/useCopyAndSaveDefinition';
import { TabPanel } from "../../../../common/components/workflow/create/SelectAction/SelectAction";
import ActionDefinitionPublishStatus from '../../../../enums/ActionDefinitionPublishStatus';
import { BuildActionContext, UseActionHooks } from "../../context/BuildActionContext";
import SetActionParameters from "../common-components/SetActionParameters";
import EditActionTemplates from "./EditActionTemplates";
import TagsAndSummary from "./TagsAndSummary";

const ActionConfigComponent = () => {
    const history = useHistory()
    const buildActionContext = React.useContext(BuildActionContext)
    const useActionHooks = React.useContext(UseActionHooks)
    const [activeTab, setActiveTab] = React.useState(1)
    const copyActionDefinition = useCopyAndSaveDefinition({mutationName: "CopyWhileEditingAction"})


    const onActionSave = () => {
        useActionHooks.useActionDefinitionFormSave?.mutate(buildActionContext)
    }

    const OnRunAction = () => {
        onActionSave()
        const actionId = buildActionContext?.lastSavedActionDefinition?.Id
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
        useActionHooks.useActionDefinitionFormSave?.mutate(buildActionContext, {
            onSuccess: () => {
                const actionId = buildActionContext?.lastSavedActionDefinition?.Id
                if(!!actionId) {
                    history.push({pathname: `/application/execute-action/${actionId}`, state: 'fromTest'})
                }
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
                        <Tab label="Tags & Summary" value={2} sx={{
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
                        disabled={(!!!buildActionContext?.lastSavedActionDefinition)||(buildActionContext?.actionDefinitionWithTags?.actionDefinition?.PublishStatus!==ActionDefinitionPublishStatus.READY_TO_USE)} 
                        onClick={OnRunAction} 
                        sx={{ 
                            minWidth: "150px",
                            borderRadius: "64px" 
                        }}
                    >
                        Run
                    </Button>
                    <Button variant="contained" onClick={onActionSave} sx={{ 
                        minWidth: "150px", 
                        background: "#56D280",
                        borderRadius: "64px" 
                    }}>
                        Save
                    </Button>
                    <Button variant="contained" onClick={onTestAction} sx={{ 
                        minWidth: "150px",
                        borderRadius: "64px",
                    }}>
                        Test
                    </Button>
                    <Button variant="contained" sx={{ 
                        minWidth: "150px",
                        borderRadius: "64px",
                        background: "#F178B6"
                    }} onClick={handleDuplicate}>
                        Duplicate
                    </Button>
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
            </Box>
        </Box>    
    )
}

export default ActionConfigComponent;