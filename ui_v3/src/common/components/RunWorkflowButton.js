import React from 'react'
import {Link, useHistory} from 'react-router-dom'
import {
    Button, Tooltip, Box, Autocomplete, TextField
} from '@mui/material'
import labels from '../../labels/labels'
import useCreateRuntimeWorkflow from './workflow/create/hooks/useCreateRuntimeWorkflow'
import ActionDefinition from '../../generated/entities/Entities'
import ActionDefinitionActionGroups from '../../enums/ActionDefinitionActionGroups'
import LoadingIndicator from './LoadingIndicator'

const RunWorkflowButton = (props) => {
    const {tableMeta} = props
    const history = useHistory()
    const [isLoading, setLoading] = React.useState(false)
    const [actionGroupsSelected, setSelectedActionGroups] = React.useState([])
    const createWorkflowForTable = useCreateRuntimeWorkflow(
        {
            mutationName: "CreateRuntimeWorkflow",
            options: {
                onMutate: () => setLoading(true),
                onSettled: () => setLoading(false),
                onSuccess: (data) => {
                    console.log(data)
                    const workflowId = data?.[0]?.Id
                    history.push(`/application/edit-workflow/${workflowId}`)
                }
            }
        }
    )
    const handleClick = () => {
        createWorkflowForTable.mutate(
            {tableId: tableMeta?.Id, actionGroups: actionGroupsSelected}
        )
    }

    return (
        <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
            {isLoading ? (
                <LoadingIndicator/>
            ) : (
                <Tooltip title={labels.RunWorkflowButton.runWorkflow}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleClick}
                        // to={{'pathname': `/application/build-table-workflow/${props?.tableMeta.Id}`}} 
                        // component={Link}
                        size="small"
                    >
                        Make Tag Based Workflow
                    </Button>
                </Tooltip>
            )}
            <Autocomplete
                fullWidth
                multiple
                options={Object.entries(ActionDefinitionActionGroups).map(([groupKey, groupName]) => groupName)}
                renderInput={(params) => <TextField {...params} label="Select Action Groups"/>}
                value={actionGroupsSelected}
                onChange={(event, value, reason, details) => {
                    setSelectedActionGroups(value)
                }}
                filterSelectedOptions
                limitTags={2}
            ></Autocomplete>
        </Box>
    )
}


export default RunWorkflowButton;
