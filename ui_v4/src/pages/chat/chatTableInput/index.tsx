import { TableListParameterInput, TableParameterInput } from "@/components/parameters/ParameterInput"
import { TableProperties } from "@/generated/entities/Entities"
import useFeatureConfig from "@/hooks/useFetaureConfig"
import Button from "antd/es/button"
import { useState } from "react"
import ParameterInput from "../../../components/parameters/ParameterInput"


export interface ChatTableInputProps {
    onChange: (tableIds: string[], prompt: string) => void,
    prompt: string,
    selectedTableIds?: string[]
}

const ChatTableInput = (props: ChatTableInputProps) => {
    const [paramObj, setParamObject] = useState<any | undefined>()
    
    const {data: featureConfigData} = useFeatureConfig()

    const handleParameterInputChange = (tableIds?:any, prompt?:any) => {
        console.log(tableIds, prompt)
        setParamObject({
            tableIds: tableIds,
            prompt: prompt
        })
    }
    const handleSubmit = () => {
        props.onChange(paramObj?.tableIds, paramObj.prompt)
    }

    const parameterListInputProps: TableListParameterInput = {
        parameterType: 'TABLE_LIST',
        inputProps: {
            parameterName: "Input Table",
            selectedTableFilters: props.selectedTableIds ? props.selectedTableIds?.map(id => ({Id: id} as TableProperties)) : undefined,
            onChange: (newTables?: TableProperties[]) => {
                const tableIds = newTables?.map(table => table.Id!)
                console.log(tableIds)
                if((tableIds?.length || 0) > 1) {
                    if(featureConfigData?.multiTableInput) {
                        handleParameterInputChange(tableIds, props.prompt)
                        // props.onChange(tableIds, props.prompt)
                    }
                } else {
                    handleParameterInputChange(tableIds, props.prompt)
                }
                // props.onChange(newTable?.Id!, props.prompt)
            },
        }
    }

    const parameterInputProps: TableParameterInput = {
        parameterType: 'TABLE',
        inputProps: {
            parameterName: "Input Table",
            selectedTableFilter: props.selectedTableIds ? {Id: props.selectedTableIds[0]} : undefined,
            availableTablesFilter: undefined,
            onChange: (newTable?: TableProperties) => {
                // props.onChange(newTable?.Id!, props.prompt)
                handleParameterInputChange([newTable?.Id!], props.prompt)
            },
        }
    }

    return (
        <>
            <ParameterInput {...featureConfigData?.multiTableInput ? {...parameterListInputProps} : {...parameterInputProps}}/>
            <Button onClick={handleSubmit}>Submit</Button>
        </>
       

    )

}

export default ChatTableInput