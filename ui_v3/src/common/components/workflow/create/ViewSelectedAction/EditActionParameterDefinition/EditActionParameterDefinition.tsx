
import { Autocomplete, Box, createFilterOptions, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, useTheme, Icon, Typography } from '@mui/material';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getInputTypeFromAttributesNew, InputMap } from '../../../../../../custom_enums/ActionParameterDefinitionInputMap';
import ActionParameterDefinitionDatatype from '../../../../../../enums/ActionParameterDefinitionDatatype';
import ActionParameterDefinitionTag from '../../../../../../enums/ActionParameterDefinitionTag';
import { ActionParameterDefinition, ActionTemplate, ColumnProperties, Tag } from '../../../../../../generated/entities/Entities';
import labels from '../../../../../../labels/labels';
import { findIfParameterPresent, SetWorkflowContext, UpstreamAction, WorkflowContext } from '../../../../../../pages/applications/workflow/WorkflowContext';
import TagHandler from '../../../../tag-handler/TagHandler';
import { HtmlTooltip } from '../../../../workflow-action/ActionCard';
import getParameterInputField, { BooleanParameterInput, IntParameterInput, ParameterInputProps, StringParameterInput, UpstreamActionParameterInput } from '../../ParameterInput';
import InfoIcon from "../../../../../../../src/images/info.svg"


export interface EditActionParameterDefinitionProps {
    parameter?: ActionParameterDefinition,
    template: ActionTemplate,
    stageId: string,
    actionIndex: number
}

const DefaultValueSelector = (props: {parameter: ActionParameterDefinition, actionIndex: number, stageId: string}) => {
    const {parameter} = props
    const workflowState = React.useContext(WorkflowContext)
    const setWorkflowState = React.useContext(SetWorkflowContext)

    const getCurrentParameterConfig = () => workflowState.stages.find(stage => stage.Id===props.stageId)?.Actions[props.actionIndex]?.Parameters.find(parameter => parameter.ActionParameterDefinitionId===props.parameter.Id)

    const formParameterInputProps = (): ParameterInputProps => {
        if(parameter.Tag === ActionParameterDefinitionTag.DATA) {
            const allUpstreams: UpstreamAction[] = []
            
            for(let i = 0; i<workflowState.stages.length; i+=1){
                if(workflowState.stages[i].Id===props.stageId){
                    workflowState.stages[i].Actions.slice(0, props.actionIndex).forEach((action, index) => allUpstreams.push({
                        stageId: workflowState.stages[i].Id, 
                        stageName: workflowState.stages[i].Name, 
                        actionName: action.DisplayName, 
                        actionId: action.Id, 
                        actionIndex: index
                    }))
                    break;
                }
                workflowState.stages[i].Actions.forEach((action, index) => allUpstreams.push({
                    stageId: workflowState.stages[i].Id, 
                    stageName: workflowState.stages[i].Name, 
                    actionName: action.DisplayName, 
                    actionId: action.Id, 
                    actionIndex: index
                }))
            }
            
            const getCurrentValue = () => {
                const parameterConfig = getCurrentParameterConfig()
                return allUpstreams.find((upstream, index) => parameterConfig?.SourceExecutionId?.actionId===upstream.actionId && parameterConfig?.SourceExecutionId?.actionIndex===upstream.actionIndex)
            }
    
            return {
                parameterType: "UPSTREAM_ACTION",
                inputProps: {
                    upstreamActions: allUpstreams,
                    selectedAction: getCurrentValue(),
                    onChange: (newUpstreamAction: UpstreamAction | undefined) => setWorkflowState({
                        type: "ASSIGN_DEFAULT_VALUE",
                        payload: {
                            stageId: props.stageId,
                            actionDefinitionId: props.parameter.ActionDefinitionId!,
                            actionIndex: props.actionIndex,
                            actionParameterDefinitionId: props.parameter.Id!,
                            sourceExecutionId: newUpstreamAction,
                            parameterValue: undefined
                        }
                    }),
                    onClear: () => setWorkflowState({
                        type: "CLEAR_DEFAULT_VALUE",
                        payload: {
                            stageId: props.stageId,
                            actionDefinitionId: props.parameter.ActionDefinitionId!,
                            actionIndex: props.actionIndex,
                            actionParameterDefinitionId: props.parameter.Id!,
                        }
                    })
                }
            } as UpstreamActionParameterInput
        } else if(parameter.Tag === ActionParameterDefinitionTag.OPTION_SET_SINGLE) {
            const parameterConfig = getCurrentParameterConfig()
            return {
                parameterType: "OPTION_SET_SINGLE",
                inputProps: {
                    parameterName: props.parameter.DisplayName || props.parameter.ParameterName || "parameter name NA",
                    availableOptions: props.parameter.OptionSetValues?.split(',')?.map(option => ({name: option})) || [],
                    selectedOptions: {name: parameterConfig?.ParameterValue || ""},
                    onChange: (newOption?: {name: string}) => {
                        setWorkflowState({
                            type: "ASSIGN_DEFAULT_VALUE",
                            payload: {
                                stageId: props.stageId,
                                actionDefinitionId: props.parameter.ActionDefinitionId!,
                                actionIndex: props.actionIndex,
                                actionParameterDefinitionId: props.parameter.Id!,
                                parameterValue: newOption?.name
                            }
                        })
                    }
                }
            }
        } else if(parameter.Tag === ActionParameterDefinitionTag.OPTION_SET_MULTIPLE) {
            const parameterConfig = getCurrentParameterConfig()
            return {
                parameterType: "OPTION_SET_MULTIPLE",
                inputProps: {
                    parameterName: props.parameter.DisplayName || props.parameter.ParameterName || "parameter Name NA",
                    availableOptions: props.parameter.OptionSetValues?.split(',')?.map(option => ({name: option})) || [],
                    selectedOptions: parameterConfig?.ParameterValue?.split(',')?.map(selected => ({name: selected})),
                    onChange: (newOptions?: {name: string}[]) => {
                        const newValue = newOptions?.map(option => option.name)?.join(',')
                        setWorkflowState({
                            type: 'ASSIGN_DEFAULT_VALUE',
                            payload: {
                                stageId: props.stageId,
                                actionDefinitionId: props.parameter.ActionDefinitionId!,
                                actionIndex: props.actionIndex,
                                actionParameterDefinitionId: props.parameter.Id!,
                                parameterValue: newValue
                            }
                        })
                    }
                }
            }
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.STRING || parameter.Datatype === ActionParameterDefinitionDatatype.STRING_NO_QUOTES) {
            const parameterConfig = getCurrentParameterConfig()
            return {
                parameterType: "STRING",
                inputProps: {
                    parameterName: props.parameter.DisplayName || props.parameter.ParameterName,
                    value: parameterConfig?.ParameterValue,
                    onChange: (newValue: string) => setWorkflowState({
                        type: "ASSIGN_DEFAULT_VALUE",
                        payload: {
                            stageId: props.stageId,
                            actionDefinitionId: props.parameter.ActionDefinitionId!,
                            actionIndex: props.actionIndex,
                            actionParameterDefinitionId: props.parameter.Id!,
                            parameterValue: newValue
                        }
                    })
                }
            } as StringParameterInput
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.INT) {
            const parameterConfig = getCurrentParameterConfig()
            return {
                parameterType: "INT",
                inputProps: {
                    parameterName: props.parameter.DisplayName || props.parameter.ParameterName,
                    value: parameterConfig?.ParameterValue,
                    onChange: (newValue: string) => setWorkflowState({
                        type: "ASSIGN_DEFAULT_VALUE",
                        payload: {
                            stageId: props.stageId,
                            actionDefinitionId: props.parameter.ActionDefinitionId!,
                            actionIndex: props.actionIndex,
                            actionParameterDefinitionId: props.parameter.Id!,
                            parameterValue: newValue
                        }
                    })
                }
            } as IntParameterInput
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.BOOLEAN) {
            const parameterConfig = getCurrentParameterConfig()
            return {
                parameterType: "BOOLEAN",
                inputProps: {
                    parameterName: props.parameter.DisplayName || props.parameter.ParameterName,
                    value: parameterConfig?.ParameterValue,
                    onChange: (newValue: string) => setWorkflowState({
                        type: "ASSIGN_DEFAULT_VALUE",
                        payload: {
                            stageId: props.stageId,
                            actionDefinitionId: props.parameter.ActionDefinitionId!,
                            actionIndex: props.actionIndex,
                            actionParameterDefinitionId: props.parameter.Id!,
                            parameterValue: newValue
                        }
                    })
                }
            } as BooleanParameterInput
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST) {
            const parameterConfig = getCurrentParameterConfig()
            return {
                parameterType: "COLUMN_LIST",
                inputProps: {
                    parameterName: props.parameter.DisplayName || props.parameter.ParameterName || "NAME NA",
                    selectedColumnFilters: parameterConfig?.ParameterValue?.split(',').map(name => ({UniqueName: name})) || [],
                    filters: {
                        tableFilters: [{Id: parameterConfig?.TableId}],
                        parameterDefinitionId: props.parameter.Id!
                    },
                    onChange: (newValue: ColumnProperties[] | undefined) => {
                        const names = newValue?.map(column => column.UniqueName) || []
                        const value = names.join(',')
                        setWorkflowState({
                            type: 'ASSIGN_DEFAULT_VALUE',
                            payload: {
                                stageId: props.stageId,
                                actionDefinitionId: props.parameter.ActionDefinitionId!,
                                actionIndex: props.actionIndex,
                                actionParameterDefinitionId: props.parameter.Id!,
                                parameterValue: value
                            }
                        })

                    }
                }
            }
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.FLOAT) {
            const parameterConfig = getCurrentParameterConfig()
            return {
                parameterType: "FLOAT",
                inputProps: {
                    parameterName: props.parameter.DisplayName || props.parameter.ParameterName!,
                    value: parameterConfig?.ParameterValue,
                    onChange: (newValue: string) => setWorkflowState({
                        type: "ASSIGN_DEFAULT_VALUE",
                        payload: {
                            stageId: props.stageId,
                            actionDefinitionId: props.parameter.ActionDefinitionId!,
                            actionIndex: props.actionIndex,
                            actionParameterDefinitionId: props.parameter.Id!,
                            parameterValue: newValue
                        }
                    })
                }
            }
        } else {
            return {parameterType: undefined}
        }
    }
    return getParameterInputField(formParameterInputProps())
}

const GlobalParameterHandler = (props: {parameter: ActionParameterDefinition, actionIndex: number, stageId: string}) => {
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)

    const currentParameterInContext = workflowContext.stages.filter(stage => stage.Id === props.stageId)[0].Actions.filter((action, index) => index === props.actionIndex)[0].Parameters.filter(parameter => parameter.ActionParameterDefinitionId === props.parameter.Id)[0]
    const currentGlobalParameterIfPresent = workflowContext.WorkflowParameters.filter(wfParameter => wfParameter.Id === currentParameterInContext?.GlobalParameterId )
    const currentGlobalParameter = currentGlobalParameterIfPresent.length > 0 ? currentGlobalParameterIfPresent[0] : {}

    const availableParameters = workflowContext.WorkflowParameters.filter(wfParameter => wfParameter.Tag === props.parameter.Tag && wfParameter.Datatype === props.parameter.Datatype)
    const filter = createFilterOptions<ActionParameterDefinition>()

    const addAndMapGlobalParameter = (parameter: ActionParameterDefinition) => {
        const paramterName = parameter.ParameterName?.substring(25)
        const id = uuidv4()
        const newGlobalParamter: ActionParameterDefinition = {
            ...parameter,
            Id: id,
            ParameterName: paramterName,
            Datatype: props.parameter.Datatype,
            Tag: props.parameter.Tag,
            OptionSetValues: props.parameter.OptionSetValues
        }
        setWorkflowContext({type: 'ADD_WORKFLOW_PARAMETER', payload: {parameter: newGlobalParamter}})
        mapToGlobalParameter(id)
    }

    const mapToGlobalParameter = (workflowParameterId: string) => {
        setWorkflowContext({type: 'MAP_PARAMETER_TO_GLOBAL_PARAMETER', 
                            payload: {stageId: props.stageId, globalParameterId: workflowParameterId, parameterDefinitionId: props.parameter.Id || "ID", actionIndex: props.actionIndex, parameterName: props.parameter.DisplayName || props.parameter.ParameterName || "parameterName"}})
    }

    return (
        <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
            <Autocomplete
                options={availableParameters}
                value={currentGlobalParameter}
                getOptionLabel={parameter => parameter.ParameterName || ""}
                
                filterSelectedOptions
                fullWidth
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderInput={(params) => <TextField label="Select Global Parameter" {...params}/>}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    if(params.inputValue !== '') {
                        filtered.push({ParameterName: `Create Global Parameter: ${params.inputValue}`});
                    }
                    return filtered
                }}
                onChange={(event, value, reason, details) => {
                    if(!!value) {
                        if(value?.ParameterName?.includes('Create Global Parameter:')) {
                            addAndMapGlobalParameter(value)
                        } else {
                            mapToGlobalParameter(value.Id || "ID")
                        }
                    }
                }}
            />
            <HtmlTooltip sx={{display: 'flex', alignItems: 'center'}} title={
                <React.Fragment>
                    <Box p={1} sx={{display: 'flex', flexDirection: 'column', gap: 1, width: '300px'}}>
                        <Typography sx={{
                            fontStyle: "normal",
                            fontWeight: 700,
                            fontSize: "16px",
                            lineHeight: "175%",
                            letterSpacing: "0.15px",
                            color: "#253858"
                        }}>
                            Global Parameters
                        </Typography>
                        <Typography sx={{
                            fontFamily: "'SF Pro Text'",
                            fontStyle: "normal",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "143%",
                            letterSpacing: "0.15px",
                            color: "rgba(66, 82, 110, 0.86)"
                        }}>
                            Parameter Display name
When the ‘user input’ is selected as ‘Yes’, then the user needs to specify a display name (or label), the value of which shall be assigned by the user during flow execution.
Parameter name has to be defined by the userExample of  parameter name: ‘ProductDataTable’Best practice: Do not use special characters like “”, %,*,$,^,(), to define parameter name 
                        </Typography>
                    </Box>
                </React.Fragment>
            }>
                <Icon sx={{display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                    <img src={InfoIcon} />
                </Icon>
            </HtmlTooltip>
        </Box>
    )
}

const EditActionParameterDefinition = (props: EditActionParameterDefinitionProps) => {
    const theme = useTheme();
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const workflowContext = React.useContext(WorkflowContext)
    const currentParameter = findIfParameterPresent(workflowContext, props.stageId, props.actionIndex, props.parameter?.Id || "id")
    const userInputRequired = currentParameter?.userInputRequired || "No"
    const handleParameterNameChange = () => {}
    const handleParameterTypeChange = () => {}
    const handleUserInputRequiredChange = (e: SelectChangeEvent<string>) => {
        setWorkflowContext({type: 'CHANGE_USER_INPUT_REQUIRED', payload: {
            stageId: props.stageId,
            parameterDefinitionId: props.parameter?.Id || "NA",
            actionIndex: props.actionIndex,
            actionDefinitionId: props.template.DefinitionId || "NA",
            userInput: e.target.value === "Yes" ? "Yes" : "No"
        }})    
    }

    if(!!props.parameter) {
        return(
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={2}>
                    <Box sx={{width: '100%', display: 'flex', gap: 1, alignItems: 'center'}}>
                        <FormControl sx={{width: '100%'}}>
                            <InputLabel htmlFor="component-outlined">User Input Required</InputLabel>
                            <Select
                                variant="outlined"
                                value={userInputRequired}
                                fullWidth
                                onChange={handleUserInputRequiredChange}
                                label="User Input Required"
                                disabled={props.parameter.Datatype === ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST}
                            >
                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                <MenuItem value={"No"}>No</MenuItem>
                            </Select>
                        </FormControl>
                        <HtmlTooltip sx={{display: 'flex', alignItems: 'center'}} title={
                            <React.Fragment>
                                <Box p={1} sx={{display: 'flex', flexDirection: 'column', gap: 1, width: '300px'}}>
                                    <Typography sx={{
                                        fontStyle: "normal",
                                        fontWeight: 700,
                                        fontSize: "16px",
                                        lineHeight: "175%",
                                        letterSpacing: "0.15px",
                                        color: "#253858"
                                    }}>
                                        User Input Required
                                    </Typography>
                                    <Typography sx={{
                                        fontFamily: "'SF Pro Text'",
                                        fontStyle: "normal",
                                        fontWeight: 400,
                                        fontSize: "14px",
                                        lineHeight: "143%",
                                        letterSpacing: "0.15px",
                                        color: "rgba(66, 82, 110, 0.86)"
                                    }}>
                                        User input for the parameter can be yes or no. If ‘Yes’ is selected, then the user needs to create a display name (label) for the input that the user will enter when running the flow. If ‘No’ is selected, then the user can choose any of the upstream actions which returns a ‘table’ as output or give a default value.
                                    </Typography>
                                </Box>
                            </React.Fragment>
                        }>
                            <Icon sx={{display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                                <img src={InfoIcon} />
                            </Icon>
                        </HtmlTooltip>
                    </Box>
                </Grid>
                <Grid item xs={12} md={8} lg={6}>
                    <FormControl sx={{width: "100%"}}>
                        <InputLabel htmlFor="component-outlined">Type Parameter Name</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            value={props.parameter.DisplayName || props.parameter.ParameterName}
                            onChange={handleParameterNameChange}
                            disabled
                            label="Type Parameter Name"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <FormControl sx={{width: "100%"}}>
                        <InputLabel htmlFor="component-outlined">Type</InputLabel>
                        <Select
                            variant="outlined"
                            value={getInputTypeFromAttributesNew(props.template.Language, props.parameter.Tag, props.parameter.Type, props.parameter.Datatype)}
                            fullWidth
                            onChange={handleParameterTypeChange}
                            label="Type"
                            disabled
                        >
                            {Object.keys(InputMap[props.template.Language!]).map((inputType) => {
                                return <MenuItem value={inputType}>{inputType}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                {userInputRequired === "No" ? (
                    <Grid item xs={12} md={4} lg={4}>
                        <DefaultValueSelector parameter={props.parameter} actionIndex={props.actionIndex} stageId={props.stageId}/>
                    </Grid>
                ) : (
                    <Grid item xs={12} md={4} lg={4}>
                        <GlobalParameterHandler parameter={props.parameter} actionIndex={props.actionIndex} stageId={props.stageId}/>
                    </Grid>
                )}
                
                <Grid item xs={12} md={8} lg={8}>
                    <TagHandler
                        entityType='ActionParameterDefinition'
                        entityId={props.parameter.Id!}
                        tagFilter={getTagFilterForParameter(props.parameter)}
                        allowAdd={true}
                        allowDelete={true}
                        inputFieldLocation="TOP"
                    />
                </Grid>
            </Grid>
        )
    } else {
        return <></>
    }
}


const getTagFilterForParameter: (parameter?: ActionParameterDefinition) => Tag = (parameter?: ActionParameterDefinition) => {
    if(parameter?.Tag===ActionParameterDefinitionTag.TABLE_NAME || parameter?.Tag===ActionParameterDefinitionTag.DATA) {
        return { Scope: labels.entities.TableProperties}
    }
    if(parameter?.Tag===ActionParameterDefinitionTag.COLUMN_NAME) {
        return { Scope: labels.entities.ColumnProperties}
    }
    if(parameter?.Datatype===ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST) {
        return { Scope: labels.entities.ColumnProperties}
    }
    else {
        return {}
    }
}
  


export default EditActionParameterDefinition;