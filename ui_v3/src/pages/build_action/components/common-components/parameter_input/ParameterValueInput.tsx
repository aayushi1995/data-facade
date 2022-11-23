import ParameterInput, { ActionParameterAdditionalConfig, ActionParameterColumnAdditionalConfig, ActionParameterTableAdditionalConfig, BooleanParameterInput, ColumnListParameterInput, ColumnParameterInput, FloatParameterInput, IntParameterInput, OptionSetMultipleParameterInput, OptionSetStringParameterInput, StringParameterInput, TableParameterInput } from "../../../../../common/components/workflow/create/ParameterInput"
import ActionParameterDefinitionDatatype from "../../../../../enums/ActionParameterDefinitionDatatype"
import ActionParameterDefinitionTag from "../../../../../enums/ActionParameterDefinitionTag"
import { ActionParameterDefinition, ActionParameterInstance, ColumnProperties, TableProperties } from "../../../../../generated/entities/Entities"

export type ParameterValueInputProps = {
    parameterDefinition: ActionParameterDefinition,
    parameterInstance?: ActionParameterInstance,
    parameterAdditionalConfig?: ActionParameterAdditionalConfig,
    onParameterInstanceParameterValueChange: (newParameterInstance?: ActionParameterInstance) => void
}

const ParameterValueInput = (props: ParameterValueInputProps) => {
    const { parameterDefinition, parameterInstance, parameterAdditionalConfig, onParameterInstanceParameterValueChange } = props
    const getParameterInputProps = () => {
        if(parameterDefinition.Tag === ActionParameterDefinitionTag.DATA || parameterDefinition.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME) {
            const addtionalConfig = parameterAdditionalConfig as (undefined | ActionParameterTableAdditionalConfig)
            return {
                parameterType: "TABLE",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
                    onChange: (selectedTable?: TableProperties) => {
                        const newParameterInstance: ActionParameterInstance = {
                            ...parameterInstance,
                            TableId: selectedTable?.Id,
                            ParameterValue: selectedTable?.UniqueName,
                            ActionParameterDefinitionId: parameterDefinition.Id,
                            ProviderInstanceId: selectedTable?.ProviderInstanceID
                        }
                        onParameterInstanceParameterValueChange(newParameterInstance)
                    },
                    selectedTableFilter: {Id: parameterInstance?.TableId},
                    availableTablesFilter: addtionalConfig?.availableTablesFilter,
                    parameterDefinitionId: parameterDefinition.Id
                }
            } as TableParameterInput
        } else if(parameterDefinition.Tag === ActionParameterDefinitionTag.COLUMN_NAME) {
            const addtionalConfig = parameterAdditionalConfig as (undefined | ActionParameterColumnAdditionalConfig)
            const tableFilters = addtionalConfig?.availableTablesFilter
            return {
                parameterType: "COLUMN",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
                    selectedColumnFilter: {Id: parameterInstance?.ColumnId},
                    filters: {
                        tableFilters: tableFilters,
                        parameterDefinitionId: parameterDefinition.Id!
                    },
                    onChange: (newColumn?: ColumnProperties) => {
                        onParameterInstanceParameterValueChange({
                            ...parameterInstance,
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
                    selectedOptions: {name: parameterInstance || ""},
                    onChange: (newOptions?: {name: string}) => {
                        const newValue = newOptions?.name
                        onParameterInstanceParameterValueChange({
                            ...parameterInstance,
                            ActionParameterDefinitionId: parameterDefinition.Id,
                            ParameterValue: newValue
                        })
                    }
                }
            } as OptionSetStringParameterInput
        } else if(parameterDefinition.Tag === ActionParameterDefinitionTag.OPTION_SET_MULTIPLE) {
            const allOptions = parameterDefinition.OptionSetValues?.split(',')
            const selectedOptions = parameterInstance?.ParameterValue?.split(',')?.map(option => ({name: option}))
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
                            ...parameterInstance,
                            ParameterValue: newValue,
                            ActionParameterDefinitionId: parameterDefinition.Id
                        }
                        onParameterInstanceParameterValueChange(newParameterInstance)
                    }
                }
            } as OptionSetMultipleParameterInput
        } else if(parameterDefinition.Datatype === ActionParameterDefinitionDatatype.STRING || parameterDefinition.Datatype === ActionParameterDefinitionDatatype.STRING_NO_QUOTES) {
            return {
                parameterType: "STRING",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
                    onChange: (parameterValue: string) => {
                        const newParameterInstance: ActionParameterInstance = {
                            ...parameterInstance,
                            ParameterValue: parameterValue,
                            ActionParameterDefinitionId: parameterDefinition.Id
                        }
                        onParameterInstanceParameterValueChange(newParameterInstance)
                    },
                    value: parameterInstance?.ParameterValue
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
                            ...parameterInstance,
                            ParameterValue: parameterValue,
                            ActionParameterDefinitionId: parameterDefinition.Id
                        }
                        onParameterInstanceParameterValueChange(newParameterInstance)
                    },
                    value: parameterInstance?.ParameterValue
                }
            }  as IntParameterInput
        } else if(parameterDefinition.Datatype === ActionParameterDefinitionDatatype.FLOAT) {
            return {
                parameterType: "FLOAT",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
                    onChange: (parameterValue: string) => {
                        const newParameterInstance: ActionParameterInstance = {
                            ...parameterInstance,
                            ParameterValue: parameterValue,
                            ActionParameterDefinitionId: parameterDefinition.Id
                        }
                        onParameterInstanceParameterValueChange(newParameterInstance)
                    },
                    value: parameterInstance?.ParameterValue
                }
            } as FloatParameterInput
        } else if(parameterDefinition.Datatype === ActionParameterDefinitionDatatype.BOOLEAN) {
            return {
                parameterType: "BOOLEAN",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
                    onChange: (parameterValue: string) => {
                        const newParameterInstance: ActionParameterInstance = {
                            ...parameterInstance,
                            ParameterValue: parameterValue,
                            ActionParameterDefinitionId: parameterDefinition.Id
                        }
                        onParameterInstanceParameterValueChange(newParameterInstance)
                    },
                    value: parameterInstance?.ParameterValue
                }
            } as BooleanParameterInput
        } else if(parameterDefinition.Datatype === ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST) {
            const addtionalConfig = parameterAdditionalConfig as (undefined | ActionParameterColumnAdditionalConfig)
            const tableFilters = addtionalConfig?.availableTablesFilter
            const parameterDefinitionId = parameterDefinition.Id!
            return {
                parameterType: "COLUMN_LIST",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
                    onChange: (newColumns?: ColumnProperties[]) => {
                        const names = newColumns?.map(column => column.UniqueName) || []
                        const newParameterInstance: ActionParameterInstance = {
                            ...parameterInstance,
                            ParameterValue: names.join(','),
                            ActionParameterDefinitionId: parameterDefinition.Id
                        }
                        onParameterInstanceParameterValueChange(newParameterInstance)
                    },
                    selectedColumnFiltersWithNameOnly: parameterInstance?.ParameterValue?.split(',')?.map(name => {
                        return {UniqueName: name}
                    }) || [],
                    filters: {
                        tableFilters: tableFilters,
                        parameterDefinitionId: parameterDefinitionId
                    }
                }
            } as ColumnListParameterInput
        } else {
            return {
                parameterType: undefined,
                parameterId: parameterDefinition.Id,
            }
        }
    }
    
    return <ParameterInput {...getParameterInputProps()}/>
}

export type ParameterValueInputFromAllParametersProps = {
    activeParameterInstanceId: string
    parameterDefinitions: ActionParameterDefinition[],
    parameterInstances: ActionParameterInstance[],
    parameterAdditionalConfigs?: ActionParameterAdditionalConfig[],
    onParameterInstanceParameterValueChange: (newParameterInstance?: ActionParameterInstance) => void,
}

export const ParameterValueInputFromAllParameters = (props: ParameterValueInputFromAllParametersProps) => {
    const activeParameterInstance: (ActionParameterInstance|undefined) = props?.parameterInstances?.find?.(param => param?.Id === activeParameterInstance)
    const activeParameterDefinition = props?.parameterDefinitions?.find?.(param => param?.Id === activeParameterInstance?.ActionParameterDefinitionId)
    const activeAdditionalConfig = props?.parameterAdditionalConfigs?.find?.(addConf => addConf?.parameterDefinitionId === activeParameterDefinition?.Id)

    if(!!activeParameterDefinition && !!activeParameterInstance) {
        return <ParameterValueInput
                parameterDefinition={activeParameterDefinition}
                parameterInstance={activeParameterInstance}
                parameterAdditionalConfig={activeAdditionalConfig}
                onParameterInstanceParameterValueChange={props?.onParameterInstanceParameterValueChange}
            />
    } else {
        return <>Loading</>
    }
    
}

export default ParameterValueInput;