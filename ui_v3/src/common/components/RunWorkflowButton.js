import { Autocomplete, Box, Button, TextField, Tooltip } from '@mui/material'
import React from 'react'
import { useHistory } from 'react-router-dom'
import ActionDefinitionActionGroups from '../../enums/ActionDefinitionActionGroups'
import labels from '../../labels/labels'
import LoadingIndicator from './LoadingIndicator'
import useCreateRuntimeWorkflow from './workflow/create/hooks/useCreateRuntimeWorkflow'

const RunWorkflowButton = (props) => {
    const {TableId} = props
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
            {tableId: TableId, actionGroups: actionGroupsSelected}
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
