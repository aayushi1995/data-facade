import React from 'react'
import {Link} from 'react-router-dom'
import {
    Button, Tooltip
} from '@material-ui/core'
import labels from '../../labels/labels'

const RunWorkflowButton = (props) => {
    return (
        <Tooltip title={labels.RunWorkflowButton.runWorkflow}>
            <Button
                color="primary"
                variant="contained"
                aria-label={labels.RunWorkflowButton.runWorkflow}
                to={{'pathname': `/run-workflow/20`, 'state': {'tableMeta': props?.tableMeta, 'runtimeWorkflow': true}}} 
                component={Link}
            >
                {labels.RunWorkflowButton.runWorkflow}
            </Button>
        </Tooltip>
    )
}


export default RunWorkflowButton;
