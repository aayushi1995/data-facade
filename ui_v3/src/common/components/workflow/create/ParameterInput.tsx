import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from "@material-ui/core"
import { Box } from "@mui/material"
import React from "react"
import { ChangeEvent } from "react"
import { ColumnProperties, TableProperties } from "../../../../generated/entities/Entities"
import { UpstreamAction, WorkflowContextType } from "../../../../pages/applications/workflow/WorkflowContext"
import useTables from "../../../../pages/build_action/hooks/useTables"
import LoadingWrapper from "../../LoadingWrapper"
import useFetchColumnsForTables from "./hooks/useFetchColumnsForTables"


export interface UpstreamActionParameterInput {
    parameterType: "UPSTREAM_ACTION",
    inputProps: {
        upstreamActions: UpstreamAction[],
        selectedAction: UpstreamAction,
        onChange: Function,
        onClear: Function
    }
}

export interface StringParameterInput {
    parameterType: "STRING",
    inputProps: {
        parameterName: string,
        value: string | undefined,
        onChange: Function
    }
}

export interface IntParameterInput {
    parameterType: "INT",
    inputProps: {
        parameterName: string,
        value: string | undefined,
        onChange: Function
    }
}

export interface FloatParameterInput {
    parameterType: "FLOAT",
    inputProps: {
        parameterName: string,
        value: string | undefined,
        onChange: Function
    }
}

export interface BooleanParameterInput {
    parameterType: "BOOLEAN",
    inputProps: {
        parameterName: string,
        value: string | undefined,
        onChange: Function
    }
}

export interface TableParameterInput {
    parameterType: "TABLE",
    inputProps: {
        parameterName: string,
        selectedTableFilter: TableProperties | undefined,
        onChange: (newTable?: TableProperties) => void
    }
}

export interface ColumnParameterInput {
    parameterType: "COLUMN",
    inputProps: {
        parameterName: string,
        selectedColumnFilter: ColumnProperties | undefined,
        tableFilters: TableProperties[] | undefined,
        onChange: (newColumn?: ColumnProperties) => void
    }
}

export interface NAInput {
    parameterType: undefined
}


export type ParameterInputProps = UpstreamActionParameterInput | StringParameterInput | IntParameterInput | FloatParameterInput | BooleanParameterInput | NAInput | TableParameterInput | ColumnParameterInput

const getParameterInputField = (props: ParameterInputProps) => {
    switch(props?.parameterType) {
        case "UPSTREAM_ACTION": return <UpstreamActionInput {...props}/>
        case "STRING": return <StringInput {...props}/>
        case "BOOLEAN": return <BooleanInput {...props}/>
        case "FLOAT": return <FloatInput {...props}/>
        case "INT": return <IntInput {...props}/>
        case "TABLE": return <TableInput {...props}/>
        case "COLUMN": return <ColumnInput {...props}/>
        default: return <NoInput/>
    }
}

const ColumnInput = (props: ColumnParameterInput) => {
    const {parameterName, selectedColumnFilter, tableFilters, onChange} = props.inputProps
    const fetchTableQuery  = useFetchColumnsForTables({ tableFilters: tableFilters})


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
                value={fetchTableQuery.data!?.find(column => column.Id===selectedColumnFilter?.Id || ((selectedColumnFilter?.Id === undefined) && column.UniqueName===selectedColumnFilter?.UniqueName))}
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
    const {parameterName, selectedTableFilter, onChange} = props.inputProps
    const {tables, loading, error}  = useTables({tableFilter: {}})
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