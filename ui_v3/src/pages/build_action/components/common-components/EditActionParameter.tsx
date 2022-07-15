import { Autocomplete, Box, Checkbox, createFilterOptions, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material";
import React from "react";
import VirtualTagHandler from "../../../../common/components/tag-handler/VirtualTagHandler";
import getParameterInputField, { BooleanParameterInput, FloatParameterInput, IntParameterInput, ParameterInputProps, StringParameterInput, TableParameterInput } from "../../../../common/components/workflow/create/ParameterInput";
import { getAttributesFromInputType, getInputTypeFromAttributesNew, InputMap } from "../../../../custom_enums/ActionParameterDefinitionInputMap";
import ActionParameterDefinitionDatatype from "../../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../../enums/ActionParameterDefinitionTag";
import { ActionParameterDefinition, ActionParameterInstance, ActionTemplate, TableProperties, Tag } from "../../../../generated/entities/Entities";
import { safelyParseJSON } from "../../../execute_action/util";

export type EditActionParameterProps = {
    template: ActionTemplate,
    paramWithTag?: {parameter: ActionParameterDefinition, tags: Tag[]},
    allParamsWithTags?: {parameter: ActionParameterDefinition, tags: Tag[]}[] | undefined,
    onTagsChange: (newTags: Tag[]) => void,
    onParameterEdit: (newParameter: ActionParameterDefinition) => void,
    onParameterTypeEdit: (newParameter: ActionParameterDefinition) => void
}

const EditActionParameter = (props: EditActionParameterProps) => {
    const {onParameterEdit, onTagsChange, onParameterTypeEdit, template, paramWithTag, allParamsWithTags} = props
    const [paramName, setParamName] = React.useState<string|undefined>()
    const [paramDisplayName, setParamDisplayName] = React.useState<string|undefined>()
    const [parameterDescription, setParameterDescription] = React.useState<string|undefined>()
    React.useEffect(() => {
        setParamName(paramWithTag?.parameter?.ParameterName)
    }, [paramWithTag?.parameter?.ParameterName])
    React.useEffect(() => {
        setParameterDescription(paramWithTag?.parameter?.Description)
    }, [paramWithTag?.parameter?.Description])
    React.useEffect(() => {
        setParamDisplayName(paramWithTag?.parameter?.DisplayName)
    }, [paramWithTag?.parameter?.DisplayName])

    const handleParameterNameChange = () => {
        onParameterEdit({
            ...paramWithTag?.parameter,
            ParameterName: paramName
        })
    }
    const handleParameterDisplayNameChange = () => {
        onParameterEdit({
            ...paramWithTag?.parameter,
            DisplayName: paramDisplayName
        })
    }
    const handleParameterDescriptionChange = () => {
        onParameterEdit({
            ...paramWithTag?.parameter,
            Description: parameterDescription
        })
    }
    const handleParameterTypeChange = (event: SelectChangeEvent<string>) => {
        const newInputType = event.target.value
        onParameterTypeEdit({
            ...paramWithTag?.parameter,
            ...getAttributesFromInputType(newInputType, template.Language)
        })
    }
    const handleUserInputRequiredChange = () => {}

    const onDefaultValueChange = (newParameterConfig: ActionParameterDefinition) => {
        onParameterEdit(newParameterConfig)
    }

    const isColumnParam = paramWithTag?.parameter?.Tag===ActionParameterDefinitionTag.COLUMN_NAME

    const onParentTableTagChange = (parentParameterDefinition: ActionParameterDefinition) => {
        const parameterConfig = safelyParseJSON(paramWithTag?.parameter?.Config) as ActionParameterDefinitionConfig
        const newParameterConfig: ActionParameterDefinitionConfig = {
            ...parameterConfig,
            ParentRelationshipName: "TableColumn",
            ParentParameterDefinitionId: parentParameterDefinition?.Id,
            ParentRelationshipConfig: {}
        }
        
        onParameterEdit({
            ...paramWithTag?.parameter,
            Config: JSON.stringify(newParameterConfig)
        })
    }

    if(!!paramWithTag) {
        const {parameter, tags} = paramWithTag
        const allParameters = allParamsWithTags?.map(param => param.parameter)
        const attributeValue = getInputTypeFromAttributesNew(template.Language, parameter.Tag, parameter.Type, parameter.Datatype)
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} md={4} lg={2}>
                    <FormControl sx={{width: "100%"}}>
                        <InputLabel htmlFor="component-outlined">Type Parameter Name</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            value={paramName}
                            onChange={(event) => setParamName(event.target.value)}
                            onBlur={() => handleParameterNameChange()}
                            label="Type Parameter Name"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <FormControl sx={{width: "100%"}}>
                        <InputLabel htmlFor="component-outlined">Parameter Display Name(Optional)</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            value={paramDisplayName}
                            onChange={(event) => setParamDisplayName(event.target.value)}
                            onBlur={() => handleParameterDisplayNameChange()}
                            label="Parameter Display Name(Optional)"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <FormControl sx={{width: "100%"}}>
                        <InputLabel htmlFor="component-outlined">Type</InputLabel>
                        <Select
                            variant="outlined"
                            value={getInputTypeFromAttributesNew(template.Language, parameter.Tag, parameter.Type, parameter.Datatype)}
                            fullWidth
                            onChange={handleParameterTypeChange}
                            label="Type"
                        >
                            {Object.keys(InputMap[props.template.Language!]).map((inputType) => {
                                return <MenuItem value={inputType}>{inputType}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} lg={6} sm={12} md={6}>
                    <FormControl sx={{width: "100%"}}>
                        <InputLabel htmlFor="component-outlined">Parameter Description</InputLabel>
                        <OutlinedInput
                            sx={{minHeight: '100px', display: 'flex', alignItems: 'flex-start'}}
                            multiline
                            value={parameterDescription}
                            onChange={(event) => setParameterDescription(event.target.value)}
                            onBlur={() => handleParameterDescriptionChange()}
                            label="Parameter Description"
                            
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4} lg={2} sx={{width: '100%'}}>
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
                    <DefaultValueSelector parameter={{...parameter }} allParameters={allParameters} onDefaultValueChange={onDefaultValueChange}/>
                </Grid>
                <Grid item xs={12} md={8} lg={6}>
                    <VirtualTagHandler
                        selectedTags={tags}
                        tagFilter={{}}
                        allowAdd={true}
                        allowDelete={true}
                        onSelectedTagsChange={(newTags: Tag[]) => {onTagsChange(newTags)}}
                        inputFieldLocation="LEFT"
                    />
                </Grid>
                <Grid xs={12} md={8} lg={4}>
                    {
                        isColumnParam && 
                            <ConfigureParentTag allParamDefs={allParameters} currentParamDef={parameter} onParameterEdit={onParameterEdit}/>
                    }
                </Grid>
                {attributeValue === "String" || attributeValue === "Integer" || attributeValue === "Decimal" ? (
                    <Grid item xs={12} mt={2}>
                        <OptionSetSelector parameter={parameter} onParameterEdit={onParameterEdit}/>
                    </Grid>
                ) : (
                    <></>
                )}
            </Grid>
        )
    } else {
        return <></>
    }
}

export const DefaultValueSelector = (props: {parameter: ActionParameterDefinition, allParameters: ActionParameterDefinition[]|undefined, onDefaultValueChange: (newParam: ActionParameterDefinition) => void }) => {
    const {parameter, allParameters, onDefaultValueChange} = props
    const defaultParameterInstance = safelyParseJSON(parameter.DefaultParameterValue) as ActionParameterInstance
    const formParameterInputProps: () => ParameterInputProps = () => {
        if(parameter.Tag === ActionParameterDefinitionTag.DATA || parameter.Tag === ActionParameterDefinitionTag.TABLE_NAME) {
            return {
                parameterType: "TABLE",
                inputProps: {
                    parameterName: `Default Value for ${parameter.ParameterName}`,
                    selectedTableFilter: {Id: defaultParameterInstance.TableId},
                    onChange: (newTable?: TableProperties) => onDefaultValueChange({
                                ...parameter,
                                DefaultParameterValue: JSON.stringify({
                                    ParameterValue: newTable?.UniqueName,
                                    TableId: newTable?.Id,
                                    ProviderInstanceId: newTable?.ProviderInstanceID
                                })
                            })
                }
            } as TableParameterInput
        // } else if(parameter.Tag === ActionParameterDefinitionTag.COLUMN_NAME) {
        //     const tableFilters = allParameters?.filter(param => param?.Tag===ActionParameterDefinitionTag.TABLE_NAME && (!!param?.DefaultParameterValue)).map(param => ({UniqueName: param.DefaultParameterValue} as TableProperties))
        //     return {
        //         parameterType: "COLUMN",
        //         inputProps: {
        //             parameterName: parameter.ParameterName,
        //             selectedColumnFilter: {UniqueName: parameter.DefaultParameterValue},
        //             tableFilters: tableFilters,
        //             onChange: (newColumn?: ColumnProperties) => setBuildActionContext({
        //                 type: "SetParameterDetails",
        //                 payload: {
        //                     newParamConfig: {
        //                         ...parameter,
        //                         DefaultParameterValue: newColumn?.UniqueName
        //                     }
        //                 }
        //             })
        //         }
        //     } as ColumnParameterInput
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.STRING) {
            return {
                parameterType: "STRING",
                inputProps: {
                    parameterName: `Default Value for ${parameter.ParameterName}`,
                    value: parameter?.DefaultParameterValue,
                    onChange: (newValue: string) => onDefaultValueChange({
                                ...parameter,
                                DefaultParameterValue: JSON.stringify({
                                    ParameterValue: newValue
                                })
                            })
                }
            } as StringParameterInput
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.INT) {
            return {
                parameterType: "INT",
                inputProps: {
                    parameterName: `Default Value for ${parameter.ParameterName}`,
                    value: parameter?.DefaultParameterValue,
                    onChange: (newValue: string) => onDefaultValueChange({
                                ...parameter,
                                DefaultParameterValue: JSON.stringify({
                                    ParameterValue: newValue
                                })
                            })
                }
            } as IntParameterInput
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.BOOLEAN) {
            return {
                parameterType: "BOOLEAN",
                inputProps: {
                    parameterName: `Default Value for ${parameter.ParameterName}`,
                    value: parameter?.DefaultParameterValue,
                    onChange: (newValue: string) => onDefaultValueChange({
                                ...parameter,
                                DefaultParameterValue: JSON.stringify({
                                    ParameterValue: newValue
                                })
                    })
                }
            } as BooleanParameterInput
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.FLOAT) {
            return {
                parameterType: "FLOAT",
                inputProps: {
                    parameterName: `Default Value for ${parameter.ParameterName}`,
                    value: parameter?.DefaultParameterValue,
                    onChange: (newValue: string) => onDefaultValueChange({
                                ...parameter,
                                DefaultParameterValue: JSON.stringify({
                                    ParameterValue: newValue
                                })
                            })
                }
            } as FloatParameterInput
        } else {
            return {parameterType: undefined}
        }
    }
   return getParameterInputField(formParameterInputProps())
}

const OptionSetSelector = (props: {parameter: ActionParameterDefinition, onParameterEdit: (newParameter: ActionParameterDefinition) => void}) => {

    const filter = createFilterOptions<string>()
    const handleChange = (newOptions: string[]) => {
        const newOption = newOptions.find(option => option.includes("Create Option:"))
        if(!!newOption) {
            const optionName = newOption.substring(14)
            const exisitingOpts = props.parameter.OptionSetValues?.split(',') || []
            exisitingOpts.push(optionName)
            props.onParameterEdit({
                ...props.parameter,
                OptionSetValues: exisitingOpts.join(',')
            })
        } else {
            props.onParameterEdit({
                ...props.parameter,
                OptionSetValues: newOptions.length ? newOptions?.join(',') : undefined
            })
        }
    }

    const handleOptionSingleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event)
        if(event.target.checked || props.parameter.Tag === ActionParameterDefinitionTag.OPTION_SET_MULTIPLE) {
            props.onParameterEdit({
                ...props.parameter,
                Tag: ActionParameterDefinitionTag.OPTION_SET_SINGLE
            })
        } else {
            props.onParameterEdit({
                ...props.parameter,
                Tag: ActionParameterDefinitionTag.OTHER,
                OptionSetValues: undefined
            })
        }
    }

    const handleOptionMultipleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.checked || props.parameter.Tag === ActionParameterDefinitionTag.OPTION_SET_SINGLE) {
            props.onParameterEdit({
                ...props.parameter,
                Tag: ActionParameterDefinitionTag.OPTION_SET_MULTIPLE
            })
        } else {
            props.onParameterEdit({
                ...props.parameter,
                Tag: ActionParameterDefinitionTag.OTHER,
                OptionSetValues: undefined
            })
        }
    }

    return (
        <Box sx={{display: 'flex', gap: 1}}>
           <FormGroup row={true} sx={{display: 'webkit', minWidth: '400px'}}>
                <FormControlLabel control={<Checkbox checked={props.parameter.Tag === ActionParameterDefinitionTag.OPTION_SET_SINGLE} onChange={handleOptionSingleChange}/>} label="Option Set Single"/>
                <FormControlLabel control={<Checkbox checked={props.parameter.Tag === ActionParameterDefinitionTag.OPTION_SET_MULTIPLE} onChange={handleOptionMultipleChange} />} label="Option Set Multiple"/>
            </FormGroup>
            {props.parameter.Tag === ActionParameterDefinitionTag.OPTION_SET_MULTIPLE || props.parameter.Tag === ActionParameterDefinitionTag.OPTION_SET_SINGLE ? 
                (
                    <Autocomplete
                        options={"".split(',') || []}
                        filterSelectedOptions
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        multiple
                        fullWidth
                        value={props.parameter.OptionSetValues?.split(',') || []}
                        onChange={(event, value, reason, details) => {
                            if(!!value){
                                handleChange(value)
                            }
                        }}
                        filterOptions={(options, params) => {

                            const filtered = filter(options, params);
                            if (params.inputValue !== '') {
                                filtered.push(`Create Option: ${params.inputValue}`);
                            }
                            return filtered;
                        }}
                        renderInput={(params) => <TextField {...params} label="Add Options"/>}
                    />
                ) : (
                    <></>
                )
            } 
            
        </Box>
    )
}


export type ConfigureParentParamProps = {
    allParamDefs?: ActionParameterDefinition[],
    currentParamDef?: ActionParameterDefinition,
    onParameterEdit?: (editedParam: ActionParameterDefinition) => void
}

export const ConfigureParentTag = (props: ConfigureParentParamProps) => {
    const tableParams = props?.allParamDefs?.filter(parameter => parameter?.Tag===ActionParameterDefinitionTag.TABLE_NAME || parameter?.Tag===ActionParameterDefinitionTag.DATA) || []
    const paramConfig = safelyParseJSON(props?.currentParamDef?.Config) as ActionParameterDefinitionConfig
    const onParentTagSelection = (selectedParameter?: ActionParameterDefinition) => {
        const newConfig: ActionParameterDefinitionConfig = {
            ...paramConfig,
            ParentParameterDefinitionId: selectedParameter?.Id,
            ParentRelationshipName: selectedParameter===undefined ? undefined : "TableColumn"
        }

        props?.onParameterEdit?.({
            ...props?.currentParamDef,
            Config: JSON.stringify(newConfig)
        })
    }

    return (
        <Autocomplete
            options={tableParams}
            getOptionLabel={option => option?.DisplayName || option?.ParameterName || ""}
            filterSelectedOptions
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            fullWidth
            value={tableParams.find(param => param.Id === paramConfig?.ParentParameterDefinitionId)}
            onChange={(event, value, reason, details) => {
                onParentTagSelection(value === null ? undefined : value)
            }}
            renderInput={(params) => <TextField {...params} label="Parent Parameter"/>}
        />
    )
}


export type ActionParameterDefinitionParentRelationshipNameType = "TableColumn"

export type TableColumnRelationshipConfig = {

}

export type ActionParameterDefinitionParentRelationshipConfigType = TableColumnRelationshipConfig

export type ActionParameterDefinitionConfig = {
    ParentParameterDefinitionId?: string,
    ParentRelationshipName?: ActionParameterDefinitionParentRelationshipNameType,
    ParentRelationshipConfig?: ActionParameterDefinitionParentRelationshipConfigType
}

export default EditActionParameter;