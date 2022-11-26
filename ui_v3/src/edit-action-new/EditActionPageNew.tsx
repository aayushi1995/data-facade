import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import { generatePath, RouteComponentProps, useHistory } from "react-router";
import ConfirmationDialog from '../common/components/ConfirmationDialog';
import { APPLICATION_EDIT_ACTION_ROUTE_NEW } from "../common/components/header/data/ApplicationRoutesConfig";
import LoadingIndicator from "../common/components/LoadingIndicator";
import ActionDefinitionPublishStatus from '../enums/ActionDefinitionPublishStatus';
import { BuildActionContext, BuildActionContextProvider, BuildActionContextState, SetBuildActionContext, UseActionHooks } from "../pages/build_action/context/BuildActionContext";
import AddActionToEdit from "./components/business/AddActionToEdit";
import EditActionForm from "./EditActionForm";
import useMultipleContext, { getActionIdFromActionContext } from './hooks/useMultipleContext';


interface EditActionPageMatchParams {
    ActionDefinitionId: string
}



function EditActionPageNew({match}: RouteComponentProps<EditActionPageMatchParams>) {
    const actionDefinitionId = match.params.ActionDefinitionId
    const { contextStore, addContext, removeContextWithId } = useMultipleContext()

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
            history.replace(generatePath(APPLICATION_EDIT_ACTION_ROUTE_NEW, {
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
            
            if(activeTabId===undefined) {
                setActiveTabId(props.actionDefinitionId)
            }
        }
    }, [props.actionDefinitionId])

    const addActionWithId = (actionDefId?: string) => actionDefId && setActiveTabId(actionDefId)
    
    const tabs = contextStore?.map(ac =>
        <Tab
            label={
                <Box sx={{ display: "flex", flexDirection:"row-reverse", alignItems: "center", width: "100%"}}>
                    <Box>
                        <IconButton onClick={(event) => {event.stopPropagation(); handleTabCloseButtonClick(ac)}}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                    <Box sx={{ overflowX: "scroll" }}>
                        <Typography textOverflow="ellipsis">{ac?.actionDefinitionWithTags?.actionDefinition?.DisplayName}</Typography>
                    </Box>

                </Box>
            }
            value={ac?.actionDefinitionWithTags?.actionDefinition?.Id}
        />
    )

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
    
    return (
        <Box>
            <ConfirmationDialog {...getConfirmationDialogProps()}/>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1}}>
                <Box sx={{ flex: 1 }}>
                    <Tabs value={activeTabId} onChange={(event, value) => setActiveTabId(value)}>
                        {tabs}
                        <Tab value="Add" label="Add"/>
                    </Tabs>
                </Box>
                {activeTabId !=="Add" &&
                    <Box>
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
                    </Box>
                }
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