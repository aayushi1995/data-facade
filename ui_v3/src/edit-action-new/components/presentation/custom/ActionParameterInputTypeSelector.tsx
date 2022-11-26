import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { getInputTypeFromAttributesNew, InputMap } from "../../../../custom_enums/ActionParameterDefinitionInputMap"
import { ActionParameterDefinition } from "../../../../generated/entities/Entities"

type ActionParameterInputTypeSelectorProps = {
    parameter?: ActionParameterDefinition,
    templateLanguage?: string,
    handleParameterInputTypeChange?: (newInputType?: string) => void
}

function ActionParameterInputTypeSelector(props: ActionParameterInputTypeSelectorProps) {
    const {parameter, templateLanguage, handleParameterInputTypeChange} = props
    const parameterInputType = getInputTypeFromAttributesNew(templateLanguage, parameter?.Tag, parameter?.Type, parameter?.Datatype)

    return (!!parameter && !!parameterInputType && !!templateLanguage) ?
    (
        <Box sx={{display:'flex', flexDirection:'row',width:'100%'}}>
            <FormControl sx={{width: "8.854vw"}}>
                <Select
                    variant="standard"
                    value={parameterInputType}
                    fullWidth
                    onChange={(event: SelectChangeEvent<string>) => {
                        const newInputType = event.target.value
                        handleParameterInputTypeChange?.(newInputType)
                    }}
                    placeholder="Not Configured"
                    disableUnderline
                >
                    {Object.keys(InputMap[templateLanguage!]).map((inputType) => {
                        return <MenuItem value={inputType}>{inputType}</MenuItem>
                    })}
                </Select>
            </FormControl>
        </Box>
    ) : <></>
} 

export default ActionParameterInputTypeSelector;