import NoData from "../NoData"
import { useGetPrebuiltApplications } from "./hooks/useGetPrebuildApplications"
import { Box, Card } from "@mui/material"
import ActionInstanceCard from "../action/ActionInstanceCard"
import { useGetActionInstances } from "./hooks/useGetActionInstances"
import { ActionInstanceCardViewResponse } from "../../../generated/interfaces/Interfaces"

interface ActionInstancesProps {
    searchQuery: string
}

const ActionInstances = (props: ActionInstancesProps) => {
    const { searchQuery } = props
    const [actionInstances, error, loading] = useGetActionInstances()

    const filterBySearchQuery = (actionInstances: ActionInstanceCardViewResponse[]) => {
        return actionInstances.filter(actionInstances => actionInstances.InstanceName?.toLowerCase().includes(searchQuery.toLowerCase())||actionInstances.DefinitionName?.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if(loading) {
        return <>Loading...</>
    } else if(actionInstances) {
        const actionInstanceCardsToRender = filterBySearchQuery(actionInstances).map(actionInstance => {
            return (
                <Box sx={{ height: '100%', p: 2}}>
                    <ActionInstanceCard actionInstance={actionInstance}/>
                </Box>
            )
        })
        return (
            <Box sx={{display: 'flex', overflowX: 'auto', flexDirection: 'row', maxWidth: '100%', minHeight: '100%', gap: 1, justifyContent: 'flex-start', pb: 2}}>
                {actionInstanceCardsToRender}
            </Box>
        )
    } else {
        return <NoData/>
    }
}

export default ActionInstances