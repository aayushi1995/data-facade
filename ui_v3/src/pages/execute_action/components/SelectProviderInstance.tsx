import { Autocomplete, TextField } from "@mui/material"
import React from "react"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import { ProviderInstance } from "../../../generated/entities/Entities"
import SelectProviderInstanceHook from "./SelectProviderInstanceHook"

export type SelectProviderInstanceProps = {
    selectedProviderInstance?: ProviderInstance,
    onProviderInstanceChange?: Function
}


const SelectProviderInstance = (props: SelectProviderInstanceProps) => {
    const { availableProviderInstanceQuery, availableProviderDefinitionQuery } = SelectProviderInstanceHook()
    const availableProviderInstances = availableProviderInstanceQuery?.data || []
    console.log(props?.selectedProviderInstance)
    React.useEffect(() => {
        availableProviderInstanceQuery?.data?.forEach(parameterInstance => {
            if(parameterInstance.IsDefaultProvider === true) {
                props.onProviderInstanceChange?.(parameterInstance)
            }
        })
    }, [availableProviderInstanceQuery?.data]) 

    React.useEffect(() => {
        if(!!availableProviderInstanceQuery.data) {
            availableProviderInstanceQuery?.data?.forEach(parameterInstance => {
                if(parameterInstance.IsDefaultProvider === true) {
                    props.onProviderInstanceChange?.(parameterInstance)
                }
            })
        }
    }, [])

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
                        value={availableProviderInstances?.find(providerInstance => providerInstance.Id===props?.selectedProviderInstance?.Id)}
                        filterSelectedOptions
                        fullWidth
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        onChange={(event, value, reason, details) => {
                            if( reason==="selectOption" || reason==="clear" ) {
                                props?.onProviderInstanceChange?.(value)
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