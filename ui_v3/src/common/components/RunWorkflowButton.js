import React from 'react'
import {Link} from 'react-router-dom'
import {
    Button, Tooltip
} from '@mui/material'
import labels from '../../labels/labels'

const RunWorkflowButton = (props) => {
    return (
        <Tooltip title={labels.RunWorkflowButton.runWorkflow}>
            <Button
                color="primary"
                variant="contained"
                aria-label={labels.RunWorkflowButton.runWorkflow}
                to={{'pathname': `/application/build-table-workflow/${props?.tableMeta.Id}`}} 
                component={Link}
            >
                Make Tag Based Workflow
            </Button>
        </Tooltip>
    )
}


export default RunWorkflowButton;
