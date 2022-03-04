import { FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ChangeEvent } from "react";
import VirtualTagHandler from "../../../../common/components/tag-handler/VirtualTagHandler";
import getParameterInputField, { BooleanParameterInput, FloatParameterInput, IntParameterInput, ParameterInputProps, StringParameterInput, TableParameterInput } from "../../../../common/components/workflow/create/ParameterInput";
import { getAttributesFromInputType, getInputTypeFromAttributesNew, InputMap } from "../../../../custom_enums/ActionParameterDefinitionInputMap";
import ActionParameterDefinitionDatatype from "../../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../../enums/ActionParameterDefinitionTag";
import { ActionParameterDefinition, ActionTemplate, TableProperties, Tag } from "../../../../generated/entities/Entities";
import { SetBuildActionContext } from "../../context/BuildActionContext";

export type EditActionParameterProps = {
    template: ActionTemplate,
    paramsWithTag?: {parameter: ActionParameterDefinition, tags: Tag[]},
    onTagsChange: (newTags: Tag[]) => void,
    onParameterEdit: (newParameter: ActionParameterDefinition) => void,
    onParameterTypeEdit: (newParameter: ActionParameterDefinition) => void
}

const EditActionParameter = (props: EditActionParameterProps) => {
    const {onParameterEdit, onTagsChange, onParameterTypeEdit, template, paramsWithTag} = props

    const [paramName, setParamName] = React.useState<string|undefined>()
    React.useEffect(() => {
        setParamName(paramsWithTag?.parameter?.ParameterName)
    }, [paramsWithTag?.parameter?.ParameterName])

    const handleParameterNameChange = () => {
        onParameterEdit({
            ...paramsWithTag?.parameter,
            ParameterName: paramName
        })
    }
    const handleParameterTypeChange = (event: SelectChangeEvent<string>) => {
        const newInputType = event.target.value
        onParameterTypeEdit({
            ...paramsWithTag?.parameter,
            ...getAttributesFromInputType(newInputType, template.Language)
        })
    }
    const handleUserInputRequiredChange = () => {}
    

    if(!!paramsWithTag) {
        const {parameter, tags} = paramsWithTag
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
                    <DefaultValueSelector parameter={parameter}/>
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
            </Grid>
        )
    } else {
        return <></>
    }
}

const DefaultValueSelector = (props: {parameter: ActionParameterDefinition}) => {
    const {parameter} = props
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const formParameterInputProps: () => ParameterInputProps = () => {
        if(parameter.Tag === ActionParameterDefinitionTag.TABLE_NAME) {
            return {
                parameterType: "TABLE",
                inputProps: {
                    parameterName: parameter.ParameterName,
                    selectedTableName: parameter.DefaultParameterValue,
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

export default EditActionParameter;