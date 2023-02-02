import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useHistory } from 'react-router-dom'
import autoTablebtn from "../../../src/assets/images/autoTablebtn.svg"
import AutoFlows from '../../enums/AutoFlows'
import useCreateRuntimeWorkflow from '../../pages/applications/workflow/create/hooks/useCreateRuntimeWorkflow'
import useGetPossibleAutoFlows from '../../pages/applications/workflow/create/hooks/useGetPossibleAutoflow'
import { ReactQueryWrapper } from './error-boundary/ReactQueryWrapper'
import LoadingIndicator from './LoadingIndicator'
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
    const btns={
        backgroundColor:'#F1BF42',
        borderRadius:'3px',
        color:'#303234',
        display:'flex',
        gap:1,
        "&:hover":{
            backgroundColor:'#d1b01d'
        }
    }
    const getButtons = (data) => {
        const possibleFlows = data?.[0]?.PossibleAutoFlow
        const buttons = possibleFlows?.map(flow => {
            if(flow === AutoFlows.TIME_SERIES_AUTO_FLOW) {
                return <Button size="small" sx={{...btns}} color="primary" variant="contained" onClick={() => handleClick(AutoFlows.TIME_SERIES_AUTO_FLOW)}><img src={autoTablebtn}/> Auto-Forecast</Button>
            }
            if(flow === AutoFlows.CLEANUP_AUTO_FLOW) {
                return <Button size="small" sx={{...btns}} color="primary" variant="contained" onClick={() => handleClick(AutoFlows.CLEANUP_AUTO_FLOW)}><img src={autoTablebtn}/> Auto-Cleanup</Button>
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
                <Box sx={{display: 'flex', gap: 1}}>
                    {isLoading ? (
                        <LoadingIndicator/>
                    ) : (
                        <Box sx={{display: 'flex', gap: 1,}}>
                            {possibleButtons}
                        </Box>
                    )}
                </Box>
            }
        />
        
    )
}


export default RunWorkflowButtons;
