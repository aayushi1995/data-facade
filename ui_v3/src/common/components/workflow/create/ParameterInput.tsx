import { Autocomplete, Box, FormControl, Icon, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import React, { ChangeEvent } from "react"
import InfoIcon from "../../../../../src/images/info.svg"
import { ColumnProperties, TableProperties } from "../../../../generated/entities/Entities"
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
        if(fetchTableQuery?.data?.[0]?.FilteredBasedOnTags) {
            onChange?.(fetchTableQuery.data?.[0]?.Columns)
        }
    }, [fetchTableQuery.data])

    return (
        <LoadingWrapper
            {...fetchTableQuery}
        >
            <Autocomplete
                options={fetchTableQuery.data?.[0]?.Columns || []}
                multiple={true}
                fullWidth
                getOptionLabel={(column: ColumnProperties) => column.UniqueName || "Un-named column"}
                groupBy={(column) => column.TableName || "Table NA"}
                value={fetchTableQuery.data?.[0]?.Columns?.filter(column => props.inputProps.selectedColumnFilters?.find(selectedColumn => selectedColumn?.Id === column.Id || (selectedColumn.Id === undefined && selectedColumn?.UniqueName === column.UniqueName) ) !== undefined)}
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
    const fetchTableQuery = useFetchColumnsForTableAndTags({
        filters: {
            tableFilters: filters.tableFilters,
            parameterDefinitionId: filters.parameterDefinitionId
        },
        queryOptions: {
            enabled: filters?.tableFilters!==undefined
        }
    })
    
    const getSelectedColumn = () => {
        const selectedColumn = fetchTableQuery?.data?.[0]?.Columns?.find?.(col => col?.Id === selectedColumnFilter?.Id)
        return selectedColumn 
    }

    React.useEffect(() => {
        if(!!fetchTableQuery.data) {
            const selectedColumn = getSelectedColumn()
            if(selectedColumn===undefined) {
                const index = 0
                if(fetchTableQuery.data?.[0]?.FilteredBasedOnTags) {
                    onChange(fetchTableQuery.data?.[0]?.Columns?.[index])
                }
            } else {
                onChange(selectedColumn)
            }
        }
    }, [fetchTableQuery.data])
 
    return (
        <LoadingWrapper 
        isLoading={fetchTableQuery.isLoading}
        error={fetchTableQuery.error}
        data={fetchTableQuery.data}
        >
            <Autocomplete
                options={fetchTableQuery.data?.[0]?.Columns!}
                getOptionLabel={(column: ColumnProperties) => column.UniqueName!}
                groupBy={(column) => column.TableName||"Table NA"}
                value={getSelectedColumn()}
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
        <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
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
            <HtmlTooltip sx={{display: 'flex', alignItems: 'center'}} title={
                <React.Fragment>
                    <Box p={1} sx={{display: 'flex', flexDirection: 'column', gap: 1, width: '300px'}}>
                        <Typography sx={{
                            fontStyle: "normal",
                            fontWeight: 700,
                            fontSize: "16px",
                            lineHeight: "175%",
                            letterSpacing: "0.15px",
                            color: "#253858"
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
When ‘user input’ is selected as ‘No’, then the user shall be required to select the output of any of the upstream actions which returns a table.  DF shall provide the user with an array of appropriate upstream actions to choose from. 
                        </Typography>
                    </Box>
                </React.Fragment>
            }>
                <Icon sx={{display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                    <img src={InfoIcon} />
                </Icon>
            </HtmlTooltip>
        </Box>
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
            setInput(undefined)
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
    const {tables, loading, error}  = useTables({tableFilter: props?.inputProps?.availableTablesFilter || {}, filterForParameterTags: true, parameterId: parameterDefinitionId})
    
    const getSelectedTable = () => {
        return tables?.find(table => table?.Id === selectedTableFilter?.Id)
    }

    const getAnyTable = () => tables?.[0]

    React.useEffect(() => {
        if(tables !== undefined) {
            if(selectedTableFilter !== undefined){
                const selectedTable = getSelectedTable()
                if(selectedTable !== undefined) {
                    onChange(selectedTable)
                } else {
                    onChange(getAnyTable())
                }
            } else {
                onChange(getAnyTable())
            }
        }
    }, [tables])
    
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
            <TextField disabled value="Default Value not valid for this type of parameter" fullWidth/>
        </Box>
    )
}

export default getParameterInputField;