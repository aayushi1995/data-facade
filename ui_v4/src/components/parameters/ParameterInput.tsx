
import { ColumnProperties, TableProperties } from "@/generated/entities/Entities"
import { FilteredColumnsResponse } from "@/generated/interfaces/Interfaces"
import useFetchColumnsForTableAndTags from "@/hooks/useFetchColumnsForTableAndTags"
import useSlackChannelInput from "@/hooks/useSlackChannelInput"
import useTables from "@/hooks/useTables"
import { Input, Select } from "antd"
import React, { ChangeEvent } from "react"
import styled from 'styled-components'

const StyledSelect = styled(Select)`
    width: 100%;
    min-width: 150px;
    max-width: 300px;
    border: 1px solid #D1D5DB;
    display:flex;
    align-items: center;
`
const StyledInput = styled(Input)`
    width:100%;
    min-width: 150px;
    max-width: 300px;
`



export type UpstreamAction = {stageId: string, stageName: string, actionName: string, actionId: string, actionIndex: number}

export interface StringParameterInput {
    parameterType: "STRING",
    parameterId?: string
    inputProps: {
        parameterName: string,
        value: string | undefined,
        onChange: Function
    }
}

export interface IntParameterInput {
    parameterType: "INT",
    parameterId?: string
    inputProps: {
        parameterName: string,
        value: string | undefined,
        onChange: Function
    }
}

export interface FloatParameterInput {
    parameterType: "FLOAT",
    parameterId?: string
    inputProps: {
        parameterName: string,
        value: string | undefined,
        onChange: Function
    }
}

export interface BooleanParameterInput {
    parameterType: "BOOLEAN",
    parameterId?: string
    inputProps: {
        parameterName: string,
        value: string | undefined,
        onChange: Function
    }
}

export interface TableParameterInput {
    parameterType: "TABLE",
    parameterId?: string
    inputProps: {
        parameterName: string,
        selectedTableFilter: TableProperties | undefined,
        availableTablesFilter: TableProperties | undefined,
        onChange: (newTable?: TableProperties) => void,
        parameterDefinitionId?: string,
        parentExecutionId?: string
    }
}

export interface ColumnParameterInput {
    parameterType: "COLUMN",
    parameterId?: string
    inputProps: {
        parameterName: string,
        selectedColumnFilter: ColumnProperties | undefined,
        filters: {
            tableFilters: TableProperties[] | undefined,
            parameterDefinitionId: string,
            availableExecutionIds: string[]
        },
        onChange: (newColumn?: ColumnProperties) => void
    }
}

export interface ColumnListParameterInput {
    parameterType: "COLUMN_LIST",
    parameterId?: string
    inputProps: {
        parameterName: string,
        selectedColumnFiltersWithNameOnly: ColumnProperties[] | undefined,
        filters: {
            tableFilters: TableProperties[] | undefined,
            parameterDefinitionId: string,
            availableExecutionIds: string[]
        },
        onChange?: (newColumnList?: ColumnProperties[]) => void
    }
}

export interface OptionSetStringParameterInput {
    parameterType: "OPTION_SET_SINGLE",
    parameterId?: string
    inputProps: {
        parameterName: string,
        availableOptions: { name: string }[],
        selectedOptions?: { name: string },
        onChange: (newOptions?: { name: string }) => void
    }
}

export interface OptionSetMultipleParameterInput {
    parameterType: "OPTION_SET_MULTIPLE",
    parameterId?: string
    inputProps: {
        parameterName: string,
        availableOptions: { name: string }[],
        selectedOptions?: { name: string }[],
        onChange: (newOptions?: { name: string }[]) => void
    }
}

export interface NAInput {
    parameterType: undefined
    parameterId?: string
}

export interface UpstreamActionWebAppInput {
    parameterType: "UPSTREAM_ACTION_WEB_APP",
    parameterId?: string,
    inputProps: {
        parameterName: string,
        upstreamActions: string[],
        selectedAction: string,
        selectedTableFilter: TableProperties,
        availableTableFilter: TableProperties,
        onChange: Function
    }
}

export interface SlackChannelSingleInput {
    parameterType: "SLACK_CHANNEL_SINGLE",
    parameterId?: string,
    inputProps: {
        selectedChannelID?: string,
        onSelectedChannelIdChange?: (selectedChannelId?: string) => void,
        parameterName: string
    }
}

export interface SlackChannelMultipleInput {
    parameterType: "SLACK_CHANNEL_MULTIPLE",
    parameterId?: string,
    inputProps: {
        selectedChannelIDs?: string[],
        onSelectedChannelIdsChange?: (selectedChannelId?: string[]) => void,
        parameterName: string
    }
}

export type ParameterInputProps = StringParameterInput
    | IntParameterInput
    | FloatParameterInput
    | BooleanParameterInput
    | NAInput
    | TableParameterInput
    | ColumnParameterInput
    | ColumnListParameterInput
    | OptionSetStringParameterInput
    | OptionSetMultipleParameterInput
    | UpstreamActionWebAppInput
    | SlackChannelSingleInput
    | SlackChannelMultipleInput


export type ActionParameterColumnAdditionalConfig = {
    type: "Column",
    parameterDefinitionId?: string,
    availableTablesFilter?: TableProperties[]
}

export type ActionParameterTableAdditionalConfig = {
    type: "Table",
    parameterDefinitionId?: string,
    availableTablesFilter?: TableProperties[]
}

export type ActionParameterAdditionalConfig = ActionParameterTableAdditionalConfig | ActionParameterColumnAdditionalConfig


const getParameterInputField = (props: ParameterInputProps) => {
    switch (props?.parameterType) {
        case "STRING": return <StringInput {...props} />
        case "BOOLEAN": return <BooleanInput {...props} />
        case "FLOAT": return <FloatInput {...props} />
        case "INT": return <IntInput {...props} />
        case "TABLE": return <TableInput {...props} />
        case "COLUMN": return <ColumnInput {...props} />
        case "COLUMN_LIST": return <ColumnListInput {...props} />
        case "OPTION_SET_SINGLE": return <OptionSetSingleInput {...props} />
        case "OPTION_SET_MULTIPLE": return <OptionSetMultipleInput {...props} />
        case "SLACK_CHANNEL_SINGLE": return <SlackChannelSingle {...props} />
        case "SLACK_CHANNEL_MULTIPLE": return <SlackChannelMultiple {...props} />
        default: return <NoInput />
    }
}
type WebAppUpstreamActionOption = {
    type: 'UpstreamAction',
    value: string
}
type WebAppTableOption = {
    type: 'TableProperties',
    value: TableProperties
}

export type WebAppAutocompleteOption = WebAppTableOption | WebAppUpstreamActionOption



const OptionSetMultipleInput = (props: OptionSetMultipleParameterInput) => {
    const { parameterName, availableOptions, selectedOptions, onChange } = props.inputProps

    return (
        <StyledSelect
            mode="multiple"
            placeholder={parameterName}
            value={selectedOptions?.map(option => option.name)}
            onChange={(value:any) => {
                onChange(value?.map((option:any) => ({name: option})))
            } 
        }
        >
            {availableOptions.map(value => <Select.Option key={value?.name} value={value?.name}>
                {value?.name}
            </Select.Option>)}
        </StyledSelect>
    )
}

const OptionSetSingleInput = (props: OptionSetStringParameterInput) => {
    const { parameterName, availableOptions, selectedOptions, onChange } = props.inputProps
    return (
        <StyledSelect
            placeholder={parameterName}
            value={availableOptions.find(option => option.name === selectedOptions?.name)?.name}
            onChange={(value: unknown) => {
                onChange(value ? {name: value as string} : undefined)
            }
            }
        >
            {availableOptions.map(value => <Select.Option key={value?.name} value={value?.name}>
                {value?.name}
            </Select.Option>)}
        </StyledSelect>
    )
}

export const SlackChannelSingle = (props: SlackChannelSingleInput) => {
    const { selectedChannelID, onSelectedChannelIdChange } = props?.inputProps
    const { selectedChannels, avialableChannels, onSelectedChannelChange } = useSlackChannelInput({
        selectedChannelIds: [selectedChannelID],
        onSelectedIDChange(selectedChannelIds: (string | undefined)[]) {
            onSelectedChannelIdChange?.(selectedChannelIds?.[0])
        },
    })

    return (
        <StyledSelect
            placeholder={props?.inputProps?.parameterName}
            value={selectedChannels?.[0] || null}
            onChange={(value) => {
                onSelectedChannelChange(!!value ? [value] : undefined)
            }}
        >
            {avialableChannels.map(value => <Select.Option key={value.Id} value={value.Id}>
                {value?.Name}
            </Select.Option>)}
        </StyledSelect>
    )
}


const SlackChannelMultiple = (props: SlackChannelMultipleInput) => {
    const { selectedChannelIDs, onSelectedChannelIdsChange } = props?.inputProps
    const { selectedChannels, avialableChannels, onSelectedChannelChange } = useSlackChannelInput({
        selectedChannelIds: selectedChannelIDs,
        onSelectedIDChange(selectedChannelIds: string[] | undefined) {
            onSelectedChannelIdsChange?.(selectedChannelIds)
        },
    })

    return (
        <StyledSelect
            placeholder={props?.inputProps?.parameterName}
            value={selectedChannels || null}
            mode="multiple"
            onChange={(value:any) => {
                onSelectedChannelChange(!!value ? value : undefined)
            }}
        >
            {avialableChannels.map(value => <Select.Option key={value.Id} value={value.Id}>
                {value?.Name}
            </Select.Option>)}
        </StyledSelect>
    )
}

const ColumnListInput = (props: ColumnListParameterInput) => {
    const { parameterName, selectedColumnFiltersWithNameOnly, filters, onChange } = props.inputProps
    const fetchColumnsQuery = useFetchColumnsForTableAndTags({
        filters: {
            tableFilters: filters.tableFilters,
            parameterDefinitionId: filters.parameterDefinitionId,
            availableExecutionIds: filters.availableExecutionIds
        }
    })
    const allColumns = fetchColumnsQuery?.data?.[0]?.Columns

    const getAutoCompleteValue = () => {
        const columnNameFrequencyMap = selectedColumnFiltersWithNameOnly?.reduce((oldMap: { [key: string]: number }, column: ColumnProperties) => {
            const columnName: string = column?.UniqueName || "NA"
            if (columnName in oldMap) {
                oldMap[columnName] += 1
            } else {
                oldMap[columnName] = 1
            }
            return oldMap
        }, {}) || {}

        const selectedColumns = Object.entries(columnNameFrequencyMap).flatMap(([columnName, freq]) => {
            return allColumns?.filter((col: any) => col?.UniqueName === columnName).slice(0, freq) || []
        })

        return selectedColumns
    }

    React.useEffect(() => {
        if (fetchColumnsQuery?.data?.[0]?.FilteredBasedOnTags) {
            // TODO: Disabling auto-fill of columns
            // onChange?.(fetchTableQuery.data?.[0]?.Columns)
        }
    }, [fetchColumnsQuery.data])

    return (
        <StyledSelect
            placeholder={parameterName}
            showSearch
            mode="multiple"
            maxTagCount={2}
            style={{ width: '100%' }}
            value={getAutoCompleteValue()?.map(column => column.UniqueName)}
            onChange={(value: any) => {
                const columns = value?.map?.((selectedColumnName:any) => fetchColumnsQuery?.data?.[0]?.Columns?.find(cData => cData.UniqueName === selectedColumnName)!)
                onChange?.(columns ?? undefined)
            }}
        >

            {
                fetchColumnsQuery.data && fetchColumnsQuery.data?.[0] && fetchColumnsQuery.data?.[0]?.Columns && fetchColumnsQuery.data?.[0]?.Columns.map((value: ColumnProperties) =>
                    <Select.Option key={value.Id} style={{width:'100%'}} value={value.UniqueName}>
                        {value.UniqueName}
                    </Select.Option>)
            }


        </StyledSelect>
    )
}

const ColumnInput = (props: ColumnParameterInput) => {
    const { parameterName, selectedColumnFilter, filters, onChange } = props.inputProps
    const [availableColumnsState, setAvailableColumns] = React.useState<ColumnProperties[] | undefined>()
    const [columnsFetched, setColumnsFetched] = React.useState(false)
    const fetchTableQuery = useFetchColumnsForTableAndTags({
        filters: {
            tableFilters: filters.tableFilters,
            parameterDefinitionId: filters.parameterDefinitionId,
            availableExecutionIds: filters.availableExecutionIds
        },
        queryOptions: {
            enabled: filters?.tableFilters !== undefined,
            onSuccess: (data: FilteredColumnsResponse[]) => {
                setAvailableColumns(data?.[0]?.Columns || [])
                setColumnsFetched(true)
            }
        }
    })

    const getColumnSelectionInfo: (availableColumns?: ColumnProperties[], selectedColumnFilter?: ColumnProperties) => { AvailableColumns: ColumnProperties[], SelectedColumn?: ColumnProperties } = (availableColumns?: ColumnProperties[], selectedColumnFilter?: ColumnProperties) => {
        const columnById = availableColumns?.find(column => column?.Id === selectedColumnFilter?.Id && !!selectedColumnFilter?.Id)
        const columnByName = availableColumns?.find(column => column?.UniqueName === selectedColumnFilter?.UniqueName)
        if (columnById !== undefined) {
            return {
                AvailableColumns: availableColumns || [],
                SelectedColumn: columnById
            }
        } else if (columnByName !== undefined) {
            return {
                AvailableColumns: availableColumns || [],
                SelectedColumn: columnByName
            }
        } else if (selectedColumnFilter?.UniqueName !== undefined && selectedColumnFilter?.UniqueName?.length > 0) {
            const selectedTable: ColumnProperties = { UniqueName: selectedColumnFilter?.UniqueName }
            setAvailableColumns([...(availableColumns || []), selectedTable])
            return {
                AvailableColumns: [...(availableColumns || []), selectedTable],
                SelectedColumn: selectedTable
            }
        } else {
            return {
                AvailableColumns: availableColumns || [],
                SelectedColumn: undefined
            }
        }
    }

    const { AvailableColumns, SelectedColumn } = getColumnSelectionInfo(availableColumnsState, selectedColumnFilter)
    React.useEffect(() => {
        if (columnsFetched) {
            if (SelectedColumn !== undefined && SelectedColumn !== selectedColumnFilter) {
                onChange(SelectedColumn)
            }
        }
    }, [availableColumnsState])

    return (
        <StyledSelect
            placeholder={parameterName}
            showSearch
            optionFilterProp="children"
            loading={fetchTableQuery.isLoading || fetchTableQuery.isRefetching}
            onChange={(value:any) => {
                if (value?.Id === "NA") {
                    const column = { UniqueName: value?.UniqueName?.substring(0, value?.UniqueName?.length - 21) }
                    onChange(column)
                } else {
                    const selectedColumn = AvailableColumns.find(col => col.Id === value)
                    onChange(!!selectedColumn ? selectedColumn : undefined)
                }
            }}
        >
            {AvailableColumns.map(value => <Select.Option key={value.Id} value={value.Id}>
                {value.UniqueName}
            </Select.Option>)}
        </StyledSelect>
    )
}

type TableOption = {
    value: TableProperties,
    type: "TableProperties"
}
type UpstreamActionOption = {
    value: UpstreamAction,
    type: "UpstreamAction"
}
export type AutoCompleteOption = TableOption | UpstreamActionOption



const StringInput = (props: StringParameterInput) => {
    const { value, parameterName, onChange } = props.inputProps
    const [input, setInput] = React.useState<string | undefined>()
    React.useEffect(() => {
        setInput(value)
    }, [value])
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    return <StyledInput style={{ width: '100%' }} value={input} onChange={handleChange} onBlur={() => onChange(input)}
        onKeyDown={(event) => event.stopPropagation()}
        placeholder={parameterName || 'N/a'} />
}

const IntInput = (props: IntParameterInput) => {
    const { value, parameterName, onChange } = props.inputProps

    const [input, setInput] = React.useState<string | undefined>()
    React.useEffect(() => {
        setInput(value)
    }, [value])

    const onValueChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const parameterValue = event.target.value
        if (parameterValue.match(/^-?\d+$/)) {
            setInput(parameterValue)
        } else if (parameterValue === "") {
            setInput(undefined)
        }
    }

    return <StyledInput value={input} onChange={onValueChange} onBlur={() => onChange(input)}
        onKeyDown={(event) => event.stopPropagation()}
        placeholder={parameterName || 'N/a'} />
}

const FloatInput = (props: FloatParameterInput) => {
    const { value, parameterName, onChange } = props.inputProps

    const [input, setInput] = React.useState<string | undefined>()
    React.useEffect(() => {
        setInput(value)
    }, [value])

    const isNumber = (str: string): boolean => {
        if (typeof str !== "string") return false;

        return !isNaN(Number(str));
    };

    const onValueChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const parameterValue = event.target.value
        if (isNumber(parameterValue)) {
            setInput(parameterValue)
        } else if (parameterValue === "") {
            setInput(undefined)
        }
    }

    return <StyledInput value={input} onChange={onValueChange} onBlur={() => onChange(input)}
        onKeyDown={(event) => event.stopPropagation()}
        placeholder={parameterName || 'N/a'}
    />
}

const BooleanInput = (props: BooleanParameterInput) => {
    const { value, onChange } = props.inputProps

    return (
            <StyledSelect
                value={value || ""}
                onChange={(value) => onChange(value)}
                placeholder={props.inputProps.parameterName || "Parameter Name NA"}
            >
                <Select.Option value="true">True</Select.Option>
                <Select.Option value="false">False</Select.Option>
            </StyledSelect>
    )
}

const TableInput = (props: TableParameterInput) => {

    const { selectedTableFilter, onChange, parameterDefinitionId } = props.inputProps
    const getTableSelectionInfo: (availableTables?: TableProperties[], selectedTableFilter?: TableProperties) => { AvailableTables: TableProperties[], SelectedTable?: TableProperties } = (availableTables?: TableProperties[], selectedTableFilter?: TableProperties) => {
        const tableById = availableTables?.find(table => table?.Id === selectedTableFilter?.Id)
        const tableByName = availableTables?.find(table => table?.UniqueName === selectedTableFilter?.UniqueName)
        if (!!props.inputProps.parentExecutionId) {
          
            const upstreamTable: TableProperties = {
                UniqueName: "Previous Execution",
                Id: props.inputProps.parentExecutionId,
                ProviderInstanceName: "Upstream Action",
                TableType: "UpstreamExecution",
                DisplayName:"Previous Execution"
            }
            if (!availableTables?.find(table => table.Id === props.inputProps.parentExecutionId)) {
                (availableTables || []).push(upstreamTable)
            }
            if (selectedTableFilter?.Id === props.inputProps.parentExecutionId) {
                return {
                    AvailableTables: availableTables || [],
                    SelectedTable: upstreamTable
                }
            }
        }

        if (tableById !== undefined) {
            return {
                AvailableTables: availableTables || [],
                SelectedTable: tableById
            }
        } else if (tableByName !== undefined) {
            return {
                AvailableTables: availableTables || [],
                SelectedTable: tableByName
            }
        } else if (selectedTableFilter?.UniqueName !== undefined) {
            const selectedTable: TableProperties = { UniqueName: selectedTableFilter?.UniqueName, ProviderInstanceName: "Default Provider" }
            return {
                AvailableTables: [...(availableTables || []), selectedTable],
                SelectedTable: selectedTable
            }
        } else {
            return {
                AvailableTables: availableTables || [],
                SelectedTable: undefined
            }
        }

    }

    const handleTablesReceived = (tables: TableProperties[]) => {
        if (!!tables) {
            const { SelectedTable } = getTableSelectionInfo(tables, selectedTableFilter)
            if (selectedTableFilter !== undefined) {
                if (SelectedTable !== undefined) {
                    onChange(SelectedTable)
                }
            }
        }
    }



    const { tables, loading } = useTables({ tableFilter: props?.inputProps?.availableTablesFilter || {}, filterForParameterTags: true, parameterId: parameterDefinitionId, handleOnSucces: handleTablesReceived })
    const { SelectedTable, AvailableTables } = getTableSelectionInfo(tables, selectedTableFilter)

    return (
       
        <StyledSelect loading={loading} placeholder="Table name"
            showSearch
            optionFilterProp="children"
            defaultValue={SelectedTable?.Id}
            onChange={(value:any) => {
                if (value === "NA") {
                    const table = { UniqueName: value?.UniqueName?.substring(0, value?.UniqueName?.length - 21) }
                    onChange(table)
                } else {
                    const table = AvailableTables?.find(table => table.Id === value)
                    onChange(!!value ? { ...table } : undefined)
                }
                value = { SelectedTable }

            }}
        >
            {
                tables?.map((value, index) => <Select.Option key={index} value={value.Id}>
                    {value.DisplayName}
                </Select.Option>)
            }
        </StyledSelect>

    )
}


const NoInput = () => {
    return (
        <StyledInput disabled value="Default Value not valid for this type of parameter" />
    )
}

export default getParameterInputField;