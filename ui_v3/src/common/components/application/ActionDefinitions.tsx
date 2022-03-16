import NoData from "../NoData"
import { useGetPrebuiltApplications } from "./hooks/useGetPrebuildApplications"
import { Box, Card } from "@material-ui/core"
import ActionDefinitionCard from "../action/ActionDefinitionCard"
import { ActionDefinitionCardViewResponse } from "../../../generated/interfaces/Interfaces"
import { useGetActionDefinitions } from "./hooks/useGetActionDefinitions"

interface ActionDefinitionsProps {
    searchQuery: string
}

const ActionDefinitions = (props: ActionDefinitionsProps) => {
    const { searchQuery } = props
    const [actionDefinitions, error, loading] = useGetActionDefinitions()

    const filterBySearchQuery = (actionDefinitions: ActionDefinitionCardViewResponse[]) => {
        return actionDefinitions.filter(actionDefinitions => actionDefinitions.DefinitionName?.toLowerCase().includes(searchQuery.toLowerCase())||actionDefinitions.DefinitionName?.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if(loading) {
        return <>Loading...</>
    } else if(actionDefinitions) {
        const actionDefinitionCardsToRender = filterBySearchQuery(actionDefinitions).map(actionDefinition => {
            return (
                <Box sx={{ height: '100%', p: 2}}>
                    <ActionDefinitionCard actionDefinition={actionDefinition}/>
                </Box>
            )
        })
        return (
            <Box sx={{display: 'flex', overflowX: 'auto', flexDirection: 'row', maxWidth: '100%', minHeight: '100%', gap: 1, justifyContent: 'flex-start', pb: 2}}>
                {actionDefinitionCardsToRender}
            </Box>
        )
    } else {
        return <NoData/>
    }
}

export default ActionDefinitions