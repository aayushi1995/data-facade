import { Box, Button, Card, Divider, Grid, Snackbar, Step, StepButton, Stepper, Typography } from "@mui/material"
import React from "react"
import { Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom"
import { ReactQueryWrapper } from "../../../common/components/error-boundary/ReactQueryWrapper"
import LoadingIndicator from "../../../common/components/LoadingIndicator"
import { SetModuleContextState } from "../../../common/components/main_module/context/ModuleContext"
import NoData from "../../../common/components/NoData"
import ConfigureParametersNew, { isDefaultValueDefined } from "../../../common/components/parameters/ConfigureParametersNew"
import { SCHEDULED_JOBS_ROUTE } from "../../../common/components/route_consts/data/ApplicationRoutesConfig"
import { userSettingsSingleton } from "../../../data_manager/userSettingsSingleton"
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype"
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag"
import { ActionInstance, ActionParameterInstance, ProviderInstance } from "../../../generated/entities/Entities"
import { ActionDefinitionDetail, ActionInstanceDetails, ActionInstanceWithParameters } from "../../../generated/interfaces/Interfaces"
import ConfigureActionRecurring from "../execute_action/components/ConfigureActionRecurring"
import ConfigureSlackAndEmail from "../execute_action/components/ConfigureSlackAndEmail"
import SelectProviderInstance from "../execute_action/components/SelectProviderInstance"
import SelectProviderInstanceHook from "../execute_action/components/SelectProviderInstanceHook"
import ActionLevelInfo from "../execute_action/presentation/ActionLevelInfo"
import { ExecuteActionMainBox } from "../execute_action/styled_components/ExecuteActionMainBox"
import { ExecuteActionStyledTab, ExecuteActionStyledTabs } from "../execute_action/styled_components/StyledTab"
import { safelyParseJSON } from "../execute_action/util"
import { defaultWorkflowContext, SetWorkflowContext, WorkflowActionDefinition, WorkflowContext, WorkflowContextProvider } from "./context/WorkflowContext"
import { TabPanel } from "./create/SelectAction/SelectAction"
import useCreateWorkflowActionInstanceMutation from "./execute/hooks/useCreateWorkflowActionInstanceMutation"
import useGetActionInstanceDetails from "./execute/hooks/useGetActionInstanceDetails"
import { useGetWorkflowChildInstances, useGetWorkflowDetails } from "./execute/hooks/useGetWorkflowInstaces"
import { ViewWorkflowExecution } from "./ViewWorkflowExecutionHomePage"

interface MatchParams {
    workflowId: string
}

interface ExecuteWorkflowProps {
    workflowId?: string,
    previousInstanceId?: string,
    onParameterInstancesChange?: (parameterInstances: ActionParameterInstance[]) => void
}

export const ExecuteWorkflow = (props: ExecuteWorkflowProps) => {
    const match = useRouteMatch<MatchParams>()
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const setModuleContextState = React.useContext(SetModuleContextState)
    const history = useHistory()
    const location = useLocation()
    const [isReady, setIsReady] = React.useState(false)
    const [snackbarState, setSnackbarState] = React.useState(false)
    const [recurrenceConfig, setRecurrenceConfig] = React.useState<{
        actionInstance: ActionInstance,
        startDate: Date,
        activeIndex: number,
        slack?: string,
        email?: string
    }>({actionInstance: {}, startDate: new Date(Date.now()), activeIndex: 0, slack: 'C01NSTT6AA3', email: userSettingsSingleton.userEmail})

    const workflowExecutionId = location.search ?  new URLSearchParams(location.search).get("flowExecution") : undefined
    const workflowInstanceId = location.search ?  new URLSearchParams(location.search).get("flowInstance") : undefined

    const [tabValue, setTabValue] = React.useState(!!workflowExecutionId ? 1 : 0)

    const handleInstanceSaved = (data: any) => {
        if(recurrenceConfig.actionInstance.IsRecurring) {
            setSnackbarState(true)
            history.push(SCHEDULED_JOBS_ROUTE)
        } else {
            history.push(`/application/execute-workflow/${workflowId}?flowInstance=${data?.[0]?.InstanceId}&flowExecution=${data?.[0]?.Id}`)
            setTabValue(1)
        }
    }

    const areAllParametersFilled = () => {
        return workflowContext.WorkflowParameterInstance?.filter(wpi => !!wpi.ParameterValue || !!wpi.TableId || !!wpi.ColumnId)?.length === workflowContext.WorkflowParameterInstance?.length
    }

    const tableTypeParameterExists = workflowContext.WorkflowParameters?.some(apd => apd.Tag === ActionParameterDefinitionTag.TABLE_NAME)
    const pandasDataframeParameterExists = workflowContext.WorkflowParameters?.some(apd => apd.Tag === ActionParameterDefinitionTag.DATA && apd.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME)

    const saveWorkflowMutation = useCreateWorkflowActionInstanceMutation(workflowContext, handleInstanceSaved)
    const workflowId = props.workflowId || match.params.workflowId
    const handleTemplate = (data: ActionDefinitionDetail[]) => {

        setWorkflowContext({type: 'ADD_ACTION_TEMPLATE', payload: {template: data?.[0]?.ActionTemplatesWithParameters?.[0].model}})
        setWorkflowContext({type: 'CHANGE_NAME', payload: {newName: data?.[0]?.ActionDefinition?.model?.DisplayName || "workflow"}})
        setWorkflowContext({type: 'CHANGE_DESCRIPTION', payload: {newDescription: data?.[0]?.ActionDefinition?.model?.Description || "NA"}})
        setWorkflowContext({type: 'ADD_WORKFLOW_PARAMETERS', payload: data?.[0]?.ActionTemplatesWithParameters?.[0]?.actionParameterDefinitions?.map(parameter => parameter?.model || {}) || []})
        setWorkflowContext({type: 'SET_APPLICATION_ID', payload: data?.[0]?.ActionDefinition?.model?.ApplicationId })
        setWorkflowContext({type: 'SET_ACTION_GROUP', payload: data?.[0]?.ActionDefinition?.model?.ActionGroup })
        refetchFunction()
    }
    const { availableProviderInstanceQuery, availableProviderDefinitionQuery } = SelectProviderInstanceHook()
    const defaultProviderInstance = availableProviderInstanceQuery?.data?.find(prov => prov?.IsDefaultProvider)

    React.useEffect(() => {
        if(!!defaultProviderInstance && !workflowContext.SelectedProviderInstance){
            console.log("here")
            setWorkflowContext({type: 'SET_SELECTED_PROVIDER_INSTANCE', payload: {newProviderInstance: defaultProviderInstance}})
        }
    }, [defaultProviderInstance])

    const handleInstances = (data: ActionInstanceWithParameters[]) => {
        const parametersArray: ActionParameterInstance[] = []
        data.forEach(actionInstanceWithParameters => {
            const workflowAction = {
                Id: actionInstanceWithParameters?.model?.Id,
                DisplayName: actionInstanceWithParameters.model?.DisplayName || "DisplayName",
                Name: actionInstanceWithParameters.model?.Name || "Name",
                ActionGroup: "test",
                DefaultActionTemplateId: actionInstanceWithParameters.model?.TemplateId || "templateId",
                TemplateId: actionInstanceWithParameters.model?.TemplateId || "templateId",
                DefinitionId: actionInstanceWithParameters.model?.DefinitionId || "definitionId",
                Parameters: actionInstanceWithParameters.ParameterInstances,
                ResultTableName: actionInstanceWithParameters.model?.ResultTableName,
                ResultSchemaName: actionInstanceWithParameters.model?.ResultSchemaName,
                ReferenceId: actionInstanceWithParameters.model?.Config 
            } as WorkflowActionDefinition
            
            workflowContext.WorkflowParameters.forEach(globalParameter => {
                const mappedGlobalParameter = workflowAction.Parameters?.find(parameter => parameter.GlobalParameterId === globalParameter.Id)
                const defaultParameterInstance = safelyParseJSON(globalParameter?.DefaultParameterValue) as ActionParameterInstance
                console.log(mappedGlobalParameter, defaultParameterInstance)
                if(!!mappedGlobalParameter) {
                    if(!parametersArray.find(parameter => parameter.ActionParameterDefinitionId === globalParameter.Id)){
                        parametersArray.push({
                            ...defaultParameterInstance,
                            TableId: mappedGlobalParameter.TableId || defaultParameterInstance?.TableId, 
                            ParameterValue: defaultParameterInstance?.ParameterValue || mappedGlobalParameter.ParameterValue , 
                            ActionParameterDefinitionId: globalParameter.Id
                        })
                    }
                }
            })

            const stageId = workflowContext.stages[0].Id
            setWorkflowContext({type: 'ADD_ACTION', payload: {stageId: stageId, Action: workflowAction}})
        }) 
        if(parametersArray.length > 0){
            console.log(parametersArray)
            setWorkflowContext({type: 'CHANGE_WORKFLOW_PARAMETER_INSTANCES', payload: {'parameterInstances': parametersArray}})
        }
        const actionInstanceDetails = actionInstanceDetailsQuery?.data?.[0]
        if(!!actionInstanceDetails) {
            setWorkflowContext({type: 'CHANGE_WORKFLOW_PARAMETER_INSTANCES', payload: {'parameterInstances': actionInstanceDetails.ActionParameterInstance || []}})
        }
        setIsReady(true)
    }

    const handleParameterInstancesChange = (newGlobalParameterInstances: ActionParameterInstance[]) => {
        setWorkflowContext({type: 'CHANGE_WORKFLOW_PARAMETER_INSTANCES', payload: {parameterInstances: newGlobalParameterInstances}})
        props.onParameterInstancesChange?.(newGlobalParameterInstances)
    }

    const executeWorkflow = () => {
        saveWorkflowMutation.mutate({workflowId: workflowId, workflowName: workflowContext.Name, recurrenceConfig: recurrenceConfig})
    }

    const handlePreviousInstanceFetched = (data: ActionInstanceDetails[]) => {
        getWorkflowDetailsRefetch()
    }

    const handleRecurringChange = (actionInstance: ActionInstance) => {
        setRecurrenceConfig(config => ({
            ...config,
            actionInstance: actionInstance
        }))
    }

    const changeStartDate = (startDate: Date) => {
        setRecurrenceConfig(config => ({
            ...config,
            startDate: startDate
        }))
    }

    const handleGoToStep = (index: number) => {
        setRecurrenceConfig(config => ({
            ...config,
            activeIndex: index
        }))
    }
    
    const handleGoNext = () => {
        const index = recurrenceConfig.activeIndex
        setRecurrenceConfig(config => ({
            ...config,
            activeIndex: index + 1
        }))
    }

    const actionInstanceDetailsQuery = useGetActionInstanceDetails({filter: {Id: props.previousInstanceId || workflowInstanceId === null ? undefined : workflowInstanceId}, options: {enabled: false, onSuccess: handlePreviousInstanceFetched}})
    const [workflowDefinition, error, loading, getWorkflowDetailsRefetch] = useGetWorkflowDetails(workflowId, {enabled: false, onSuccess: handleTemplate})
    const [workflowInstances, instancesError, instancesLoading, refetchFunction, isRefetching] = useGetWorkflowChildInstances(workflowId, {enabled: false, onSuccess: handleInstances})
    
    React.useEffect(() => {
        setWorkflowContext({
            type: 'SET_ENTIRE_CONTEXT',
            payload: defaultWorkflowContext
        })
        if(workflowInstanceId !== undefined && workflowInstanceId !== null) {
            actionInstanceDetailsQuery.refetch()
        } else {
            getWorkflowDetailsRefetch()
        }

    }, [props.workflowId])

    const handleEmailAndSlackChange = (slack?: string, email?: string) => {
        setRecurrenceConfig(config => ({
            ...config,
            slack: slack,
            email: email
        }))
    }

    const IndexToComponent: {component: React.ReactNode, label: string}[] = []

    if(workflowContext.WorkflowParameters.filter(apd => !isDefaultValueDefined(apd.DefaultParameterValue)).length > 0) {
        IndexToComponent.push(
            {
                component: <ConfigureParametersNew
                    ActionParameterDefinitions={workflowContext.WorkflowParameters} 
                    ActionParameterInstances={workflowContext.WorkflowParameterInstance || []} 
                    ParameterAdditionalConfig={workflowContext.WorkflowParameterAdditionalConfigs || []}
                    handleParametersChange={handleParameterInstancesChange}
                    mode="GENERAL"
                />,
                label: "Required Input"
            }
        )
    }

    if(workflowContext.WorkflowParameters.filter(apd => isDefaultValueDefined(apd.DefaultParameterValue)).length > 0) {
        IndexToComponent.push(
            {
                component: <ConfigureParametersNew
                    ActionParameterDefinitions={workflowContext.WorkflowParameters} 
                    ActionParameterInstances={workflowContext.WorkflowParameterInstance || []} 
                    ParameterAdditionalConfig={workflowContext.WorkflowParameterAdditionalConfigs || []}
                    handleParametersChange={handleParameterInstancesChange}
                    mode="ADVANCED"
                />,
                label: "Inputs Advanced"
            },
        )
    }
    
    React.useEffect(() => {
        setModuleContextState({
            type: 'SetHeader',
            payload: {
                'newHeader': {
                    Title: "",
                    SubTitle: ""
                }
            }
        })
    }, [])

    IndexToComponent.push(
        {
            component: <ConfigureSlackAndEmail parameterInstances={workflowContext.WorkflowParameterInstance || []} slack={recurrenceConfig.slack} email={recurrenceConfig.email} handleEmailAndSlackChange={handleEmailAndSlackChange}/>,
            label: "Notifcation"
        }   
    )

    if((!tableTypeParameterExists)&&(!pandasDataframeParameterExists)) {
        IndexToComponent.push({
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
                                selectedProviderInstance={workflowContext.SelectedProviderInstance}
                                onProviderInstanceChange={(newProviderInstance?: ProviderInstance) => setWorkflowContext({ type: "SET_SELECTED_PROVIDER_INSTANCE", payload: { newProviderInstance: newProviderInstance } })}
                            />
                        </Grid>
                        <Grid item xs={0} md={3} lg={4}/>
                    </Grid>
                </Card>,
            label: "Providers"
        })
    }

    const handleEditFlow = () => {
        history.push(`/application/edit-workflow/${workflowId}`)
    }

    if(history.location.state !== 'fromTest') {
        IndexToComponent.push(
            {
                component: <ConfigureActionRecurring actionInstance = {recurrenceConfig.actionInstance} handleRecurringChange={handleRecurringChange} startDate={recurrenceConfig.startDate} handleStartDateChange={changeStartDate}/>,
                label: "Schedule"
            }
        )
    }

    const getSubTexts = () => {
        return [
            workflowContext.stages?.[0]?.Actions.length + " Actions",
            workflowContext.WorkflowParameters.length + " Parameters"
        ]
    }
    
    if(workflowContext.Template !== undefined && workflowContext.stages[0].Actions.length > 0 && isReady && !actionInstanceDetailsQuery.isRefetching)
    {
        return (
            <ExecuteActionMainBox sx={{display: 'flex', gap: 2, flexDirection: 'column', justifyContent: 'center',p:3}}>
               <Box sx={{flex: 1}}>
                    <ActionLevelInfo actionDefinition={workflowDefinition?.[0]?.ActionDefinition?.model || {}} subTexts={getSubTexts()} isFlow={true}/>
               </Box>
               <Divider orientation="horizontal" sx={{width: '100%'}} />
                <Box sx={{flex: 4, p: 2}}>
                    <ReactQueryWrapper data={workflowContext.WorkflowParameterInstance} isLoading={!isReady} error={instancesError} children={
                        () => (
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 3, m: 1}}>
                                <Box sx={{display: 'flex', gap: 1}}>
                                    <ExecuteActionStyledTabs value={tabValue} onChange={((event, newValue) => setTabValue(newValue))}>
                                        <ExecuteActionStyledTab label="Input" value={0} />
                                        <ExecuteActionStyledTab label="Output" value={1} disabled={!(!!workflowExecutionId)}/>
                                    </ExecuteActionStyledTabs>
                                </Box>
                                <Box sx={{mt: 1}}>
                                    <TabPanel value={tabValue} index={0}>
                                        <Grid container sx={{mt: 0}}>
                                            <Grid item xs={6} />
                                            <Grid item xs= {6} >
                                                <Stepper nonLinear activeStep={recurrenceConfig.activeIndex} alternativeLabel>
                                                    {IndexToComponent.map((component, index) => (
                                                        <Step key={index}>
                                                            <StepButton onClick={() => handleGoToStep(index)}>
                                                                <Typography>{IndexToComponent[index].label}</Typography>
                                                            </StepButton>
                                                        </Step>
                                                    ))}
                                                </Stepper>
                                            </Grid>
                                        </Grid>
                                        <Box sx={{mt: '10px'}}> 
                                            {IndexToComponent[recurrenceConfig.activeIndex].component}
                                        </Box>
                                        <Box sx={{flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2}}>
                                            {saveWorkflowMutation.isLoading ? (
                                                <LoadingIndicator/>
                                            ) : (
                                                <>
                                                {recurrenceConfig.activeIndex ===  (IndexToComponent.length - 1)? (
                                                    <Button onClick={executeWorkflow}>EXECUTE</Button>
                                                ) : (
                                                    <Box sx={{display: 'flex', flexDirection:'row', width:'90%', gap: 2,justifyContent: 'flex-end'}}>
                                                        <Button  variant="contained" disabled={!areAllParametersFilled()} onClick={executeWorkflow}>EXECUTE</Button>
                                                        <Button variant="contained" onClick={handleGoNext}>NEXT</Button>
                                                    </Box>
                                                )}
                                                
                                                </>
                                            )}
                                        </Box>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={1}>
                                    <WorkflowContextProvider>
                                        <Card sx={{overflow: 'auto'}}>
                                            <ViewWorkflowExecution workflowExecutionId={workflowExecutionId!} />
                                        </Card>
                                    </WorkflowContextProvider>
                                    </TabPanel>
                                </Box>
                                
                            </Box>
                        )
                    }/>
                    
                </Box>
                <Snackbar open={snackbarState} autoHideDuration={5000} onClose={() => setSnackbarState(false)} message="Execution Created"/>
            </ExecuteActionMainBox>
        )
    } else if(loading || instancesLoading || !isReady || actionInstanceDetailsQuery.isRefetching){
        return <LoadingIndicator/>
    } else if(!!instancesError || !!error){
        return <>Fetching Instances Error...</>
    } else {
        return <NoData/>
    }
}


const ExecuteWorkflowHomePage = () => {
    const match = useRouteMatch()

    return (
        <WorkflowContextProvider>
            <Switch>
                <Route path={`${match.path}/:workflowId`} component={ExecuteWorkflow}/>
            </Switch>
        </WorkflowContextProvider>
    )
}

export default ExecuteWorkflowHomePage