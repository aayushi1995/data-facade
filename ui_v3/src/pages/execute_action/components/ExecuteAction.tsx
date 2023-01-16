import EditIcon from '@mui/icons-material/Edit';
import { Alert, Box, Button, Card, Dialog, DialogContent, Divider, Grid, IconButton, Snackbar, Step, StepButton, Stepper, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import { generatePath, useHistory, useLocation } from "react-router-dom";
import CodeTabIcon from "../../../../src/images/CodeTab.svg";
import ParametersIcon from "../../../../src/images/Parameters.svg";
import CodeEditor from "../../../common/components/CodeEditor";
import { ACTION_EXECUTION_ROUTE, APPLICATION_EDIT_ACTION_ROUTE_ROUTE, SCHEDULED_JOBS_ROUTE } from "../../../common/components/header/data/ApplicationRoutesConfig";
import LoadingIndicator from '../../../common/components/LoadingIndicator';
import { SetModuleContextState } from "../../../common/components/ModuleContext";
import ActionDescriptionCard from "../../../common/components/workflow-action/ActionDescriptionCard";
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import { ActionInstance, ActionParameterInstance, ProviderInstance } from "../../../generated/entities/Entities";
import { ActionExecutionDetails } from '../../apps/components/ActionExecutionHomePage';
import useActionDefinitionDetail from "../../build_action/hooks/useActionDefinitionDetail";
import ViewActionExecution from "../../view_action_execution/VIewActionExecution";
import { constructCreateActionInstanceRequest, ExecuteActionContext, SetExecuteActionContext } from "../context/ExecuteActionContext";
import useCreateActionInstance from "../hooks/useCreateActionInstance";
import useGetExistingParameterInstances from '../hooks/useGetExistingParameterInstances';
import useValidateActionInstance from '../hooks/useValidateActionInstance';
import ActionLevelInfo from '../presentation/ActionLevelInfo';
import CircularDot from '../presentation/CircularDot';
import { ExecuteActionMainBox } from '../styled_components/ExecuteActionMainBox';
import { ExecuteActionStyledTab, ExecuteActionStyledTabs } from '../styled_components/StyledTab';
import ConfigureActionRecurring from "./ConfigureActionRecurring";
import ConfigureParameters, { isDefaultValueDefined } from "./ConfigureParameters";
import ConfigureParametersNew from './ConfigureParametersNew';
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
    showOnlyParameters?: boolean,
    fromDeepDive?: boolean,
    parentExecutionId?: string,
    hideExecution?: boolean
}

const ExecuteActionNew = (props: ExecuteActionProps) => {
    const actionDefinitionId = props.actionDefinitionId
    const setModuleContext = React.useContext(SetModuleContextState)
    const actionExecutionView = React.useRef<HTMLDivElement | null>(null)
    const useUrlToFindId = (props.fromDeepDive === undefined || props.fromDeepDive == false)
    const location = useLocation()
    const actionExecutionId = useUrlToFindId && location.search ? new URLSearchParams(location.search).get("executionId") : undefined
    const actionInstanceId = useUrlToFindId && location.search ? new URLSearchParams(location.search).get("instanceId") : undefined
    const [tabValue, setTabValue] = React.useState(!!actionExecutionId ? 1 : 0)
    const validateActionInstance = useValidateActionInstance()
    const [validateErrorMessage, setValidationErrorMessage] = React.useState<string | undefined>()
    const { createActionInstanceAsyncMutation, createActionInstanceSyncMutation, fetchActionExeuctionParsedOutputMutation } = useCreateActionInstance({
        asyncOptions: {
            onMutate: () => {
            }
        },
        syncOptions: {
            onMutate: () => {
                setDialogState({isOpen: true})
            }
        }
    })


    
    const {data, error, isLoading, refetch, isRefetching} = useActionDefinitionDetail({actionDefinitionId: actionDefinitionId, options: { enabled: false, onSuccess(data) {
        if(!!data && !!data[0]) {
            setExecuteActionContext({
                type: "SetFromActionDefinitionDetail",
                payload: {
                    ActionDefinitionDetail: data[0],
                    existingParameterInstances: fetchExistingActionParameterInstancesQuery?.data,
                    parentExecutionId: props.parentExecutionId
                }
            })
        }
    }, }})
    const fetchExistingActionParameterInstancesQuery = useGetExistingParameterInstances({
        filter: {ActionInstanceId: actionInstanceId === null ? undefined : actionInstanceId}, 
        queryOptions: {
            onSuccess: (data) => {
                refetch()
            },
            enabled: false
        }
    })
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
        if(actionInstanceId === undefined || actionInstanceId === null) {
            refetch()
        } else {
            fetchExistingActionParameterInstancesQuery.refetch()
        }
        
    }, [props.actionDefinitionId])

    React.useEffect(() => {
        if(defaultProviderInstance!==undefined){
            setExecuteActionContext({ type: "SetProviderInstance", payload: { newProviderInstance: defaultProviderInstance } })
        }
    }, [defaultProviderInstance])

    React.useEffect(() => {
        if(!! actionExecutionId && !!data) {
            const currentComponent: React.ReactNode = actionExecutionView.current
            if (currentComponent) {
                (currentComponent as {scrollIntoView: Function})?.scrollIntoView?.({
                    behavior: 'smooth',
                    block: 'start',
                })
            }
        }
    }, [actionExecutionId, data])

    React.useEffect(() => {
        setModuleContext({
            type: 'SetHeader',
            payload: {
                'newHeader': {
                    // Title: executeActionContext.ExistingModels?.ActionDefinition?.DisplayName,
                    // SubTitle: 'Last Updated On ' + (new Date(executeActionContext.ExistingModels?.ActionDefinition?.UpdatedOn || executeActionContext.ExistingModels?.ActionDefinition?.CreatedOn || Date.now()).toString())
                    Title: "",
                    SubTitle: ""
                }
            }
        })
    }, [executeActionContext.ExistingModels?.ActionDefinition?.DisplayName])

    const isOptional = (actionParameterInstance: ActionParameterInstance) => {
        return executeActionContext.ExistingModels?.ActionParameterDefinitions?.find(apd => apd.Id === actionParameterInstance.ActionParameterDefinitionId)?.IsOptional
    }

    const areAllParametersFilled = () => {
        return executeActionContext.ToCreateModels?.ActionParameterInstances?.filter(wpi => !!wpi.ParameterValue || !!wpi.TableId || !!wpi.ColumnId || isOptional(wpi))?.length === executeActionContext.ToCreateModels.ActionParameterInstances?.length
    }

    const handleAsyncCreate = () => {
        const parametersFilled = areAllParametersFilled()
        if(!parametersFilled) {
            setValidationErrorMessage("Please Fill All Required Parameters")
            return
        }
        const request = constructCreateActionInstanceRequest(executeActionContext)
        validateActionInstance.validate(request, executeActionContext.ExistingModels.ActionTemplates?.[0]?.SupportedRuntimeGroup || "python", {
            onSuccess: () => {
                createActionInstanceAsyncMutation.mutate(request, {
                    onSuccess: () => {
                        setSnackbarState(true)
                        setTabValue(1)
                        if(!(executeActionContext.ToCreateModels.ActionInstance.IsRecurring)) {
                            // setResultActionExecutionId(request?.actionExecutionToBeCreatedId)
                            if(props.redirectToExecution !== false) { 
                                // history.push(generatePath(APPLICATION_EXECUTE_ACTION_WITH_EXECUTION, {ActionDefinitionId: actionDefinitionId, ActionExecutionId: request?.actionExecutionToBeCreatedId}))
                                history.push(`/application/execute-action/${actionDefinitionId}?instanceId=${request?.actionInstance?.Id}&executionId=${request?.actionExecutionToBeCreatedId}`)

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

    const StepNumberToComponent: {component: React.ReactNode, label: string}[] = []

    if(executeActionContext.ExistingModels.ActionParameterDefinitions.filter(apd => !isDefaultValueDefined(apd?.DefaultParameterValue)).length > 0) {
        StepNumberToComponent.unshift({
            component: 
            <Box sx={{ mx: 15 }}>
                <ConfigureParametersNew
                    mode="GENERAL"
                    ActionParameterDefinitions={executeActionContext.ExistingModels.ActionParameterDefinitions}
                    ActionParameterInstances={executeActionContext.ToCreateModels.ActionParameterInstances}
                    ParameterAdditionalConfig={executeActionContext.ExistingModels.ParameterAdditionalConfig || []}
                    handleParametersChange={handleChange}
                    showOnlyParameters={props.showOnlyParameters}
                    parentExecutionId={props.parentExecutionId}
                />
            </Box>,
            label: "Required Inputs"
        })
    }

    if(executeActionContext.ExistingModels.ActionParameterDefinitions.filter(apd => isDefaultValueDefined(apd?.DefaultParameterValue)).length > 0) {
        StepNumberToComponent.push({
            component: 
            <Box sx={{ mx: 15 }}>
                <ConfigureParametersNew
                    showOnlyParameters={props.showOnlyParameters}
                    mode="ADVANCED"
                    ActionParameterDefinitions={executeActionContext.ExistingModels.ActionParameterDefinitions}
                    ActionParameterInstances={executeActionContext.ToCreateModels.ActionParameterInstances}
                    ParameterAdditionalConfig={executeActionContext.ExistingModels.ParameterAdditionalConfig || []}
                    handleParametersChange={handleChange}
                    parentExecutionId={props.parentExecutionId}
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
    
    let description = executeActionContext.ExistingModels.ActionDefinition?.Description ?
        executeActionContext.ExistingModels.ActionDefinition?.Description :
        executeActionContext.ExistingModels.ActionDefinition?.DisplayName

    return (
        <ExecuteActionMainBox sx={{display: "flex", flexDirection: "column", gap: 2, p: 3}}>
            {props.showActionDescription && !!description ? (
                <Box>
                    <ActionLevelInfo actionDefinition={executeActionContext.ExistingModels.ActionDefinition} subTexts={[executeActionContext.ExistingModels.ActionParameterDefinitions.length + " Parameters"]}/>
                </Box>
            ) : (
                <></>
            )}
            <Divider orientation='horizontal' sx={{width: '100%'}} />
            <Box sx={{
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
                        <ExecuteActionStyledTabs value={tabValue} onChange={((event, newValue) => setTabValue(newValue))}>
                            <ExecuteActionStyledTab label="Input" value={0} />
                            <ExecuteActionStyledTab label="Output" value={1} disabled={!(!!actionExecutionId && !!data && !props.hideExecution)}/>
                        </ExecuteActionStyledTabs>
                    </Box>
                )}
                <Box m={1}>
                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
                            <Grid container>
                                <Grid item xs={7} />
                                <Grid item xs= {5} >
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
                                        {createActionInstanceAsyncMutation.isLoading ? (
                                            <LoadingIndicator />
                                        ) : (
                                            <>
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
                                            </>
                                        )}
                                    </Box>
                                )}
                                
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <ActionExecutionDetails actionExecutionId={actionExecutionId!} showDescription={false}/>
                    </TabPanel>
                </Box>
                <Dialog open={dialogState.isOpen} onClose={handleDialogClose} fullWidth maxWidth="xl">
                    <DialogContent>
                        <ViewActionExecution actionExecutionId={resultActionExecutionId}/>
                    </DialogContent>
                </Dialog>
                <Snackbar open={!!validateErrorMessage} autoHideDuration={5000} onClose={() => setValidationErrorMessage(undefined)} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                    <Alert severity='error' onClose={() => setValidationErrorMessage(undefined)} sx={{width: '100%'}}>
                        {validateErrorMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </ExecuteActionMainBox>
    )
}

export default ExecuteActionNew;
