import { Box, Button, Card, Dialog, DialogContent, Grid, Snackbar, Step, StepButton, Stepper } from "@mui/material";
import React from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import ParameterDefinitionsConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane";
import { SCHEDULED_JOBS_ROUTE } from "../../../common/components/header/data/ApplicationRoutesConfig";
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import { ActionInstance, ActionParameterInstance, ProviderInstance } from "../../../generated/entities/Entities";
import ActionDefinitionHero from "../../build_action/components/shared-components/ActionDefinitionHero";
import useActionDefinitionDetail from "../../build_action/hooks/useActionDefinitionDetail";
import ViewActionExecution from "../../view_action_execution/VIewActionExecution";
import { constructCreateActionInstanceRequest, ExecuteActionContext, SetExecuteActionContext } from "../context/ExecuteActionContext";
import useCreateActionInstance from "../hooks/useCreateActionInstance";
import ConfigureActionRecurring from "./ConfigureActionRecurring";
import ConfigureSlackAndEmail from "./ConfigureSlackAndEmail";
import SelectProviderInstance from "./SelectProviderInstance";
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
    const [snackbarState, setSnackbarState] = React.useState(false)

    const tableTypeParameterExists = executeActionContext.ExistingModels.ActionParameterDefinitions?.some(apd => apd.Tag === ActionParameterDefinitionTag.TABLE_NAME)
    const pandasDataframeParameterExists = executeActionContext.ExistingModels.ActionParameterDefinitions?.some(apd => apd.Tag === ActionParameterDefinitionTag.DATA && apd.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME)

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
                setSnackbarState(true)
                if(!(executeActionContext.ToCreateModels.ActionInstance.IsRecurring)) {
                    setResultActionExecutionId(request?.actionExecutionToBeCreatedId)
                } else {
                    setDialogState({isOpen: false})
                    history.push(SCHEDULED_JOBS_ROUTE)
                }
            }
        })
    }

    const handleSyncCreate = () => {
        if(!!data && !!data[0]){
            if(executeActionContext.ToCreateModels.ActionInstance.IsRecurring) {
                handleAsyncCreate()
            } else {
                const request = constructCreateActionInstanceRequest(executeActionContext)
                createActionInstanceSyncMutation.mutate(request, {
                    onSuccess: (data) => {
                        const execution = data[0]
                        setResultActionExecutionId(execution.Id)
                    
                    }
                })
            }
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

    const handleRecurringChange = (actionInstance: ActionInstance) => {
        setExecuteActionContext({
            type: "SetActionInstance",
            payload: {
                newActionInstance: actionInstance
            }
        })
    }

    const handleGoNext = () => {
        setExecuteActionContext({
            type: "GoToNextStep"
        })
    }

    const handleGoToStep = (index: number) => {
        setExecuteActionContext({
            type: 'GoToThisStep',
            payload: index
        })
    }

    const changeStartDate = (date: Date) => {
        setExecuteActionContext({
            type: 'SetStartDate',
            payload: date
        })
    }

    const handleSlackAndEmailChange = (slack?: string, email?: string) => {
        setExecuteActionContext({
            type: 'SetSlackAndEmail',
            payload: {
                slack: slack,
                email: email
            }
        })
    }

    const handleWriteBackTableNameChange = (tableName: string) => {
        setExecuteActionContext({
            type: 'SetWriteBackTableName',
            payload: tableName
        })
    }

    const StepNumberToComponent = [
        {
            component: 
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                    <ParameterDefinitionsConfigPlane 
                        parameterDefinitions={executeActionContext.ExistingModels.ActionParameterDefinitions}
                        parameterInstances={executeActionContext.ToCreateModels.ActionParameterInstances}
                        parameterAdditionalConfigs={executeActionContext.ExistingModels.ParameterAdditionalConfig || []}
                        handleChange={handleChange}
                    />
                </Box>
            </Box>
        },
        {
            component: <ConfigureSlackAndEmail slack={executeActionContext.slack} email={executeActionContext.email} writeBackTableName={executeActionContext.ToCreateModels.ActionInstance.ResultTableName} handleEmailAndSlackChange={handleSlackAndEmailChange} parameterInstances={executeActionContext.ToCreateModels.ActionParameterInstances} actionDefinitionReturnType={executeActionContext.ExistingModels.ActionDefinition.PresentationFormat} handleWriteBackTableNameChange={handleWriteBackTableNameChange}/>
        },
        
    ]

    if((!tableTypeParameterExists)&&(!pandasDataframeParameterExists)) {
        StepNumberToComponent.unshift({
            component:  
                <Card sx={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #F8F8F8', 
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '-5px -5px 10px #E3E6F0, 5px 5px 10px #A6ABBD', 
                    borderRadius: '10px', backgroundBlendMode: 'soft-light, normal', minWidth: '100%', minHeight: '100%', 
                    justifyContent: 'center', alignItems: 'center', display: 'flex', p: 2}}
                >
                    <Grid container>
                        <Grid item xs={0} md={3} lg={4}/>
                        <Grid item xs={12} md={6} lg={4}>
                            <SelectProviderInstance 
                                selectedProviderInstance={executeActionContext.ExistingModels.SelectedProviderInstance}
                                onProviderInstanceChange={(newProviderInstance?: ProviderInstance) => {
                                    setExecuteActionContext({ type: "SetProviderInstance", payload: { newProviderInstance: newProviderInstance } })
                                }}
                            />
                        </Grid>
                        <Grid item xs={0} md={3} lg={4}/>
                    </Grid>
                </Card>
        })
    }

    if(history.location.state !== 'fromTest') {
        StepNumberToComponent.push(
            {
                component: <ConfigureActionRecurring actionInstance = {executeActionContext.ToCreateModels.ActionInstance} handleRecurringChange={handleRecurringChange} startDate={executeActionContext.startDate || new Date(Date.now())} handleStartDateChange={changeStartDate}/>
            }
        )
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
            <Grid container>
                <Grid item xs={4} />
                <Grid item xs= {4} >
                    <Stepper nonLinear activeStep={executeActionContext.currentStep}>
                        {StepNumberToComponent.map((component, index) => (
                            <Step key={index}>
                                <StepButton onClick={() => handleGoToStep(index)}>
                                    step {index+1}/{StepNumberToComponent.length}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>
            </Grid>
            <Box>
                {StepNumberToComponent[executeActionContext.currentStep].component}
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
                    <Box>
                        {executeActionContext.currentStep === (StepNumberToComponent.length - 1) ? (
                            <Button onClick={handleAsyncCreate} variant="contained" sx={{width: "100%"}}>
                                GET PREDICTION / RUN
                            </Button>
                        ) : (
                            <Button onClick={handleGoNext} variant="contained" sx={{width: "100%"}}>
                                NEXT
                            </Button>
                        )}
                        
                    </Box>
                )}
                
            </Box>
            <Dialog open={dialogState.isOpen} onClose={handleDialogClose} fullWidth maxWidth="xl">
                <DialogContent>
                    <ViewActionExecution actionExecutionId={resultActionExecutionId}/>
                </DialogContent>
            </Dialog>
            <Snackbar open={snackbarState} autoHideDuration={5000} onClose={() => setSnackbarState(false)} message="Execution Created"/>
        </Box>
    )
}

export default ExecuteAction;