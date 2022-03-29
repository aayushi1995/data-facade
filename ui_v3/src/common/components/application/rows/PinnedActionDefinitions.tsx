import { Box } from "@mui/material"
import ActionDefinitionCard from "../../action/ActionDefinitionCard"
import { ActionDefinitionCardViewResponse } from "../../../../generated/interfaces/Interfaces"
import { useGetPinnedActionDefinitions } from "./../hooks/useGetPinnedActionDefinitions"
import LoadingWrapper from "../../LoadingWrapper"
import { AllApplicationRowProps } from "../../../../pages/apps/components/AllApplicationView"


const PinnedActionDefinitions = (props: AllApplicationRowProps) => {
    const searchQuery = props.searchQuery||""
    const pinnedActionDefinitionQuery = useGetPinnedActionDefinitions()

    const renderCards = (actionDefinitions: ActionDefinitionCardViewResponse[] | undefined) => (actionDefinitions||[])
        .filter(actionDefinitions => {
            const show = (actionDefinitions.DefinitionName?.toLowerCase().includes(searchQuery.toLowerCase())||actionDefinitions.DefinitionName?.toLowerCase().includes(searchQuery.toLowerCase()))
            console.log(show, actionDefinitions)
            return show
        })
        .map(actionDefinition => 
            <Box sx={{ height: '100%', p: 2}}  key={actionDefinition.DefinitionId}>
                <ActionDefinitionCard actionDefinition={actionDefinition}/>
            </Box>
        )
    
    return(
        <LoadingWrapper isLoading={pinnedActionDefinitionQuery.isLoading} error={pinnedActionDefinitionQuery.error} data={pinnedActionDefinitionQuery.data}>
            {renderCards(pinnedActionDefinitionQuery.data)}
        </LoadingWrapper>
    )
}

export default PinnedActionDefinitions