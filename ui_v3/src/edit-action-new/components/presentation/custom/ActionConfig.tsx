import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch } from "@mui/material";
import ActionTypeToSupportedRuntimes from "../../../../custom_enums/ActionTypeToSupportedRuntimes";

export type ActionConfigProps = {
    pinned?: boolean,
    published?: boolean,
    onPinToggle: () => void,
    onPublishToggle: () => void,
    language?: string,
    actionType?: string,
    onLanguageChange?: (newLanguage?: string) => void,
    returnType?: string,
    onReturnTypeChange?: (newReturnType?: string) => void
}

function ActionConfig(props: ActionConfigProps) {
    const { pinned, published, onPinToggle, onPublishToggle, language, onLanguageChange, actionType } = props
    return (
        <Box>
            <Box>
                
            </Box>
            <Box>
                <Box>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Select your Scripting Language</InputLabel>
                        <Select
                            value={language|| "Select"}
                            onChange={(event) => onLanguageChange?.(event.target.value)}
                            variant="outlined"
                            label="Select your Scripting Language"
                            fullWidth
                        >
                            {ActionTypeToSupportedRuntimes[actionType].map( runtime => {
                                return <MenuItem value={runtime}>{runtime}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    {/* <Autocomplete/> */}
                </Box>
            </Box>
            <Box>
                <Box>
                <FormControlLabel
                    control={
                        <Switch checked={pinned||false} onChange={() => onPinToggle?.()} name="jason" />
                    }
                    label="Pin to App Home Page"
                />
                </Box>
                <Box>
                <FormControlLabel
                    control={
                        <Switch checked={published||false} onChange={() => onPublishToggle?.()} name="jason" />
                    }
                    label="Publish"
                />
                </Box>
            </Box>
        </Box>
    )
}

export default ActionConfig;