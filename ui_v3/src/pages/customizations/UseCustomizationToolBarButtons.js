import React from "react";
import {IconButton, Tooltip} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import {Link as RouterLink, useLocation} from 'react-router-dom';

let customizationToolBarState = {
    dialogState: false,
    createActionInstanceDialog: false
};
const listeners = {items: []};

export function useCustomizationToolBarButtonsBehaviour() {
    const renderListener = React.useState()[1];
    React.useEffect(() => () => {
        listeners.items = listeners.items?.filter(l => l !== renderListener);
    }, [renderListener]);
    React.useEffect(() => {
        listeners.items.push(renderListener);
    }, [renderListener]);

    const setDialogState = (state) => {
        customizationToolBarState = {...customizationToolBarState, dialogState: state};
        listeners.items?.forEach((l) => l(customizationToolBarState));
    }
    const setCreateActionInstanceDialog = (state) => {
        customizationToolBarState = {...customizationToolBarState, createActionInstanceDialog: state};
        listeners.items?.forEach((l) => l(customizationToolBarState));
    }
    const handleDialogOpen = () => {
        setDialogState(true)
    }
    const handleDialogClose = () => {
        setDialogState(false)
    }
    const handleCreateActionInstanceOpen = () => {
        setCreateActionInstanceDialog(true)
    }
    const handleCreateActionInstanceClose = () => {
        setCreateActionInstanceDialog(false)
    }
    return {
        dialogState: customizationToolBarState.dialogState,
        createActionInstanceDialog: customizationToolBarState.createActionInstanceDialog,
        handleDialogOpen,
        handleDialogClose,
        handleCreateActionInstanceOpen,
        handleCreateActionInstanceClose
    };
}

export function useCustomizationToolBarButtons() {
    return [
        <Tooltip title="Create action">
            <IconButton
                to={`/create-action`}
                component={RouterLink}
                color="primary"
                aria-label="Create action"
            >
                <AddIcon/>
            </IconButton></Tooltip>,
        <Tooltip title="Run action">
            <IconButton
                to="/run-action"
                component={RouterLink}
                color="primary"
                aria-label="Run action"
            >
                <PlayArrowIcon/>
            </IconButton>
        </Tooltip>
    ];
}