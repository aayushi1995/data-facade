import { Box, Button, Dialog, DialogContent } from "@mui/material";
import {v4 as uuidv4} from 'uuid'
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { ActionExecution, ActionInstance, ActionParameterInstance } from "../../../generated/entities/Entities";
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces";
import ActionHero from "../../build_action/components/form-components/ActionHero";
import useActionDefinitionDetail from "../../build_action/hooks/useActionDefinitionDetail";
import ParameterDefinitionsConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane";
import { CreateActionPage } from "../../customizations/CreateActionPage";
import useCreateActionInstance from "../hooks/useCreateActionInstance";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import ViewConfiguredParameters from "./ViewConfiguredParameters";
import ActionExecutionResultDialog, { ActionExecutionResultDialogProps } from "./ActionExecutionResultDialog";
import { constructCreateActionInstanceRequest, ExecuteActionContext, SetExecuteActionContext } from "../context/ExecuteActionContext";

interface MatchParams {
    actionDefinitionId: string
}

const ExecuteAction = ({match}: RouteComponentProps<MatchParams>) => {
    const actionDefinitionId = match.params.actionDefinitionId

    const { createActionInstanceAsyncMutation, createActionInstanceSyncMutation, fetchActionExeuctionParsedOutputMutation } = useCreateActionInstance({})
    const {data, error, isLoading, refetch} = useActionDefinitionDetail({actionDefinitionId: actionDefinitionId, options: {}})

    const setExecuteActionContext = React.useContext(SetExecuteActionContext)
    const executeActionContext = React.useContext(ExecuteActionContext)

    const [actionExecutionResultState, setActionExecutionResultState] = React.useState<ActionExecutionResultDialogProps>({})

    const [dialogState, setDialogState] = React.useState<{isOpen: boolean}>({isOpen: false})

    const handleChange = (newActionParameterInstances: ActionParameterInstance[]) => {
        setExecuteActionContext({
            type: "SetActionParameterInstances",
            payload: {
                newActionParameterInstances: newActionParameterInstances
            }
        })
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
                console.log(data)
            }
        })
    }

    const handleSyncCreate = () => {
        if(!!data && !!data[0]){
            const request = constructCreateActionInstanceRequest(executeActionContext)
            createActionInstanceSyncMutation.mutate(request, {
                onSuccess: (data) => {
                    const execution = data[0]
                    setActionExecutionResultState(oldState => ({...oldState, actionExecution: execution}))
                    setDialogState({isOpen: true})
                }
            })
        }
    }
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 4}}>
            <Box>
                <ActionHero
                    Name={executeActionContext.ExistingModels.ActionDefinition?.UniqueName}
                    Description={executeActionContext.ExistingModels.ActionDefinition?.Description}
                    Author={executeActionContext.ExistingModels.ActionDefinition?.CreatedBy}
                    readOnly={true}
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
                <Button onClick={handleSyncCreate} variant="contained" sx={{width: "100%"}}>
                    GET PREDICTION / RUN
                </Button>
            </Box>
            <Dialog open={dialogState.isOpen} onClose={() => setDialogState({isOpen: false})} fullWidth maxWidth="xl">
                <DialogContent>
                    <ActionExecutionResultDialog {...actionExecutionResultState}/>
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default ExecuteAction;