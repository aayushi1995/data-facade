import { Box, TextField } from "@mui/material";
import React from "react";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import useFetchActionDefinitionForSelector from "../../hooks/useFetchActionDefinitionForSelector";
import ActionDefinitionSelectorRow from "../presentation/ActionDefinitionSelectorRow";

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
        <Box>
            <Box>
                <TextField value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)}/>
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