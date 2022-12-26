import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton, Tab, Tabs, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { generatePath, RouteComponentProps, useHistory } from "react-router";
import ConfirmationDialog from '../common/components/ConfirmationDialog';
import { APPLICATION_EDIT_ACTION_ROUTE_ROUTE } from "../common/components/header/data/ApplicationRoutesConfig";
import LoadingIndicator from "../common/components/LoadingIndicator";
import ActionDefinitionPublishStatus from '../enums/ActionDefinitionPublishStatus';
import { BuildActionContext, BuildActionContextProvider, BuildActionContextState, SetBuildActionContext, UseActionHooks } from "../pages/build_action/context/BuildActionContext";
import AddActionToEdit from "./components/business/AddActionToEdit";
import EditActionForm from "./EditActionForm";
import useMultipleContext, { getActionIdFromActionContext } from './hooks/useMultipleContext';
import TabUnstyled from '@mui/base/TabUnstyled';
import TabsListUnstyled from '@mui/base/TabUnstyled';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import { SetModuleContextState } from '../common/components/ModuleContext';
import AddIcon from '@mui/icons-material/Add';
import { ActionTab } from './components/presentation/styled_native/ActionTab';
interface EditActionPageMatchParams {
    ActionDefinitionId: string
}



function EditActionPageNew({match}: RouteComponentProps<EditActionPageMatchParams>) {
    const actionDefinitionId = match.params.ActionDefinitionId
    const { contextStore, addContext, removeContextWithId } = useMultipleContext()
    const setModuleContext = useContext(SetModuleContextState)
    useEffect(() => {
        setModuleContext({
            type: "SetHeader",
            payload: {
                newHeader: {
                    Title: "",
                    SubTitle: ""
                }
            }
        })
    }, [])
    return(
        <BuildActionContextProvider mode="UPDATE" newActionCallback={addContext}>
            <EditActionFormInitialized actionDefinitionId={actionDefinitionId} contextStore={contextStore} addContext={addContext} removeContextWithId={removeContextWithId}/>
        </BuildActionContextProvider>
    )
}


function EditActionFormInitialized(props: { actionDefinitionId?: string, contextStore?: BuildActionContextState[], addContext?: (newContext?: BuildActionContextState) => void, removeContextWithId?: (actionDefinitionId?: string) => void }) {
    const { contextStore, addContext, removeContextWithId } = props
    const history = useHistory()
    const buildActionContext = React.useContext(BuildActionContext)
    const setActionContext = React.useContext(SetBuildActionContext)
    const useActionHooks = React.useContext(UseActionHooks)
    const [dialogState, setDialogState] = React.useState<{ context?: BuildActionContextState, open: boolean }>({ open: false })
    const openDialog = (context: BuildActionContextState) => setDialogState({ context: context, open: true})
    const closeDialog = () => setDialogState({ open: false })
    
    const [activeTabId, setActiveTabId] = React.useState<string | undefined>()

    const handleTabCloseButtonClick = (ac: BuildActionContextState) => openDialog(ac)

    const getConfirmationDialogProps = () => ({
        messageHeader: `Close ${dialogState?.context?.actionDefinitionWithTags?.actionDefinition?.DisplayName} ?`,
        messageToDisplay: "Do you want to save your changes ?",
        acceptString: "Yes",
        declineString: "No",
        onAccept: () => {
            if(contextStore?.length!==1) {
                const dialogActionContextId = getActionIdFromActionContext(dialogState?.context)
                const actionContextToRemoveIndex = contextStore?.findIndex(ac => getActionIdFromActionContext(ac) === dialogActionContextId) || 0
                const newActiveActionContextIndex = Math.max(actionContextToRemoveIndex - 1, 0)
                removeContextWithId?.(dialogActionContextId)
                setActiveTabId(getActionIdFromActionContext(contextStore?.[newActiveActionContextIndex]))
            }
            closeDialog()
        },
        onDecline: () => closeDialog(),
        dialogOpen: dialogState?.open,
        onDialogClose: () => closeDialog()
    })
   
    React.useEffect(() => {
        console.log("WADAWDWADWA", activeTabId)
        if(!!activeTabId){
            history.replace(generatePath(APPLICATION_EDIT_ACTION_ROUTE_ROUTE, {
                ActionDefinitionId: activeTabId,
            }))
        }
    }, [ activeTabId ])    
    
    React.useEffect(() => {
        console.log(props.actionDefinitionId)
        if(!!props.actionDefinitionId) {
            if(props.actionDefinitionId!=="Add") {
                const cachedContext = contextStore?.find(ac => getActionIdFromActionContext(ac) === props.actionDefinitionId)
                setActionContext({
                    type: "SetActionDefinitionToLoadId",
                    payload: {
                        actionDefinitionToLoadId: props.actionDefinitionId,
                        saveOldContextCallback: addContext,
                        cachedContext: cachedContext
                    }
                })    
            } else {
                setActionContext({
                    type: "SetMode",
                    payload: {
                        mode: "CREATE",
                        saveOldContextCallback: addContext
                    }
                })
            }
            
                setActiveTabId(props.actionDefinitionId)
            
        }
    }, [props.actionDefinitionId])

    const addActionWithId = (actionDefId?: string) => actionDefId && setActiveTabId(actionDefId)
    
    const tabs = contextStore?.map(ac =>
        <ActionTab 
            label={
                <Box sx={{py:0,px:0, display: "flex", flexDirection:"row-reverse", alignItems: "center", width: "100%",height:'20px'}}>
                    <Box>
                        <IconButton onClick={(event) => {event.stopPropagation(); handleTabCloseButtonClick(ac)}}>
                            <CloseIcon sx={{fontSize:'15px'}}/>
                        </IconButton>
                    </Box>
                    <Box sx={{ overflowX: "scroll" }}>
                        <Typography sx={{fontSize:'0.8rem',pt:1,color:'Black'}} textOverflow="ellipsis">{ac?.actionDefinitionWithTags?.actionDefinition?.DisplayName}</Typography>
                    </Box>

                </Box>
            }
            value={ac?.actionDefinitionWithTags?.actionDefinition?.Id}
        />
    )

    const onActionSave = () => {
        useActionHooks.useActionDefinitionFormSave?.mutate(buildActionContext)
    }
    
    return (
        <Box sx={{px:1}}>
            <ConfirmationDialog {...getConfirmationDialogProps()}/>
            <Box sx={{pt:1, display: "flex", flexDirection: "row", gap: 1,borderBottom:'1px solid #b8b9ba',mx:-1}}>
                <Box sx={{ flex: 1,px:1}}>
                    <Tabs 
                        value={activeTabId} 
                        onChange={(event, value) => setActiveTabId(value)}
                        >
                                {tabs}
                                <ActionTab  
                                            value="Add" 
                                            label={
                                                <Box sx={{py:0,px:0, display: "flex", flexDirection:"row", alignItems: "center", width: "100%"}}>
                                                    <Box>
                                                        <IconButton>
                                                            <AddIcon sx={{fontSize:'18px'}}/>
                                                        </IconButton>
                                                    </Box>
                                                    <Box sx={{ overflowX: "scroll" }}>
                                                        <Typography sx={{fontSize:'0.8rem',pt:1,color:'Black'}} textOverflow="ellipsis">Add</Typography>
                                                    </Box>

                                                </Box>}
                                                />

                    </Tabs>
                </Box>
            </Box>
            {
                activeTabId === "Add" ?
                    <AddActionToEdit addActionWithId={addActionWithId}/>
                :
                    buildActionContext.mode==="UPDATE" ?
                        <EditActionForm/>
                    :
                        <LoadingIndicator/>
            }
        </Box>
        
    )
}

export default EditActionPageNew;