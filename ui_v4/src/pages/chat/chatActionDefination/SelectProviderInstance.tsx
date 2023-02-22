import { AutoComplete, Input, Select } from "antd"
import React from "react"
import { ReactQueryWrapper } from "@components/ReactQueryWrapper/ReactQueryWrapper"
import { ProviderInstance } from "@/generated/entities/Entities"
import SelectProviderInstanceHook from "@hooks/actionDefination/SelectProviderInstanceHook"

export type SelectProviderInstanceProps = {
    selectedProviderInstance?: ProviderInstance,
    onProviderInstanceChange?: Function
}


const SelectProviderInstance = (props: SelectProviderInstanceProps) => {
    const { availableProviderInstanceQuery, availableProviderDefinitionQuery } = SelectProviderInstanceHook()
    const availableProviderInstances = availableProviderInstanceQuery?.data || []
 
    React.useEffect(() => {
        if(!props.selectedProviderInstance){
            availableProviderInstanceQuery?.data?.forEach(parameterInstance => {
                if(parameterInstance.IsDefaultProvider === true) {
                    props.onProviderInstanceChange?.(parameterInstance)
                }
            })
        }
        
    }, [availableProviderInstanceQuery?.data]) 

    React.useEffect(() => {
        if(!!availableProviderInstanceQuery.data && !props.selectedProviderInstance) {
            availableProviderInstanceQuery?.data?.forEach(parameterInstance => {
                if(parameterInstance.IsDefaultProvider === true) {
                    props.onProviderInstanceChange?.(parameterInstance)
                }
            })
        }
    }, [])
    const currentValue = availableProviderInstances?.find(providerInstance => providerInstance.Id===props?.selectedProviderInstance?.Id)

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
                    <Select
                        options={availableProviderInstances || []}
                        value={currentValue || null}
                        onChange={(value:any) => {
                            props?.onProviderInstanceChange?.(value)
                        }}
                        
                    >
                        {
                            availableProviderInstances.map(value => <Select.Option value={value.Id}>
                                {value.Name}
                            </Select.Option>)
                        }
                    </Select>
                }
            />}
        />
    )
    
}

export default SelectProviderInstance;