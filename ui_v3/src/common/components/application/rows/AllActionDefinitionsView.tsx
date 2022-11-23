import { Box, Grid } from "@mui/material"
import { ActionDefinitionCardViewResponse } from "../../../../generated/interfaces/Interfaces"
import { AllApplicationRowProps } from "../../../../pages/apps/components/AllApplicationView"
import ActionDefinitionCard from "../../action/ActionDefinitionCard"
import { ReactQueryWrapper } from "../../ReactQueryWrapper"
import useGetActionDefinitionsForUi from "../hooks/useGetActionDefinitionsForUi"



const AllActionDefinitionsView = (props: AllApplicationRowProps) => {
    const {data, isLoading, error} = useGetActionDefinitionsForUi({filter: {IsVisibleOnUI: true}})

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
                <Grid item xs={12} lg={4} md={6} xl={3}>
                    <Box sx={{ height: '100%', p: 2}}  key={actionDefinition.DefinitionId}>
                        <ActionDefinitionCard actionDefinition={actionDefinition}/>
                    </Box>
                </Grid>
            )
    }

    return (
        <ReactQueryWrapper 
            isLoading={isLoading}
            data={data}
            error={error}
            children={() => 
                <Grid container spacing={1}>
                    {renderCards(data || [])}
                </Grid>
            }
        />
    )
}

export default AllActionDefinitionsView