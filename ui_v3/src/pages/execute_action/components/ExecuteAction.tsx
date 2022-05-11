import { Box, Button, Dialog, DialogContent } from "@mui/material";
import React from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import ParameterDefinitionsConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane";
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import { ActionParameterInstance } from "../../../generated/entities/Entities";
import ActionDefinitionHero from "../../build_action/components/shared-components/ActionDefinitionHero";
import useActionDefinitionDetail from "../../build_action/hooks/useActionDefinitionDetail";
import ViewActionExecution from "../../view_action_execution/VIewActionExecution";
import { constructCreateActionInstanceRequest, ExecuteActionContext, SetExecuteActionContext } from "../context/ExecuteActionContext";
import useCreateActionInstance from "../hooks/useCreateActionInstance";
import ViewConfiguredParameters from "./ViewConfiguredParameters";

interface MatchParams {
    actionDefinitionId: string
}

const ExecuteAction = ({match}: RouteComponentProps<MatchParams>) => {
    const actionDefinitionId = match.params.actionDefinitionId

    const { createActionInstanceAsyncMutation, createActionInstanceSyncMutation, fetchActionExeuctionParsedOutputMutation } = useCreateActionInstance({
        asyncOptions: {
            onMutate: () => {
                setDialogState({isOpen: true})
            }
        },
        syncOptions: {
            onMutate: () => {
                setDialogState({isOpen: true})
            }
        }
    })
    const {data, error, isLoading, refetch} = useActionDefinitionDetail({actionDefinitionId: actionDefinitionId, options: { enabled: false }})

    const setExecuteActionContext = React.useContext(SetExecuteActionContext)
    const executeActionContext = React.useContext(ExecuteActionContext)

    const [resultActionExecutionId, setResultActionExecutionId] = React.useState<string|undefined>()
    const history = useHistory()

    const [dialogState, setDialogState] = React.useState<{isOpen: boolean}>({isOpen: false})

    const handleChange = (newActionParameterInstances: ActionParameterInstance[]) => {
        setExecuteActionContext({
            type: "SetActionParameterInstances",
            payload: {
                newActionParameterInstances: newActionParameterInstances
            }
        })
    }

    const handleDialogClose = () => {
        setResultActionExecutionId(undefined)
        setDialogState({isOpen: false})
    }

    React.useEffect(() => {
        refetch()
    }, [])

    React.useEffect(() => {
        if(!!data && !!data[0]) {
            setExecuteActionContext({
                type: "SetFromActionDefinitionDetail",
                payload: {
                    ActionDefinitionDetail: data[0]
                }
            })
        }
    }, [data])

    const handleAsyncCreate = () => {
        const request = constructCreateActionInstanceRequest(executeActionContext)
        createActionInstanceAsyncMutation.mutate(request, {
            onSuccess: () => {
                
            }
        })
    }

    const handleSyncCreate = () => {
        if(!!data && !!data[0]){
            const request = constructCreateActionInstanceRequest(executeActionContext)
            createActionInstanceSyncMutation.mutate(request, {
                onSuccess: (data) => {
                    const execution = data[0]
                    setResultActionExecutionId(execution.Id)
                   
                }
            })
        }
    }

    const handleCreateWorkflow = () => {
        if(!!data && !!data[0]){
            const request = constructCreateActionInstanceRequest(executeActionContext)
            createActionInstanceSyncMutation.mutate(request, {
                onSuccess: (data) => {
                    const autoFlowId = data?.[0]?.Id
                    history.push(`/application/edit-workflow/${autoFlowId}`)
                }
            })
        }
    }
    
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 4}}>
            <Box>
                <ActionDefinitionHero
                    mode="READONLY"
                    name={executeActionContext.ExistingModels.ActionDefinition?.UniqueName}
                    description={executeActionContext.ExistingModels.ActionDefinition?.Description}
                    createdBy={executeActionContext.ExistingModels.ActionDefinition?.CreatedBy}
                    applicationId={executeActionContext.ExistingModels.ActionDefinition?.ApplicationId}
                    group={executeActionContext.ExistingModels.ActionDefinition?.ActionGroup}
                    lastUpdatedOn={executeActionContext.ExistingModels.ActionDefinition?.UpdatedOn}
                    publishStatus={executeActionContext.ExistingModels.ActionDefinition?.PublishStatus}
                />
            </Box>
            <Box>
                <ParameterDefinitionsConfigPlane
                    parameterDefinitions={executeActionContext.ExistingModels.ActionParameterDefinitions}
                    parameterInstances={executeActionContext.ToCreateModels.ActionParameterInstances}
                    handleChange={handleChange}
                />
            </Box>
            <Box>
                <ViewConfiguredParameters
                    parameterDefinitions={executeActionContext.ExistingModels.ActionParameterDefinitions}
                    parameterInstances={executeActionContext.ToCreateModels.ActionParameterInstances}
                />
            </Box>
            <Box sx={{width: "100%"}}>
                {executeActionContext.ExistingModels.ActionDefinition.ActionType === ActionDefinitionActionType.AUTO_FLOW ? (
                    <Button onClick={handleCreateWorkflow} variant="contained" sx={{width: "100%"}}>
                        Create Auto Flow
                    </Button>
                ) : (
                    <Button onClick={handleSyncCreate} variant="contained" sx={{width: "100%"}}>
                        GET PREDICTION / RUN
                    </Button>
                )}
                
            </Box>
            <Dialog open={dialogState.isOpen} onClose={handleDialogClose} fullWidth maxWidth="xl">
                <DialogContent>
                    <ViewActionExecution actionExecutionId={resultActionExecutionId}/>
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default ExecuteAction;