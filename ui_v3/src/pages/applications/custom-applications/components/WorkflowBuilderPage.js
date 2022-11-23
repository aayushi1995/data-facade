import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Typography,
  Select,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  Container,
  Dialog,
  IconButton,
  TextField
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useFetchActionDefinitionQuery } from "../../../customizations/components/AllActions";
import { ActionsIcon } from "../../../../images/actions_icon";
import { PageHeader } from "../../../../common/components/header/PageHeader";
import { withStyles } from "@mui/styles"
import CheckIcon from '@mui/icons-material/Check';
import ActionDefinitionActionType from "../../../../enums/ActionDefinitionActionType";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { v4 as uuidv4 } from 'uuid';
import { useMutation } from "react-query";
import dataManager, { useRetreiveData } from "../../../../data_manager/data_manager";
import { userSettingsSingleton } from "../../../../data_manager/userSettingsSingleton";
import { useHistory, useRouteMatch } from "react-router-dom";
import PreviewIcon from "@mui/icons-material/Preview";
import CloseIcon from '@mui/icons-material/Close';
import ShowActionTemplate from "../../../customizations/components/ActionInstancesRow";
import CodeEditor from "../../../../common/components/CodeEditor";
import { WorkflowMeta } from "./WorkflowMeta";
import { getWorkflowActionDefinitions } from "../selectors/GetWorkflowActionDefinitions";
import { updateActionMutation, updateActionMutationCb, useUpdateActionMutation } from "../../../customizations/components/UpdateActionDefinition";
require("./workflowEditor.css");

const actionIconMap = {
  [ActionDefinitionActionType.PROFILING]: <PermIdentityIcon />,
  [ActionDefinitionActionType.CHECK]: <CheckIcon />,
  [ActionDefinitionActionType.CLEANUP_STEP]: <CleaningServicesIcon />
};
const styles = theme => ({
  listItem: {
    height: "60px",
    border: "solid 1px #cccccc",
    display: "flex",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5px",
    borderRadius: "5px",
    backgroundColor: "green",
    color: "#ffffff",
  },
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '90vh',
    minWidth: 1500
  }
})
const getActionProps = (action) => ({
  Id: action.ActionDefinition?.model?.Id,
  DisplayName: action.ActionDefinition?.model?.DisplayName,
  ActionType: action.ActionDefinition?.model?.ActionType
});

const setCount = (data) => {
  if (!data) { return }
  const map = {};
  return data.map((d) => {
    map[d.Id] = map[d.Id] ?? 0 + 1;
    d.count = map[d.Id];
    return d;
  });
}
class _DraggableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props, data: setCount(props.data) };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ data: setCount(nextProps?.data) });
  }
  dragStart(e) {
    this.dragged = e.currentTarget;
  }
  dragEnd(e) {
    this.dragged.style.display = "flex";

    e.target.classList.remove("drag-up");
    this.over.classList.remove("drag-up");

    e.target.classList.remove("drag-down");
    this.over.classList.remove("drag-down");

    var data = this.state.data;
    console.log(data)
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id);
    data.splice(to, 0, data.splice(from, 1)[0]);

    //set newIndex to judge direction of drag and drop
    data = data.map((doc, index) => {
      doc.newIndex = index + 1;
      return doc;
    });
    this.setState({ data: data });
    this.props.setSelectedActions(data)
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
  render() {
    const { theme } = this.props;
    var listItems = this.state.data.map((item, i) => {
      const { ActionType, Id, DisplayName } = getActionProps(item);
      const ActionTypeIcon = actionIconMap[ActionType];
      return (
        <li
          data-id={i}
          key={i}
          style={{
            height: "60px",
            border: "solid 1px",
            display: "flex",
            padding: 20,
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5px",
            borderRadius: "5px",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
          text="true"
          draggable="true"
          onDragEnd={this.dragEnd.bind(this)}
          onDragStart={this.dragStart.bind(this)}
          data-item={JSON.stringify(item)}
        >
          {ActionTypeIcon}
          {DisplayName}
          <Grid>
            <Button><DeleteIcon onClick={() => this.props.deselectAction(Id)} /></Button>
            <Button><PreviewIcon onClick={() => this.props.openDefintionDetailDialog(Id)} /></Button>
          </Grid>
        </li>
      );
    });
    return (
      <ul
        onDragOver={this.dragOver.bind(this)}
        className="contain  "
        style={{ padding: 0 }}
      >
        {listItems}
      </ul>
    );
  }
}
const DraggableList = withStyles(styles, { withTheme: true })(_DraggableList);

const WorkflowBuilder = (props) => {
  const history = useHistory()
  const classes = styles()
  const match = useRouteMatch()
  const workflowDefinitionId = match.params?.workflowDefinitionId;
  const [definitionDetailDialog, setDefinitionDetailDialog] = React.useState(false)
  const [selectedDefinition, setSelectedDefinition] = React.useState({})
  const [description, setDescription] = React.useState()
  const [searchFilter, setSearchFilter] = React.useState()

  const createWorkflowDefinition = useMutation((action) => {
    console.log(action)
    const response = workflowDefinitionId ? updateActionMutationCb(() => { console.log('OnMutate'); })(action) : dataManager.getInstance.saveData(
      "ActionDefinition",
      {
        "ActionDefinition": action.ActionDefinition,
        "ActionTemplatesWithParameters": action.ActionTemplatesWithParameters,
        "CreateActionDefinitionForm": true
      },
      {
        onMutate: () => { }
      })
  })


  const checks = useFetchActionDefinitionQuery(); //all action definitions
  const [remainingActions, setRemainingActions] = useState(checks.data);

  useEffect(() => {
    setRemainingActions(checks.data);
  }, [checks.data]);

  const { data: selectedActionDefinitions } = useFetchActionDefinitionQuery("Workflow",
    workflowDefinitionId,
    true,
    false,
    { enabled: !!workflowDefinitionId }
  );
  const workflowDefinition = selectedActionDefinitions?.[0]?.workflowDefinition;

  useEffect(() => {
    if (workflowDefinitionId && selectedActionDefinitions?.length > 0 && remainingActions?.length > 0) {
      const { finalDefinitions, mappings } = getWorkflowActionDefinitions(selectedActionDefinitions, remainingActions);
      setSelectedActions(finalDefinitions);
    }
  }, [remainingActions, selectedActionDefinitions, workflowDefinitionId]);



  const [selectedActions, setSelectedActions] = useState([]);
  if (!checks?.data) {
    return null;
  }
  const selectAction = (currentSelectionId) => {
    const currentSelection = remainingActions.find(
      (action) => getActionProps(action).Id === currentSelectionId
    );
    const count = selectedActions?.filter((action) => getActionProps(action).Id === currentSelectionId)?.length;
    currentSelection.count = count ?? 0 + 1;
    currentSelection &&
      setSelectedActions([...selectedActions, currentSelection]);
  };
  const deselectAction = (currentSelectionId, count) => {
    //take all actions except the one with given id and count
    const newActions = selectedActions?.filter((action) => getActionProps(action).Id !== currentSelectionId && (count ? count !== action.count : true))

    setSelectedActions(newActions)
  };
  const handleSaveWorkflow = () => {
    var workflowConfig = {
      ActionDefinition: {
        model: {
          Id: uuidv4(),
          ActionType: "Workflow",
          UniqueName: props?.name,
          DisplayName: props?.name,
          CreatedBy: userSettingsSingleton.userEmail,
          Description: description
        },
        tags: []
      }
    }

    const templateText = selectedActions.map((actionDefinition) => {
      return {
        Id: actionDefinition?.ActionDefinition?.model?.Id,
        DisplayName: actionDefinition?.ActionDefinition?.model?.DisplayName,
        DefaultActionTemplateId: actionDefinition?.ActionTemplatesWithParameters[0]?.model?.Id
      }
    })

    const workflowActionDefinitionOld = remainingActions.find(remainingAction => remainingAction.ActionDefinition.model.Id === workflowDefinitionId);

    const templateAndParameters = {
      model: {
        //using old workflow action definition model id
        Id: workflowActionDefinitionOld ? workflowActionDefinitionOld.ActionTemplatesWithParameters?.[0]?.model?.Id : uuidv4(),
        DefinitionId: workflowConfig.ActionDefinition.model.Id,
        Text: JSON.stringify(templateText)
      },
      tags: [],
      actionParameterDefinitions: []
    }
    workflowConfig = {
      ...workflowConfig,
      ActionTemplatesWithParameters: [templateAndParameters]
    }

    var updateWorkflowConfig = {
      "entityName": "ActionDefinition",
      "old": workflowActionDefinitionOld, //{ActionDefinition, ActionTemplatesWithParameters}
      "new": {
        "ActionDefinition": workflowActionDefinitionOld?.ActionDefinition, //TODO: should be modified with description, DisplayName
        "ActionTemplatesWithParameters": [templateAndParameters],// [{string: {TableId,ParameterValue, ProviderInstanceId}}]
      },
      "filter": {
        Id: workflowDefinitionId
      },
      withActionTemplate: true
    }
    createWorkflowDefinition.mutate(
      workflowDefinitionId ? updateWorkflowConfig : workflowConfig,
      {
        onSuccess: (data, variables, context) => {
          history.goBack()
        },
        onError: (data, variables, context) => { }
      }
    )
  }
  var templateText = "";
  const handleDefinitionDetailDialogClose = () => {
    setDefinitionDetailDialog(false)
  }
  const handleDefinitionDetailDialogOpen = (currentSelectionId) => {
    const currentSelection = selectedActions.find(
      (action) => getActionProps(action).Id === currentSelectionId
    );
    templateText = currentSelection?.ActionTemplatesWithParameters[0]?.model?.Text
    setSelectedDefinition(currentSelection)
    setDefinitionDetailDialog(true)

  }

  const handleDisplayNameChange = (e) => {
    const oldProps = selectedDefinition
    setSelectedDefinition({
      ...oldProps,
      ActionDefinition: {
        ...oldProps.ActionDefinition,
        model: {
          ...oldProps.ActionDefinition.model,
          DisplayName: e.target.value
        }
      }
    })
  }

  const handleSaveDisplayName = () => {
    const newActions = selectedActions.map((action) => { return (getActionProps(action).Id === getActionProps(selectedDefinition).Id) ? selectedDefinition : action })
    setSelectedActions(newActions)
    handleDefinitionDetailDialogClose()
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
  }

  const handleActionDefinitionSearch = (e) => {
    setSearchFilter(e.target.value);
  }

  return (
    <Grid container>
      <Dialog open={definitionDetailDialog} onClose={handleDefinitionDetailDialogClose} classes={{ paper: classes.dialogPaper }} scroll="paper" fullWidth>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton aria-label="close" onClick={handleDefinitionDetailDialogClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <Box m={1}>
            <Grid item xs={12}>
              <TextField label='Display Name'
                fullWidth
                defaultValue={getActionProps(selectedDefinition).DisplayName}
                variant="outlined"
                onChange={handleDisplayNameChange}
              ></TextField>
              <Box p={1}>
                <Grid item xs={12}>
                  <CodeEditor
                    language={selectedDefinition?.ActionTemplatesWithParameters?.length > 0 ? selectedDefinition?.ActionTemplatesWithParameters[0]?.model?.Language : "python"}
                    code={(selectedDefinition?.ActionTemplatesWithParameters?.length > 0) ? selectedDefinition?.ActionTemplatesWithParameters[0]?.model?.Text : ""} />
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button style={{ justifyContent: 'flex-end' }} variant="contained" onClick={handleSaveDisplayName}>Save</Button>
            </Grid>
          </Box>
        </Grid>
      </Dialog>
      <PageHeader pageHeading={`Workflow Editor: ${props?.name}`} />

      <Grid item xs={6}>
        <WorkflowMeta tableMeta={{ Table: workflowDefinition }} />
        <Box p={1}>
          <TextField
            multiline="true"
            variant="standard"
            label="Workflow Description"
            fullWidth
            onChange={handleDescriptionChange}
          ></TextField>
        </Box>
        <Box p={1}>
          <TextField
            multiline="true"
            variant="outlined"
            label="Search Action Definitions"
            fullWidth
            onChange={handleActionDefinitionSearch}
          ></TextField>
        </Box>
        <List>
          {remainingActions?.filter((action) => {
            const { DisplayName } = getActionProps(action);
            return searchFilter ? DisplayName?.indexOf(searchFilter) !== -1 : true;
          })?.map((action) => {
            const { ActionType, Id, DisplayName } = getActionProps(action);
            const ActionTypeIcon = actionIconMap[ActionType];
            return ActionTypeIcon ? (
              <ListItem disablePadding onClick={() => selectAction(Id)} key={Id}>
                <ListItemButton>
                  <ListItemIcon>
                    {ActionTypeIcon}
                  </ListItemIcon>
                  <ListItemText primary={DisplayName} />
                </ListItemButton>
              </ListItem>
            ) : null;
          })}
        </List>
      </Grid>
      <Grid item xs={6}>
        <Container>{selectedActions?.length === 0 ? "Select actions" : "Selected actions"}</Container>
        <DraggableList
          openDefintionDetailDialog={handleDefinitionDetailDialogOpen}
          setSelectedActions={setSelectedActions}
          deselectAction={deselectAction}
          data={
            selectedActions?.map((action, index) => ({
              newIndex: index,
              ...action
            })) || []
          }
        />
        <Button onClick={handleSaveWorkflow} variant="contained">Save Workflow</Button>
      </Grid>
    </Grid>
  );
};

export default WorkflowBuilder;
