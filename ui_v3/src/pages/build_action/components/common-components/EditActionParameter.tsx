import { FormControlLabel, FormGroup } from "@mui/material";
import { Box, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Checkbox, Autocomplete, TextField, createFilterOptions } from "@mui/material";
import React from "react";
import { ChangeEvent } from "react";
import VirtualTagHandler from "../../../../common/components/tag-handler/VirtualTagHandler";
import getParameterInputField, { BooleanParameterInput, ColumnParameterInput, FloatParameterInput, IntParameterInput, ParameterInputProps, StringParameterInput, TableParameterInput } from "../../../../common/components/workflow/create/ParameterInput";
import { getAttributesFromInputType, getInputTypeFromAttributesNew, InputMap } from "../../../../custom_enums/ActionParameterDefinitionInputMap";
import ActionParameterDefinitionDatatype from "../../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../../enums/ActionParameterDefinitionTag";
import { ActionParameterDefinition, ActionTemplate, ColumnProperties, TableProperties, Tag } from "../../../../generated/entities/Entities";
import { SetBuildActionContext } from "../../context/BuildActionContext";

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
    React.useEffect(() => {
        setParamName(paramWithTag?.parameter?.ParameterName)
    }, [paramWithTag?.parameter?.ParameterName])

    const handleParameterNameChange = () => {
        onParameterEdit({
            ...paramWithTag?.parameter,
            ParameterName: paramName
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

    if(!!paramWithTag) {
        const {parameter, tags} = paramWithTag
        const allParameters = allParamsWithTags?.map(param => param.parameter)
        const attributeValue = getInputTypeFromAttributesNew(template.Language, parameter.Tag, parameter.Type, parameter.Datatype)
        return(
            <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={6}>
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
                <Grid item xs={12} md={4} lg={4}>
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
                    <DefaultValueSelector parameter={parameter} allParameters={allParameters}/>
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <VirtualTagHandler
                        selectedTags={tags}
                        tagFilter={{}}
                        allowAdd={true}
                        allowDelete={true}
                        onSelectedTagsChange={(newTags: Tag[]) => {onTagsChange(newTags)}}
                        orientation="HORIZONTAL"
                        direction="DEFAULT"
                    />
                </Grid>
                {attributeValue === "String" || attributeValue === "Integer" || attributeValue === "Decimal" ? (
                    <Grid item xs={6}>
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

const DefaultValueSelector = (props: {parameter: ActionParameterDefinition, allParameters: ActionParameterDefinition[]|undefined}) => {
    const {parameter, allParameters} = props
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const formParameterInputProps: () => ParameterInputProps = () => {
        if(parameter.Tag === ActionParameterDefinitionTag.TABLE_NAME) {
            return {
                parameterType: "TABLE",
                inputProps: {
                    parameterName: parameter.ParameterName,
                    selectedTableFilter: {UniqueName: parameter.DefaultParameterValue},
                    onChange: (newTable?: TableProperties) => setBuildActionContext({
                        type: "SetParameterDetails",
                        payload: {
                            newParamConfig: {
                                ...parameter,
                                DefaultParameterValue: newTable?.UniqueName
                            }
                        }
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
                    parameterName: parameter.ParameterName,
                    value: parameter?.DefaultParameterValue,
                    onChange: (newValue: string) => setBuildActionContext({
                        type: "SetParameterDetails",
                        payload: {
                            newParamConfig: {
                                ...parameter,
                                DefaultParameterValue: newValue
                            }
                        }
                    })
                }
            } as StringParameterInput
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.INT) {
            return {
                parameterType: "INT",
                inputProps: {
                    parameterName: parameter.ParameterName,
                    value: parameter?.DefaultParameterValue,
                    onChange: (newValue: string) => setBuildActionContext({
                        type: "SetParameterDetails",
                        payload: {
                            newParamConfig: {
                                ...parameter,
                                DefaultParameterValue: newValue
                            }
                        }
                    })
                }
            } as IntParameterInput
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.BOOLEAN) {
            return {
                parameterType: "BOOLEAN",
                inputProps: {
                    parameterName: parameter.ParameterName,
                    value: parameter?.DefaultParameterValue,
                    onChange: (newValue: string) => setBuildActionContext({
                        type: "SetParameterDetails",
                        payload: {
                            newParamConfig: {
                                ...parameter,
                                DefaultParameterValue: newValue
                            }
                        }
                    })
                }
            } as BooleanParameterInput
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.FLOAT) {
            return {
                parameterType: "FLOAT",
                inputProps: {
                    parameterName: parameter.ParameterName,
                    value: parameter?.DefaultParameterValue,
                    onChange: (newValue: string) => setBuildActionContext({
                        type: "SetParameterDetails",
                        payload: {
                            newParamConfig: {
                                ...parameter,
                                DefaultParameterValue: newValue
                            }
                        }
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
           <FormGroup>
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

export default EditActionParameter;