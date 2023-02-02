import { getUniqueFilters } from "../../../../../../common/components/parameters/ParameterDefinitionsConfigPlane"
import ParameterInput, { ActionParameterAdditionalConfig, ActionParameterColumnAdditionalConfig, ActionParameterTableAdditionalConfig, BooleanParameterInput, ColumnListParameterInput, ColumnParameterInput, FloatParameterInput, IntParameterInput, OptionSetMultipleParameterInput, OptionSetStringParameterInput, ParameterInputProps, SlackChannelMultipleInput, SlackChannelSingleInput, StringParameterInput, TableParameterInput } from "../../../../../../common/components/parameters/ParameterInput"
import ActionParameterDefinitionDatatype from "../../../../../../enums/ActionParameterDefinitionDatatype"
import ActionParameterDefinitionTag from "../../../../../../enums/ActionParameterDefinitionTag"
import { ActionParameterDefinition, ActionParameterInstance, ColumnProperties, TableProperties } from "../../../../../../generated/entities/Entities"
import { safelyParseJSON } from "../../../../execute_action/util"

export type DefaultValueInputProps = {
    actionParameterDefinition?: ActionParameterDefinition,
    actionParameterDefinitionAdditionalConfig?: ActionParameterAdditionalConfig
    onDefaultValueChange: (newDefaultValue: string) => void
}

const DefaultValueInput = (props: DefaultValueInputProps) => {
    const {actionParameterDefinition, actionParameterDefinitionAdditionalConfig, onDefaultValueChange} = props
    const defaultActionParameterInstance = safelyParseJSON(actionParameterDefinition?.DefaultParameterValue) as ActionParameterInstance
    const updateDefaultActionParameterInstance = (newDefaultActionParameterInstance: ActionParameterInstance) => {
        console.log(newDefaultActionParameterInstance)
        onDefaultValueChange(JSON.stringify(newDefaultActionParameterInstance))
    }
    
    const getParameterInputProps: () => ParameterInputProps = () => {
        const addtionalConfig = actionParameterDefinitionAdditionalConfig as (undefined | ActionParameterTableAdditionalConfig)
        
        if(actionParameterDefinition?.Tag === ActionParameterDefinitionTag.DATA || actionParameterDefinition?.Tag === ActionParameterDefinitionTag.TABLE_NAME) {
            return {
                parameterType: "TABLE",
                inputProps: {
                    parameterName: `Default Value for ${actionParameterDefinition.ParameterName}`,
                    selectedTableFilter: {Id: defaultActionParameterInstance?.TableId, UniqueName: defaultActionParameterInstance?.ParameterValue},
                    availableTablesFilter: addtionalConfig?.availableTablesFilter,
                    onChange: (newTable?: TableProperties) => updateDefaultActionParameterInstance({
                                    ParameterValue: newTable?.UniqueName,
                                    TableId: newTable?.Id,
                                    ProviderInstanceId: newTable?.ProviderInstanceID
                                })
                }
            } as TableParameterInput
        } else if(actionParameterDefinition?.Tag === ActionParameterDefinitionTag.COLUMN_NAME) {
            const addtionalConfig = actionParameterDefinitionAdditionalConfig as (undefined | ActionParameterColumnAdditionalConfig)
            const tableFilters = addtionalConfig?.availableTablesFilter || []
            const uniqueTableFilters = getUniqueFilters(tableFilters)
            return {
                parameterType: "COLUMN",
                inputProps: {
                    parameterName: actionParameterDefinition?.ParameterName,
                    selectedColumnFilter: {Id: defaultActionParameterInstance?.ColumnId, UniqueName: defaultActionParameterInstance?.ParameterValue},
                    filters: {
                        tableFilters: uniqueTableFilters,
                        parameterDefinitionId: actionParameterDefinition?.Id
                    },
                    onChange: (newColumn?: ColumnProperties) => updateDefaultActionParameterInstance({
                                TableId: newColumn?.TableId,
                                ColumnId: newColumn?.Id,
                                ParameterValue: newColumn?.UniqueName
                            })
                }
            } as ColumnParameterInput 
        } else if(actionParameterDefinition?.Tag === ActionParameterDefinitionTag.SLACK_CHANNEL_SINGLE) {
            return {
                parameterType: "SLACK_CHANNEL_SINGLE",
                parameterId: actionParameterDefinition.Id,
                inputProps: {
                    selectedChannelID: defaultActionParameterInstance?.ParameterValue,
                    onSelectedChannelIdChange: (selectedChannelId?: string) => {
                        selectedChannelId && updateDefaultActionParameterInstance({
                            ParameterValue: selectedChannelId
                        })
                    }
                } 
            } as SlackChannelSingleInput
        } else if(actionParameterDefinition?.Tag === ActionParameterDefinitionTag.SLACK_CHANNEL_MULTIPLE) {
            return {
                parameterType: "SLACK_CHANNEL_MULTIPLE",
                parameterId: actionParameterDefinition.Id,
                inputProps: {
                    selectedChannelIDs: defaultActionParameterInstance?.ParameterValue?.split(','),
                    onSelectedChannelIdsChange: (selectedChannelIds?: string[]) => {
                        selectedChannelIds && updateDefaultActionParameterInstance({
                            ParameterValue: selectedChannelIds?.join(',')
                        })
                    }
                } 
            } as SlackChannelMultipleInput
        } else if(actionParameterDefinition?.Tag === ActionParameterDefinitionTag.OPTION_SET_SINGLE) {
            return {
                parameterType: "OPTION_SET_SINGLE",
                parameterId: actionParameterDefinition.Id,
                inputProps: {
                    parameterName: actionParameterDefinition.ParameterName,
                    selectedOptions: {name: defaultActionParameterInstance?.ParameterValue},
                    availableOptions: actionParameterDefinition?.OptionSetValues?.split(',')?.map(option => ({name: option})) || [],
                    onChange: (newOption: {name: string}) => {
                        updateDefaultActionParameterInstance({
                            ParameterValue: newOption.name
                        })
                    }
                } 
            } as OptionSetStringParameterInput
        } else if(actionParameterDefinition?.Tag === ActionParameterDefinitionTag.OPTION_SET_MULTIPLE) {
            return {
                parameterType: 'OPTION_SET_MULTIPLE',
                parameterId: actionParameterDefinition.Id,
                inputProps: {
                    parameterName: actionParameterDefinition.ParameterName || "string",
                    availableOptions: actionParameterDefinition?.OptionSetValues?.split(',')?.map(option => ({name: option})) || [],
                    selectedOptions: defaultActionParameterInstance?.ParameterValue?.split(',')?.map(option => ({name: option})) || [],
                    onChange: (newOptions: {name: string}[]) => {
                        updateDefaultActionParameterInstance({
                            ParameterValue: newOptions.map(option => option.name).join(',')
                        })
                    }
                }
            } as OptionSetMultipleParameterInput
        } else if(actionParameterDefinition?.Datatype === ActionParameterDefinitionDatatype.STRING || actionParameterDefinition?.Datatype === ActionParameterDefinitionDatatype.STRING_NO_QUOTES) {
            return {
                parameterType: "STRING",
                inputProps: {
                    parameterName: `Default Value for ${actionParameterDefinition?.ParameterName}`,
                    value: defaultActionParameterInstance?.ParameterValue,
                    onChange: (newValue: string) => updateDefaultActionParameterInstance({
                                ParameterValue: newValue
                            })
                }
            } as StringParameterInput
        } else if(actionParameterDefinition?.Datatype === ActionParameterDefinitionDatatype.INT) {
            return {
                parameterType: "INT",
                inputProps: {
                    parameterName: `Default Value for ${actionParameterDefinition?.ParameterName}`,
                    value: defaultActionParameterInstance?.ParameterValue,
                    onChange: (newValue: string) => updateDefaultActionParameterInstance({
                                ParameterValue: newValue
                            })
                }
            } as IntParameterInput
        } else if(actionParameterDefinition?.Datatype === ActionParameterDefinitionDatatype.BOOLEAN) {
            return {
                parameterType: "BOOLEAN",
                inputProps: {
                    parameterName: `Default Value for ${actionParameterDefinition?.ParameterName}`,
                    value: defaultActionParameterInstance?.ParameterValue,
                    onChange: (newValue: string) => updateDefaultActionParameterInstance({
                                ParameterValue: newValue
                            })
                }
            } as BooleanParameterInput
        } else if(actionParameterDefinition?.Datatype === ActionParameterDefinitionDatatype.FLOAT) {
            return {
                parameterType: "FLOAT",
                inputProps: {
                    parameterName: `Default Value for ${actionParameterDefinition?.ParameterName}`,
                    value: defaultActionParameterInstance?.ParameterValue,
                    onChange: (newValue: string) => updateDefaultActionParameterInstance({
                                ParameterValue: newValue
                            })
                }
            } as FloatParameterInput
        } else if(actionParameterDefinition?.Datatype === ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST) {
            const addtionalConfig = actionParameterDefinitionAdditionalConfig as (undefined | ActionParameterColumnAdditionalConfig)
            const tableFilters = addtionalConfig?.availableTablesFilter || []
            const uniqueTableFilters = getUniqueFilters(tableFilters)
            
            return {
                parameterType: "COLUMN_LIST",
                parameterId: actionParameterDefinition?.Id,
                inputProps: {
                    parameterName: actionParameterDefinition?.DisplayName || actionParameterDefinition?.ParameterName || "parameterName",
                    onChange: (newColumns?: ColumnProperties[]) => {
                        const names = newColumns?.map(column => column.UniqueName) || []
                        console.log(names)
                        updateDefaultActionParameterInstance({
                            ParameterValue: names.join(',')
                        })
                    },
                    selectedColumnFiltersWithNameOnly: defaultActionParameterInstance?.ParameterValue?.split(',')?.map(name => {
                        return { UniqueName: name }
                    }) || [],
                    filters: {
                        tableFilters: uniqueTableFilters,
                        parameterDefinitionId: actionParameterDefinition?.Id
                    }
                }
            } as ColumnListParameterInput
        } else {
            return {parameterType: undefined}
        }
    }

    return <ParameterInput {...getParameterInputProps()}/>
}

export type DefaultValueInputFromAllParametersProps = {
    activeParameterDefinitionId?: string
    parameterDefinitions: ActionParameterDefinition[],
    parameterAdditionalConfigs?: ActionParameterAdditionalConfig[],
    onDefaultValueChange: (newDefaultValue: string) => void
}

export const DefaultValueInputFromAllParameters = (props: DefaultValueInputFromAllParametersProps) => {
    const activeParameterDefinition = props?.parameterDefinitions?.find?.(param => param?.Id === props?.activeParameterDefinitionId)
    const activeAdditionalConfig = props?.parameterAdditionalConfigs?.find?.(addConf => addConf?.parameterDefinitionId === activeParameterDefinition?.Id)

    if(!!activeParameterDefinition) {
        return <DefaultValueInput
                actionParameterDefinition={activeParameterDefinition}
                actionParameterDefinitionAdditionalConfig={activeAdditionalConfig}
                onDefaultValueChange={props.onDefaultValueChange}
            />
    } else {
        return <>Loading</>
    }
    
}

export default DefaultValueInput;