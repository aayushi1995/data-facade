import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import React, { ChangeEvent } from "react"
import { ColumnProperties, TableProperties } from "../../../../generated/entities/Entities"
import { UpstreamAction } from "../../../../pages/applications/workflow/WorkflowContext"
import useTables from "../../../../pages/build_action/hooks/useTables"
import LoadingWrapper from "../../LoadingWrapper"
import useFetchColumnsForTableAndTags from "./hooks/useFetchColumnsForTableAndTags"


export interface UpstreamActionParameterInput {
    parameterType: "UPSTREAM_ACTION",
    parameterId?: string
    inputProps: {
        upstreamActions: UpstreamAction[],
        selectedAction: UpstreamAction,
        onChange: Function,
        onClear: Function
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
        selectedColumnFilters: ColumnProperties[] | undefined,
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
                    {...params}
                    label={parameterName || "Parameter Name NA"}
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
    const {parameterName, selectedColumnFilters, filters, onChange} = props.inputProps
    const fetchTableQuery = useFetchColumnsForTableAndTags({filters: {
        tableFilters: filters.tableFilters,
        parameterDefinitionId: filters.parameterDefinitionId
    }})

    React.useEffect(() => {
        onChange?.(fetchTableQuery.data)
    }, [fetchTableQuery.data])

    return (
        <LoadingWrapper
            {...fetchTableQuery}
        >
            <Autocomplete
                options={fetchTableQuery.data || []}
                multiple={true}
                fullWidth
                getOptionLabel={(column: ColumnProperties) => column.UniqueName || "Un-named column"}
                groupBy={(column) => column.TableName || "Table NA"}
                value={fetchTableQuery.data!?.filter(column => props.inputProps.selectedColumnFilters?.find(selectedColumn => selectedColumn?.Id === column.Id || (selectedColumn.Id === undefined && selectedColumn?.UniqueName === column.UniqueName) ) !== undefined)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={props.inputProps.parameterName || "Parameter Name NA"}
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
    const {parameterName, selectedColumnFilter, filters, onChange} = props.inputProps
    const fetchTableQuery = useFetchColumnsForTableAndTags({filters: {
        tableFilters: filters.tableFilters,
        parameterDefinitionId: filters.parameterDefinitionId
    }})

    React.useEffect(() => {
        const index = Math.floor(Math.random() * (fetchTableQuery.data?.length || 0))
        onChange(fetchTableQuery.data?.[index])
    }, [fetchTableQuery.data])

    const getValue = () => {
        const selectedColumn = fetchTableQuery.data?.find(column => column?.Id === selectedColumnFilter?.Id)
        return selectedColumn 
    }
 
    return (
        <LoadingWrapper 
        isLoading={fetchTableQuery.isLoading}
        error={fetchTableQuery.error}
        data={fetchTableQuery.data}
        >
            <Autocomplete
                options={fetchTableQuery.data!}
                getOptionLabel={(column: ColumnProperties) => column.UniqueName!}
                groupBy={(column) => column.TableName||"Table NA"}
                value={getValue()}
                filterSelectedOptions
                fullWidth
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                onChange={(event, value, reason, details) => {
                    onChange(!!value ? value : undefined)
                }}
                renderInput={(params) => <TextField {...params} label={props.inputProps.parameterName || "Parameter Name NA"}/>}
            />
        </LoadingWrapper>
        
    )
}

const UpstreamActionInput = (props: UpstreamActionParameterInput) => {
    const {upstreamActions, selectedAction, onChange, onClear} = props.inputProps
    const formLabel = (upstream: UpstreamAction) => `${upstream.stageName} | ${upstream.actionName} (${upstream.actionIndex+1})`
    return (
        <Autocomplete
            options={upstreamActions}
            getOptionLabel={formLabel}
            value={selectedAction}
            renderInput={(params) => <TextField {...params} label="Select Upstream Action" />}
            onChange={(event, value, reason, details) => {
                if(reason==="selectOption" && !!value){
                    onChange(value)
                } else if(reason==="clear"){
                    onClear()
                }
            }}
            filterSelectedOptions
            fullWidth
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
        />
    )
}

const StringInput = (props: StringParameterInput) => {
    const {value, parameterName, onChange} = props.inputProps

    const [input, setInput] = React.useState<string|undefined>()
    React.useEffect(() => {
        setInput(value)
    }, [value])

    return <TextField
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onBlur={() => onChange(input)}
                variant="outlined"
                label={props.inputProps.parameterName || "Parameter Name NA"}
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
            setInput("")
        }
    }

    return <TextField
            value={input}
            onChange={onValueChange}
            onBlur={() => onChange(input)}
            variant="outlined"
            label={props.inputProps.parameterName || "Parameter Name NA"}
            fullWidth
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
        return !isNaN(parseFloat(str))
    }
    
    const onValueChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const parameterValue = event.target.value
        if (isNumber(parameterValue)) {
            setInput(parameterValue)
        } else if(parameterValue==="") {
            setInput("")
        }
    }

    return <TextField
            value={input}
            onChange={onValueChange}
            onBlur={() => onChange(input)}
            variant="outlined"
            label={props.inputProps.parameterName || "Parameter Name NA"}
            fullWidth
        />
}

const BooleanInput = (props: BooleanParameterInput) => {
    const {value, parameterName, onChange} = props.inputProps
    
    return (
        <FormControl variant="outlined" style={{ width: "100%" }}>
        <InputLabel>{props.inputProps.parameterName || "Parameter Name NA"}</InputLabel>
        <Select
            value={value || ""}
            onChange={(event) => onChange(event.target.value)}
            variant="outlined"
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
    // TODO: Instead of selected table name, get selected table id
    const {parameterName, selectedTableFilter, onChange, parameterDefinitionId} = props.inputProps
    const {tables, loading, error}  = useTables({tableFilter: {}, filterForParameterTags: true, parameterId: parameterDefinitionId})
    return (
        <LoadingWrapper
        isLoading={loading}
        error={error}
        data={tables}
        >
            <Autocomplete
                options={tables!}
                getOptionLabel={(table: TableProperties) => table.UniqueName!}
                groupBy={(table) => table.ProviderInstanceName||"Provider NA"}
                value={tables?.find(table => table.Id===selectedTableFilter?.Id || (selectedTableFilter?.Id===undefined && (table.UniqueName===selectedTableFilter?.UniqueName)))}
                filterSelectedOptions
                fullWidth
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                onChange={(event, value, reason, details) => {
                    onChange(!!value ? value : undefined)
                }}
                renderInput={(params) => <TextField {...params} label={props.inputProps.parameterName || "Parameter Name NA"}/>}
            />
        </LoadingWrapper>
    )
}


const NoInput = () => {
    return (
        <Box>
            Input Field NA
        </Box>
    )
}

export default getParameterInputField;