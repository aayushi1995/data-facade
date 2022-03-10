import { Box, Button, Dialog, DialogContent } from "@mui/material";
import {v4 as uuidv4} from 'uuid'
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { ActionExecution, ActionInstance, ActionParameterInstance } from "../../../generated/entities/Entities";
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces";
import ActionHero from "../../build_action/components/form-components/ActionHero";
import useActionDefinitionDetail from "../../build_action/hooks/useActionDefinitionDetail";
import { constructCreateActionInstanceRequest, getDefaultTemplateParameters, getParameters } from "../util";
import ParameterDefinitionsConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane";
import { CreateActionPage } from "../../customizations/CreateActionPage";
import useCreateActionInstance from "../hooks/useCreateActionInstance";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import ViewConfiguredParameters from "./ViewConfiguredParameters";
import ActionExecutionResultDialog, { ActionExecutionResultDialogProps } from "./ActionExecutionResultDialog";

interface MatchParams {
    actionDefinitionId: string
}

const ExecuteAction = ({match}: RouteComponentProps<MatchParams>) => {
    const { createActionInstanceAsyncMutation, createActionInstanceSyncMutation, fetchActionExeuctionParsedOutputMutation } = useCreateActionInstance({})

    const actionDefinitionId = match.params.actionDefinitionId

    const {data, error, isLoading, refetch} = useActionDefinitionDetail({actionDefinitionId: actionDefinitionId, options: {}})
    const castedData: ActionDefinitionDetail[]|undefined = data as ActionDefinitionDetail[]|undefined

    const [actionParameterInstances, setActionParameterInstances] = React.useState<ActionParameterInstance[]>([])
    const [actionExecutionResultState, setActionExecutionResultState] = React.useState<ActionExecutionResultDialogProps>({})
    const [dialogState, setDialogState] = React.useState<{isOpen: boolean}>({isOpen: false})

    const handleChange = (newParameterInstances: ActionParameterInstance[]) => {
        console.table(newParameterInstances)
        setActionParameterInstances(newParameterInstances)
    }

    React.useEffect(() => {
        refetch()
    }, [])

    React.useEffect(() => {
        if(!!castedData && !!castedData[0] && castedData.length===1) {
            const actionParameterDefinitions = getDefaultTemplateParameters(castedData![0])
            setActionParameterInstances(oldParams => {
                const newActionParameterInstances = (actionParameterDefinitions?.map(apd => ({
                    ...(oldParams.find(api => api.ActionParameterDefinitionId===apd.model?.Id)||{}),
                    Id: uuidv4(), 
                    ActionParameterDefinitionId: apd.model?.Id
                })))||[]
                return newActionParameterInstances;
            })
        }
    }, [data])

    const handleAsyncCreate = () => {
        if(!!castedData && !!castedData[0]){
            const request = constructCreateActionInstanceRequest(castedData[0]!, actionParameterInstances)
            createActionInstanceAsyncMutation.mutate(request, {
                onSuccess: () => {
                    console.log(data)
                }
            })
        }
    }

    const handleSyncCreate = () => {
        if(!!castedData && !!castedData[0]){
            const request = constructCreateActionInstanceRequest(castedData[0]!, actionParameterInstances)
            createActionInstanceSyncMutation.mutate(request, {
                onSuccess: (data) => {
                    const execution = data[0]
                    setActionExecutionResultState(oldState => ({...oldState, actionExecution: execution}))
                    setDialogState({isOpen: true})
                }
            })
        }
    }

    if(!!castedData && !!castedData[0] && castedData.length===1) {
        const apd = getParameters(castedData[0])!
        if(!!apd && !!actionParameterInstances) {
            return (
                <Box sx={{display: "flex", flexDirection: "column", gap: 4}}>
                    <Box>
                        <ActionHero
                            Name={castedData[0].ActionDefinition?.model?.UniqueName!}
                            Description={castedData[0].ActionDefinition?.model?.Description!}
                            Author={castedData[0].ActionDefinition?.model?.CreatedBy}
                            readOnly={true}
                        />
                    </Box>
                    <Box>
                        <ParameterDefinitionsConfigPlane
                            parameterDefinitions={apd!}
                            parameterInstances={actionParameterInstances!}
                            handleChange={handleChange}
                        />
                    </Box>
                    <Box>
                        <ViewConfiguredParameters
                            parameterDefinitions={apd!}
                            parameterInstances={actionParameterInstances!}
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
        } else {
            return <></>
        }
 
    } else {
        return <></>
    }

    
}

export default ExecuteAction;