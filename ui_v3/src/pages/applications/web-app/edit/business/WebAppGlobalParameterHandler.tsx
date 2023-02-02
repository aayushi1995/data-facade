import { Autocomplete, createFilterOptions, TextField } from "@mui/material"
import { ActionParameterDefinition, ActionParameterInstance } from "../../../../../generated/entities/Entities"
import useWebAppGlobalParameterHandler from "../hooks/useWebAppGlobalParameterHandler"

interface WebAppGlobalParameterHandlerProps {
    currentParameter: ActionParameterDefinition,
    currentParameterInstance: ActionParameterInstance,
    actionReference: string
}

const WebAppGlobalParameterHandler = (props: WebAppGlobalParameterHandlerProps) => {

    const {currentParameter, currentParameterInstance, actionReference} = props

    const {currentGlobalParameterSelected, availableParameters, mapToGlobalParameter, addAndMapGlobalParameter} = useWebAppGlobalParameterHandler({...props})
    const filter = createFilterOptions<ActionParameterDefinition>()

    return (
        <Autocomplete 
            options={availableParameters}
            value={currentGlobalParameterSelected}
            getOptionLabel={parameter => parameter.ParameterName || ""}
            filterSelectedOptions
            fullWidth
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            renderInput={(params) => <TextField label="Select Global Parameter" {...params}/>}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                if(params.inputValue !== '') {
                    filtered.push({ParameterName: `Create Global Parameter: ${params.inputValue}`});
                }
                return filtered
            }}
            onChange={(event, value, reason, details) => {
                if(!!value) {
                    if(value?.ParameterName?.includes('Create Global Parameter:')) {
                        addAndMapGlobalParameter({...value, ParameterName: value?.ParameterName?.substring(25)})
                    } else {
                        mapToGlobalParameter(value.Id || "ID")
                    }
                }
            }}
        />
    )

}

export default WebAppGlobalParameterHandler