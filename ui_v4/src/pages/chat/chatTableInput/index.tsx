import { TableParameterInput } from "@/components/parameters/ParameterInput"
import { TableProperties } from "@/generated/entities/Entities"
import ParameterInput from "../../../components/parameters/ParameterInput"


export interface ChatTableInputProps {
    onChange: (tableId: string, prompt: string) => void,
    prompt: string,
    selectedTableId?: string
}

const ChatTableInput = (props: ChatTableInputProps) => {

    const parameterInputProps: TableParameterInput = {
        parameterType: 'TABLE',
        inputProps: {
            parameterName: "Input Table",
            selectedTableFilter: props.selectedTableId ? {Id: props.selectedTableId} : undefined,
            availableTablesFilter: undefined,
            onChange: (newTable?: TableProperties) => {
                props.onChange(newTable?.Id!, props.prompt)
            },
        }
    }

    return (
        <ParameterInput {...parameterInputProps}/>
    )

}

export default ChatTableInput