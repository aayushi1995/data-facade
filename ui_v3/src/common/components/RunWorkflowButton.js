import { Autocomplete, Box, Button, TextField, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { useHistory } from 'react-router-dom'
import ActionDefinitionActionGroups from '../../enums/ActionDefinitionActionGroups'
import AutoFlows from '../../enums/AutoFlows'
import labels from '../../labels/labels'
import LoadingIndicator from './LoadingIndicator'
import { ReactQueryWrapper } from './ReactQueryWrapper'
import useCreateRuntimeWorkflow from './workflow/create/hooks/useCreateRuntimeWorkflow'
import useGetPossibleAutoFlows from './workflow/create/hooks/useGetPossibleAutoflow'

const RunWorkflowButtons = (props) => {
    const {TableId} = props


    const history = useHistory()
    const [isLoading, setLoading] = React.useState(false)

    const getPossibleFlowsQuery = useGetPossibleAutoFlows({filter: {Id: TableId}})
    const [possibleButtons, setPossibleButton] = React.useState()
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

    const handleClick = (autoFlow) => {
        createWorkflowForTable.mutate(
            {tableId: TableId, autoFlow: autoFlow}
        )
    }

    const getButtons = (data) => {
        const possibleFlows = data?.[0]?.PossibleAutoFlow
        const buttons = possibleFlows?.map(flow => {
            if(flow === AutoFlows.TIME_SERIES_AUTO_FLOW) {
                return <Button size="small" color="primary" variant="contained" onClick={() => handleClick(AutoFlows.TIME_SERIES_AUTO_FLOW)}>Time Forecast Auto Flow</Button>
            }
            if(flow === AutoFlows.CLEANUP_AUTO_FLOW) {
                return <Button size="small" color="primary" variant="contained" onClick={() => handleClick(AutoFlows.CLEANUP_AUTO_FLOW)}>Cleanup Auto Flow</Button>
            }
        })
        
        if(!!buttons && buttons.length !== 0) {
            setPossibleButton(buttons)
        } else {
            setPossibleButton([<Typography variant="heroMeta" sx={{fontSize: '15px', mt: 1}}>No Auto Flows Found. Check Table And Column Tags</Typography>])
        }
        console.log(buttons)
    }

    React.useEffect(() => {
        getButtons(getPossibleFlowsQuery.data)
    }, [getPossibleFlowsQuery.data]) 

    return (
        <ReactQueryWrapper 
            isLoading={getPossibleFlowsQuery.isLoading}
            data={possibleButtons}
            error={getPossibleFlowsQuery.error}
            children={() => 
                <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    {isLoading ? (
                        <LoadingIndicator/>
                    ) : (
                        <Box sx={{display: 'flex', gap: 1,  justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                            {possibleButtons}
                        </Box>
                    )}
                </Box>
            }
        />
        
    )
}


export default RunWorkflowButtons;
