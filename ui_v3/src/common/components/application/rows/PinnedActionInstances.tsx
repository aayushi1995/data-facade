import { Box } from "@mui/material"
import { AllApplicationRowProps } from "../../../../pages/applications/components/AllApplicationView"
import LoadingWrapper from "../../LoadingWrapper"
import ActionInstanceCard from "../action/ActionInstanceCard"
import { useGetPinnedActionInstances } from "../hooks/useGetPinnedActionInstances"
import { ActionInstanceCardViewResponse } from "./../../../../generated/interfaces/Interfaces"


const PinnedActionInstances = (props: AllApplicationRowProps) => {
    const searchQuery = props.searchQuery||""
    const pinnedActionInstancesQuery = useGetPinnedActionInstances()

    const renderCards = (prebuiltApplications: ActionInstanceCardViewResponse[] | undefined) => (prebuiltApplications||[])
    .filter(actionInstances => actionInstances.InstanceName?.toLowerCase().includes(searchQuery.toLowerCase())||actionInstances.DefinitionName?.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(actionInstance => 
            <Box sx={{ height: '100%', p: 2}}  key={actionInstance.InstanceId}>
                <ActionInstanceCard actionInstance={actionInstance}/>
            </Box>
        )

    return(
        <LoadingWrapper isLoading={pinnedActionInstancesQuery.isLoading} error={pinnedActionInstancesQuery.error} data={pinnedActionInstancesQuery.data}>
            {renderCards(pinnedActionInstancesQuery.data)}
        </LoadingWrapper>
    )
}

export default PinnedActionInstances