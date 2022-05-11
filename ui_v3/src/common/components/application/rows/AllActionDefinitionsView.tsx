import { Box } from "@mui/material"
import { ActionDefinition } from "../../../../generated/entities/Entities"
import { ActionDefinitionCardViewResponse } from "../../../../generated/interfaces/Interfaces"
import { AllApplicationRowProps } from "../../../../pages/apps/components/AllApplicationView"
import ActionDefinitionCard from "../../action/ActionDefinitionCard"
import { ReactQueryWrapper } from "../../ReactQueryWrapper"
import useGetActionDefinitionsForUi from "../hooks/useGetActionDefinitionsForUi"



const AllActionDefinitionsView = (props: AllApplicationRowProps) => {
    const {data, isLoading, error} = useGetActionDefinitionsForUi({filter: {}})

    const searchQuery = props.searchQuery || ""
    const renderCards = (actionDefinitions: ActionDefinitionCardViewResponse[]) => {
        if(searchQuery === "") {
            return <></>
        }
        return actionDefinitions
            .filter(actionDefinitions => {
                const show = (actionDefinitions.DefinitionName?.toLowerCase().includes(searchQuery.toLowerCase()))
                return show
            })
            .map(actionDefinition => 
                <Box sx={{ height: '100%', p: 2}}  key={actionDefinition.DefinitionId}>
                    <ActionDefinitionCard actionDefinition={actionDefinition}/>
                </Box>
            )
    }

    return (
        <ReactQueryWrapper 
            isLoading={isLoading}
            data={data}
            error={error}
            children={() => 
                renderCards(data || [])
            }
        />
    )
}

export default AllActionDefinitionsView