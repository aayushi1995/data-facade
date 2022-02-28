import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from "@material-ui/core"
import { ChangeEvent } from "react"
import { UpstreamAction, WorkflowContextType } from "../../../../pages/applications/workflow/WorkflowContext"


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

export interface NAInput {
    parameterType: undefined
}


export type ParameterInputProps = UpstreamActionParameterInput | StringParameterInput | IntParameterInput | FloatParameterInput | BooleanParameterInput | NAInput


const ParameterInput = (props: ParameterInputProps) => {
    switch(props?.parameterType) {
        case "UPSTREAM_ACTION": {
            const {upstreamActions, selectedAction, onChange, onClear} = props.inputProps
            const formLabel = (upstream: UpstreamAction) => `${upstream.stageName} | ${upstream.actionName} (${upstream.actionIndex+1})`
            return (
                <Autocomplete
                    options={upstreamActions}
                    getOptionLabel={formLabel}
                    value={selectedAction}
                    renderInput={(params) => <TextField {...params} label="Select Upstream Action" />}
                    onChange={(event, value, reason, details) => {
                        console.log(value, reason)
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

        case "STRING": {
            const {value, parameterName, onChange} = props.inputProps
            
            return <TextField
                        value={value||""}
                        onChange={(event) => onChange(event.target.value)}
                        variant="outlined"
                        label={parameterName}
                        fullWidth
                    />
        }

        case "INT": {
            const {value, parameterName, onChange} = props.inputProps
            
            
            const onValueChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                const parameterValue = event.target.value
                if (parameterValue.match(/^-?\d+$/)) {
                    onChange(parameterValue)
                }
            }

            return <TextField
                    value={value||""}
                    onChange={onValueChange}
                    variant="outlined"
                    label={parameterName}
                    fullWidth
                />
        }

        case "FLOAT": {
            const {value, parameterName, onChange} = props.inputProps
            
            const isNumber = (str: string): boolean => {
                if (typeof str != "string") return false // we only process strings!
                // could also coerce to string: str = ""+str
                return !isNaN(parseFloat(str))
            }
            
            const onValueChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                const parameterValue = event.target.value
                if (isNumber(parameterValue)) {
                    onChange(parameterValue)
                }
            }

            return <TextField
                    value={value||""}
                    onChange={onValueChange}
                    variant="outlined"
                    label={parameterName}
                    fullWidth
                />
        }

        case "BOOLEAN": {
            const {value, parameterName, onChange} = props.inputProps
            
            return (
                <FormControl variant="outlined" style={{ width: "100%" }}>
                <InputLabel>{parameterName}</InputLabel>
                <Select
                    value={value || ""}
                    onChange={(event) => onChange(event.target.value)}
                    variant="outlined"
                    label={parameterName}
                    fullWidth
                >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                </Select>
            </FormControl>
            )
        }

        default:
            return <>SELECT NAA</>
    }

    // const getOffset = (state: WorkflowContextType, stageId: string) => state.stages.reduce((acc: number, curr) => acc<0 ? acc : (curr.Id===stageId ? -1*acc: acc+curr.Actions.length, 0)
}

export default ParameterInput;