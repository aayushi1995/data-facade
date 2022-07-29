import { Box, Grid, Typography } from "@mui/material";
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import { ActionParameterDefinition, ActionParameterInstance, ColumnProperties, TableProperties } from "../../../generated/entities/Entities";
import ParameterInput, { ActionParameterAdditionalConfig, ActionParameterColumnAdditionalConfig, ActionParameterTableAdditionalConfig, ColumnParameterInput, ParameterInputProps, StringParameterInput, TableParameterInput } from "../workflow/create/ParameterInput";




interface ParameterDefinitionsConfigPlaneProps {
    parameterDefinitions: ActionParameterDefinition[],
    parameterInstances: ActionParameterInstance[],
    parameterAdditionalConfigs?: ActionParameterAdditionalConfig[],
    handleChange: (parameterInstances: ActionParameterInstance[]) => void,
    onParameterClick?: (parameterDefinitionId: string) => void
}


const ParameterDefinitionsConfigPlane = (props: ParameterDefinitionsConfigPlaneProps) => {

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

    const getparameterAdditionalConfig = (parameterDefinitionId: string) => {
        const parameterAdditionalConfig = props?.parameterAdditionalConfigs?.find(parameterAddtionalConfig => parameterAddtionalConfig.parameterDefinitionId === parameterDefinitionId)
        return parameterAdditionalConfig
    }

    const getParameterDescription = (parameterId: string) => {
        const parameterDefinition = props.parameterDefinitions.find(parameter => parameter.Id === parameterId)
        return parameterDefinition?.Description || parameterDefinition?.DisplayName || parameterDefinition?.ParameterName
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

    const parameterDefinitions: ParameterInputProps[] = getSortedParameters().map(parameterDefinition => {
        const existingParameterInstance = getExistingParameterInstance(parameterDefinition.Id || "na")
        const parameterAdditionalConfig = getparameterAdditionalConfig(parameterDefinition.Id || "na")
        const existingParameterValue = getExistingParameterValue(parameterDefinition.Id || "na")

        if(parameterDefinition.Tag === ActionParameterDefinitionTag.DATA || parameterDefinition.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME) {
            const addtionalConfig = parameterAdditionalConfig as (undefined | ActionParameterTableAdditionalConfig)
            return {
                parameterType: "TABLE",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
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
                    availableTablesFilter: addtionalConfig?.availableTablesFilter,
                    parameterDefinitionId: parameterDefinition.Id
                }
            } as TableParameterInput
        } else if(parameterDefinition.Tag === ActionParameterDefinitionTag.TABLE_NAME) {
            const addtionalConfig = parameterAdditionalConfig as (undefined | ActionParameterTableAdditionalConfig)
            return {
                parameterType: "TABLE",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
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
                    availableTablesFilter: addtionalConfig?.availableTablesFilter,
                    parameterDefinitionId: parameterDefinition.Id
                }
            } as TableParameterInput
        } else if(parameterDefinition.Tag === ActionParameterDefinitionTag.COLUMN_NAME) {
            const addtionalConfig = parameterAdditionalConfig as (undefined | ActionParameterColumnAdditionalConfig)
            const tableFilters = addtionalConfig?.availableTablesFilter !== undefined ? addtionalConfig?.availableTablesFilter : props.parameterInstances.filter(api => api.TableId!==undefined).map(api => ({Id: api.TableId} as TableProperties))
            const uniqueTableFilters = getUniqueFilters(tableFilters)
            return {
                parameterType: "COLUMN",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
                    selectedColumnFilter: {Id: existingParameterInstance?.ColumnId},
                    filters: {
                        tableFilters: uniqueTableFilters,
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
                parameterId: parameterDefinition.Id,
                inputProps: {
                    availableOptions: allOptions?.map(option => ({'name': option})) || [],
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
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
                parameterId: parameterDefinition.Id,
                inputProps: {
                    availableOptions: allOptions?.map(option => ({'name': option})) || [],
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
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
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
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
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
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
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
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
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
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
            const addtionalConfig = parameterAdditionalConfig as (undefined | ActionParameterColumnAdditionalConfig)
            const tableFilters = addtionalConfig?.availableTablesFilter !== undefined ? addtionalConfig?.availableTablesFilter : props.parameterInstances.filter(api => api.TableId!==undefined).map(api => ({Id: api.TableId} as TableProperties))
            const uniqueTableFilters = getUniqueFilters(tableFilters)
            return {
                parameterType: "COLUMN_LIST",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
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
                        tableFilters: uniqueTableFilters,
                        parameterDefinitionId: parameterDefinition?.Id!
                    }
                }
            }
        } else {
            return {
                parameterType: undefined,
                parameterId: parameterDefinition.Id,
            }
        }
    })

    return (
        <Box sx={{display: 'flex', minWidth: '100%', minHeight: '100%'}}>
            <Grid container spacing = {5} sx={{p: 2}}>
                {parameterDefinitions.length === 0 && 
                    <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography> No Parameters Present</Typography>
                    </Grid>
                }
                {parameterDefinitions.map((parameter) => {
                    return (
                        <Grid item xs={12}>
                            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={() => props.onParameterClick?.(parameter.parameterId!)}>
                                <ParameterInput {...parameter}/>
                            </Box>
                            
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}

export const getUniqueFilters = (tableFilters: TableProperties[]) => {
    let tableIds: {[Id: string]: TableProperties} = {}
    const uniqueTableFilters: TableProperties[] = []
    tableFilters.forEach(table => {
        if(tableIds[table.Id!] === undefined) {
            tableIds[table.Id!] = table
            uniqueTableFilters.push(table)
        }
    })
    return uniqueTableFilters
}

export default ParameterDefinitionsConfigPlane