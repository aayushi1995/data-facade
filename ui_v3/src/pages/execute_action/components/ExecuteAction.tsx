import EditIcon from '@mui/icons-material/Edit';
import { Alert, Box, Button, Card, Dialog, DialogContent, Divider, Grid, IconButton, Snackbar, Step, StepButton, Stepper, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import { generatePath, useHistory } from "react-router-dom";
import CodeTabIcon from "../../../../src/images/CodeTab.svg";
import ParametersIcon from "../../../../src/images/Parameters.svg";
import CodeEditor from "../../../common/components/CodeEditor";
import { ACTION_EXECUTION_ROUTE, APPLICATION_EDIT_ACTION_ROUTE_ROUTE, SCHEDULED_JOBS_ROUTE } from "../../../common/components/header/data/ApplicationRoutesConfig";
import { SetModuleContextState } from "../../../common/components/ModuleContext";
import ActionDescriptionCard from "../../../common/components/workflow-action/ActionDescriptionCard";
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import { ActionInstance, ActionParameterInstance, ProviderInstance } from "../../../generated/entities/Entities";
import useActionDefinitionDetail from "../../build_action/hooks/useActionDefinitionDetail";
import ViewActionExecution from "../../view_action_execution/VIewActionExecution";
import { constructCreateActionInstanceRequest, ExecuteActionContext, SetExecuteActionContext } from "../context/ExecuteActionContext";
import useCreateActionInstance from "../hooks/useCreateActionInstance";
import useValidateActionInstance from '../hooks/useValidateActionInstance';
import ConfigureActionRecurring from "./ConfigureActionRecurring";
import ConfigureParameters, { isDefaultValueDefined } from "./ConfigureParameters";
import ConfigureSlackAndEmail from "./ConfigureSlackAndEmail";
import SelectProviderInstance from "./SelectProviderInstance";
import SelectProviderInstanceHook from "./SelectProviderInstanceHook";

interface MatchParams {
    actionDefinitionId: string,
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

interface ExecuteActionProps {
    actionDefinitionId: string, 
    existingParameterInstances?: ActionParameterInstance[], 
    showActionDescription: boolean,
    disableRun?: boolean,
    redirectToExecution?: boolean,
    onExecutionCreate?: (executionId: string) => void,
    fromTestRun?: boolean,
    showOnlyParameters?: boolean
}

const ExecuteActionNew = (props: ExecuteActionProps) => {
    const actionDefinitionId = props.actionDefinitionId
    console.log(actionDefinitionId)
    const setModuleContext = React.useContext(SetModuleContextState)
    const [tabValue, setTabValue] = React.useState(0)
    const validateActionInstance = useValidateActionInstance()
    const [validateErrorMessage, setValidationErrorMessage] = React.useState<string | undefined>()

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
    const { availableProviderInstanceQuery, availableProviderDefinitionQuery } = SelectProviderInstanceHook()
    const defaultProviderInstance = availableProviderInstanceQuery?.data?.find(prov => prov?.IsDefaultProvider)

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

    // TODO: WHY???
    React.useEffect(() => {
        refetch()
    }, [])

    React.useEffect(() => {
        if(!!data && !!data[0]) {
            setExecuteActionContext({
                type: "SetFromActionDefinitionDetail",
                payload: {
                    ActionDefinitionDetail: data[0],
                    existingParameterInstances: props.existingParameterInstances
                }
            })
        }
    }, [data])

    React.useEffect(() => {
        if(defaultProviderInstance!==undefined){
            setExecuteActionContext({ type: "SetProviderInstance", payload: { newProviderInstance: defaultProviderInstance } })
        }
    }, [defaultProviderInstance])

    React.useEffect(() => {
        setModuleContext({
            type: 'SetHeader',
            payload: {
                'newHeader': {
                    Title: executeActionContext.ExistingModels?.ActionDefinition?.DisplayName,
                    SubTitle: 'Last Updated On ' + (new Date(executeActionContext.ExistingModels?.ActionDefinition?.UpdatedOn || executeActionContext.ExistingModels?.ActionDefinition?.CreatedOn || Date.now()).toString())
                }
            }
        })
    }, [executeActionContext.ExistingModels?.ActionDefinition?.DisplayName])

    const handleAsyncCreate = () => {
        const request = constructCreateActionInstanceRequest(executeActionContext)
        validateActionInstance.validate(request, executeActionContext.ExistingModels.ActionTemplates?.[0]?.SupportedRuntimeGroup || "python", {
            onSuccess: () => {
                createActionInstanceAsyncMutation.mutate(request, {
                    onSuccess: () => {
                        setSnackbarState(true)
                        if(!(executeActionContext.ToCreateModels.ActionInstance.IsRecurring)) {
                            // setResultActionExecutionId(request?.actionExecutionToBeCreatedId)
                            if(props.redirectToExecution !== false) { 
                                history.push(generatePath(ACTION_EXECUTION_ROUTE, {ActionExecutionId: request?.actionExecutionToBeCreatedId}))
                            } else {
                                setDialogState({isOpen: false})
                                props.onExecutionCreate?.(request?.actionExecutionToBeCreatedId!)
                            }
                        } else {
                            setDialogState({isOpen: false})
                            history.push(SCHEDULED_JOBS_ROUTE)
                        }
                    }
                })
            },
            onError: (errorMessage?: string) => setValidationErrorMessage(errorMessage)
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

    const areAllParametersFilled = () => {
        return executeActionContext.ToCreateModels?.ActionParameterInstances?.filter(wpi => !!wpi.ParameterValue || !!wpi.TableId || !!wpi.ColumnId)?.length === executeActionContext.ToCreateModels.ActionParameterInstances?.length
    }

    const StepNumberToComponent: {component: React.ReactNode, label: string}[] = []

    if(executeActionContext.ExistingModels.ActionParameterDefinitions.filter(apd => !isDefaultValueDefined(apd?.DefaultParameterValue)).length > 0) {
        StepNumberToComponent.unshift({
            component: 
            <Box sx={{ mx: 15 }}>
                <ConfigureParameters 
                    mode="GENERAL"
                    ActionParameterDefinitions={executeActionContext.ExistingModels.ActionParameterDefinitions}
                    ActionParameterInstances={executeActionContext.ToCreateModels.ActionParameterInstances}
                    ParameterAdditionalConfig={executeActionContext.ExistingModels.ParameterAdditionalConfig || []}
                    handleParametersChange={handleChange}
                    showOnlyParameters={props.showOnlyParameters}
                />
            </Box>,
            label: "Required Inputs"
        })
    }

    if(executeActionContext.ExistingModels.ActionParameterDefinitions.filter(apd => isDefaultValueDefined(apd?.DefaultParameterValue)).length > 0) {
        StepNumberToComponent.push({
            component: 
            <Box sx={{ mx: 15 }}>
                <ConfigureParameters 
                    showOnlyParameters={props.showOnlyParameters}
                    mode="ADVANCED"
                    ActionParameterDefinitions={executeActionContext.ExistingModels.ActionParameterDefinitions}
                    ActionParameterInstances={executeActionContext.ToCreateModels.ActionParameterInstances}
                    ParameterAdditionalConfig={executeActionContext.ExistingModels.ParameterAdditionalConfig || []}
                    handleParametersChange={handleChange}
                />
            </Box>,
            label: "Inputs Advanced"
            
        })
    }
    if(!props.fromTestRun) {
        StepNumberToComponent.push(
            {
                component: <ConfigureSlackAndEmail slack={executeActionContext.slack} email={executeActionContext.email} writeBackTableName={executeActionContext.ToCreateModels.ActionInstance.ResultTableName} handleEmailAndSlackChange={handleSlackAndEmailChange} parameterInstances={executeActionContext.ToCreateModels.ActionParameterInstances} actionDefinitionReturnType={executeActionContext.ExistingModels.ActionDefinition.PresentationFormat} handleWriteBackTableNameChange={handleWriteBackTableNameChange}/>,
                label: "Notification"
            },
        )
    }

    const handleEdit = () => {
        history.push(generatePath(APPLICATION_EDIT_ACTION_ROUTE_ROUTE, {ActionDefinitionId: executeActionContext.ExistingModels.ActionDefinition.Id}))
    }

    if((!tableTypeParameterExists)&&(!pandasDataframeParameterExists)) {
        StepNumberToComponent.push({
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
                </Card>,
            label: "Providers"
        })
    }

    if(history.location.state !== 'fromTest' && !props.fromTestRun) {
        StepNumberToComponent.push(
            {   
                component: <ConfigureActionRecurring actionInstance = {executeActionContext.ToCreateModels.ActionInstance} handleRecurringChange={handleRecurringChange} startDate={executeActionContext.startDate || new Date(Date.now())} handleStartDateChange={changeStartDate}/>,
                label: "Schedule"
            }
        )
    }
    
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            {props.showActionDescription ? (
                <Box>
                    <ActionDescriptionCard description={executeActionContext.ExistingModels.ActionDefinition?.Description} mode="READONLY" />
                </Box>
            ) : (
                <></>
            )}
            <Card sx={{
                background: "#F8F8F8",
                boxShadow:
                "-10px -10px 15px #FFFFFF, 10px 10px 10px rgba(0, 0, 0, 0.05), inset 10px 10px 10px rgba(0, 0, 0, 0.05), inset -10px -10px 20px #FFFFFF",
                borderRadius: "9.72px",
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 2,
                mb: 2
            }}>
                {props.fromTestRun ? (
                    <></>
                ) : (
                    <Box sx={{display: 'flex', gap: 1}}>
                        <Tabs value={tabValue} onChange={((event, newValue) => setTabValue(newValue))}>
                            <Tab label="Parameters" value={0} sx={{
                                fontFamily: "'SF Pro Text'",
                                fontStyle: "normal",
                                fontWeight: 500,
                                lineHeight: "157%",
                                letterSpacing: "0.124808px",
                                color: "#DB8C28",
                            }}
                            iconPosition="start" 
                            icon={<img src={ParametersIcon} alt="" style={{height: 35, width: 60}}/>}/>
                            <Tab label="Code" value={1} sx={{
                                fontFamily: "'SF Pro Text'",
                                fontStyle: "normal",
                                fontWeight: 500,
                                lineHeight: "157%",
                                letterSpacing: "0.124808px",
                                color: "#353535",
                            }} icon={<img src={CodeTabIcon} alt=""/>} iconPosition="start"/>
                        </Tabs>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2, flex: 1}}>
                            <IconButton onClick={handleEdit}>
                                <EditIcon/>
                            </IconButton>
                        </Box>
                    </Box>
                )}
                <Divider orientation="horizontal" sx={{mt: 1, transform: "matrix(-1, 0, 0, -1, 0, 0)"}}/>
                <Box m={1}>
                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
                            <Grid container>
                                <Grid item xs={4} />
                                <Grid item xs= {4} >
                                    <Stepper nonLinear activeStep={executeActionContext.currentStep} alternativeLabel>
                                        {StepNumberToComponent.map((component, index) => (
                                            <Step key={index}>
                                                <StepButton onClick={() => handleGoToStep(index)} >
                                                    {StepNumberToComponent[index].label}
                                                </StepButton>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Grid>
                            </Grid>
                            <Box>
                                {StepNumberToComponent[executeActionContext.currentStep].component}
                            </Box>
                            {/* <Box>
                                <ViewConfiguredParameters
                                    parameterDefinitions={executeActionContext.ExistingModels.ActionParameterDefinitions}
                                    parameterInstances={executeActionContext.ToCreateModels.ActionParameterInstances}
                                />
                            </Box> */}
                            <Box sx={{justifyContent:'center'}}>
                                {executeActionContext.ExistingModels.ActionDefinition.ActionType === ActionDefinitionActionType.AUTO_FLOW ? (
                                    <Button onClick={handleCreateWorkflow} variant="contained" sx={{width: "100%"}}>
                                        Create Auto Flow
                                    </Button>
                                ) : (
                                    <Box sx={{display: 'flex', flexDirection:'row',justifyContent: 'center'}}>
                                        {executeActionContext.currentStep === (StepNumberToComponent.length - 1) ? (
                                            <Button onClick={handleAsyncCreate} variant="contained" sx={{width: "250px"}} disabled={props.disableRun || false}>
                                                RUN
                                            </Button>
                                        ) : (
                                            <Box sx={{display: 'flex', gap: 1}}>
                                                {areAllParametersFilled() ? (
                                                    <Button onClick={handleAsyncCreate} variant="contained" sx={{width: "250px"}} disabled={props.disableRun || false}>
                                                        RUN
                                                    </Button>
                                                ) : (
                                                    <></>
                                                )}
                                                <Button onClick={handleGoNext} variant="contained" sx={{width: "250px"}}>
                                                    NEXT
                                                </Button>
                                            </Box>
                                        )}
                                        
                                    </Box>
                                )}
                                
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <CodeEditor 
                            code={executeActionContext?.ExistingModels?.ActionTemplates?.[0]?.Text || "NA"}
                            readOnly={true}
                            language={executeActionContext?.ExistingModels?.ActionTemplates?.[0]?.Language}
                        />
                    </TabPanel>
                </Box>
                <Dialog open={dialogState.isOpen} onClose={handleDialogClose} fullWidth maxWidth="xl">
                    <DialogContent>
                        <ViewActionExecution actionExecutionId={resultActionExecutionId}/>
                    </DialogContent>
                </Dialog>
                {/* <Snackbar open={snackbarState} autoHideDuration={5000} onClose={() => setSnackbarState(false)} message="Execution Created"/>  */}
                <Snackbar open={!!validateErrorMessage} autoHideDuration={5000} onClose={() => setValidationErrorMessage(undefined)} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                    <Alert severity='error' onClose={() => setValidationErrorMessage(undefined)} sx={{width: '100%'}}>
                        {validateErrorMessage}
                    </Alert>
                </Snackbar>
            </Card>
        </Box>
    )
}

export default ExecuteActionNew;