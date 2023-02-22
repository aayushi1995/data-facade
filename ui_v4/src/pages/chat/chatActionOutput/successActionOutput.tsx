import { ReactQueryWrapper } from "@/components/ReactQueryWrapper/ReactQueryWrapper";
import {  SetChatContext } from "@/contexts/ChatContext/index";
import { ActionDefinition, ActionExecution, ActionInstance } from "@/generated/entities/Entities";
import ActionDefinitionPresentationFormat from "@/helpers/enums/ActionDefinitionPresentationFormat";
import { useActionExecutionParsedOutput } from "@/hooks/actionOutput/useActionExecutionParsedOutput";
import { useDownloadExecutionOutputFromS3 } from "@/hooks/actionOutput/useDownloadExecutionOutputFromS3";
import { useGetPreSignedUrlForExecutionOutput } from "@/hooks/actionOutput/useGetPreSignedUrlForExecutionOutput";
import { DownloadOutlined } from "@ant-design/icons";
import { Alert, Button, Table } from "antd";
import React, { useContext, useEffect } from "react";
import { OutputTableStyled } from "./successActionOutput.styles";
import OutputComponent from "./TableChartComponent/OutputComponent";
import TableComponent from "./TableChartComponent/TableComponent";


export interface ViewActionExecutionOutputProps {
    ActionExecution: ActionExecution,
    ActionInstance: ActionInstance,
    ActionDefinition: ActionDefinition,
    showCharts?: boolean,
    onDeepDiveActionSelected?: (actionId: string) => void
    getTableData?: (data: any) => void
    title?:string
}

const SuccessActionOutput = (props: ViewActionExecutionOutputProps) => {
    const { ActionExecution, ActionDefinition } = props
    const actionExecutionParsedOutputQuery = useActionExecutionParsedOutput({ actionExecutionFilter: { Id: ActionExecution?.Id }, queryOptions: { staleTime: 1000 } })

    React.useEffect(() => {
        props?.getTableData && props?.getTableData(actionExecutionParsedOutputQuery.data?.Output)
    }, [actionExecutionParsedOutputQuery.data?.Output])

    const outputComponentToRender = (output?: any) => {
        switch (ActionDefinition?.PresentationFormat || "NA") {
            case ActionDefinitionPresentationFormat.TABLE_VALUE:
                return <ViewActionExecutionTableOutput TableOutput={output as TableOutputSuccessfulFormat} ActionExecution={ActionExecution} ActionDefinition={ActionDefinition} onDeepDiveActionSelected={props.onDeepDiveActionSelected} title={props.title}/>
            case ActionDefinitionPresentationFormat.OBJECT:
                return <ViewActionExecutionTableOutput TableOutput={output as TableOutputSuccessfulFormat} ActionExecution={ActionExecution} ActionDefinition={ActionDefinition} title={props.title}/>
            default:
                return <Alert message="Not Supported Format" description={ActionDefinition?.PresentationFormat} />
        }
    }

    return (
        <ReactQueryWrapper
            data={actionExecutionParsedOutputQuery.data}
            isLoading={actionExecutionParsedOutputQuery.isLoading}
            error={actionExecutionParsedOutputQuery.error}
        >

            {outputComponentToRender(actionExecutionParsedOutputQuery.data?.Output)}

        </ReactQueryWrapper>

    )

}

export interface TableOutputSuccessfulFormat {
    preview: string,
    column_stats?: any[]

}

export interface TableOutputSizeExceededErrorFormat {
    errorMessage: string,
    errorType: string
}

export type TableOutputFormat = TableOutputSuccessfulFormat | TableOutputSizeExceededErrorFormat

function isTableOutputSuccessfulFormat(output: TableOutputFormat): output is TableOutputSuccessfulFormat {
    return (output as TableOutputSuccessfulFormat).preview !== undefined;
}

function isTableOutputSizeExceededErrorFormat(output: TableOutputFormat): output is TableOutputSizeExceededErrorFormat {
    return (output as TableOutputSizeExceededErrorFormat).errorType !== undefined;
}


export interface TablePreview {
    schema: {
        fields: {
            name: string
        }[]
    },
    data: any[]
}

export interface SingleValueOutputFormat {
    value: number | string | boolean
}

export interface ViewActionExecutionTableOutputProps {
    TableOutput: TableOutputSuccessfulFormat | TableOutputSizeExceededErrorFormat,
    ActionExecution: ActionExecution,
    ActionDefinition: ActionDefinition,
    onDeepDiveActionSelected?: (actionId: string) => void
    title?:string
}

const ViewActionExecutionTableOutput = (props: ViewActionExecutionTableOutputProps) => {
    const setChatContext = useContext(SetChatContext)
    const { TableOutput , ActionExecution, ActionDefinition } = props as any
    const useGetPresignedDowloadUrl = useGetPreSignedUrlForExecutionOutput(ActionExecution?.OutputFilePath || "NA", 5)
    const { downloadExecutionOutputFromS3, download } = useDownloadExecutionOutputFromS3()
    
    const preview: TablePreview = JSON.parse(TableOutput?.preview) 
    const dataGridColumns = (preview?.schema?.fields || []).map(f => { return { ...f, dataIndex: f.name, title: f.name, } }).filter(col => col.dataIndex !== 'datafacadeindex')
    const dataGridRows = (preview?.data || []).map((row, index) => ({ ...row, key: row?.Id || index }))

    useEffect(() => {
        isTableOutputSuccessfulFormat(TableOutput) && setChatContext({
            type: "setTableData",
            payload: {
                tableData: {
                    dataGridColumns: dataGridColumns,
                    dataGridRows: dataGridRows
                }
            }
        })
       },[])

    const handleDownloadResult = () => {
        useGetPresignedDowloadUrl.mutate(
            (undefined),
            {
                onSuccess: (data, variables, context) => {
                    const s3Data = data as { requestUrl: string, headers: any }
                    downloadExecutionOutputFromS3.mutate(
                        ({ requestUrl: s3Data.requestUrl as string, headers: s3Data.headers }), {
                        onSuccess: (data, variables, context) => {
                            download(data as Blob, ActionExecution?.ActionInstanceName + ".csv" || "DataFacadeOutput")
                        }
                    }
                    )
                }
            }
        )
    }

    const downloadButton = downloadExecutionOutputFromS3.isLoading && (<Button type="link" onClick={handleDownloadResult} icon={<DownloadOutlined />} />)

    if (isTableOutputSuccessfulFormat(TableOutput)) {
        const preview: TablePreview = JSON.parse(TableOutput.preview)
        const dataGridColumns = (preview?.schema?.fields || []).map(f => { return { ...f, dataIndex: f.name, title: f.name, } }).filter(col => col.dataIndex !== 'datafacadeindex')
        const dataGridRows = (preview?.data || []).map((row, index) => ({ ...row, key: row?.Id || index }))

        return (
           <OutputComponent dataGridColumns={dataGridColumns} dataGridRows={dataGridRows} title={props.title}/>
        )
    } else if (isTableOutputSizeExceededErrorFormat(TableOutput)) {
        const errorType: string = TableOutput.errorType

        return (
            <Alert type="error" message="Error" description={errorType} />
        )
    } else if ((TableOutput as any)?.statusCode === "404") {
        return <Alert type="info" message="No output produced" />
    } else {
        return (
            <Alert type="error" message="Error" description="Something went wrong parsing the Action Output. Contact Support." />
        )
    }


}



export default SuccessActionOutput