import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import ActionDefinitionActionType from "../../../../enums/ActionDefinitionActionType";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import { getAction, getActionInstance, WorkflowListItem } from "./WorkflowListItem";
import { withRunActionsHookHOC } from "../hooks/withRunActionsHookHOC";
import { Grid } from "@mui/material";
import { ActionExecutionSection } from "./ActionExecutionSection";

export const actionIconMap = {
  [ActionDefinitionActionType.PROFILING]: <PermIdentityIcon />,
  [ActionDefinitionActionType.CHECK]: <CheckIcon />,
  [ActionDefinitionActionType.CLEANUP_STEP]: <CleaningServicesIcon />,
  [ActionDefinitionActionType.ML_TRAIN]: <CheckIcon />,
  [ActionDefinitionActionType.ML_PREDICT]: <CheckIcon />
};
export const getActionProps = (action) => ({
  Id: action?.Id,
  DisplayName: action?.DisplayName,
  ActionType: action?.ActionType,
  uniqueKey: action?.uniqueKey
});

const getActionResultList = (statusMap = {}) => Object.values(statusMap)?.reduce((acc, { actionInstanceData, actionExecutionData }) => {
  const action = getAction(actionInstanceData);
  const instance = getActionInstance(actionInstanceData, actionExecutionData);
  action && acc.push({
    action,
    instance
  });
  return acc;
}, []);

class _DraggableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
  }
  onReset() {
    this.setState({ data: this.props.data });
  }
  dragStart(e) {
    this.dragged = e.currentTarget;
  }
  dragEnd(e) {
    if (!this.over) {
      //no ongoing drag
      return;
    }
    this.dragged.style.display = "flex";

    e.target.classList.remove("drag-up");
    this.over.classList.remove("drag-up");

    e.target.classList.remove("drag-down");
    this.over.classList.remove("drag-down");

    var data = this.state.data;
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id);
    data.splice(to, 0, data.splice(from, 1)[0]);

    //set newIndex to judge direction of drag and drop
    data = data.map((doc, index) => {
      doc.newIndex = index;
      return doc;
    });

    this.setState({ data: data });
  }

  dragOver(e) {
    e.preventDefault();

    this.dragged.style.display = "none";

    if (e.target.tagName !== "LI") {
      return;
    }

    const dgIndex = JSON.parse(this.dragged.dataset.item).newIndex;
    const taIndex = JSON.parse(e.target.dataset.item).newIndex;
    const animateName = dgIndex > taIndex ? "drag-up" : "drag-down";

    if (this.over && e.target.dataset.item !== this.over.dataset.item) {
      this.over.classList.remove("drag-up", "drag-down");
    }

    if (!e.target.classList.contains(animateName)) {
      e.target.classList.add(animateName);
      this.over = e.target;
    }
  }
  deselectAction = (currentSelectionId) => {
    const currentSelection = this.state.data.find(
      (action) => getActionProps(action).Id === currentSelectionId
    );
    currentSelection &&
      this.setState({
        data: [...this.state.data?.filter(
          (action) => getActionProps(action).Id !== currentSelectionId
        )]
      });
  };
  render() {
    const resultList = []
    const { tableMeta, statusMap, handleCreateSynchronous, updateActionName,
      reset, executeActions, executeActionsLabel, currentView,
      showRenderedTemplate, saveCreateActionInstanceFormConfig, ActionDefinitions } = this.props;
    const listItems = this.state.data?.reduce((accList, item, i) => {
      const { ActionType, Id, DisplayName, uniqueKey } = getActionProps(item);
      const ActionTypeIcon = actionIconMap[ActionType];
      const { data: executionResult, result: status, actionInstanceData, actionExecutionData } = statusMap?.[Id] || {};
      const filteredActionDefinitions = ActionDefinitions?.[0]?.LinkedDefinitions?.filter(ad => ad?.ActionDefinition?.model?.Id === item.DefinitionId)
      const actionResult = {action: {ActionDefinition: filteredActionDefinitions?.[0]?.ActionDefinition?.model, ActionInstances: [item]}, instance: {ActionInstance: item, ActionExecutions: [executionResult]}}
      resultList.push(actionResult)
      
      const actionData = [{ ActionInstance: item, ActionDefinition: item }]
      if (ActionTypeIcon) {
        accList.push(<WorkflowListItem
          showRenderedTemplate={showRenderedTemplate}
          handleCreateSynchronous={handleCreateSynchronous}
          status={status}
          executionResult={executionResult}
          actionInstanceData={actionInstanceData}
          Table={tableMeta?.Table}
          actionData={actionData}
          id={i}
          Id={Id}
          actionResult={actionResult}
          key={uniqueKey}
          draggable={true}
          onDragEnd={this.dragEnd.bind(this)}
          onDragStart={this.dragStart.bind(this)}
          currentView={currentView}
          item={item}
          onDelete={this.deselectAction}
          ActionTypeIcon={ActionTypeIcon}
          DisplayName={DisplayName}
          updateActionName={updateActionName}
          actionExecutionData={actionExecutionData}
          ActionInstance={item?.ActionInstance}
          preActionInstanceModels={this.state?.data?.slice(0, i).map(a => {
            const model = a?.ActionInstance?.model;
            model && (model.type = 'ActionInstance');
            return a?.ActionInstance?.model;
          })}
          saveCreateActionInstanceFormConfig={saveCreateActionInstanceFormConfig}
        />);
      }
      return accList;
    }, []);
    let actionResultList = getActionResultList(statusMap);
    return listItems?.length > 0 ?
      <>
        <Grid item xs={12} style={{ marginTop: 20 }} justifyContent="center">
          <ActionExecutionSection
            currentView={currentView}
            tableMeta={tableMeta}
            allItems={this.props.data}
            items={this.state.data}
            onReset={(...args) => {
              this.onReset(...args);
              reset(...args);
            }
            }
            actionResultList={resultList}
            executeActions={executeActions}
            executeActionsLabel={executeActionsLabel}
          />
        </Grid>
        <Grid item xs={12} justifyContent="center">
          <ul
            onDragOver={this.dragOver.bind(this)}
            className="contain"
            style={{ padding: 0 }}
          >
            {listItems}
          </ul>
        </Grid>
      </> : <div>No Action {currentView}s found.</div>
  }
}


export const WorkflowList = withRunActionsHookHOC(_DraggableList);
