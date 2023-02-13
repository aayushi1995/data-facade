import { ReactQueryWrapper } from "@/components/ErrorBoundary/ReactQueryWrapper";
import Loader from "@/components/Loader";
import { ActionDefinition, ActionExecution, ActionInstance } from "@/generated/entities/Entities";
import ActionDefinitionPresentationFormat from "@/helpers/enums/ActionDefinitionPresentationFormat";
import { Table } from 'antd';
import React from 'react';
import { useActionExecutionParsedOutput } from "../hooks/useActionExecutionParsedOutput";
import { useDownloadExecutionOutputFromS3 } from "../hooks/useDownloadExecutionOutputFromS3";
import { useGetPreSignedUrlForExecutionOutput } from "../hooks/useGetPreSignedUrlForExecutionOutput";


export interface ViewActionExecutionOutputProps {
    ActionExecution: ActionExecution,
    ActionInstance: ActionInstance,
    ActionDefinition: ActionDefinition,
    showCharts?: boolean,
    onDeepDiveActionSelected?: (actionId: string) => void
    getTableData?: (data:any) => void
} 

const ViewActionExecutionOutput = (props: ViewActionExecutionOutputProps) => {
    const { ActionExecution, ActionDefinition } = props
    const actionExecutionParsedOutputQuery = useActionExecutionParsedOutput({ actionExecutionFilter: {Id: ActionExecution?.Id}, queryOptions: {staleTime: 1000}})
    const showCharts = props.showCharts === undefined ? true : false

    // send output
    React.useEffect(() => {
        props?.getTableData && props?.getTableData(actionExecutionParsedOutputQuery.data?.Output)
    },[actionExecutionParsedOutputQuery.data?.Output])
   
    const outputComponentToRender = (output?: any) => {
        switch(ActionDefinition?.PresentationFormat || "NA") {
            case ActionDefinitionPresentationFormat.TABLE_VALUE:
                return <ViewActionExecutionTableOutput TableOutput={output as TableOutputSuccessfulFormat} ActionExecution={ActionExecution} ActionDefinition={ActionDefinition} onDeepDiveActionSelected={props.onDeepDiveActionSelected}/>
            case ActionDefinitionPresentationFormat.OBJECT:
                return <ViewActionExecutionTableOutput TableOutput={output as TableOutputSuccessfulFormat} ActionExecution={ActionExecution} ActionDefinition={ActionDefinition}/>
            default:
                return <>Not Supported Format: {ActionDefinition?.PresentationFormat}</>
        }
    }

    return (
        <ReactQueryWrapper
            data={actionExecutionParsedOutputQuery.data}
            isLoading={actionExecutionParsedOutputQuery.isLoading}
            error={actionExecutionParsedOutputQuery.error}
        >
            {() => (
                <div style={{display: 'flex', flexDirection: 'column', gap: 1, height: "100%"}}>
                {outputComponentToRender(actionExecutionParsedOutputQuery.data?.Output)}
                {/* {showCharts ? (
                    <ViewExecutionCharts executionId={props.ActionExecution.Id || "NA"}/>
                ) : (
                    <></>
                )} */}
            </div>
            )}
            
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
}

const TableTheme = () => {
    return ({
        "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#c3d7f7",
            fontFamily: 'sans-serif',
            fontSize: '14px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#797a7a',
        },
        "& .MuiDataGrid-row": {
            border: '0px solid black !important',
        },
        backgroundColor: 'ActionCardBgColor.main',
        height: 900,
        overflow: 'scroll',
    }
    )
}
const ViewActionExecutionTableOutput = (props: ViewActionExecutionTableOutputProps) => {
    const { TableOutput, ActionExecution, ActionDefinition } = props
    const useGetPresignedDowloadUrl = useGetPreSignedUrlForExecutionOutput(ActionExecution?.OutputFilePath || "NA", 5)
    const {downloadExecutionOutputFromS3, download} = useDownloadExecutionOutputFromS3()

    const handleDownloadResult = () => {
        useGetPresignedDowloadUrl.mutate(
            (undefined),
            {
                onSuccess: (data, variables, context) => {
                    const s3Data = data as {requestUrl: string, headers: any}
                    downloadExecutionOutputFromS3.mutate(
                        ({requestUrl: s3Data.requestUrl as string, headers: s3Data.headers}), {
                            onSuccess: (data, variables, context) => {
                                download(data as Blob, ActionExecution?.ActionInstanceName + ".csv" || "DataFacadeOutput")
                            }
                        }
                    )
                }
            }
        )
    }

    const downloadButton = downloadExecutionOutputFromS3.isLoading ? (
        <Loader />
    ) : (
            <b onClick={handleDownloadResult}>
                <img alt="Download" />
            </b>
    )

    if(isTableOutputSuccessfulFormat(TableOutput)) {
        const preview: TablePreview = JSON.parse(TableOutput.preview)
        const dataGridColumns = (preview?.schema?.fields || []).map(f => {return {...f, dataIndex: f.name, title: f.name, flex: 1, minWidth: 200}}).filter(col => col.dataIndex!=='datafacadeindex')
        const dataGridRows = (preview?.data || []).map((row, index) => ({...row, key: row?.Id||index}))

        
        return (
            <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                
                <Table 
                    columns={dataGridColumns} 
                    dataSource={dataGridRows}
                    // components={{
                    //     Toolbar: CustomToolbar([deepdiveBtn])
                    // }}
                />
            </div>
        )
    } else if(isTableOutputSizeExceededErrorFormat(TableOutput)) {
        const errorType: string = TableOutput.errorType
        
        return (
            <div style={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "space-between", alignItems: "center"}}>
                <div>
                    <span >
                        Error: {errorType}
                    </span>
                </div>
                <div>
                    {downloadButton}
                </div>
            </div>
        )
    } else if((TableOutput as any)?.statusCode === "404") {
        return <span>
            No Output Produced
        </span>
    } else {
        return (
            <span style={{
                fontFamily: "SF Pro Text",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "10.1078px",
                lineHeight: "143%",
                letterSpacing: "0.108298px"
            }}>
                Something went wrong parsing the Action Output. Contact Support.
            </span>
        )
    }
    
    
}

export interface ViewActionExecutionSingleValueOutputProps {
    SingleValueOutput: SingleValueOutputFormat
}


export default ViewActionExecutionOutput;
