import { Box, Card, Grid } from "@mui/material";
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import { ActionParameterDefinition, ActionParameterInstance, ColumnProperties, TableProperties } from "../../../generated/entities/Entities";
import ParameterInput, { ColumnParameterInput, ParameterInputProps, StringParameterInput, TableParameterInput } from "../workflow/create/ParameterInput";


interface ParameterDefinitionsConfigPlaneProps {
    parameterDefinitions: ActionParameterDefinition[],
    parameterInstances: ActionParameterInstance[],
    handleChange: (parameterInstances: ActionParameterInstance[]) => void
}


const ParameterDefinitionsConfigPlane = (props: ParameterDefinitionsConfigPlaneProps) => {

    console.log(props)
    const onParameterValueChange = (event: ActionParameterInstance) => {
        const checkIfExists = props.parameterInstances.find(parameterInstance => parameterInstance.ActionParameterDefinitionId === event.ActionParameterDefinitionId)
        const newParameterInstances = checkIfExists !== undefined ? (props.parameterInstances.map(parameterInstance => {
            return parameterInstance.ActionParameterDefinitionId !== event.ActionParameterDefinitionId ? parameterInstance : {
                ...parameterInstance,
                ...event
            }
        })) : (
            [...props.parameterInstances, event]
        )
        props.handleChange(newParameterInstances)
    }

    const getExistingParameterValue = (parameterId: string) => {
        const parameterInstance = props.parameterInstances.find(parameterInstance => parameterInstance.ActionParameterDefinitionId === parameterId)
        return parameterInstance?.ParameterValue
    }

    const getExistingParameterInstance = (parameterId: string) => {
        const parameterInstance = props.parameterInstances.find(parameterInstance => parameterInstance.ActionParameterDefinitionId === parameterId)
        return parameterInstance
    }

    const getSortedParameters = () => {
        const sortedByName = props.parameterDefinitions.sort((p1, p2) => ((p1?.ParameterName||"a") > (p2.ParameterName||"b")) ? 1 : -1)
        const tableParameters: ActionParameterDefinition[] = []
        const columnParameters: ActionParameterDefinition[] = []
        const restParameters: ActionParameterDefinition[] = []

        sortedByName.forEach(parameter => {
            if(parameter.Tag === ActionParameterDefinitionTag.DATA || parameter.Tag === ActionParameterDefinitionTag.TABLE_NAME) {
                tableParameters.push(parameter)
            } else if(parameter.Tag === ActionParameterDefinitionTag.COLUMN_NAME || parameter.Tag === ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST) {
                columnParameters.push(parameter)
            } else {
                restParameters.push(parameter)
            }
        })
        return tableParameters.concat(columnParameters, restParameters)
    }

    const getParameterDefinition = (parameterDefinitionId: string| undefined) => props.parameterDefinitions.find(apd => apd.Id===parameterDefinitionId)

    const parameterDefinitions: ParameterInputProps[] = getSortedParameters().map(parameterDefinition => {
        const existingParameterInstance = getExistingParameterInstance(parameterDefinition.Id || "na")
        const existingParameterValue = getExistingParameterValue(parameterDefinition.Id || "na")
        if(parameterDefinition.Tag === ActionParameterDefinitionTag.DATA || parameterDefinition.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME) {
            return {
                parameterType: "TABLE",
                inputProps: {
                    parameterName: parameterDefinition.ParameterName || "parameterName",
                    onChange: (selectedTable?: TableProperties) => {
                        const newParameterInstance: ActionParameterInstance = {
                            TableId: selectedTable?.Id,
                            ParameterValue: selectedTable?.UniqueName,
                            ActionParameterDefinitionId: parameterDefinition.Id,
                            ProviderInstanceId: selectedTable?.ProviderInstanceID
                        }
                        onParameterValueChange(newParameterInstance)
                    },
                    selectedTableFilter: {Id: existingParameterInstance?.TableId},
                    parameterDefinitionId: parameterDefinition.Id
                }
            } as TableParameterInput
        } else if(parameterDefinition.Tag === ActionParameterDefinitionTag.TABLE_NAME) {
            return {
                parameterType: "TABLE",
                inputProps: {
                    parameterName: parameterDefinition.ParameterName || "parameterName",
                    onChange: (selectedTable?: TableProperties) => {
                        const newParameterInstance: ActionParameterInstance = {
                            TableId: selectedTable?.Id,
                            ParameterValue: selectedTable?.UniqueName,
                            ActionParameterDefinitionId: parameterDefinition.Id,
                            ProviderInstanceId: selectedTable?.ProviderInstanceID
                        }
                        onParameterValueChange(newParameterInstance)
                    },
                    selectedTableFilter: {Id: existingParameterInstance?.TableId}
                }
            } as TableParameterInput
        } else if(parameterDefinition.Tag === ActionParameterDefinitionTag.COLUMN_NAME) {
            const tableFilters = props.parameterInstances.filter(api => api.TableId!==undefined).map(api => ({Id: api.TableId} as TableProperties))
            return {
                parameterType: "COLUMN",
                inputProps: {
                    parameterName: parameterDefinition.ParameterName || "parameterName",
                    selectedColumnFilter: {Id: existingParameterInstance?.ColumnId},
                    filters: {
                        tableFilters: tableFilters,
                        parameterDefinitionId: parameterDefinition.Id!
                    },
                    onChange: (newColumn?: ColumnProperties) => {
                        onParameterValueChange({
                            ...existingParameterInstance,
                            ColumnId: newColumn?.Id,
                            ParameterValue: newColumn?.UniqueName,
                            ActionParameterDefinitionId: parameterDefinition.Id
                        })
                    }
                }
            } as ColumnParameterInput
        } else if(parameterDefinition.Tag === ActionParameterDefinitionTag.OPTION_SET_SINGLE) {
            const allOptions = parameterDefinition.OptionSetValues?.split(',')
            return {
                parameterType: "OPTION_SET_SINGLE",
                inputProps: {
                    availableOptions: allOptions?.map(option => ({'name': option})) || [],
                    parameterName: parameterDefinition.ParameterName || "parameterName",
                    selectedOptions: {name: existingParameterValue || ""},
                    onChange: (newOptions?: {name: string}) => {
                        const newValue = newOptions?.name
                        onParameterValueChange({
                            ActionParameterDefinitionId: parameterDefinition.Id,
                            ParameterValue: newValue
                        })
                    }
                }
            }

        } else if(parameterDefinition.Tag === ActionParameterDefinitionTag.OPTION_SET_MULTIPLE) {
            const allOptions = parameterDefinition.OptionSetValues?.split(',')
            const selectedOptions = existingParameterValue?.split(',')?.map(option => ({name: option}))
            return {
                parameterType: 'OPTION_SET_MULTIPLE',
                inputProps: {
                    availableOptions: allOptions?.map(option => ({'name': option})) || [],
                    parameterName: parameterDefinition.ParameterName || "parameterName",
                    selectedOptions: selectedOptions,
                    onChange: (newOption?: {name: string}[]) => {
                        const optionList = newOption?.map(option => option.name)
                        const newValue = optionList?.join(',')
                        const newParameterInstance = {
                            ParameterValue: newValue,
                            ActionParameterDefinitionId: parameterDefinition.Id
                        }
                        onParameterValueChange(newParameterInstance)
                    }
                }
            }

        } else if(parameterDefinition.Datatype === ActionParameterDefinitionDatatype.STRING || parameterDefinition.Datatype === ActionParameterDefinitionDatatype.STRING_NO_QUOTES) {
            return {
                parameterType: "STRING",
                inputProps: {
                    parameterName: parameterDefinition.ParameterName || "parameterName",
                    onChange: (parameterValue: string) => {
                        const newParameterInstance: ActionParameterInstance = {
                            ParameterValue: parameterValue,
                            ActionParameterDefinitionId: parameterDefinition.Id
                        }
                        onParameterValueChange(newParameterInstance)
                    },
                    value: existingParameterValue
                }
            } as StringParameterInput
        } else if(parameterDefinition.Datatype === ActionParameterDefinitionDatatype.INT) {
            return {
                parameterType: "INT",
                inputProps: {
                    parameterName: parameterDefinition.ParameterName || "parameterName",
                    onChange: (parameterValue: string) => {
                        const newParameterInstance: ActionParameterInstance = {
                            ParameterValue: parameterValue,
                            ActionParameterDefinitionId: parameterDefinition.Id
                        }
                        onParameterValueChange(newParameterInstance)
                    },
                    value: existingParameterValue
                }
            }
        } else if(parameterDefinition.Datatype === ActionParameterDefinitionDatatype.FLOAT) {
            return {
                parameterType: "FLOAT",
                inputProps: {
                    parameterName: parameterDefinition.ParameterName || "parameterName",
                    onChange: (parameterValue: string) => {
                        const newParameterInstance: ActionParameterInstance = {
                            ParameterValue: parameterValue,
                            ActionParameterDefinitionId: parameterDefinition.Id
                        }
                        onParameterValueChange(newParameterInstance)
                    },
                    value: existingParameterValue
                }
            } 
        } else if(parameterDefinition.Datatype === ActionParameterDefinitionDatatype.BOOLEAN) {
            return {
                parameterType: "BOOLEAN",
                inputProps: {
                    parameterName: parameterDefinition.ParameterName || "parameterName",
                    onChange: (parameterValue: string) => {
                        const newParameterInstance: ActionParameterInstance = {
                            ParameterValue: parameterValue,
                            ActionParameterDefinitionId: parameterDefinition.Id
                        }
                        onParameterValueChange(newParameterInstance)
                    },
                    value: existingParameterValue
                }
            }
        } else if(parameterDefinition.Datatype === ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST) {
            const tableFilters = props.parameterInstances.filter(api => api.TableId!==undefined).map(api => ({Id: api.TableId} as TableProperties))
            const parameterDefinitionId = parameterDefinition.Id!
            return {
                parameterType: "COLUMN_LIST",
                inputProps: {
                    parameterName: parameterDefinition.ParameterName || "parameterName",
                    onChange: (newColumns?: ColumnProperties[]) => {
                        const names = newColumns?.map(column => column.UniqueName) || []
                        const newParameterInstance: ActionParameterInstance = {
                            ParameterValue: names.join(','),
                            ActionParameterDefinitionId: parameterDefinition.Id
                        }
                        onParameterValueChange(newParameterInstance)
                    },
                    selectedColumnFilters: existingParameterValue?.split(',')?.map(name => {
                        return {UniqueName: name}
                    }) || [],
                    filters: {
                        tableFilters: tableFilters,
                        parameterDefinitionId: parameterDefinitionId
                    }
                }
            }
        } else {
            return {
                parameterType: undefined
            }
        }
    })

    return (
        <Box sx={{display: 'flex', minWidth: '100%', minHeight: '200px'}}>
            <Card sx={{background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #F8F8F8', border: '2px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '-5px -5px 10px #E3E6F0, 5px 5px 10px #A6ABBD', borderRadius: '10px', backgroundBlendMode: 'soft-light, normal', minWidth: '100%', minHeight: '100%'
        , justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                <Grid container spacing = {5} sx={{p: 2}}>
                    {parameterDefinitions.map((parameter) => {
                        return (
                            <Grid item xs={4}>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <ParameterInput {...parameter}/>
                                </Box>
                            </Grid>
                        )
                    })}
                </Grid>
            </Card>
        </Box>
    )
}

export default ParameterDefinitionsConfigPlane