import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import React from "react";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import useFetchActionDefinitionForSelector from "../../hooks/useFetchActionDefinitionForSelector";
import ActionDefinitionSelectorRow from "../presentation/ActionDefinitionSelectorRow";
import SearchIcon from '@mui/icons-material/Search';
export type ActionDefinitionSelectorProps = {
    onActionDefinitionSelectionCallback?: (actionDefinitionId?: string) => void
}

function ActionDefinitionSelector(props: ActionDefinitionSelectorProps) {
    const {data, isLoading, error} = useFetchActionDefinitionForSelector({})
    const [searchQuery, setSearchQuery] = React.useState("")
    const filteredData = (data || [])?.filter(ad => ad?.ActionDisplayName?.includes?.(searchQuery))

    const actionDefinitionRows = searchQuery==="" ? [] : filteredData?.map?.(ad => 
        <Box>
            <ActionDefinitionSelectorRow 
                data={ad} 
                onSelect={() => props?.onActionDefinitionSelectionCallback?.(ad?.ActionId)} 
            />
        </Box>
    )

    return (
        <Box sx={{m:'auto',width:'40vw',my:2}}>
            <Box>
                <Typography sx={{fontSize:'1.3rem',fontWeight:600,color:'#9e9e98',textAlign:'center'}}>
                    Search and Add existing action from library
                </Typography>
            </Box>
            <Box sx={{width:'20vw'}}>
                <TextField variant="standard" 
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search Actions"
                            multiline={true}
                            sx={{width: '40vw', 
                                backgroundColor: 'allTableTextfieldbgColor1.main',
                                boxSizing: 'border-box', 
                                boxShadow: 'inset -4px -6px 16px rgba(255, 255, 255, 0.5), inset 4px 6px 16px rgba(163, 177, 198, 0.5);',
                                backgroundBlendMode: 'soft-light, normal', 
                                borderRadius: '16px',
                                display: 'flex', 
                                justifyContent: 'center', 
                                minHeight: '50px'}}
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{marginLeft: 1}}/>
                                    </InputAdornment>
                                )
                            }}/>
            </Box>
            <Box>
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