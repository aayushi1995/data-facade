
import React from 'react'
import { Autocomplete, Box, Card, Chip, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SvgIcon, TextField, Typography, useTheme} from '@material-ui/core';
import {Tabs, Tab} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import PencilAltIcon from "../../../../../../icons/PencilAlt"
import DeleteIcon from "@material-ui/icons/Delete"
import { ActionDefinition, ActionParameterDefinition, ActionTemplate, Tag } from '../../../../../../generated/entities/Entities';
import { DataGrid, GridToolbarContainer } from '@material-ui/data-grid';
import { CustomToolbar } from '../../../../CustomToolbar';
import { getInputTypeFromAttributesNew, InputMap } from '../../../../../../custom_enums/ActionParameterDefinitionInputMap';
import { TemplateWithParams } from '../hooks/UseViewAction';
import TagHandler from '../../../../tag-handler/TagHandler';
import { SetWorkflowContext, UpstreamAction, WorkflowContext } from '../../../../../../pages/applications/workflow/WorkflowContext';
import { ParameterName } from 'storybook-addon-designs/esm/addon';
import ActionParameterDefinitionTag from '../../../../../../enums/ActionParameterDefinitionTag';
import ParameterInput, { BooleanParameterInput, IntParameterInput, ParameterInputProps, StringParameterInput, UpstreamActionParameterInput } from '../../ParameterInput';
import ActionParameterDefinitionType from '../../../../../../enums/ActionParameterDefinitionType';
import ActionParameterDefinitionDatatype from '../../../../../../enums/ActionParameterDefinitionDatatype';


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
                // console.log(parameterConfig)
                return allUpstreams.find((upstream, index) => parameterConfig?.SourceExecutionId?.actionId===upstream.actionId && parameterConfig?.SourceExecutionId?.actionIndex===index)
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
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.STRING) {
            const parameterConfig = getCurrentParameterConfig()
            return {
                parameterType: "STRING",
                inputProps: {
                    parameterName: props.parameter.ParameterName,
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
                    parameterName: props.parameter.ParameterName,
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
                    parameterName: props.parameter.ParameterName,
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
        } else {
            return {parameterType: undefined}
        }
    }
     
    return <ParameterInput {...formParameterInputProps()}/>
}

const EditActionParameterDefinition = (props: EditActionParameterDefinitionProps) => {
    const theme = useTheme();
    
    const handleParameterNameChange = () => {}
    const handleParameterTypeChange = () => {}
    const handleUserInputRequiredChange = () => {}
    

    if(!!props.parameter) {
        return(
            <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={6}>
                    <FormControl sx={{width: "100%"}}>
                        <InputLabel htmlFor="component-outlined">Type Parameter Name</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            value={props.parameter.ParameterName}
                            onChange={handleParameterNameChange}
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
                <Grid item xs={12} md={4} lg={2}>
                    <FormControl sx={{width: "100%"}}>
                        <InputLabel htmlFor="component-outlined">User Input Required</InputLabel>
                        <Select
                            variant="outlined"
                            value={"No"}
                            fullWidth
                            onChange={handleUserInputRequiredChange}
                            label="User Input Required"
                            disabled
                        >
                            <MenuItem value={"Yes"}>Yes</MenuItem>
                            <MenuItem value={"No"}>No</MenuItem>
                        </Select>
                    </FormControl>    
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <DefaultValueSelector parameter={props.parameter} actionIndex={props.actionIndex} stageId={props.stageId}/>
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <TagHandler
                        entityType='ActionParameterDefinition'
                        entityId={props.parameter.Id!}
                        tagFilter={{}}
                        allowAdd={true}
                        allowDelete={true}
                    />
                </Grid>
            </Grid>
        )
    } else {
        return <></>
    }
}



  


export default EditActionParameterDefinition;