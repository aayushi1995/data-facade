import { makeStyles } from "@material-ui/styles";
import { TextField, IconButton, Tooltip, Grid, Button } from "@material-ui/core";
import { useState } from "react";
import { Box } from "@material-ui/system";
import { GridCloseIcon } from "@material-ui/data-grid";
import { Dialog } from "@mui/material";
import { ACTION_EXECUTION_STATUS } from "../hooks/useRunActions";
import { QuickStatsNewTempWrapper } from "../../../table_details/components/QuickStatsNewTemp";
import JobsRowJobDetail from "../../../jobs/components/JobsRowJobDetail";
import { WorkflowActionButtons } from "./WorkflowActionButtons";
import * as PropTypes from "prop-types";
import CreateActionInstanceForm, { getConfig } from "../../../../common/components/CreateActionInstanceForm";

export const useStyles = makeStyles((theme) => ({
    item: {
        border: "solid 1px",
        display: "flex",
        padding: 10,
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "5px",
        borderRadius: "5px",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
    },
    dialogPaper: {
        width: '100%!important',
        maxWidth: '100%!important'
    }
}));

export const DIALOG_CONTENT_TYPE = {
    ACTION_EXECUTION_RESULT: "ACTION_EXECUTION_RESULT",
    VIEW_LOGS: "VIEW_LOGS",
    INPUT_ACTION_PARAMETERS: "INPUT_ACTION_PARAMETERS"
};

function WorkflowDialogContent(props) {
    const ActionInstanceModel = props?.ActionInstance?.model;
    const ActionParameterInstances = props?.ActionParameterInstances;
    console.log(ActionParameterInstances)
    return <>
        {props.dialogContent === DIALOG_CONTENT_TYPE.ACTION_EXECUTION_RESULT ? <QuickStatsNewTempWrapper
            actionResultList={props.actionResultList} /> :
            props.dialogContent === DIALOG_CONTENT_TYPE.VIEW_LOGS ? <JobsRowJobDetail hideHeader showDevData
                actionExecutionId={props.actionExecutionData?.[0]?.Id} /> :
                props.dialogContent === DIALOG_CONTENT_TYPE.INPUT_ACTION_PARAMETERS ?
                    ActionInstanceModel ?
                        <CreateActionInstanceForm config={{
                            ActionInstance: {
                                model: ActionInstanceModel
                            },
                            ActionParameterInstances: ActionParameterInstances
                        }}
                            preFilledTables={props.preActionInstanceModels}
                            saveCreateActionInstanceFormConfig={props.saveCreateActionInstanceFormConfig} /> :
                        <div>No Action Instance Model found.</div> :
                    <div>error</div>}
    </>;
}

WorkflowDialogContent.propTypes = {
    dialogContent: PropTypes.any,
    actionInstanceData: PropTypes.any,
    actionExecutionData: PropTypes.any
};

export function WorkflowResultDialog(props) {
    return <Dialog onClose={props.onClose} open={props.open} fullWidth
        classes={{ paper: props.classes.dialogPaper }} scroll="paper">
        <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton aria-label="close" onClick={props.onClose}>
                <GridCloseIcon />
            </IconButton>
        </Grid>
        <Grid item xs={12}>
            <Box mx={2} my={1}>
                <WorkflowDialogContent
                    {...props}
                />
            </Box>
        </Grid>
    </Dialog>;
}

WorkflowResultDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    classes: PropTypes.any,
    dialogContent: PropTypes.any,
    actionInstanceData: PropTypes.any,
    actionExecutionData: PropTypes.any
};

export function useWorkflowDialogState() {
    const [queryDataDialog, setQueryDataDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState(null);
    const handleQueryDataDialogClose = () => {
        setQueryDataDialog(false);
    }
    return { queryDataDialog, setQueryDataDialog, dialogContent, setDialogContent, handleQueryDataDialogClose };
}

export const WorkflowListItem = ({
    id,
    Id,
    onDragEnd,
    onDragStart,
    item,
    onDelete,
    draggable,
    ActionTypeIcon,
    DisplayName,
    status,
    handleCreateSynchronous,
    updateActionName,
    Table,
    actionInstanceData,
    executionResult,
    actionExecutionData,
    actionResult,
    actionData,
    showRenderedTemplate,
    preActionInstanceModels,
    //save global config
    saveCreateActionInstanceFormConfig,
    currentView,
    ActionInstance
}) => {
    console.log(actionResult)
    const classes = useStyles();
    //internal state of item
    const [actionName, setActionName] = useState(DisplayName);

    const [itemConfig, setItemConfig] = useState(getConfig({ ActionParameterInstances: {}, ActionInstance }));
    // console.log(ActionInstance)

    const _ActionInstance = itemConfig?.ActionInstance;
    const ActionParameterInstances = itemConfig?.ActionParameterInstances;
    const {
        queryDataDialog,
        setQueryDataDialog,
        dialogContent,
        setDialogContent,
        handleQueryDataDialogClose
    } = useWorkflowDialogState();
    return (<li
        data-id={id}
        className={classes.item}
        draggable={draggable}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        data-item={JSON.stringify(item)}
    >
        <Grid container alignItems="center" justifyContent="space-between" item xs={16}>
            <Grid item xs={1} container justifyContent="center"><Tooltip
                title={`${item.ActionType} Action`}>{ActionTypeIcon}</Tooltip></Grid>
            <Grid item xs={3}>
                <TextField variant="standard"
                    value={itemConfig?.ActionInstance?.model?.DisplayName?.value || actionName || ""}
                    fullWidth margin="normal"
                    InputProps={{ disableUnderline: true }}
                    onChange={(e) => {
                        const newName = e.target.value;
                        const newConfig = getConfig(itemConfig, [{ key: 'DisplayName', value: newName }, { key: 'Name', value: newName }]);
                        setItemConfig(newConfig);
                        saveCreateActionInstanceFormConfig(Id, newConfig);
                        setActionName(newName);
                        updateActionName(Id, newName)
                    }} label="Action Name" />
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={2}>{status || ""}</Grid>
            <Grid item xs={2}>
                {status === ACTION_EXECUTION_STATUS.SUCCESS ? <Tooltip title="View">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setQueryDataDialog(true);
                            setDialogContent(DIALOG_CONTENT_TYPE.ACTION_EXECUTION_RESULT);
                        }}
                        aria-label="View"
                    >
                        Result
                    </Button>
                </Tooltip> : status === ACTION_EXECUTION_STATUS.FAIL ? <Tooltip title="View Logs">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setQueryDataDialog(true);
                            setDialogContent(DIALOG_CONTENT_TYPE.VIEW_LOGS);
                        }}
                        aria-label="View Logs"
                    >
                        View Logs
                    </Button>
                </Tooltip> : <div></div>}
            </Grid>
            <WorkflowActionButtons
                currentView={currentView}
                status={status}
                actionInstanceData={actionInstanceData || actionData}
                onInputClickHandler={() => {
                    setQueryDataDialog(true);
                    setDialogContent(DIALOG_CONTENT_TYPE.INPUT_ACTION_PARAMETERS);
                }}
                showRenderedTemplate={showRenderedTemplate}
                onDeleteHandler={() => onDelete(Id)}
                onCreateHandler={() => handleCreateSynchronous([item], Table)} />
            <WorkflowResultDialog onClose={handleQueryDataDialogClose} open={queryDataDialog} classes={classes}
                dialogContent={dialogContent}
                ActionInstance={_ActionInstance}
                preActionInstanceModels={preActionInstanceModels}
                actionResultList={[actionResult]}
                ActionParameterInstances={ActionParameterInstances}
                saveCreateActionInstanceFormConfig={(config) => {
                    saveCreateActionInstanceFormConfig(Id, config);
                    setItemConfig(config);
                }}
            />
        </Grid>
    </li>);
};

export function getAction(actionInstanceData) {
    const actionInstanceDataItem = actionInstanceData?.[0];
    if (!actionInstanceDataItem) {
        return;
    }
    return { ActionInstances: [actionInstanceData?.[0]], ...(actionInstanceData?.[0] || {}) };
}

export function getActionInstance(actionInstanceData, actionExecutionData) {
    const actionInstanceDataItem = actionInstanceData?.[0];
    if (!actionInstanceDataItem) {
        return;
    }
    return {
        ...(actionInstanceData?.[0] || {}),
        ActionExecutions: actionExecutionData || []
    };
}
