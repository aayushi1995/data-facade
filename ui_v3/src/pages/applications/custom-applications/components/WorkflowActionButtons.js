import { Grid, IconButton, Tooltip } from "@mui/material";
import { ACTION_EXECUTION_STATUS } from "../hooks/useRunActions";
import ShowActionTemplate from "../../../customizations/components/ActionInstancesRow";
import InputIcon from "@mui/icons-material/Input";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import * as PropTypes from "prop-types";
import { RUN_WORKFLOW_VIEWS } from "./RunWorkflowHomePage";

export function WorkflowActionButtons(props) {
    if (props.currentView === RUN_WORKFLOW_VIEWS.EXECUTION_RESULT) {
        return null;
    }
    return <Grid item container xs={props.xs || 3} justifyContent="flex-end">
        {props.currentView === RUN_WORKFLOW_VIEWS.INSTANCES && <Tooltip title="Action Parameter inputs">
            <IconButton
                variant="contained"
                color="primary"
                onClick={props.onInputClickHandler}
                aria-label="Action Parameter inputs"
            >
                <InputIcon />
            </IconButton>
        </Tooltip>}
        {props.status === ACTION_EXECUTION_STATUS.SUCCESS || props.showRenderedTemplate ?
            <ShowActionTemplate {...(props.actionInstanceData?.[0] || props.actionInstanceData || {})} >
            </ShowActionTemplate>
            : <div />}
        <Tooltip title="Delete">
            <IconButton
                color="primary"
                onClick={props.onDeleteHandler}
                aria-label="Delete"
            >
                <DeleteIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title="Run">
            <IconButton
                color="primary"
                onClick={props.onCreateHandler}
                aria-label="Run"
            >
                <PlayArrowIcon />
            </IconButton>
        </Tooltip>
    </Grid>;
}

WorkflowActionButtons.propTypes = {
    status: PropTypes.any,
    actionInstanceData: PropTypes.any,
    onDeleteHandler: PropTypes.func,
    onCreateHandler: PropTypes.func
};