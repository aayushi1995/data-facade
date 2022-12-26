import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import React from "react";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import useFetchActionDefinitionForSelector from "../../hooks/useFetchActionDefinitionForSelector";
import ActionDefinitionSelectorRow from "../presentation/ActionDefinitionSelectorRow";
import SearchIcon from '@mui/icons-material/Search';
import labels from "../../../labels/labels";
import { SearchBarTextField } from "../presentation/styled_native/ActionAddCodeIconBox";
export type ActionDefinitionSelectorProps = {
    onActionDefinitionSelectionCallback?: (actionDefinitionId?: string) => void
}

function ActionDefinitionSelector(props: ActionDefinitionSelectorProps) {
    const {data, isLoading, error} = useFetchActionDefinitionForSelector({})
    const [searchQuery, setSearchQuery] = React.useState("")
    const filteredData = (data || [])?.filter(ad => ad?.ActionDisplayName?.includes?.(searchQuery))

    const actionDefinitionRows = filteredData?.map?.(ad => 
        <Box>
            <ActionDefinitionSelectorRow 
                data={ad} 
                onSelect={() => props?.onActionDefinitionSelectionCallback?.(ad?.ActionId)} 
            />
        </Box>
    )

    return (
        <Box sx={{m:'auto',width:'40vw',my:2}}>
            <Box sx={{width:'40vw'}}>
                <SearchBarTextField variant="standard" 
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder={labels.AddActionPage.searchText}
                            multiline={true}
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{marginLeft: 1}}/>
                                    </InputAdornment>
                                )
                            }}/>
            </Box>
            <Box sx={{height:'30vh',overflow:'scroll'}}>
                <ReactQueryWrapper
                    isLoading={isLoading}
                    error={error}
                    data={data}
                    children={() => actionDefinitionRows}
                />
            </Box>
        </Box>
    )
}

export default ActionDefinitionSelector;