import { TableProperties } from "@/generated/entities/Entities"
import { Table } from "antd"
import { TablePropertiesContent } from "../ConfirmationInput/Chat.types"


export interface ChatTablePropertiesProps {
    Tables: TablePropertiesContent
}

const column = [{
    title: 'Table Name',
    key: 'UniqueName',
    dataIndex: 'UniqueName'
}]

const ChatTablePropeties = (props: ChatTablePropertiesProps) => {
    const { Tables } = props

    console.log(Tables.Tables, Tables)
    return (

        <Table dataSource={Tables.Tables} columns={column}/>
    )
}


export default ChatTablePropeties