import React, { useMemo, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
    AppBar,
    Box,
    Button,
    Checkbox,
    Dialog,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Tabs,
    TextField
} from '@mui/material'
import { useMutation } from 'react-query'
import { makeStyles } from '@mui/styles'
import Autocomplete from '@mui/material/Autocomplete';

import CodeEditor from './CodeEditor'
import TabWithClose from './TabWithClose'

import ActionDefinitionActionType from '../../enums/ActionDefinitionActionType'
import dataManagerInstance, { useRetreiveData } from "../../data_manager/data_manager";
import ActionParameterDefinitionTag from '../../enums/ActionParameterDefinitionTag'
import SagemakerKNNPredictorType from '../../enums/SagemakerKNNPredictorType'
import SagemakerXGBOOSTPredictorType from '../../enums/SagemakerXGBOOSTPredictorType'
import CloseIcon from '@mui/icons-material/Close';
import ActionParameterDefinitionDatatype from '../../enums/ActionParameterDefinitionDatatype'
import {getActionExecutionParsedOutput} from '../../data_manager/entity_data_handlers/action_execution_data'
import QueryData from './QueryData'
import LoadingIndicator from './LoadingIndicator'
import { config } from 'process'
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';



const useStyles = makeStyles(() => ({
    tabPanel: {
        flexGrow: 1,
        width: '100%',

    },
    dialogPaper: {
        minHeight: '60vh',
        maxHeight: '70vh',
        minWidth: 1100
    }
}))


/*
State

{
    ActionInstance: {
        model: {
            ATTRIBUTE: {
                value: ,
                isValid: 
            }
        }
    },
    ActionParameterInstances: {
        {ParameterName}: {
            model: {
                ATTRIBUTE: value
            }
        }
    }
}
AllActionParameterInstanceConfigPlane.Object.onMutate
*/

export const CreateActionInstanceForm = (props) => {
    const [config, _setConfig] = React.useState(getConfig(props.config))
    const [startTime, setStartTime] = React.useState(Date.now())
    const setConfig = (cb) => {
        const newConfig = cb(config);
        _setConfig(newConfig);
        props.saveCreateActionInstanceFormConfig && props.saveCreateActionInstanceFormConfig(newConfig);
    }
    const isConfigSet = !!props.config;
    const [availableActionDefinitionsWithTemplates, setAvailableActionDefinitionsWithTemplates] = React.useState()
    const [availableProviderInstances, setAvailableProviderInstances] = React.useState([])

    // This useMutation fetches all compatible ActionDefinitions
    useRetreiveData(
        "ActionDefinition",
        {
            filter: {
                ActionType: isConfigSet ? undefined : config.ActionInstance.model.ActionType.value,
                Id: isConfigSet ? config.ActionInstance.model.DefinitionId.value : undefined
            },
            ProviderInstanceId: config.ActionInstance.model.ProviderInstanceId.value,
            CreateActionInstanceFormGetCompatibleActionDefinitions: true
        },
        {
            //avoid further calls as it may enter infinite loop
            enabled: config.ActionInstance.model.ProviderInstanceId.value !== undefined,
            onSettled: () => {
            },
            onSuccess: (data) => {
                setAvailableActionDefinitionsWithTemplates(data)
            }
        }
    )

    // This useQuery is responsible for fetching all avaialble Provider Instances
    useRetreiveData("ProviderInstance",
        {
            filter: {}
        },
        {
            onSuccess: (data) => {
                setAvailableProviderInstances(data)
            }
        }
    )

    // This hook is responsible for making sure that the Action Instance always has a valid Provider linked 
    React.useEffect(() => {
        if (isConfigSet) {
            return;
        }
        if (availableProviderInstances !== undefined) {        
            setConfig(oldConfig => {                
                const oldProviderInstanceid = oldConfig?.ActionInstance?.model?.ProviderInstanceId?.value
                const anyProviderInstanceId = availableProviderInstances.length > 0 ? availableProviderInstances[0].Id : undefined
                const isExistingProviderAvailable = availableProviderInstances.some(providerInstance => providerInstance.Id === oldProviderInstanceid)

                return {
                    ...oldConfig,
                    ActionInstance: {
                        ...oldConfig.ActionInstance,
                        model: {
                            ...oldConfig.ActionInstance.model,
                            ProviderInstanceId: {
                                ...oldConfig.ActionInstance.model.ProviderInstanceId,
                                value: isExistingProviderAvailable ? oldProviderInstanceid : anyProviderInstanceId
                            }
                        }
                    }
                }
            })
        }
    }, [JSON.stringify(availableProviderInstances)])

    // This hook is responsible for making sure that the Action Instance always has a valid Definition linked 
    React.useEffect(() => {
        if (availableActionDefinitionsWithTemplates !== undefined) {
            setConfig(oldConfig => {
                const oldActionId = oldConfig?.ActionInstance?.model?.DefinitionId?.value || props.actionDefinitionId
                const anyActionId = availableActionDefinitionsWithTemplates.length > 0 ? availableActionDefinitionsWithTemplates[0].ActionDefinition.Id : undefined
                const isExistingActionAvailable = availableActionDefinitionsWithTemplates.some(action => action.ActionDefinition.Id === oldActionId)
                return {
                    ...oldConfig,
                    ActionInstance: {
                        ...oldConfig.ActionInstance,
                        model: {
                            ...oldConfig.ActionInstance.model,
                            DefinitionId: {
                                ...oldConfig.ActionInstance.model.DefinitionId,
                                value: isExistingActionAvailable ? oldActionId : anyActionId
                            }
                        }
                    }
                }
            })
        }
    }, [JSON.stringify(availableActionDefinitionsWithTemplates)])


    // This hook is responsible for making sure that the Action Instance always has a valid Template linked 
    React.useEffect(() => {
        if (isConfigSet) {
            return;
        }

        setConfig(oldConfig => {
            const oldDefinitionId = oldConfig?.ActionInstance?.model?.DefinitionId?.value
            const oldTemplateId = oldConfig?.ActionInstance?.model?.TemplateId?.value
            
            const oldDefinitionAndTemplateFilterResult = (availableActionDefinitionsWithTemplates || []).filter(action => action.ActionDefinition.Id === oldDefinitionId)
            const oldDefinitionAndTemplate = oldDefinitionAndTemplateFilterResult.length === 1 ? oldDefinitionAndTemplateFilterResult[0] : undefined

            const oldTemplateFilterResult = (oldDefinitionAndTemplate?.ActionTemplates || []).filter(template => template.Id === oldTemplateId)
            const oldTemplate = oldTemplateFilterResult.length === 1 ? oldTemplateFilterResult[0] : undefined

            return {
                ...oldConfig,
                ActionInstance: {
                    ...oldConfig.ActionInstance,
                    model: {
                        ...oldConfig.ActionInstance.model,
                        TemplateId: {
                            ...oldConfig.ActionInstance.model.TemplateId,
                            value: !!oldTemplate ? oldTemplate.Id : (!!oldDefinitionAndTemplate ? oldDefinitionAndTemplate.ActionTemplates[0].Id : undefined)
                        }
                    }
                }
            }
        })
    }, [config?.ActionInstance?.model?.DefinitionId?.value])


    return (
        <Box m={1} style={{ overflow: "auto", width: "100%" }} fullWidth>
            <Grid container spacing={1}>
                <Grid container item xs={12} spacing={1}>
                    <Grid container item xs={8}>
                        <ActionInstanceTemplateConfigPlane config={config} setConfig={setConfig}
                            availableActionDefinitionsWithTemplates={availableActionDefinitionsWithTemplates} />
                    </Grid>
                    <Grid container item xs={4}>
                        <Grid item xs={12}>
                            <ActionInstanceConfigPlane config={config} setConfig={setConfig}
                                startTime={startTime}
                                setStartTime={setStartTime}
                                isConfigSet={isConfigSet}
                                availableProviderInstances={availableProviderInstances}
                                availableActionDefinitionsWithTemplates={availableActionDefinitionsWithTemplates} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
                    <AllActionParameterInstanceConfigPlane
                        config={config}
                        setConfig={setConfig}
                        preFilledTables={props.preFilledTables}
                    />
                </Grid>
                <Grid container item xs={12}>
                    <FormControlPlane config={config} setConfig={setConfig} saveCreateActionInstanceFormConfig={props.saveCreateActionInstanceFormConfig} startTime={startTime}/>
                </Grid>
            </Grid>
        </Box>
    )
}

const ActionInstanceConfigPlane = (props) => {
    const { config, setConfig, isConfigSet, startTime, setStartTime } = props

    const handleName = (event) => {
        const newName = event.target.value
        setConfig(oldConfig => {
            return {
                ...oldConfig,
                ActionInstance: {
                    ...oldConfig.ActionInstance,
                    model: {
                        ...oldConfig.ActionInstance.model,
                        Name: {
                            ...oldConfig.ActionInstance.model.Name,
                            value: newName
                        },
                        DisplayName: {
                            ...oldConfig.ActionInstance.model.DisplayName,
                            value: newName
                        }
                    }
                }
            }
        })
    }

    const handleActionType = (event, newActionType, reason) => {
        setConfig(oldConfig => {
            return {
                ...oldConfig,
                ActionInstance: {
                    ...oldConfig.ActionInstance,
                    model: {
                        ...oldConfig.ActionInstance.model,
                        ActionType: {
                            ...oldConfig.ActionInstance.model.ActionType,
                            value: newActionType
                        }
                    }
                }
            }
        })
    }

    const handleEnableForReporting = (event) => {
        setConfig(oldConfig => {
            return {
                ...oldConfig,
                ActionInstance: {
                    ...oldConfig.ActionInstance,
                    model: {
                        ...oldConfig.ActionInstance.model,
                        EnableForReporting: {
                            ...oldConfig.ActionInstance.model.EnableForReporting,
                            value: event.target.checked
                        }
                    }
                }
            }
        })
    }

    const handleEmail = (event) => {
        const newEmail = event.target.value
        setConfig(oldConfig => {
            return {
                ...oldConfig,
                email: newEmail
            }
        })
    }

    const handleIsRecurring = (event) => {
        setConfig(oldConfig => {
            return {
                ...oldConfig,
                ActionInstance: {
                    ...oldConfig.ActionInstance,
                    model: {
                        ...oldConfig.ActionInstance.model,
                        IsRecurring: {
                            ...oldConfig.ActionInstance.model.IsRecurring,
                            value: event.target.checked
                        },
                        RecurrenceIntervalInSecs: {
                            ...oldConfig.ActionInstance.model.RecurrenceIntervalInSecs,
                            isValid: event.target.checked
                        }
                    }
                }
            }
        })
    }

    const handleRecurrenceIntervalChange = (event) => {
        const parameterValue = event.target.value
        if (parameterValue.match(/^-?\d+$/)) {
            const interval = parseInt(parameterValue)
            setConfig(oldConfig => {
                return {
                    ...oldConfig,
                    ActionInstance: {
                        ...oldConfig.ActionInstance,
                        model: {
                            ...oldConfig.ActionInstance.model,
                            RecurrenceIntervalInSecs: {
                                ...oldConfig.ActionInstance.model.RecurrenceIntervalInSecs,
                                value: interval
                            }
                        }
                    }
                }

            })
        }
        else if(parameterValue === ""){
            setConfig(oldConfig => {
                return {
                    ...oldConfig,
                    ActionInstance: {
                        ...oldConfig.ActionInstance,
                        model: {
                            ...oldConfig.ActionInstance.model,
                            RecurrenceIntervalInSecs: {
                                ...oldConfig.ActionInstance.model.RecurrenceIntervalInSecs,
                                value: 0
                            }
                        }
                    }
                }

            })
        }
    }

    const handleStartTimeChange = (event) => {
        if(event !== "Invalid Date"){
            console.log(event)
            setStartTime(event)
            const date = Date.parse(event)
            console.log(date)
        }
    }

    const handleProvider = {
        HANDLE_PROVIDER_CHANGE: (event, newProvider, reason) => {
            setConfig(oldConfig => {
                return {
                    ...oldConfig,
                    ActionInstance: {
                        ...oldConfig.ActionInstance,
                        model: {
                            ...oldConfig.ActionInstance.model,
                            ProviderInstanceId: {
                                ...oldConfig.ActionInstance.model.ProviderInstanceId,
                                value: handleProvider.EXTRACT_ID_FROM_PROVIDER(newProvider)
                            }
                        }
                    }
                }
            })
        },
        GET_PROVIDER_FROM_ID: (providerInstanceId) => {
            if (providerInstanceId === undefined) {
                return {
                    Name: ""
                }
            } else {
                const provider = props.availableProviderInstances.filter(provider => provider.Id === providerInstanceId)[0]
                return provider
            }
        },
        EXTRACT_ID_FROM_PROVIDER: (provider) => {
            return provider?.Id
        }
    }

    const handleDefinition = {
        HANDLE_DEFINITION_CHANGE: (event, newDefinition, reason) => {
            setConfig(oldConfig => {
                return {
                    ...oldConfig,
                    ActionInstance: {
                        ...oldConfig.ActionInstance,
                        model: {
                            ...oldConfig.ActionInstance.model,
                            DefinitionId: {
                                ...oldConfig.ActionInstance.model.DefinitionId,
                                value: handleDefinition.EXTRACT_ID_FROM_ACTION(newDefinition)
                            }
                        }
                    }
                }
            })
        },
        GET_DEFINITION_FROM_ID: (definitionId) => {
            if (definitionId === undefined) {
                return {
                    ActionDefinition: {
                        DisplayName: ""
                    }
                }
            } else {
                const action = (props.availableActionDefinitionsWithTemplates || []).filter(action => action.ActionDefinition.Id === definitionId)[0]
                return action
            }
        },
        EXTRACT_ID_FROM_ACTION: (definition) => {
            return definition?.ActionDefinition?.Id
        }
    }

    return (
        <Box pt={1} pb={1}>
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        value={config?.ActionInstance?.model?.Name?.value || "[Edit It] Action Instance Created At " + Date()
                        }
                        onChange={handleName}
                        variant="outlined"
                        label="Name"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        options={[ActionDefinitionActionType.PROFILING, ActionDefinitionActionType.CHECK, ActionDefinitionActionType.ML_PREDICT, ActionDefinitionActionType.ML_TRAIN]}
                        value={(config?.ActionInstance?.model?.ActionType?.value) || ""}
                        filterSelectedOptions
                        fullWidth
                        selectOnFocus
                        onChange={handleActionType}
                        disableClearable={true}
                        disabled={!!isConfigSet}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                disabled={!!isConfigSet}
                                variant="outlined"
                                label="Action Type"
                                placeholder=""
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        options={props.availableProviderInstances}
                        getOptionLabel={provider => (provider?.Name) || ""}
                        filterSelectedOptions
                        fullWidth
                        selectOnFocus
                        disabled={!!isConfigSet}
                        value={handleProvider.GET_PROVIDER_FROM_ID(config?.ActionInstance?.model?.ProviderInstanceId?.value) || ""}
                        onChange={handleProvider.HANDLE_PROVIDER_CHANGE}
                        disableClearable={true}
                        renderInput={(params) => (
                            <TextField
                                disabled={!!isConfigSet}
                                {...params}
                                variant="outlined"
                                label="Provider Instance"
                                placeholder=""
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        options={props.availableActionDefinitionsWithTemplates || []}
                        getOptionLabel={action => (action?.ActionDefinition?.DisplayName) || ""}
                        filterSelectedOptions
                        fullWidth
                        disabled={!!isConfigSet}
                        selectOnFocus
                        value={handleDefinition.GET_DEFINITION_FROM_ID(config?.ActionInstance?.model?.DefinitionId?.value) || ''}
                        onChange={handleDefinition.HANDLE_DEFINITION_CHANGE}
                        disableClearable={true}
                        noOptionsText="No Actions Available"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Action Definition"
                                placeholder="Action Definition"
                                disabled={!!isConfigSet}
                            />
                        )}
                    />
                </Grid>
                {/* {config?.ActionInstance?.model?.ActionType?.value === ActionDefinitionActionType.PROFILING &&
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox checked={config?.ActionInstance?.model?.EnableForReporting?.value || false}
                                onChange={handleEnableForReporting}
                                inputProps={{ 'aria-label': 'primary checkbox' }} />}
                            label="Enable For Reporting"
                        />
                    </Grid>
                } */}
                {config?.ActionInstance?.model?.ActionType?.value === ActionDefinitionActionType.CHECK &&
                <Grid item xs={12}>
                    <TextField
                        value={props.config?.email || ""}
                        onChange={handleEmail}
                        variant="outlined"
                        label="Notification Email"
                        fullWidth
                    />
                </Grid>}
                    <Grid item xs={12}>
                    <FormControlLabel
                    control={<Checkbox checked={config?.ActionInstance?.model?.IsRecurring?.value || false}
                    onChange={handleIsRecurring}
                    inputProps={{'aria-label': 'primary checkbox'}}/>}
                    label="Is Action Recurring"
                    />
                    </Grid>
                {config?.ActionInstance?.model?.RecurrenceIntervalInSecs?.isValid &&
                    <Grid item xs={12}>
                    <TextField
                    value={config?.ActionInstance?.model?.RecurrenceIntervalInSecs?.value || ""}
                    onChange={handleRecurrenceIntervalChange}
                    variant="outlined"
                    label="Recurrence Interval in Seconds"
                    fullWidth
                    />
                    </Grid>
                }
                {
                    config?.ActionInstance?.model?.IsRecurring?.value === true &&
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid item xs={12}>
                            <DateTimePicker
                                value={startTime}
                                label="Start Date"
                                renderInput={(params) => <TextField {...params} />}
                                onChange={handleStartTimeChange}
                            />
                        </Grid>
                    </LocalizationProvider>
                }
            </Grid>
        </Box>
    )
}

const ActionInstanceTemplateConfigPlane = (props) => {
    const classes = useStyles()
    const { config, setConfig } = props
    const activeDefinitionId = config?.ActionInstance?.model?.DefinitionId?.value
    const activeTemplateId = config?.ActionInstance?.model?.TemplateId?.value
    const allTempates = (props.availableActionDefinitionsWithTemplates || []).filter(action => action.ActionDefinition.Id === activeDefinitionId)[0]?.ActionTemplates
    const activeTemplate = (allTempates || []).filter(templates => templates.Id === activeTemplateId)[0]

    const handleTemplateId = (event, newTemplateId) => {
        setConfig(oldConfig => {
            return {
                ...oldConfig,
                ActionInstance: {
                    ...oldConfig.ActionInstance,
                    model: {
                        ...oldConfig.ActionInstance.model,
                        TemplateId: {
                            ...oldConfig.ActionInstance.model.TemplateId,
                            value: newTemplateId
                        }
                    }
                }
            }
        })
    }
    return (
        <Box style={{ width: "100%" }}>
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <div className={classes.tabPanel}>
                        <AppBar position="static" color="default">
                            <Tabs
                                value={activeTemplateId}
                                onChange={handleTemplateId}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"
                            >
                                {(allTempates || []).map((template, index) => {
                                    return <TabWithClose label={template.SupportedRuntimeGroup} value={template.Id}
                                        disableClose={true} />
                                })}
                            </Tabs>
                        </AppBar>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <CodeEditor
                        code={activeTemplate?.Text || "NA"}
                        language={activeTemplate?.Language}
                        readOnly={true}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export const AllActionParameterInstanceConfigPlane = (props) => {
    const { config, setConfig } = props
    const templateId = config?.ActionInstance?.model?.TemplateId?.value
    const [apd, setApd] = React.useState([])
    const [searchParamName, setSearchParamName] = React.useState("")
    const [filteredApd, setFilteredApd] = React.useState([])

    // This useMutation is responsible for fetching all Action Parameter Definitions
    useRetreiveData(
        "ActionParameterDefinition", {
            filter: {
                TemplateId: templateId
            }
        },
        {
            enabled: templateId !== undefined,
            onSuccess: (data) => {
                setApd(data);
                setConfig(oldConfig => {
                    const oldActionParameterInstances = config?.ActionParameterInstances
                    const newActionParameterInstances = {}
                    for (const parameterDefinition of data) {
                        if(oldActionParameterInstances?.length > 0 && oldActionParameterInstances[parameterDefinition.ParameterName] === undefined) {
                            const currentParameterInstance = oldActionParameterInstances?.find?.(old => old?.ActionParameterDefinitionId === parameterDefinition.Id)
                            newActionParameterInstances[parameterDefinition.ParameterName] = {
                                ...currentParameterInstance
                            }
                        } else {
                            newActionParameterInstances[parameterDefinition.ParameterName] = oldActionParameterInstances[parameterDefinition.ParameterName] || {
                                Id: uuidv4(),
                                ParameterName: parameterDefinition.ParameterName,
                                ActionParameterDefinitionId: parameterDefinition.Id,
                                ActionInstanceId: config.ActionInstance.model.Id.value         
                            }
                        }
                    }
                    console.log(newActionParameterInstances)
                    return {
                        ...oldConfig,
                        ActionParameterInstances: newActionParameterInstances
                    }
                })
                
            }
        }
    );

    // This hook is responsible for searching
    React.useEffect(() => {
        setFilteredApd(apd.filter(param => param.ParameterName.includes(searchParamName)))
    }, [searchParamName, apd])

    return (
        <Box pt={1} style={{ width: "100%" }}>
            <Grid container item xs={12} spacing={1}>
                <Grid item xs={12}>
                    <Box style={{ width: "100%" }}>
                        <TextField
                            value={searchParamName}
                            onChange={(event) => {
                                setSearchParamName(event.target.value)
                            }}
                            variant="outlined"
                            fullWidth
                            placeholder="Search"
                            margin="dense"
                        />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box style={{ width: "100%", height: 200, overflow: 'auto' }}>
                        <Grid container item xs={12} spacing={1}>
                            {filteredApd.map(paramDef =>
                                <Grid container item xs={6}>
                                    <ActionParameterInstanceConfigPlane parameterDefinition={paramDef} config={config}
                                        setConfig={setConfig}
                                        allActionParameterDefinition={apd}
                                        preFilledTables={props.preFilledTables}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
};

const ActionParameterInstanceConfigPlane = (props) => {
    const {
        Tag: parameterTag,
        Datatype: parameterDatatype,
        Type: parameterType,
        ParameterName: parameterName,
        DefaultParameterValue: defaultParameterValue
    } = props.parameterDefinition

    const tagBased = {
        [ActionParameterDefinitionTag.TABLE_NAME]: <ActionParameterInstanceInputField.TABLE_NAME
            config={props.config}
            setConfig={props.setConfig}
            preFilledTables={props.preFilledTables}
            ParameterName={parameterName}
            DefaultParameterValue={defaultParameterValue}
            allActionParameterDefinition={props.allActionParameterDefinition}
        />,
        [ActionParameterDefinitionTag.DATA]: <ActionParameterInstanceInputField.DATAFRAME
            config={props.config}
            setConfig={props.setConfig}
            preFilledTables={props.preFilledTables}
            ParameterName={parameterName}
            DefaultParameterValue={defaultParameterValue}
            allActionParameterDefinition={props.allActionParameterDefinition}
        />,
        [ActionParameterDefinitionTag.COLUMN_NAME]: <ActionParameterInstanceInputField.COLUMN_NAME
            config={props.config}
            setConfig={props.setConfig}
            ParameterName={parameterName} DefaultParameterValue={defaultParameterValue}
            allActionParameterDefinition={props.allActionParameterDefinition} />,
        [ActionParameterDefinitionTag.TRAINED_PREDICTION_MODEL_NAME]: <ActionParameterInstanceInputField.TRAINED_PREDICTION_MODEL_NAME config={props.config} setConfig={props.setConfig}
            ParameterName={parameterName} allActionParameterDefinition={props.allActionParameterDefinition} DefaultParameterValue={defaultParameterValue} />,
        [ActionParameterDefinitionTag.NEW_PREDICTION_MODEL_NAME]: <ActionParameterInstanceInputField.NEW_PREDICTION_MODEL_NAME config={props.config} setConfig={props.setConfig}
            ParameterName={parameterName} allActionParameterDefinition={props.allActionParameterDefinition} DefaultParameterValue={defaultParameterValue} />,
        [ActionParameterDefinitionTag.SAGEMAKER_MODEL_URI]: <ActionParameterInstanceInputField.SAGEMAKER_MODEL_URI config={props.config} setConfig={props.setConfig}
            ParameterName={parameterName} allActionParameterDefinition={props.allActionParameterDefinition} DefaultParameterValue={defaultParameterValue} />,
        [ActionParameterDefinitionTag.SAGEMAKER_KNN_PREDICTOR_TYPE]: <ActionParameterInstanceInputField.SAGEMAKER_KNN_PREDICTOR_TYPE config={props.config} setConfig={props.setConfig}
            ParameterName={parameterName} allActionParameterDefinition={props.allActionParameterDefinition} DefaultParameterValue={defaultParameterValue} />,
        [ActionParameterDefinitionTag.SAGEMAKER_XGBOOST_PREDICTOR_TYPE]: <ActionParameterInstanceInputField.SAGEMAKER_XGBOOST_PREDICTOR_TYPE config={props.config} setConfig={props.setConfig}
            ParameterName={parameterName} allActionParameterDefinition={props.allActionParameterDefinition} DefaultParameterValue={defaultParameterValue} />,
    }

    const datatypeBased = {
        [ActionParameterDefinitionDatatype.BOOLEAN]: <ActionParameterInstanceInputField.BOOLEAN config={props.config} setConfig={props.setConfig}
            ParameterName={parameterName} allActionParameterDefinition={props.allActionParameterDefinition} DefaultParameterValue={defaultParameterValue} />,
        [ActionParameterDefinitionDatatype.STRING]: <ActionParameterInstanceInputField.STRING config={props.config} setConfig={props.setConfig}
            ParameterName={parameterName} allActionParameterDefinition={props.allActionParameterDefinition} DefaultParameterValue={defaultParameterValue} />,
        [ActionParameterDefinitionDatatype.INT]: <ActionParameterInstanceInputField.INT config={props.config} setConfig={props.setConfig}
            ParameterName={parameterName} allActionParameterDefinition={props.allActionParameterDefinition} DefaultParameterValue={defaultParameterValue} />,
        [ActionParameterDefinitionDatatype.FLOAT]: <ActionParameterInstanceInputField.FLOAT config={props.config} setConfig={props.setConfig}
            ParameterName={parameterName} allActionParameterDefinition={props.allActionParameterDefinition} DefaultParameterValue={defaultParameterValue} />
    }

    const getInputElementForParameter = () => {
        if (parameterTag in tagBased) {
            return tagBased[parameterTag]
        } else if (parameterDatatype in datatypeBased) {
            return datatypeBased[parameterDatatype]
        } else {
            return <></>
        }
    }

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <Box pt={1} pb={1} style={{ width: "100%" }}>
                    {getInputElementForParameter()}
                </Box>
            </Grid>
        </Grid>
    )
}

// Collection of Action Parameter Instance Inputs
const ActionParameterInstanceInputField = {
    TRAINED_PREDICTION_MODEL_NAME: (props) => {
        // This useQuery is responsible for fetching all the Models
        const { status: availablePredictionModelStatus, data: availablePredictionModelData } = useRetreiveData("PredictionModel",
            {
                filter: {}
            }
        )
        const handlePredictionModel = {
            HANDLE_MODEL_CHANGE: (event, predictionModel, reason) => {
                props.setConfig(oldConfig => {
                    return {
                        ...oldConfig,
                        ActionParameterInstances: {
                            ...oldConfig?.ActionParameterInstances,
                            [props.ParameterName]: {
                                ...oldConfig?.ActionParameterInstances[props.ParameterName],
                                ParameterValue: predictionModel.UniqueName
                            }
                        }
                    }
                })
            },
            GET_MODEL_FROM_NAME: (modelUniqueName) => {
                if (modelUniqueName === undefined) {
                    return { UniqueName: "" }
                } else {
                    const predictionModel = (availablePredictionModelData || []).filter(predictionModel => predictionModel.UniqueName === modelUniqueName)[0]
                    return predictionModel
                }
            }
        }

        return (
            <Autocomplete
                options={(availablePredictionModelData || [])}
                getOptionLabel={predictionModel => predictionModel.UniqueName}
                value={handlePredictionModel.GET_MODEL_FROM_NAME(props.config?.ActionParameterInstances[props.ParameterName]?.ParameterValue)}
                fullWidth
                selectOnFocus
                onChange={handlePredictionModel.HANDLE_MODEL_CHANGE}
                disableClearable={true}
                renderInput={(params) => {

                    return <TextField
                        {...params}
                        value={props.config?.ActionParameterInstances[props.ParameterName]?.ParameterValue}
                        variant="outlined"
                        label={props.ParameterName}
                        placeholder=""
                    />
                }}
            />
        )

    },
    SAGEMAKER_KNN_PREDICTOR_TYPE: (props) => {
        const onValueChange = (event) => {
            const parameterValue = event.target.value
            props.setConfig(oldConfig => {
                return {
                    ...oldConfig,
                    ActionParameterInstances: {
                        ...oldConfig?.ActionParameterInstances,
                        [props.ParameterName]: {
                            ...oldConfig?.ActionParameterInstances[props.ParameterName],
                            ParameterValue: parameterValue
                        }
                    }
                }
            })
        }

        return (
            <FormControl variant="outlined" style={{ width: "100%" }}>
                <InputLabel>{props.ParameterName}</InputLabel>
                <Select
                    value={props.config?.ActionParameterInstances[props.ParameterName]?.ParameterValue}
                    onChange={onValueChange}
                    variant="outlined"
                    label={props.ParameterName}
                    fullWidth
                    inputProps={{ disabled: props.readOnly }}
                >
                    <MenuItem value={SagemakerKNNPredictorType.CLASSIFIER}>{SagemakerKNNPredictorType.CLASSIFIER}</MenuItem>
                    <MenuItem value={SagemakerKNNPredictorType.REGRESSOR}>{SagemakerKNNPredictorType.REGRESSOR}</MenuItem>
                </Select>
            </FormControl>
        )
    },
    SAGEMAKER_XGBOOST_PREDICTOR_TYPE: (props) => {
        const onValueChange = (event) => {
            const parameterValue = event.target.value
            props.setConfig(oldConfig => {
                return {
                    ...oldConfig,
                    ActionParameterInstances: {
                        ...oldConfig?.ActionParameterInstances,
                        [props.ParameterName]: {
                            ...oldConfig?.ActionParameterInstances[props.ParameterName],
                            ParameterValue: parameterValue
                        }
                    }
                }
            })
        }

        return (
            <FormControl variant="outlined" style={{ width: "100%" }}>
                <InputLabel>{props.ParameterName}</InputLabel>
                <Select
                    value={props.config?.ActionParameterInstances[props.ParameterName]?.ParameterValue}
                    onChange={onValueChange}
                    variant="outlined"
                    label={props.ParameterName}
                    fullWidth
                    inputProps={{ disabled: props.readOnly }}
                >
                    <MenuItem value={SagemakerXGBOOSTPredictorType.CLASSIFIER}>{SagemakerXGBOOSTPredictorType.CLASSIFIER}</MenuItem>
                    <MenuItem value={SagemakerXGBOOSTPredictorType.REGRESSOR}>{SagemakerXGBOOSTPredictorType.REGRESSOR}</MenuItem>
                </Select>
            </FormControl>
        )
    },
    SAGEMAKER_MODEL_URI: (props) => {
        React.useEffect(() => {
            props.setConfig(oldConfig => {
                return {
                    ...oldConfig,
                    ActionParameterInstances: {
                        ...oldConfig?.ActionParameterInstances,
                        [props.ParameterName]: {
                            ...oldConfig?.ActionParameterInstances[props.ParameterName],
                            ParameterValue: props.DefaultParameterValue
                        }
                    }
                }
            })
        }, [props.DefaultParameterValue])
        return <></>
    },
    NEW_PREDICTION_MODEL_NAME: (props) => {
        // This useQuery is responsible for fetching all the Models
        const onValueChange = (event) => {
            const parameterValue = event.target.value
            props.setConfig(oldConfig => {
                return {
                    ...oldConfig,
                    ActionParameterInstances: {
                        ...oldConfig?.ActionParameterInstances,
                        [props.ParameterName]: {
                            ...oldConfig?.ActionParameterInstances[props.ParameterName],
                            ParameterValue: parameterValue
                        }
                    }
                }
            })
        }

        return (
            <TextField
                value={props.config?.ActionParameterInstances[props.ParameterName]?.ParameterValue || ""}
                onChange={onValueChange}
                variant="outlined"
                label={props.ParameterName}
                fullWidth
            />
        )
    },
    TABLE_NAME: (props) => {
        const config = props.config;
        const allActionParameterDefinition = props.allActionParameterDefinition
        //repeated code
        // This useQuery is responsible for fetching all the Tables on a Provider Instance
        const { status: availableTableStatus, data: availableTableData } = useRetreiveData("TableProperties",
            {
                filter: { ProviderInstanceID: config?.ActionInstance?.model?.ProviderInstanceId?.value }
            }
        )
        //props.preFilledTables are action instances
        const [availableTables, setAvailableTables] = React.useState([]);


        // This hook is responsible for setting the list of avaialble tables
        React.useEffect(() => {
            if (availableTableData !== undefined) {
                const newTableIds = availableTableData.map(t => t.Id);
                const oldTableIds = availableTables.map(t => t.Id);
                const isTableIdsModified = newTableIds?.some(newTableId => !oldTableIds.includes(newTableId));
                //if there are any new tableIds then add them
                if (isTableIdsModified) {
                    setAvailableTables((t) => [...(props.preFilledTables || []), ...availableTableData])
                }
            }
        }, [availableTableData, availableTables, props.preFilledTables]);

        // This hook assigns a Default Value to the Parameter
        /** if (data.some(newApd => !oldApdIds?.includes(newApd.Id))) {
            setConfig(oldConfig => {
                const newActionParameterInstances = {}
                for (const parameterDefinition of apd) {
                    newActionParameterInstances[parameterDefinition.ParameterName] = {
                        Id: uuidv4(),
                        ParameterName: parameterDefinition.ParameterName,
                        ActionParameterDefinitionId: parameterDefinition.Id,
                        ActionInstanceId: config.ActionInstance.model.Id.value,
                    }
                }
                return {
                    ...oldConfig,
                    ActionParameterInstances: newActionParameterInstances
                }
            })
        }
        // }, [availableTables])**/

        const handleTable = {
            HANDLE_TABLE_CHANGE: (event, tableModel, reason) => {
                const ParameterValue = config.ActionParameterInstances?.[props.ParameterName]?.ParameterValue;
                if (!!ParameterValue &&
                    (tableModel.UniqueName === ParameterValue ||
                    tableModel.DisplayName === ParameterValue)) {
                    return;
                }
                props.setConfig(oldConfig => {
                    return {
                        ...oldConfig,
                        ActionParameterInstances: {
                            ...oldConfig?.ActionParameterInstances,
                            [props.ParameterName]: {
                                ...oldConfig?.ActionParameterInstances[props.ParameterName],
                                ParameterValue: tableModel.UniqueName || tableModel.DisplayName,
                                TableId: tableModel.Id,
                                SourceExecutionId: tableModel.type === 'ActionInstance' ? tableModel.Id : undefined,
                                ...(allActionParameterDefinition.find(apd => apd.ParameterName === props.ParameterName) || {})
                            }
                        },
                        ActionInstance: {
                            ...oldConfig?.ActionInstance,
                            model: {
                                ...oldConfig?.ActionInstance?.model,
                                TableId: {
                                    ...oldConfig?.ActionInstance?.model?.TableId,
                                    value: tableModel.Id,
                                }
                            }
                        }
                    }
                })
            },
            GET_TABLE_FROM_ID: (tableId) => {
                if (tableId === undefined) {
                    return { UniqueName: "" }

                } else {
                    const tableModel = availableTables.filter(table => table.Id === tableId)[0]
                    return tableModel;
                }
            }
        }

        return (
            <Autocomplete
                options={availableTables}
                groupBy={tableModel => tableModel.type === 'ActionInstance' ? "Action Instances" : "Data sets"}
                getOptionLabel={tableModel => tableModel.UniqueName || tableModel.DisplayName || ""}
                value={handleTable.GET_TABLE_FROM_ID(props.config?.ActionParameterInstances[props.ParameterName]?.TableId) || ""}
                fullWidth
                selectOnFocus
                onChange={handleTable.HANDLE_TABLE_CHANGE}
                disableClearable={true}
                renderInput={(params) => {

                    return <TextField
                        {...params}
                        value={props.config?.ActionParameterInstances[props.ParameterName]?.ParameterValue || ""} //TODO: pre select the workflow table
                        variant="outlined"
                        label={props.ParameterName}
                        placeholder=""
                    />
                }}
            />
        )
    },
    DATAFRAME: (props) => {
        //props.preFilledTables are action instances
        const allActionParameterDefinition = props.allActionParameterDefinition
        const [availableTables, setAvailableTables] = React.useState([]);
        const config = props.config;


        const ProviderInstanceID = props?.config?.ActionInstance?.model?.ProviderInstanceId?.value;
        // This useQuery is responsible for fetching all the Tables on a Provider Instance
        const { status: availableTableStatus, data: availableTableData } = useRetreiveData("TableProperties",
            {
                filter: {}
            },
            {
                enabled: ProviderInstanceID !== undefined
            }
        )

        // This hook is responsible for setting the list of avaialble tables
        React.useEffect(() => {
            if (availableTableData !== undefined) {
                const newTableIds = availableTableData.map(t => t.Id);
                const oldTableIds = availableTables.map(t => t.Id);
                const isTableIdsModified = newTableIds?.some(newTableId => !oldTableIds.includes(newTableId));
                //if there are any new tableIds then add them
                if (isTableIdsModified) {
                    setAvailableTables((t) => [
                        ...(props.preFilledTables || []),
                        ...availableTableData
                    ])
                }
            }
        }, [availableTableData, availableTables, props.preFilledTables]);


        //props.preFilledTables are action instances



        const handleTable = {
            HANDLE_TABLE_CHANGE: (event, tableModel, reason) => {
                //if no change in ParameterValue then return to avoid rerendering
                const ParameterValue = config.ActionParameterInstances?.[props.ParameterName]?.ParameterValue;
                if (!!ParameterValue &&
                    (tableModel.UniqueName === ParameterValue ||
                        tableModel.DisplayName === ParameterValue)) {
                    return;
                }
                props.setConfig(oldConfig => {
                    return {
                        ...oldConfig,
                        ActionParameterInstances: {
                            ...oldConfig?.ActionParameterInstances,
                            [props.ParameterName]: {
                                ...oldConfig?.ActionParameterInstances[props.ParameterName],
                                ParameterValue: tableModel.UniqueName || tableModel.DisplayName,
                                TableId: tableModel.Id,
                                SourceExecutionId: tableModel.type === 'ActionInstance' ? tableModel.Id : undefined,
                                ProviderInstanceId: oldConfig?.ActionInstance?.model?.ProviderInstanceId?.value,
                                ...(allActionParameterDefinition.find(apd => apd.ParameterName === props.ParameterName) || {})
                            }
                        },
                        ActionInstance: {
                            ...oldConfig?.ActionInstance,
                            model: {
                                ...oldConfig?.ActionInstance?.model,
                                TableId: {
                                    ...oldConfig?.ActionInstance?.model?.TableId,
                                    value: tableModel.Id,
                                }
                            }
                        }
                    }
                })
            },
            GET_TABLE_FROM_ID: (tableId) => {
                console.log(tableId)
                if (tableId === undefined) {
                    return { UniqueName: "" }
                } else {
                    const tableModel = availableTables.filter(table => table.Id === tableId)[0]
                    return tableModel
                }
            }
        }
        console.log(availableTables)
        return (
            <Autocomplete
                options={availableTables}
                groupBy={tableModel => tableModel.type === 'ActionInstance' ? "Action Instances" : "Data sets"}
                getOptionLabel={tableModel => {
                    // console.log(tableModel)
                    return tableModel.UniqueName || tableModel.DisplayName || tableModel.Name || ""
                }}
                value={handleTable.GET_TABLE_FROM_ID(props.config?.ActionParameterInstances[props.ParameterName]?.TableId) || ""}
                fullWidth
                selectOnFocus
                onChange={handleTable.HANDLE_TABLE_CHANGE}
                disableClearable={true}
                groupBy={tableModel => tableModel.ProviderInstanceName}
                renderInput={(params) => {
                    return <TextField
                        {...params}
                        value={props.config?.ActionParameterInstances[props.ParameterName]?.ParameterValue || ""}
                        variant="outlined"
                        label={props.ParameterName}
                        placeholder=""
                    />
                }}
            />
        )
    },
    COLUMN_NAME: (props) => {
        // Extract all possible Table Names from other parameters and store in state
        const [tableNames, setTableNames] = React.useState([]);
        const [previousActions, setPreviousActions] = React.useState([]);
        // This hook is respnsible for
        React.useEffect(() => {
            const parameterNamesWithTableTags = props.allActionParameterDefinition.filter(apd => apd.Tag === ActionParameterDefinitionTag.TABLE_NAME || apd.Tag === ActionParameterDefinitionTag.DATA).map(apd => apd.ParameterName)
            const tableNames = [];
            const previousActions = [];
            parameterNamesWithTableTags.forEach(paramName => {
                const ParameterObject = props?.config?.ActionParameterInstances[paramName];
                if (!!ParameterObject?.SourceExecutionId) {
                    previousActions.push(ParameterObject);
                    //TODO: if PresentationFormat of the associated ActionDefinition.model is 'table_value' then show a textbox to let user fill the value
                }else{
                    const paramValue = ParameterObject?.ParameterValue
                    if (paramValue !== undefined) {
                        tableNames.push(paramValue)
                    }
                }
            })
            setTableNames(tableNames);
            setPreviousActions(previousActions);
        }, [props.allActionParameterDefinition, props?.config?.ActionParameterInstances])

        // This useQuery is responsible for fetching all the Columns for all the Selected Tables in the Action Parameters
        const { status: availableColumnStatus, data: availableColumnData } = useRetreiveData("ColumnProperties",
            {
                filter: {},
                CreateActionInstanceFormGetColumnNames: true,
                TableNames: tableNames,
                ProviderInstanceId: props?.config?.ActionInstance?.model?.ProviderInstanceId?.value
            }
        )

        const [availableColumns, setAvailableColumns] = React.useState([])

        // This hook is responsible for setting the list of avaialble columns
        React.useEffect(() => {
            if (availableColumnData !== undefined) {
                setAvailableColumns(availableColumnData)
            }
        }, [availableColumnData])

        // Collection of functions that handle value/onChange
        const handleColumn = {
            HANDLE_COLUMN_CHANGE: (event, columnModel, reason) => {
                props.setConfig(oldConfig => {
                    return {
                        ...oldConfig,
                        ActionParameterInstances: {
                            ...oldConfig?.ActionParameterInstances,
                            [props.ParameterName]: {
                                ...oldConfig?.ActionParameterInstances[props.ParameterName],
                                ParameterValue: columnModel.UniqueName,
                                ColumnId: columnModel.Id,
                                TableId: columnModel.TableId,
                                ...(props.allActionParameterDefinition.find(apd => apd.ParameterName === props.ParameterName) || {})
                            }
                        }
                    }
                })
            },
            HANDLE_TEXT_COLUMN_CHANGE: (event) => {
                const value = event.target.value;
                props.setConfig(oldConfig => {
                    return {
                        ...oldConfig,
                        ActionParameterInstances: {
                            ...oldConfig?.ActionParameterInstances,
                            [props.ParameterName]: {
                                ...oldConfig?.ActionParameterInstances[props.ParameterName],
                                ParameterValue: value,
                                ...(props.allActionParameterDefinition.find(apd => apd.ParameterName === props.ParameterName) || {})
                            }
                        }
                    }
                })
            },
            GET_COLUMN_FROM_ID: (columnId) => {
                if (columnId === undefined) {
                    return { UniqueName: "" }
                } else {
                    const columnModel = availableColumns.filter(column => column.Id === columnId)[0]
                    return columnModel
                }
            }
        }

        return (
            previousActions?.length>0? <TextField
                variant="outlined"
                label={props.ParameterName}
                value={props.config?.ActionParameterInstances[props.ParameterName]?.ParameterValue}
                onBlur={handleColumn.HANDLE_TEXT_COLUMN_CHANGE}
                placeholder=""
            /> :<Autocomplete
                options={availableColumns}
                getOptionLabel={columnModel => columnModel.UniqueName}
                groupBy={columnModel => columnModel.TableName}
                value={handleColumn.GET_COLUMN_FROM_ID(props.config?.ActionParameterInstances[props.ParameterName]?.ColumnId) || ""}
                fullWidth
                selectOnFocus
                onChange={handleColumn.HANDLE_COLUMN_CHANGE}
                disableClearable={true}
                renderInput={(params) => {
                    return <TextField
                        {...params}
                        value={props.config?.ActionParameterInstances[props.ParameterName]?.ParameterValue}
                        variant="outlined"
                        label={props.ParameterName}
                        placeholder=""
                    />
                }}
            />
        )
    },
    BOOLEAN: (props) => {
        const onValueChange = (event) => {
            const parameterValue = event.target.value
            props.setConfig(oldConfig => {
                return {
                    ...oldConfig,
                    ActionParameterInstances: {
                        ...oldConfig?.ActionParameterInstances,
                        [props.ParameterName]: {
                            ...oldConfig?.ActionParameterInstances[props.ParameterName],
                            ParameterValue: parameterValue,
                            ...(props.allActionParameterDefinition.find(apd => apd.ParameterName === props.ParameterName) || {})
                        }
                    }
                }
            })
        }

        return (
            <FormControl variant="outlined" style={{ width: "100%" }}>
                <InputLabel>{props.ParameterName}</InputLabel>
                <Select
                    value={props.config?.ActionParameterInstances[props.ParameterName]?.ParameterValue || ""}
                    onChange={onValueChange}
                    variant="outlined"
                    label={props.ParameterName}
                    fullWidth
                    inputProps={{ disabled: props.readOnly }}
                >
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                </Select>
            </FormControl>
        )
    },
    STRING: (props) => {
        const onValueChange = (event) => {
            const parameterValue = event.target.value
            props.setConfig(oldConfig => {
                return {
                    ...oldConfig,
                    ActionParameterInstances: {
                        ...oldConfig?.ActionParameterInstances,
                        [props.ParameterName]: {
                            ...oldConfig?.ActionParameterInstances[props.ParameterName],
                            ParameterValue: parameterValue,
                            ...(props.allActionParameterDefinition.find(apd => apd.ParameterName === props.ParameterName) || {})
                        }
                    }
                }
            })
        }

        return (
            <TextField
                value={props.config?.ActionParameterInstances[props.ParameterName]?.ParameterValue || ""}
                onChange={onValueChange}
                variant="outlined"
                label={props.ParameterName}
                fullWidth
            />
        )
    },
    INT: (props) => {
        const onValueChange = (event) => {
            const parameterValue = event.target.value
            if (parameterValue.match(/^-?\d+$/)) {
                props.setConfig(oldConfig => {
                    return {
                        ...oldConfig,
                        ActionParameterInstances: {
                            ...oldConfig?.ActionParameterInstances,
                            [props.ParameterName]: {
                                ...oldConfig?.ActionParameterInstances[props.ParameterName],
                                ParameterValue: parameterValue,
                                ...(props.allActionParameterDefinition.find(apd => apd.ParameterName === props.ParameterName) || {})
                            }
                        }
                    }
                })
            }
        }

        return (
            <TextField
                value={props.config?.ActionParameterInstances[props.ParameterName]?.ParameterValue || ""}
                onChange={onValueChange}
                variant="outlined"
                label={props.ParameterName}
                fullWidth
            />
        )
    },
    FLOAT: (props) => {
        const onValueChange = (event) => {
            const parameterValue = event.target.value

            function isNumber(str) {
                if (typeof str != "string") return false // we only process strings!
                // could also coerce to string: str = ""+str
                return !isNaN(str) && !isNaN(parseFloat(str))
            }


            if (isNumber(parameterValue)) {
                props.setConfig(oldConfig => {
                    return {
                        ...oldConfig,
                        ActionParameterInstances: {
                            ...oldConfig?.ActionParameterInstances,
                            [props.ParameterName]: {
                                ...oldConfig?.ActionParameterInstances[props.ParameterName],
                                ParameterValue: parameterValue,
                                ...(props.allActionParameterDefinition.find(apd => apd.ParameterName === props.ParameterName) || {})
                            }
                        }
                    }
                })
            }
        }

        return (
            <TextField
                value={props.config?.ActionParameterInstances[props.ParameterName]?.ParameterValue || ""}
                onChange={onValueChange}
                variant="outlined"
                label={props.ParameterName}
                fullWidth
            />
        )
    }
}

const FormControlPlane = (props) => {
    const classes = useStyles()
    // This useMutation is responsoble for creating the entities in the backend
    const fetchActionDefinitionMutation = useMutation(
        "CreateActionInstance",
        (config) => dataManagerInstance.getInstance.saveData(config.entityName, config.actionProperties),
        {
            onMutate: () => {
            }
        }
    )
    const fetchActionExeuctionParsedOutput = useMutation(getActionExecutionParsedOutput)
    const [syncQueryData, setSyncQueryData] = React.useState({})
    const [queryDataDialog, setQueryDataDialog] = React.useState(false)

    // Callback function to handle Action Creation
    const handleCreate = () => {
        const actionInstance = {}
        const actionParameterInstances = []
        for (const [key, value] of Object.entries(props.config?.ActionInstance?.model || {})) {
            actionInstance[key] = value.value
        }
        actionInstance['Id'] = uuidv4()

        for (const actionParameterInstance of Object.values(props.config?.ActionParameterInstances) || []) {
            actionParameterInstance['ActionInstanceId'] = actionInstance?.Id
            actionParameterInstance['Id'] = uuidv4()
            actionParameterInstances.push(actionParameterInstance)
        }
        console.log(actionInstance, actionParameterInstances)
        console.log(props.startTime)
        const scheduledTime = actionInstance.IsRecurring === true ? Date.parse(props?.startTime).toString() : undefined

        fetchActionDefinitionMutation.mutate({
            entityName: "ActionInstance",
            actionProperties: {
                entityProperties: actionInstance,
                ActionParameterInstanceEntityProperties: actionParameterInstances,
                withActionParameterInstance: true,
                executionScheduledDate: scheduledTime === "NaN" ? props.startTime.toString() : scheduledTime
            }
        }, {
            onSettled: () => {
            },
            onSuccess: () => {
            }
        })
    }
    const handleCreateSynchronous = () => {
        console.log(props.config)
        const actionInstance = {}
        const actionParameterInstances = []
        for (const [key, value] of Object.entries(props.config?.ActionInstance?.model || {})) {
            actionInstance[key] = value.value
        }
        actionInstance['Id'] = uuidv4()

        for (const actionParameterInstance of Object.values(props.config?.ActionParameterInstances) || []) {
            actionParameterInstance['ActionInstanceId'] = actionInstance?.Id
            actionParameterInstance['Id'] = uuidv4()
            actionParameterInstances.push(actionParameterInstance)
        }
        console.log(actionInstance, actionParameterInstances)

        fetchActionDefinitionMutation.mutate({
            entityName: "ActionInstance",
            actionProperties: {
                entityProperties: actionInstance,
                ActionParameterInstanceEntityProperties: actionParameterInstances,
                withActionParameterInstance: true,
                SynchronousActionExecution: true
            }
        }, {
            onSettled: () => {
            },
            onSuccess: (data) => {
                fetchActionExeuctionParsedOutput.mutate(data[0], {
                    onSuccess: (parsedOutputData, variables, context) => {
                        setSyncQueryData([parsedOutputData.Output])
                        setQueryDataDialog(true)
                    }
                })
            }
        })
    }


    const handleCancel = () => {
        props.onCloseDialog()
    }

    const handleQueryDataDialogClose = () => {
        setQueryDataDialog(false)
        //props.onCloseDialog()
    }
    if (props.saveCreateActionInstanceFormConfig) {
        return null;
    }
    return (
        <React.Fragment>
            <Grid container item xs={12} direction="row">
                <Grid container item xs={4} direction="row" justify="flex-start">
                    <Button variant="contained" component="label" classes={{ root: "select-all" }} onClick={handleCreate}>
                        Create
                    </Button>
                    <Grid item xs={2} />
                    <Button variant="contained" component="label" classes={{ root: "select-all" }}
                        onClick={handleCreateSynchronous}>
                        Create Synchronous
                    </Button>
                </Grid>
                <Grid item xs={2} />
                <Grid container item xs={4} direction="row" justify="flex-start">
                    <Button variant="contained" component="label" classes={{ root: "delete" }} onClick={handleCancel}>
                        Cancel
                    </Button>
                    {fetchActionDefinitionMutation.isLoading ? (
                        <LoadingIndicator />
                    ) : (<></>)}
                </Grid>
            </Grid>
            <Dialog onClose={handleQueryDataDialogClose} open={queryDataDialog} fullWidth
                classes={{ paper: classes.dialogPaper }} scroll="paper">
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton aria-label="close" onClick={handleQueryDataDialogClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Box mx={2} my={1}>
                        <QueryData props={syncQueryData} />
                    </Box>
                </Grid>
            </Dialog>
        </React.Fragment>
    )
}


export const getConfig = (config, overrides) => {
    const model = config?.ActionInstance?.model;
    const ActionParameterInstances = config?.ActionInstance?.ParameterInstances || config?.ActionParameterInstances ||{};
    const getValue = (key) => model?.[key]?.value || model?.[key];
    const newConfig = {
        ActionInstance: {
            model: {
                Id: {
                    value: getValue('Id') || uuidv4(),
                    isValid: true
                },
                ActionType: {
                    value: getValue('ActionType') || ActionDefinitionActionType.PROFILING,
                    isValid: true
                },
                ProviderInstanceId: {
                    value: getValue('ProviderInstanceId') || undefined,
                    isValid: true
                },
                DefinitionId: {
                    value: getValue('DefinitionId') || undefined,
                    isValid: true
                },
                TemplateId: {
                    value: getValue('TemplateId') || undefined,
                    isValid: true
                },
                Name: {
                    value: getValue('Name') || undefined,
                    isValid: true
                },
                DisplayName: {
                    value: getValue('DisplayName') || undefined,
                    isValid: true
                },
                TableId: {
                    value: getValue('TableId') || undefined,
                    isValid: true
                },
                IsRecurring: {
                    value: false,
                    isValid: true
                },
                RecurrenceIntervalInSecs: {
                    value: undefined,
                    isValid: false
                }
            }
        },
        ActionParameterInstances: ActionParameterInstances //TODO: fill initial state
    };
    if (overrides) {
        overrides.forEach(override => {
            newConfig.ActionInstance.model[override.key] = { value: override.value, isValid: true };
        });
    }
    return newConfig;
}

export default CreateActionInstanceForm
