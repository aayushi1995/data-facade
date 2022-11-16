import { Autocomplete, Box, createFilterOptions, FormControl, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { DataGrid, DataGridProps, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import React from 'react';
import { useContext } from 'react';
import { getInputTypeFromAttributesNew } from '../../../../../custom_enums/ActionParameterDefinitionInputMap';
import ActionParameterDefinitionDatatype from '../../../../../enums/ActionParameterDefinitionDatatype';
import TemplateLanguage from '../../../../../enums/TemplateLanguage';
import { ActionParameterDefinition, Tag } from '../../../../../generated/entities/Entities';
import { findIfParameterPresent, SetWorkflowContext, WorkflowContext } from '../../../../../pages/applications/workflow/WorkflowContext';
import { TagEditorView, textStyle } from '../../../../../pages/build_action/components/common-components/ViewActionParameters';
import useFetchTags from '../../../tag-handler/hooks/useFetchTags';
import { DefaultValueSelector, useGlobalParameterHandler, UseGlobalParameterHandlerParams } from './EditActionParameterDefinition/EditActionParameterDefinition';
import { TemplateWithParams } from './hooks/UseViewAction';


const filter = createFilterOptions<ActionParameterDefinition>()

export interface ActionParameterDefinitionEditListProps {
    templateWithParams?: TemplateWithParams,    
    stageId: string,
    actionIndex: number
}

type ActionParameterDefinitionEditListDatagridRow = {
    id?: string,
    parameter: ActionParameterDefinition
}

const ActionParameterDefinitionEditList = (props: ActionParameterDefinitionEditListProps) => {
    const { templateWithParams, stageId, actionIndex } = props
    const setWorkflowContext = useContext(SetWorkflowContext)
    const workflowContext = useContext(WorkflowContext)

    const datagridRows: ActionParameterDefinitionEditListDatagridRow[] =(templateWithParams?.actionParameterDefinitions || []).map(param => {
        return {
            id: param?.model?.Id,
            parameter: param?.model
        } as ActionParameterDefinitionEditListDatagridRow
    })
    
    const datagridProps: DataGridProps = {
        columns: [
            {
                field: "ParameterName",
                flex: 5,
                headerName: "Parameter Name",
                valueGetter: (params: GridValueGetterParams<ActionParameterDefinitionEditListDatagridRow>) => params?.row?.parameter?.ParameterName
            },
            {
                field: "Default Value",
                flex: 5,
                headerName: "Default Value",
                renderCell: (params: GridRenderCellParams<ActionParameterDefinitionEditListDatagridRow>) => {
                    const currentParameter = findIfParameterPresent(workflowContext, props.stageId, props.actionIndex, params?.row?.parameter?.Id || "id")
                    const userInputRequiredValue = currentParameter?.userInputRequired || "No"

                    return (
                        
                            <DefaultValueSelector
                                parameter={params?.row?.parameter} 
                                actionIndex={actionIndex} 
                                stageId={stageId}
                            />
                    )
                }
            },
            {
                field: "Global Parameter",
                flex: 5,
                headerName: "Global Parameter",
                renderCell: (params: GridRenderCellParams<ActionParameterDefinitionEditListDatagridRow>) => {
                    const currentParameter = findIfParameterPresent(workflowContext, props.stageId, props.actionIndex, params?.row?.parameter?.Id || "id")
                    const userInputRequiredValue = currentParameter?.userInputRequired || "No"

                    return (
                        userInputRequiredValue === "No" ? (
                            <Typography color="text.disabled">Disabled</Typography>
                            
                        ) : (
                            <GlobalParameterHandler
                                parameter={params?.row?.parameter} 
                                actionIndex={actionIndex} 
                                stageId={stageId}
                            />
                        )
                    )
                }
            },
            {
                field: "ParameterInputType",
                flex: 3,
                headerName: "Input Type",
                valueGetter: (params: GridValueGetterParams<ActionParameterDefinitionEditListDatagridRow>) => getInputTypeFromAttributesNew(templateWithParams?.model?.Language || TemplateLanguage.SQL, params?.row?.parameter?.Tag, params?.row?.parameter?.Type, params?.row?.parameter?.Datatype)
            },
            {
                field: "UserInputRequired",
                flex: 2,
                headerName: "User Input Required",
                renderCell: (params: GridRenderCellParams<ActionParameterDefinitionEditListDatagridRow>) => {
                    const currentParameter = findIfParameterPresent(workflowContext, props.stageId, props.actionIndex, params?.row?.parameter?.Id || "id")
                    const userInputRequiredValue = currentParameter?.userInputRequired || "No"

                    const handleUserInputRequiredChange = (newValue?: string) => {
                        setWorkflowContext({type: 'CHANGE_USER_INPUT_REQUIRED', payload: {
                            stageId: props.stageId,
                            parameterDefinitionId: params?.row?.parameter?.Id || "NA",
                            actionIndex: props.actionIndex,
                            actionDefinitionId: templateWithParams?.model?.DefinitionId || "NA",
                            userInput: newValue === "Yes" ? "Yes" : "No"
                        }})    
                    }
                    return (
                        <FormControl sx={{width: '100%'}}>
                            <Select
                                variant="standard"
                                value={userInputRequiredValue}
                                fullWidth
                                onChange={(event?: SelectChangeEvent<string>) => handleUserInputRequiredChange?.(event?.target?.value)}
                                disabled={params?.row?.parameter?.Datatype === ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST}
                                placeholder="Not Configured"
                                disableUnderline={true}
                                sx={{
                                    ...textStyle
                                }}
                            >
                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                <MenuItem value={"No"}>No</MenuItem>
                            </Select>
                        </FormControl>
                    )
                }
            },
            {
                field: "Tags",
                flex: 5,
                headerName: "Tags",
                renderCell: (params: GridRenderCellParams<ActionParameterDefinitionEditListDatagridRow>) => <DatagridTagHandler
                    entityType="ActionParameterDefinition"
                    entityId={params?.row?.parameter?.Id}
                    tagFilter={{}}
                />   
            }
        ],
        rows: datagridRows,
        autoPageSize: true,
        rowsPerPageOptions: [5, 10, 15],
        initialState: {
            pagination: {
                pageSize: 10
            }
        },
        disableSelectionOnClick: true
    }

    return(
        <Box sx={{ height: "300px", width: "100%" }}>
            <DataGrid sx={{
                "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},
                backgroundColor: 'ActionCardBgColor.main',
                backgroundBlendMode: "soft-light, normal",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
            }}{...datagridProps}/> 
        </Box>
    )
}

const GlobalParameterHandler = (props: UseGlobalParameterHandlerParams) => {
    const {availableParameters, currentGlobalParameter, addAndMapGlobalParameter, mapToGlobalParameter} = useGlobalParameterHandler(props)
    if(!!!availableParameters.includes({ParameterName:props.parameter.ParameterName}) && !currentGlobalParameter.ParameterName){
        addAndMapGlobalParameter(props.parameter)
    }
    return (
        <Box sx={{display: 'flex', gap: 1, alignItems: 'center', width: "100%" }}>
            <Autocomplete
                options={availableParameters}
                value={currentGlobalParameter}
                getOptionLabel={parameter => parameter.ParameterName || ""}
                filterSelectedOptions
                fullWidth
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderInput={(params) => <TextField variant="standard" 
                                        {...params} 
                                        placeholder="Not Configured"
                                        InputProps={{
                                            disableUnderline: true,
                                            ...params.InputProps,
                                            sx: {
                                                ...textStyle
                                            }
                                        }}
                                    />}   
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    if(!availableParameters.includes(props.parameter) && !currentGlobalParameter.ParameterName && params.inputValue === ''){
                        filtered.push({ParameterName: `Create Global Parameter: ${props.parameter.ParameterName}`});
                    }
                    if(params.inputValue !== '') {
                        filtered.push({ParameterName: `Create Global Parameter: ${params.inputValue}`});
                    }
                    return filtered
                }}
                onChange={(event, value, reason, details) => {
                    if(!!value) {
                        if(value?.ParameterName?.includes('Create Global Parameter:')) {
                           const newVal =  {
                                    ...value,
                                    ParameterName: value?.ParameterName?.substring(25)
                                     }
                            
                            addAndMapGlobalParameter(newVal)
                        } else {
                            mapToGlobalParameter(value.Id || "ID")
                        }
                    }
                }}
            />
        </Box>
    )
}

type DatagridTagHandlerProps = {
    entityType: string,
    entityId: string,
    tagFilter: Tag
}

const DatagridTagHandler = (props: DatagridTagHandlerProps) => {
    const { entityType, entityId, tagFilter } = props
    const [tagsSelectedForEntity, tagsNotSelectedButAvaialbleForEntity, isLoading, isMutating, error, addTag, createAndAddTag, deleteTag] = useFetchTags({
        entityType: props.entityType,
        entityId: props.entityId,
        tagFilter: props.tagFilter
    })

    return <TagEditorView
                availableTagNames={tagsNotSelectedButAvaialbleForEntity}
                selectedTagNames={tagsSelectedForEntity}
                addTag={addTag}
                createAndAddTag={createAndAddTag}
                deleteTag={deleteTag}
            />
}

export default ActionParameterDefinitionEditList;
