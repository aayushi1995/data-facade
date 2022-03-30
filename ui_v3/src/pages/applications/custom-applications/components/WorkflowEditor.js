import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Grid
} from "@mui/material";
import { PageHeader } from "../../../../common/components/header/PageHeader";
import { useGetActionDefinitionForTable, usePrevious } from "../hooks/useGetActionDefinitionForTable";
import { useRouteMatch } from "react-router-dom";
import { useRunActions } from "../hooks/useRunActions";
import { TableWrapper } from "../../../../common/components/TableWrapper";
import { WorkflowMeta } from "./WorkflowMeta";
import { getWorkflowEditorData } from "../selectors/getWorkflowEditorData";
import { WorkflowList } from "./WorkflowList";

require("./workflowEditor.css");

/**
 * dedup array of objects based on an identity prop
 * @param {*} arr  
 * @param {*} identityProp 
 */
export const deDup = (arr, identityProp) => {
  const map = {};
  return arr?.reduce((a, e) => {
    if (!map[e[identityProp]]) {
      map[e[identityProp]] = e;
      a.push(e);
    }
    return a;
  }, []);
};


export const hasActionDefinitionsChanged = (prev, current) => {
  if (prev?.length !== current?.length) {
    return true;
  }
  const contains = (arr1, arr2) => arr1?.map(e => e?.Id)?.includes(arr2?.map(e => e?.Id));
  if (contains(prev, current) && contains(current, prev)) {
    return false;
  }
  return false;
};
export const useSetSelectedActions = (actionDefinitions) => {
  const [selectedActions, setSelectedActions] = useState([]);
  const prevActionDefinitions = usePrevious(actionDefinitions);
  useEffect(() => {
    if (hasActionDefinitionsChanged(prevActionDefinitions, actionDefinitions)) {
      setSelectedActions(actionDefinitions);
    }
  }, [actionDefinitions, prevActionDefinitions, setSelectedActions]);
  return [selectedActions, setSelectedActions];
};

const WorkflowEditor = (props) => {
  const match = useRouteMatch();

  const tableId = match.params.tableId ?? props.TableId;
  const { actionDefinitionsResult, isTagsLoading, tagsError } = useGetActionDefinitionForTable(tableId);
  const { actionDefinitions, erroneous, tableMeta, isLoading } = useMemo(() => getWorkflowEditorData(actionDefinitionsResult, tableId), [
    actionDefinitionsResult,
    tableId
  ]);
  const [selectedActions, setSelectedActions] = useSetSelectedActions(actionDefinitions);
  const { reset } = useRunActions();
  const onReset = () => {
    setSelectedActions(actionDefinitions);
    reset();
  }
  const actionsList = selectedActions || [];
  return (
    <Grid>
      <PageHeader pageHeading={tableMeta?.Table?.DisplayName} />
      <Grid item container xs={12} xl={10} style={{ margin: "auto" }}>
        {tableMeta?.Table && <Grid item xs={12} justifyContent="center">
          <WorkflowMeta tableMeta={tableMeta} />
        </Grid>}
        <TableWrapper error={erroneous || tagsError} data={selectedActions} isLoading={isLoading || isTagsLoading}>
          {() => <WorkflowList
            tableMeta={tableMeta}
            data={actionsList}
            onReset={onReset}
          />}</TableWrapper>
      </Grid>
    </Grid>
  );
};

export default WorkflowEditor;
