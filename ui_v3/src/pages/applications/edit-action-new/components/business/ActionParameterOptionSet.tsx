import { Autocomplete, Box, createFilterOptions, FormControlLabel, Switch, TextField } from "@mui/material";
import ActionParameterDefinitionTag from "../../../../../enums/ActionParameterDefinitionTag";
import { ActionParameterDefinition } from "../../../../../generated/entities/Entities";

type ActionParameterOptionSetProps = {
    parameter?: ActionParameterDefinition,
    handleParameterChange: (newActionParameterDefinition: ActionParameterDefinition) => void
}

const filter = createFilterOptions<string>()

function ActionParameterOptionSet(props: ActionParameterOptionSetProps) {
    const { parameter, handleParameterChange } = props
    const parameterTag = parameter?.Tag
    const parameterOptionSetValues = parameter?.OptionSetValues
    const isSingleOptionSet = parameterTag === ActionParameterDefinitionTag.OPTION_SET_SINGLE
    const isMultipleOptionSet = parameterTag === ActionParameterDefinitionTag.OPTION_SET_MULTIPLE

    const handleChange = (newOptions: string[]) => {
        const newOption = newOptions.find(option => option.includes("Create Option:"))
        if(newOption) {
            const optionName = newOption.substring(15)
            const exisitingOpts = parameterOptionSetValues?.split(',') || []
            exisitingOpts.push(optionName)

            handleParameterChange({
                ...parameter,
                OptionSetValues: exisitingOpts.join(',')
            })
            
        } else {
            handleParameterChange({
                ...parameter,
                OptionSetValues: newOptions.length ? newOptions?.join(',') : undefined
            })
        }
    }

    const handleOptionSetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleParameterChange({
            ...parameter,
            Tag: (parameter?.Tag === event.target.value) ? undefined : event.target.value
        })
    }

    return (
        <Box>
            <Box>
                <FormControlLabel value={ActionParameterDefinitionTag.OPTION_SET_SINGLE} control={<Switch checked={isSingleOptionSet} onChange={handleOptionSetChange}/>} label="Single" />
                <FormControlLabel value={ActionParameterDefinitionTag.OPTION_SET_MULTIPLE} control={<Switch checked={isMultipleOptionSet} onChange={handleOptionSetChange}/>} label="Multiple" />
            </Box>
            {(isSingleOptionSet || isMultipleOptionSet) && <Box>
                <Autocomplete
                    options={"".split(',') || []}
                    filterSelectedOptions
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    multiple
                    fullWidth
                    value={parameterOptionSetValues?.split(',') || []}
                    onChange={(event, value, reason, details) => {
                        if (value) {
                            handleChange(value);
                        }
                    } }
                    filterOptions={(options, params) => {

                        const filtered = filter(options, params);
                        if (params.inputValue !== '') {
                            filtered.push(`Create Option: ${params.inputValue}`);
                        }
                        return filtered;
                    } }
                    renderInput={(params) => <TextField {...params} label="Add Options" />}
                />
            </Box>}
        </Box>
    )
}

export default ActionParameterOptionSet;