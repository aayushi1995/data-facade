import {DIALOG_CONTENT_TYPE, useStyles, useWorkflowDialogState, WorkflowResultDialog} from "./WorkflowListItem";
import {Button} from "@mui/material";
import React from "react";

export const WorkflowOverallResultButton = ({actionResultList}) => {
    const classes = useStyles();
    const {
        queryDataDialog,
        setQueryDataDialog,
        handleQueryDataDialogClose
    } = useWorkflowDialogState();

    return (<>
        <Button variant="contained" onClick={() => setQueryDataDialog(true)}>Result</Button>
        <WorkflowResultDialog onClose={handleQueryDataDialogClose} open={queryDataDialog} classes={classes}
                              dialogContent={DIALOG_CONTENT_TYPE.ACTION_EXECUTION_RESULT}
                              actionResultList={actionResultList}/>
    </>);
}