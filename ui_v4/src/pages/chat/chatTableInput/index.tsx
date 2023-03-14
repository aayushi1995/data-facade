import { TableParameterInput } from "@/components/parameters/ParameterInput"
import { TableProperties } from "@/generated/entities/Entities"
import Button from "antd/es/button"
import { useState } from "react"
import ParameterInput from "../../../components/parameters/ParameterInput"


export interface ChatTableInputProps {
    onChange: (tableId: string, prompt: string) => void,
    prompt: string,
    selectedTableId?: string
}

const ChatTableInput = (props: ChatTableInputProps) => {
    const [paramObj, setParamObject] = useState<any | undefined>()
    
    const handleParameterInputChange = (tableId?:any, prompt?:any) => {

        setParamObject({
            tableId: tableId,
            prompt: prompt
        })
    }
    const handleSubmit = () => {
        props.onChange(paramObj?.tableId, paramObj.prompt)
    }

    const parameterInputProps: TableParameterInput = {
        parameterType: 'TABLE',
        inputProps: {
            parameterName: "Input Table",
            selectedTableFilter: props.selectedTableId ? {Id: props.selectedTableId} : undefined,
            availableTablesFilter: undefined,
            onChange: (newTable?: TableProperties) => {
                // props.onChange(newTable?.Id!, props.prompt)
                handleParameterInputChange(newTable?.Id!, props.prompt)
            },
        }
    }

    return (
        <>
            <ParameterInput {...parameterInputProps}/>
            <Button onClick={handleSubmit}>Submit</Button>
        </>
       

    )

}

export default ChatTableInput