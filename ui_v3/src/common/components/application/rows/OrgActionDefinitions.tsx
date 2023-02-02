import { Box } from "@mui/material"
import { ActionDefinitionCardViewResponse } from "../../../../generated/interfaces/Interfaces"
import { AllApplicationRowProps } from "../../../../pages/applications/components/AllApplicationView"
import LoadingWrapper from "../../LoadingWrapper"
import ActionDefinitionCard from "../action/ActionDefinitionCard"
import { useGetOrgActionDefinitions } from "../hooks/useGetOrgActionDefinitions"


const OrgActionDefinitions = (props: AllApplicationRowProps) => {
    const searchQuery = props.searchQuery||""
    const pinnedActionDefinitionQuery = useGetOrgActionDefinitions()

    const renderCards = (actionDefinitions: ActionDefinitionCardViewResponse[] | undefined) => (actionDefinitions||[])
        .filter(actionDefinitions => actionDefinitions.DefinitionName?.toLowerCase().includes(searchQuery.toLowerCase())||actionDefinitions.DefinitionName?.toLowerCase().includes(searchQuery.toLowerCase()))
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

export default OrgActionDefinitions