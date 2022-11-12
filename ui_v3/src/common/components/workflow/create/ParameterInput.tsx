import { Autocomplete, Box, createFilterOptions, FormControl, Icon, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import React, { ChangeEvent } from "react"
import InfoIcon from "../../../../../src/images/info.svg"
import { ColumnProperties, TableProperties } from "../../../../generated/entities/Entities"
import { FilteredColumnsResponse } from "../../../../generated/interfaces/Interfaces"
import { UpstreamAction } from "../../../../pages/applications/workflow/WorkflowContext"
import useTables from "../../../../pages/build_action/hooks/useTables"
import LoadingWrapper from "../../LoadingWrapper"
import { HtmlTooltip } from "../../workflow-action/ActionCard"
import useFetchColumnsForTableAndTags from "./hooks/useFetchColumnsForTableAndTags"


export interface UpstreamActionParameterInput {
    parameterType: "UPSTREAM_ACTION",
    parameterId?: string
    inputProps: {
        upstreamActions: UpstreamAction[],
        selectedAction: UpstreamAction,
        selectedTableFilter: TableProperties,
        availableTablesFilter: TableProperties,
        onChange: Function
    }
}

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
        parameterDefinitionId?: string
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
            parameterDefinitionId: string
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
            parameterDefinitionId: string
        },
        onChange?: (newColumnList?: ColumnProperties[]) => void
    }
}

export interface OptionSetStringParameterInput {
    parameterType: "OPTION_SET_SINGLE",
    parameterId?: string
    inputProps: {
        parameterName: string,
        availableOptions: {name: string}[],
        selectedOptions?: {name: string},
        onChange: (newOptions?: {name: string}) => void
    }
}

export interface OptionSetMultipleParameterInput {
    parameterType: "OPTION_SET_MULTIPLE",
    parameterId?: string
    inputProps: {
        parameterName: string,
        availableOptions: {name: string}[],
        selectedOptions?: {name: string}[],
        onChange: (newOptions?: {name: string}[]) => void
    }
}

export interface NAInput {
    parameterType: undefined
    parameterId?: string
}


export type ParameterInputProps = UpstreamActionParameterInput 
                                | StringParameterInput 
                                | IntParameterInput 
                                | FloatParameterInput 
                                | BooleanParameterInput 
                                | NAInput 
                                | TableParameterInput 
                                | ColumnParameterInput 
                                | ColumnListParameterInput 
                                | OptionSetStringParameterInput
                                | OptionSetMultipleParameterInput


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
    switch(props?.parameterType) {
        case "UPSTREAM_ACTION": return <UpstreamActionInput {...props}/>
        case "STRING": return <StringInput {...props}/>
        case "BOOLEAN": return <BooleanInput {...props}/>
        case "FLOAT": return <FloatInput {...props}/>
        case "INT": return <IntInput {...props}/>
        case "TABLE": return <TableInput {...props}/>
        case "COLUMN": return <ColumnInput {...props}/>
        case "COLUMN_LIST": return <ColumnListInput {...props}/>
        case "OPTION_SET_SINGLE": return <OptionSetSingleInput {...props}/>
        case "OPTION_SET_MULTIPLE": return <OptionSetMultipleInput {...props}/>
        default: return <NoInput/>
    }
}

const OptionSetMultipleInput = (props: OptionSetMultipleParameterInput) => {
    const {parameterName, availableOptions, selectedOptions, onChange} = props.inputProps

    return (
        <Autocomplete 
            options={availableOptions}
            multiple
            fullWidth
            getOptionLabel={(option) => option.name}
            value={availableOptions.filter(option => selectedOptions?.find(selected => selected.name === option.name) !== undefined)}
            clearOnBlur
            handleHomeEndKeys
            limitTags={2}
            filterSelectedOptions
            disableCloseOnSelect
            renderInput={(params) => (
                <TextField 
                    {...params}
                    label={parameterName || "Parameter Name NA"}
                    variant="outlined"
                    size="small"
                />
            )}
            onChange={(event, value, reason, details) => {
                    onChange(value ?? undefined)
                } 
            }
        />
    )
}

const OptionSetSingleInput = (props: OptionSetStringParameterInput) => {
    const {parameterName, availableOptions, selectedOptions, onChange} = props.inputProps
    return (
        <Autocomplete 
            options={availableOptions}
            fullWidth
            getOptionLabel={(option) => option.name}
            value={availableOptions.find(option => option.name === selectedOptions?.name)}
            clearOnBlur
            handleHomeEndKeys
            filterSelectedOptions
            renderInput={(params) => (
                <TextField 
                    sx={{py:0}}
                    {...params}
                    label={parameterName || "Parameter Name NA"}
                    variant="outlined"
                    size="small"
                />
            )}
            onChange={(event, value, reason, details) => {
                    onChange(value ?? undefined)
                } 
            }
        />
    )
}

const ColumnListInput = (props: ColumnListParameterInput) => {
    const {parameterName, selectedColumnFiltersWithNameOnly, filters, onChange} = props.inputProps
    const fetchColumnsQuery = useFetchColumnsForTableAndTags({filters: {
        tableFilters: filters.tableFilters,
        parameterDefinitionId: filters.parameterDefinitionId
    }})
    const allColumns = fetchColumnsQuery?.data?.[0]?.Columns

    const getAutoCompleteValue = () => {
        const columnNameFrequencyMap = selectedColumnFiltersWithNameOnly?.reduce((oldMap: {[key: string]: number}, column: ColumnProperties) => {
            const columnName: string = column?.UniqueName || "NA"
            if(columnName in oldMap) {
                oldMap[columnName]+=1
            } else {
                oldMap[columnName]=1
            }
            return oldMap
        }, {}) || {}

        const selectedColumns = Object.entries(columnNameFrequencyMap).flatMap(([columnName, freq]) => {
            return allColumns?.filter(col => col?.UniqueName===columnName).slice(0, freq) || []
        })

        return selectedColumns
    }

    React.useEffect(() => {
        if(fetchColumnsQuery?.data?.[0]?.FilteredBasedOnTags) {
            // TODO: Disabling auto-fill of columns
            // onChange?.(fetchTableQuery.data?.[0]?.Columns)
        }
    }, [fetchColumnsQuery.data])

    return (
        <LoadingWrapper
            {...fetchColumnsQuery}
        >
            <Autocomplete
                options={fetchColumnsQuery.data?.[0]?.Columns || []}
                multiple={true}
                fullWidth
                getOptionLabel={(column: ColumnProperties) => column.UniqueName || "Un-named column"}
                groupBy={(column) => column.TableName || "Table NA"}
                value={getAutoCompleteValue()}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={props.inputProps.parameterName || "Parameter Name NA"}
                        variant="outlined"
                        size="small"
                    />
                )}
                disableCloseOnSelect
                clearOnBlur
                handleHomeEndKeys
                limitTags={2}
                filterSelectedOptions
                onChange={(event, value, reason, details) => {
                    onChange?.(value ?? undefined)
                }}
            ></Autocomplete>
        </LoadingWrapper>
    )
}

const ColumnInput = (props: ColumnParameterInput) => {
    const filter = createFilterOptions<ColumnProperties>()
    const {parameterName, selectedColumnFilter, filters, onChange} = props.inputProps
    const [availableColumnsState, setAvailableColumns] = React.useState<ColumnProperties[]>([])
    const fetchTableQuery = useFetchColumnsForTableAndTags({
        filters: {
            tableFilters: filters.tableFilters,
            parameterDefinitionId: filters.parameterDefinitionId
        },
        queryOptions: {
            enabled: filters?.tableFilters!==undefined,
            onSuccess: (data: FilteredColumnsResponse[]) => setAvailableColumns(data?.[0]?.Columns || [])
        }
    })    
    
    const getColumnSelectionInfo: (availableColumns?: ColumnProperties[], selectedColumnFilter?: ColumnProperties) => { AvailableColumns: ColumnProperties[], SelectedColumn?: ColumnProperties} = (availableColumns?: ColumnProperties[], selectedColumnFilter?: ColumnProperties) => {
        const columnById = availableColumns?.find(column => column?.Id === selectedColumnFilter?.Id)
        const columnByName = availableColumns?.find(column => column?.UniqueName === selectedColumnFilter?.UniqueName)
        if(columnById !== undefined) {
            return {
                AvailableColumns: availableColumns || [], 
                SelectedColumn: columnById
            }
        } else if(columnByName !== undefined) {
            return {
                AvailableColumns: availableColumns || [], 
                SelectedColumn: columnByName
            }
        } else if(selectedColumnFilter?.UniqueName !== undefined && selectedColumnFilter?.UniqueName?.length > 0){
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
        if(SelectedColumn!==undefined && SelectedColumn !== selectedColumnFilter) {
            onChange(SelectedColumn)
        }
    }, [availableColumnsState])
 
    return (
        <LoadingWrapper 
        isLoading={fetchTableQuery.isLoading}
        error={fetchTableQuery.error}
        data={fetchTableQuery.data}
        >
            <Autocomplete
                options={AvailableColumns}
                getOptionLabel={(column: ColumnProperties) => column.UniqueName!}
                groupBy={(column) => column.TableName||"Table NA"}
                value={SelectedColumn}
                filterSelectedOptions
                fullWidth
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                onChange={(event, value, reason, details) => {
                    if(value?.Id === "NA") {
                        const column = { UniqueName: value?.UniqueName?.substring(0, value?.UniqueName?.length - 21)}
                        onChange(column)
                    } else {
                        onChange(!!value ? value : undefined)
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    if (params.inputValue !== '') {
                        filtered.push({ UniqueName: `${params.inputValue} (Not Synced With DF)`, TableName: "NA", Id: "NA" });
                    }
                    return filtered;
                }}
                renderInput={(params) => <TextField {...params} label={props.inputProps.parameterName || "Parameter Name NA"} variant="outlined" size="small"/>}
            />
        </LoadingWrapper>   
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

const UpstreamActionInput = (props: UpstreamActionParameterInput) => {
    const {upstreamActions, selectedAction, selectedTableFilter, availableTablesFilter, onChange} = props.inputProps
    const {tables, loading, error}  = useTables({ tableFilter: availableTablesFilter || {} })
    
    const autoCompleteOptions: AutoCompleteOption[] = [
        ...upstreamActions.map(upstreamAction => ({value: upstreamAction, type: "UpstreamAction"} as AutoCompleteOption)),
        ...(tables?.map(table => ({ value: table, type: "TableProperties" } as AutoCompleteOption)) || [])
    ]
    const formLabel = (upstream: UpstreamAction) => `${upstream.stageName} | ${upstream.actionName} (${upstream.actionIndex+1})`
    const selectedOption = autoCompleteOptions.find(option => (option.type==="TableProperties" && option.value?.Id===selectedTableFilter?.Id) || (option.type==="UpstreamAction" && option.value===selectedAction))
    React.useEffect(() => {
        if(selectedOption===undefined && !!tables) {
            handleOptionSelect(autoCompleteOptions?.[0])
        }
    }, [autoCompleteOptions])

    const handleOptionSelect = (value?: AutoCompleteOption) => {
        onChange(value)
    }
    
    return (
        <LoadingWrapper
        isLoading={loading}
        error={error}
        data={tables}
        >
            <Box sx={{display: 'flex', gap: 1, alignItems: 'center', width: "100%"}}>
                <Autocomplete
                    options={autoCompleteOptions}
                    getOptionLabel={(option: AutoCompleteOption) => option.type==="UpstreamAction" ? formLabel(option.value) : (option.value?.UniqueName || "NA")}
                    groupBy={(option: AutoCompleteOption) => option.type}
                    value={selectedOption}
                    key={props.parameterId}
                    filterSelectedOptions
                    fullWidth
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    onChange={(event, value, reason, details) => {
                        handleOptionSelect(value || undefined)
                    }}
                     renderInput={(params) => <TextField {...params} label={"Select Upstream/Table"} variant="outlined" size="small"/>}
                />
                <HtmlTooltip sx={{display: 'flex', alignItems: 'center'}} title={
                    <React.Fragment>
                        <Box p={1} sx={{display: 'flex', flexDirection: 'column', gap: 1, width: '300px'}}>
                            <Typography sx={{
                                fontStyle: "normal",
                                fontWeight: 700,
                                fontSize: "16px",
                                lineHeight: "175%",
                                letterSpacing: "0.15px",
                                color: "ActionDefinationHeroTextColor1.main"
                            }}>
                                Upstream Action
                            </Typography>
                            <Typography sx={{
                                fontFamily: "'SF Pro Text'",
                                fontStyle: "normal",
                                fontWeight: 400,
                                fontSize: "14px",
                                lineHeight: "143%",
                                letterSpacing: "0.15px",
                                color: "rgba(66, 82, 110, 0.86)"
                            }}>
    When ‘user input’ is selected as ‘No’, then the user shall be required to select the output of any of the upstream actions which returns a table.  DF will provide the user with an array of appropriate upstream actions to choose from. 
                            </Typography>
                        </Box>
                    </React.Fragment>
                }>
                    <Icon sx={{display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                        <img src={InfoIcon} />
                    </Icon>
                </HtmlTooltip>
            </Box>
        </LoadingWrapper>
    )
}

const StringInput = (props: StringParameterInput) => {
    const {value, parameterName, onChange} = props.inputProps
    const [input, setInput] = React.useState<string|undefined>()
    React.useEffect(() => {
        setInput(value)
    }, [value])
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
      };
    return <TextField
                defaultValue={input}
                // onChange={handleChange}
                onBlur={() => onChange(input)}
                variant="outlined"
                size="small"
                label={props.inputProps.parameterName || "Parameter Name NA"}
                // placeholder={props.inputProps.parameterName || "Parameter Name NA"}
                fullWidth
            />
}

const IntInput = (props: IntParameterInput) => {
    const {value, parameterName, onChange} = props.inputProps
    
    const [input, setInput] = React.useState<string|undefined>()
    React.useEffect(() => {
        setInput(value)
    }, [value])

    const onValueChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const parameterValue = event.target.value
        if (parameterValue.match(/^-?\d+$/)) {
            setInput(parameterValue)
        } else if(parameterValue==="") {
            setInput(undefined)
        }
    }

    return <TextField
            value={input}
            onChange={onValueChange}
            onBlur={() => onChange(input)}
            label={props.inputProps.parameterName || "Parameter Name NA"}
            fullWidth
            variant="outlined"
            size="small"
        />
}

const FloatInput = (props: FloatParameterInput) => {
    const {value, parameterName, onChange} = props.inputProps
    
    const [input, setInput] = React.useState<string|undefined>()
    React.useEffect(() => {
        setInput(value)
    }, [value])
    
    const isNumber = (str: string): boolean => {
        if (typeof str != "string") return false // we only process strings!
        // could also coerce to string: str = ""+str
        // TODO: fix this type error
        return !isNaN(str)
    }
    
    const onValueChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const parameterValue = event.target.value
        if (isNumber(parameterValue)) {
            setInput(parameterValue)
        } else if(parameterValue==="") {
            setInput(undefined)
        }
    }

    return <TextField
            value={input}
            onChange={onValueChange}
            onBlur={() => onChange(input)}
            label={props.inputProps.parameterName || "Parameter Name NA"}
            fullWidth
            variant="outlined"
            size="small"
        />
}

const BooleanInput = (props: BooleanParameterInput) => {
    const {value, parameterName, onChange} = props.inputProps
    
    return (
        <FormControl size="small" variant="outlined" style={{ width: "100%" }}>
        <InputLabel>{props.inputProps.parameterName || "Parameter Name NA"}</InputLabel>
        <Select
            value={value || ""}
            onChange={(event) => onChange(event.target.value)}
            variant="outlined"
            size="small"
            label={props.inputProps.parameterName || "Parameter Name NA"}
            fullWidth
        >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
        </Select>
    </FormControl>
    )
}

const TableInput = (props: TableParameterInput) => {
    const filter = createFilterOptions<TableProperties>()
    // TODO: Instead of selected table name, get selected table id
    const {parameterName, selectedTableFilter, onChange, parameterDefinitionId} = props.inputProps
    const getTableSelectionInfo: (availableTables?: TableProperties[], selectedTableFilter?: TableProperties) => { AvailableTables: TableProperties[], SelectedTable?: TableProperties} = (availableTables?: TableProperties[], selectedTableFilter?: TableProperties) => {
        const tableById = availableTables?.find(table => table?.Id === selectedTableFilter?.Id)
        const tableByName = availableTables?.find(table => table?.UniqueName === selectedTableFilter?.UniqueName)

        if(tableById !== undefined) {
            return {
                AvailableTables: availableTables || [], 
                SelectedTable: tableById
            }
        } else if(tableByName !== undefined) {
            return {
                AvailableTables: availableTables || [], 
                SelectedTable: tableByName
            }
        } else if(selectedTableFilter?.UniqueName !== undefined){
            const selectedTable: TableProperties = { UniqueName: selectedTableFilter?.UniqueName, ProviderInstanceName: "Default Provider"}
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
        if(!!tables) {
            if(selectedTableFilter !== undefined) {
                if(SelectedTable !== undefined) {
                    onChange(SelectedTable)
                }
            }
        }
    }

    const {tables, loading, error}  = useTables({tableFilter: props?.inputProps?.availableTablesFilter || {}, filterForParameterTags: true, parameterId: parameterDefinitionId, handleOnSucces: handleTablesReceived})
    const { AvailableTables, SelectedTable } = getTableSelectionInfo(tables, selectedTableFilter)
    
    return (
        <LoadingWrapper
            isLoading={loading}
            error={error}
            data={tables}
        >
            <Autocomplete
                key={SelectedTable?.UniqueName || "NA"}
                options={AvailableTables}
                getOptionLabel={(table: TableProperties) => table.UniqueName!}
                defaultValue={SelectedTable}
                groupBy={(table) => table.ProviderInstanceName||"Provider NA"}
                value={SelectedTable}
                filterSelectedOptions
                fullWidth
                selectOnFocus
                // clearOnBlur
                handleHomeEndKeys
                onChange={(event, value, reason, details) => {
                    if(value?.Id === "NA") {
                        const table = { UniqueName: value?.UniqueName?.substring(0, value?.UniqueName?.length - 21)}
                        onChange(table)
                    } else {
                        onChange(!!value ? value : undefined)
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    if (params.inputValue !== '') {
                        filtered.push({ UniqueName: `${params.inputValue} (Not Synced With DF)`, ProviderInstanceName: "Default Provider", Id: "NA" });
                    }
                    return filtered;
                }}
                renderInput={(params) => <TextField {...params}variant="outlined" size="small" label={props.inputProps.parameterName || "Parameter Name NA"}/>}
            />
        </LoadingWrapper>
    )
}


const NoInput = () => {
    return (
        <Box>
             <TextField variant="outlined" size="small" disabled value="Default Value not valid for this type of parameter" fullWidth/>
        </Box>
    )
}

export default getParameterInputField;