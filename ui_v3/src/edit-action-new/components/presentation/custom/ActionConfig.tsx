import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, Typography } from "@mui/material";
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
        <Box sx={{py:1}}>
            <Box sx={{py:1,borderBottom:'3px solid #e3e3e3',px:3}}>
                <Typography sx={{fontSize:'1.2rem',fontWeight:600}}>
                    Action config
                </Typography>
            </Box>
            <Box sx={{px:3,borderBottom:'3px solid #e3e3e3',py:2}}>
                <Box sx={{mt:2}}>
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
            <Box sx={{display:'flex',flexDirection:'row',px:3,gap:4}}>
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