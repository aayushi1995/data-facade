import { ActionParameterDefinition, ActionParameterInstance, ColumnProperties, TableProperties } from "@/generated/entities/Entities";
import ActionParameterDefinitionDatatype from "@/helpers/enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "@/helpers/enums/ActionParameterDefinitionTag";
import ParameterInput, { ActionParameterAdditionalConfig, ActionParameterColumnAdditionalConfig, ActionParameterTableAdditionalConfig, ColumnListParameterInput, ColumnParameterInput, ParameterInputProps, SlackChannelMultipleInput, SlackChannelSingleInput, StringParameterInput, TableParameterInput, WebAppAutocompleteOption } from "./ParameterInput";




interface ParameterDefinitionsConfigPlaneProps {
    parameterDefinitions: ActionParameterDefinition[],
    parameterInstances: ActionParameterInstance[],
    parameterAdditionalConfigs?: ActionParameterAdditionalConfig[],
    handleChange: (parameterInstances: ActionParameterInstance[]) => void,
    onParameterClick?: (parameterDefinitionId: string) => void,
    parentExecutionId?: string,
    fromWebAppDefaultValue?: boolean,
    upstreamWebAppActions?: string[]
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
        const sortedByIndex = props.parameterDefinitions.sort((p1, p2) => ((p1?.Index||0) > (p2?.Index||1)) ? 1 : -1)
        const tableParameters: ActionParameterDefinition[] = []
        const columnParameters: ActionParameterDefinition[] = []
        const restParameters: ActionParameterDefinition[] = []

        sortedByIndex.forEach(parameter => {
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

        if(parameterDefinition.Tag === ActionParameterDefinitionTag.DATA || 
            parameterDefinition.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME ||
            parameterDefinition.Tag === ActionParameterDefinitionTag.TABLE_NAME) {
            const addtionalConfig = parameterAdditionalConfig as (undefined | ActionParameterTableAdditionalConfig)
            if(props.fromWebAppDefaultValue) {
                return {
                    parameterType: "UPSTREAM_ACTION_WEB_APP",
                    parameterId: parameterDefinition.Id,
                    inputProps: {
                        parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
                        selectedAction: existingParameterInstance?.SourceExecutionId || "",
                        upstreamActions: props.upstreamWebAppActions || [],
                        selectedTableFilter: {Id: existingParameterInstance?.TableId, UniqueName: existingParameterInstance?.ParameterValue},
                        availableTableFilter: addtionalConfig?.availableTablesFilter || {},
                        onChange: (selectedOption: WebAppAutocompleteOption) => {
                            if(selectedOption?.type==="UpstreamAction") {
                                onParameterValueChange({
                                    ...existingParameterInstance,
                                    SourceExecutionId: selectedOption.value
                                })
                            } else if(selectedOption?.type==="TableProperties") {
                                onParameterValueChange({
                                    ...existingParameterInstance,
                                    ParameterValue: selectedOption?.value?.UniqueName,
                                    TableId: selectedOption?.value?.Id,
                                    ProviderInstanceId: selectedOption?.value?.ProviderInstanceID
                                })
                            } else {
                                onParameterValueChange({
                                    ...existingParameterInstance,
                                    ParameterValue: undefined,
                                    TableId: undefined,
                                    ProviderInstanceId: undefined,
                                    SourceExecutionId: undefined
                                })
                            }
                        }
                    }
                }
            }
            return {
                parameterType: "TABLE",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
                    onChange: (selectedTable?: TableProperties) => {
                        const newParameterInstance: ActionParameterInstance = {
                            TableId: selectedTable?.Id,
                            ParameterValue: selectedTable?.SchemaName !== undefined ? selectedTable?.SchemaName + "." + selectedTable?.UniqueName : selectedTable?.UniqueName,
                            ActionParameterDefinitionId: parameterDefinition.Id,
                            ProviderInstanceId: selectedTable?.ProviderInstanceID
                        }
                        // If selectedTable type is upstream, then set the source execution id.
                        if (selectedTable?.TableType === "UpstreamExecution") {
                            newParameterInstance.SourceExecutionId = props.parentExecutionId
                        }
                        onParameterValueChange(newParameterInstance)
                    },
                    selectedTableFilter: {Id: existingParameterInstance?.TableId, UniqueName: existingParameterInstance?.ParameterValue },
                    availableTablesFilter: addtionalConfig?.availableTablesFilter,
                    parameterDefinitionId: parameterDefinition.Id,
                    parentExecutionId: props.parentExecutionId,
                }
            } as TableParameterInput
        } else if(parameterDefinition.Tag === ActionParameterDefinitionTag.COLUMN_NAME) {
            const addtionalConfig = parameterAdditionalConfig as (undefined | ActionParameterColumnAdditionalConfig)
            const tableFilters = addtionalConfig?.availableTablesFilter !== undefined 
                ? addtionalConfig?.availableTablesFilter 
                : props.parameterInstances.filter(api => api.TableId!==undefined || api.ParameterValue !==undefined).map(api => ({Id: api.TableId, UniqueName: api.ParameterValue} as TableProperties))
            
            const availableExecutionIds = props.parameterInstances.filter(api => api.SourceExecutionId !== undefined)?.map(api => (api.SourceExecutionId)) || []
            const uniqueTableFilters = getUniqueFilters(tableFilters)
            return {
                parameterType: "COLUMN",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    parameterName: parameterDefinition.DisplayName || parameterDefinition.ParameterName || "parameterName",
                    selectedColumnFilter: {Id: existingParameterInstance?.ColumnId, UniqueName: existingParameterInstance?.ParameterValue },
                    filters: {
                        availableExecutionIds: availableExecutionIds,
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
        } else if(parameterDefinition.Tag === ActionParameterDefinitionTag.SLACK_CHANNEL_SINGLE) {
            const allOptions = parameterDefinition.OptionSetValues?.split(',')
            return {
                parameterType: "SLACK_CHANNEL_SINGLE",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    selectedChannelID: existingParameterValue,
                    onSelectedChannelIdChange: (selectedChannelId) => onParameterValueChange({
                        ActionParameterDefinitionId: parameterDefinition.Id,
                        ParameterValue: selectedChannelId
                    }),
                    parameterName: parameterDefinition.ParameterName || "Parameter Name NA"
                }
            } as SlackChannelSingleInput

        } else if(parameterDefinition.Tag === ActionParameterDefinitionTag.SLACK_CHANNEL_MULTIPLE) {
            const allOptions = parameterDefinition.OptionSetValues?.split(',')
            return {
                parameterType: "SLACK_CHANNEL_MULTIPLE",
                parameterId: parameterDefinition.Id,
                inputProps: {
                    selectedChannelIDs: existingParameterValue,
                    onSelectedChannelIdsChange: (selectedChannelId) => onParameterValueChange({
                        ActionParameterDefinitionId: parameterDefinition.Id,
                        ParameterValue: selectedChannelId?.join(','),
                    }),
                    parameterName: parameterDefinition.ParameterName || "Parameter Name NA"
                }
            } as SlackChannelMultipleInput

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
                            ParameterValue: newOption?.length === 0 ? undefined : newValue,
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
            const availableExecutionIds = props.parameterInstances.filter(api => api.SourceExecutionId !== undefined)?.map(api => (api.SourceExecutionId)) || []
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
                    selectedColumnFiltersWithNameOnly: existingParameterValue?.split(',')?.map(name => {
                        return {UniqueName: name}
                    }) || [],
                    filters: {
                        tableFilters: uniqueTableFilters,
                        parameterDefinitionId: parameterDefinition?.Id!,
                        availableExecutionIds: availableExecutionIds
                    }
                }
            } as ColumnListParameterInput
        } else {
            return {
                parameterType: undefined,
                parameterId: parameterDefinition.Id,
            }
        }
    })


    const onParameterSelectClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, parameter: ParameterInputProps) => {
        props.onParameterClick?.(parameter?.parameterId!)
        event.stopPropagation()
    }

    return (
        <div style={{display: 'flex', width: '100%', height: '100%', flexDirection: 'column', gap: 2}}>
            {parameterDefinitions.length === 0 && 
                <div  style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <span> No Parameters Present</span>
                </div>
            }
            {parameterDefinitions.map((parameter) => {
                return (
                        <div style={{height: '100%', width: '100%'}}
                            onClick={(event) => onParameterSelectClick(event, parameter)}>
                            <ParameterInput {...parameter}/>
                        </div>
                )
            })}
        </div>
    )
}

export const getUniqueFilters = (tableFilters: TableProperties[]) => {
    let tableIds: {[Id: string]: TableProperties} = {}
    const uniqueTableFilters: TableProperties[] = []
    tableFilters.forEach(table => {
        if(tableIds[table.Id || table.UniqueName!] === undefined) {
            tableIds[table.Id || table.UniqueName!] = table
            uniqueTableFilters.push(table)
        }
    })
    return uniqueTableFilters
}

export default ParameterDefinitionsConfigPlane
