import { Box, List, ListItemButton, Typography } from "@mui/material"
import React from "react"
import { ActionDefinition } from "../../../generated/entities/Entities"
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces"
import { ReactQueryWrapper } from "../ReactQueryWrapper"
import useFetchDeepDiveActions from "./hooks/useFetchDeepDiveActions"


interface DeepDiveActionsListProps {
    actionDefinition: ActionDefinition,
    onDeepDiveActionSelected?: (actionId: string) => void
}

const DeepDiveActionsList = (props: DeepDiveActionsListProps) => {

    const fetchDeepDiveActionsQuery = useFetchDeepDiveActions({filter: {Id: props.actionDefinition.Id}, options: {enabled: false}})

    React.useEffect(() => {
        if(!fetchDeepDiveActionsQuery.data) {
            fetchDeepDiveActionsQuery.refetch()
        }
    }, [])

    const handleDeepDiveActionClick = (actionDefinition: ActionDefinitionDetail ) => {
        props.onDeepDiveActionSelected?.(actionDefinition.ActionDefinition?.model?.Id!)
    }

    return (
        <ReactQueryWrapper isLoading={fetchDeepDiveActionsQuery.isLoading || fetchDeepDiveActionsQuery.isRefetching} data={fetchDeepDiveActionsQuery.data} error={fetchDeepDiveActionsQuery.error}>
            {() => 
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                {fetchDeepDiveActionsQuery?.data?.length === 0 ? (
                        <Typography sx={{px: 2}}>
                            No configured Deep Dive actions
                        </Typography>
                    ) : (
                        <Typography sx={{px: 2}} variant="executeActionName">
                            Configured Deep Dive actions
                        </Typography>
                        
                )}
                <List>
                    {fetchDeepDiveActionsQuery?.data?.map(actionDefinition => 
                    <ListItemButton onClick={() => handleDeepDiveActionClick(actionDefinition)}>{actionDefinition.ActionDefinition?.model?.DisplayName || actionDefinition?.ActionDefinition?.model?.UniqueName}</ListItemButton>)}
                </List>
            </Box>}
        </ReactQueryWrapper>
    )
}

export default DeepDiveActionsList