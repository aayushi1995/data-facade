import { Button, Grid } from "@mui/material";
import { useRunActions } from "../hooks/useRunActions";
import React from "react";
import { WorkflowOverallResultButton } from "./WorkflowOverallResultButton";
import { RUN_WORKFLOW_VIEWS } from "./RunWorkflowHomePage";

function areAllSelectedActionsCompleted(items, actionResultList) {
  return items?.length === actionResultList.length && actionResultList?.length !== 0;
}

export const ActionExecutionSection = ({ items, tableMeta, allItems, actionResultList, onReset, executeActions, executeActionsLabel, currentView }) => {
  const { handleCreateSynchronous, stopExecution } = useRunActions();
  return <Grid container xs={12} justifyContent="flex-end" spacing={3}>
    <Grid item>
      {
        areAllSelectedActionsCompleted(items, actionResultList) &&
        <WorkflowOverallResultButton
          actionResultList={actionResultList}
        />
      }
    </Grid>
    {currentView !== RUN_WORKFLOW_VIEWS.EXECUTION_RESULT && <><Grid item>
      {items?.length > 0 && <Button variant="contained" onClick={() => executeActions(items, tableMeta.Table)}>{executeActionsLabel}</Button>}
    </Grid>
      <Grid item>
        {items?.length > 0 && <Button variant="contained" onClick={stopExecution}>Stop</Button>}
      </Grid>
      <Grid item>
        {allItems?.length > 0 && <Button onClick={onReset} variant="contained">Reset</Button>}
      </Grid></>}
  </Grid>;
};


