import { Dialog, DialogTitle, DialogContent, Grid, Typography, Box, Autocomplete, TextField, Button } from "@mui/material"
import React from "react"
import { useHistory } from "react-router"
import LoadingIndicator from "../../common/components/LoadingIndicator"
import { ReactQueryWrapper } from "../../common/components/ReactQueryWrapper"
import useCreateRuntimeWorkflow from "../../common/components/workflow/create/hooks/useCreateRuntimeWorkflow"
import ActionDefinitionActionGroups from "../../enums/ActionDefinitionActionGroups"
import AutoFlows from "../../enums/AutoFlows"
import useTables from "../build_action/hooks/useTables"


interface BuildAutoFlowProps {

}

const BuildAutoFlow = (props: BuildAutoFlowProps) => {
    const {tables, loading, error} = useTables({tableFilter: {}})
    const history = useHistory()
    const [mutationLoading, setLoading] = React.useState(false)
    const [autoFlowConfig, setAutoFlowConfig] = React.useState<{tableId?: string, actionGroups: string[]}>({actionGroups: []})
    const createWorkflowMutation = useCreateRuntimeWorkflow({
        mutationName: "CreateAutoFlows",
        options: {
            onMutate: () => setLoading(true),
            onSettled: () => setLoading(false),
        }
    })

    const handleCreate = () => {
        createWorkflowMutation.mutate({
            actionGroups: autoFlowConfig.actionGroups,
            tableId: autoFlowConfig.tableId!,
            autoFlow: AutoFlows.GENERIC_AUTO_FLOW
        }, {
            onSuccess: (data, variables, context) => {
                history.push(`edit-workflow/${data?.[0]?.Id}`)
            }
        })
    }

    return (
        <ReactQueryWrapper
            isLoading={loading}
            data={tables}
            error={error} 
            children={() => 
                <Dialog open={true} fullWidth maxWidth="xl" sx={{minHeight: 600}}>
                    <DialogTitle sx={{display: 'flex', justifyContent: 'flex-start',background: "#66748A", boxShadow: "inset 0px 15px 25px rgba(54, 48, 116, 0.3)"}}>
                        <Grid item xs={6} sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                            <Typography variant="heroHeader" sx={{
                                fontFamily: "'SF Pro Text'",
                                fontStyle: "normal",
                                fontWeight: 500,
                                fontSize: "18px",
                                lineHeight: "160%",
                                letterSpacing: "0.15px",
                                color: "#F8F8F8"}}
                            >
                                Create Auto Flow
                            </Typography>
                        </Grid>
                    </DialogTitle>
                    <DialogContent sx={{mt: 5, display: 'flex', flexDirection: 'column', gap: 3}}>
                        <Grid container sx={{justifyContent: 'center', display: 'flex'}}>
                            <Grid item xs={6}>
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', p: 1}}>
                                <Autocomplete 
                                        options={Object.entries(ActionDefinitionActionGroups).map(([groupKey, groupName]) => groupName)}
                                        fullWidth
                                        multiple
                                        selectOnFocus
                                        handleHomeEndKeys
                                        disableCloseOnSelect
                                        renderInput={(params) => <TextField {...params} label="Select Action Groups"/>}
                                        onChange={(event, value, reason, details) => {
                                            setAutoFlowConfig(config => ({
                                                ...config,
                                                actionGroups: value || []
                                            }))
                                        }}
                                    />
                                    <Autocomplete 
                                        options={tables || []}
                                        getOptionLabel={table => table.DisplayName || "Table"}
                                        groupBy={(table) => table.ProviderInstanceName||"Provider NA"}
                                        fullWidth
                                        selectOnFocus
                                        clearOnBlur
                                        handleHomeEndKeys
                                        renderInput={(params) => <TextField {...params} label="Select Table"/>}
                                        onChange={(event, value, reason, details) => {
                                            setAutoFlowConfig(config => ({
                                                ...config,
                                                tableId: value?.Id
                                            }))
                                        }}
                                    />
                                </Box>
                            </Grid>

                            <Box sx={{minWidth: '100%',display: 'flex', justifyContent: 'flex-end', mt: 3}}>
                                {mutationLoading ? (
                                    <LoadingIndicator/>
                                ) : (
                                    <Button variant="contained" disabled={autoFlowConfig.tableId === undefined || autoFlowConfig.actionGroups === []} onClick={handleCreate}>
                                        Create Auto-Flow
                                    </Button>
                                )}
                                
                            </Box>
                        </Grid>
                    </DialogContent>
                </Dialog>
            }/>
        
    )
}

export default BuildAutoFlow