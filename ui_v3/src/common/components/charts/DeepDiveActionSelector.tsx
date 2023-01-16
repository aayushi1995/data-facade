import { Box, Grid, Tab, Tabs, Typography } from "@mui/material"
import React from "react"
import { ReactQueryWrapper } from "../ReactQueryWrapper"
import SelectAction, { ActionDefinitionToAdd, TabPanel } from "../workflow/create/SelectAction/SelectAction"
import SelectActionCard from "../workflow/create/SelectActionCard"
import useFetchDeepDiveActions from "./hooks/useFetchDeepDiveActions"


interface DeepDiveActionSelectorProps {
    actionDefinitionId: string,
    onAddAction: (actionDefinitionToAdd: ActionDefinitionToAdd) => void
}

const DeepDiveActionSelector = (props: DeepDiveActionSelectorProps) => {

    const fetchDeepDiveActionsQuery = useFetchDeepDiveActions({filter: {Id: props.actionDefinitionId}, options: {enabled: false}})

    const [tabState, setTabState] = React.useState(0)

    React.useEffect(() => {
        fetchDeepDiveActionsQuery.refetch()
    }, [props.actionDefinitionId])


    return (
        <ReactQueryWrapper 
            isLoading={fetchDeepDiveActionsQuery.isLoading || fetchDeepDiveActionsQuery.isRefetching} 
            data={fetchDeepDiveActionsQuery.data} 
            isError={fetchDeepDiveActionsQuery.isError}>

                {() => (
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Tabs value={tabState} onChange={((event, newValue) => setTabState(newValue))}>
                            <Tab value={0} label="Recommended actions" />
                            <Tab value={1} label="All Actions" />
                        </Tabs>
                        <TabPanel value={tabState} index={0}>
                            {fetchDeepDiveActionsQuery.data?.length ? 
                                <Grid container spacing={1}>
                                    {fetchDeepDiveActionsQuery.data.map(actionDefinition => 
                                        <Grid item xs={12} md={6} lg={6} xl={4} sm={12}>
                                            <SelectActionCard
                                                actionId={actionDefinition?.ActionDefinition?.model?.Id||"NA"}
                                                actionName={actionDefinition?.ActionDefinition?.model?.DisplayName || actionDefinition?.ActionDefinition?.model?.UniqueName||"NAME NA"}
                                                actionDescription={actionDefinition?.ActionDefinition?.model?.Description||"DESCRIPTION NA"}
                                                onAddAction={props.onAddAction}
                                                defaultTemplateId={actionDefinition?.ActionDefinition?.model?.DefaultActionTemplateId||"TEMPLATE NA"}
                                                actionGroup={actionDefinition?.ActionDefinition?.model?.ActionGroup}
                                                parameters={actionDefinition?.ActionTemplatesWithParameters?.[0]?.actionParameterDefinitions}
                                            />
                                        </Grid>    
                                    )}
                                </Grid>
                                    : 

                                <Typography variant="heroHeader">
                                    No Recommended Actions
                                </Typography>
                            }
                        </TabPanel>
                        <TabPanel value={tabState} index={1}>
                            <SelectAction groups={[]} onAddAction={props.onAddAction}/>
                        </TabPanel>
                    </Box>
                )}
        </ReactQueryWrapper>
    )

}

export default DeepDiveActionSelector