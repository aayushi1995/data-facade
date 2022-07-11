import { Autocomplete, TextField } from "@mui/material"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import { ProviderInstance } from "../../../generated/entities/Entities"
import SelectProviderInstanceHook from "./SelectProviderInstanceHook"

export type SelectProviderInstanceProps = {
    selectedProviderInstance?: ProviderInstance,
    onProviderInstanceChange?: Function
}


const SelectProviderInstance = (props: SelectProviderInstanceProps) => {
    const { selectedProviderInstance, onProviderInstanceChange, availableProviderInstanceQuery, availableProviderDefinitionQuery } = SelectProviderInstanceHook(props)
    const availableProviderInstances = availableProviderInstanceQuery?.data || []


    return (
        <ReactQueryWrapper
            isLoading={availableProviderDefinitionQuery.isLoading}
            error={availableProviderDefinitionQuery.error}
            data={availableProviderDefinitionQuery.data}
            children={() =>
            <ReactQueryWrapper
                isLoading={availableProviderInstanceQuery.isLoading}
                error={availableProviderInstanceQuery.error}
                data={availableProviderInstanceQuery.data}
                children={() =>
                    <Autocomplete
                        options={availableProviderInstances || []}
                        getOptionLabel={(providerInstance: ProviderInstance) => providerInstance.Name || "NA"}
                        groupBy={(providerInstance: ProviderInstance) => availableProviderDefinitionQuery?.data?.find(providerDefinition => providerDefinition?.Id===providerInstance.ProviderDefinitionId)?.UniqueName || "NA"}
                        value={availableProviderInstances?.find(providerInstance => providerInstance.Id===selectedProviderInstance?.Id)}
                        filterSelectedOptions
                        fullWidth
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        onChange={(event, value, reason, details) => {
                            if( reason==="selectOption" || reason==="clear" ) {
                                onProviderInstanceChange?.(value)
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label={"Provider Name"}/>}
                    />
                }
            />}
        />
    )
    
}

export default SelectProviderInstance;