import { Box, Divider, IconButton, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import React from 'react'
import ReactJson from "react-json-view"
import DownloadIcon from "../../../../../src/assets/images/DownloadData.svg"
import { TableTheme } from "../../../../css/theme/CentralCSSManager"
import ActionDefinitionPresentationFormat from "../../../../enums/ActionDefinitionPresentationFormat"
import { ActionDefinition, ActionExecution, ActionInstance } from "../../../../generated/entities/Entities"
import { useActionExecutionParsedOutputNew } from "../../../../pages/applications/execute_action/hooks/useActionExecutionParsedOutput"
import { CustomToolbar } from "../../CustomToolbar"
import LoadingIndicator from "../../LoadingIndicator"
import LoadingWrapper from "../../LoadingWrapper"
import DeepDiveActionButton from "./DeepDiveActionButton"
import { useDownloadExecutionOutputFromS3 } from "./hooks/useDownloadExecutionOutputFromS3"
import { useGetPreSignedUrlForExecutionOutput } from "./hooks/useGetPreSignedUrlForExecutionOutput"
import ViewExecutionCharts from "./ViewExecutionCharts"

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
    const actionExecutionParsedOutputQuery = useActionExecutionParsedOutputNew({ actionExecutionFilter: {Id: ActionExecution?.Id}, queryOptions: {staleTime: 1000}})
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
            case ActionDefinitionPresentationFormat.SINGLE_VALUE:
                return <ViewActionExecutionSingleValueOutput SingleValueOutput={output as SingleValueOutputFormat}/>
            default:
                return <>Not Supported Format: {ActionDefinition?.PresentationFormat}</>
        }
    }

    return (
        <LoadingWrapper
            data={actionExecutionParsedOutputQuery.data}
            isLoading={actionExecutionParsedOutputQuery.isLoading}
            error={actionExecutionParsedOutputQuery.error}
        >
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, height: "100%"}}>
                {outputComponentToRender(actionExecutionParsedOutputQuery.data?.Output)}
                {showCharts ? (
                    <ViewExecutionCharts executionId={props.ActionExecution.Id || "NA"}/>
                ) : (
                    <></>
                )}
            </Box>
        </LoadingWrapper>
        
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
        <LoadingIndicator />
    ) : (
            <IconButton onClick={handleDownloadResult}>
                <img src={DownloadIcon} />
            </IconButton>
    )
    const deepdiveBtn = (<Box sx={{display:'flex',flexDirection:'row',mr:1}}>
                        {downloadButton}
                    <DeepDiveActionButton ActionDefinition={ActionDefinition} onDeepDiveActionSelected={props.onDeepDiveActionSelected}/>
                    </Box>
    )

    if(isTableOutputSuccessfulFormat(TableOutput)) {
        const preview: TablePreview = JSON.parse(TableOutput.preview)
        const dataGridColumns = (preview?.schema?.fields || []).map(f => {return {...f, field: f.name, headerName: f.name, flex: 1, minWidth: 200}}).filter(col => col.field!=='datafacadeindex')
        const dataGridRows = (preview?.data || []).map((row, index) => ({...row, id: row?.Id||index}))

        
        return (
            <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                
                <DataGrid 
                    headerHeight={70}
                    sx={{
                        ...TableTheme()
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
                    initialState={{
                        pagination: {
                            pageSize: 10
                        }
                    }}
                    autoHeight
                    columns={dataGridColumns} 
                    rows={dataGridRows}
                    components={{
                        Toolbar: CustomToolbar([deepdiveBtn])
                    }}
                />
            </Box>
        )
    } else if(isTableOutputSizeExceededErrorFormat(TableOutput)) {
        const errorType: string = TableOutput.errorType
        
        return (
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "space-between", alignItems: "center"}}>
                <Box>
                    <Typography variant="h5">
                        Error: {errorType}
                    </Typography>
                </Box>
                <Box>
                    {downloadButton}
                </Box>
            </Box>
        )
    } else if((TableOutput as any)?.statusCode === "404") {
        return <Typography variant="heroHeader">
            No Output Produced
        </Typography>
    } else {
        return (
            <Typography sx={{
                fontFamily: "SF Pro Text",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "10.1078px",
                lineHeight: "143%",
                letterSpacing: "0.108298px"
            }}>
                Something went wrong parsing the Action Output. Contact Support.
            </Typography>
        )
    }
    
    
}

export interface ViewActionExecutionSingleValueOutputProps {
    SingleValueOutput: SingleValueOutputFormat
}

const ViewActionExecutionSingleValueOutput = (props: ViewActionExecutionSingleValueOutputProps) => {
    const value = props.SingleValueOutput.value

    function isJSON(str: string) {
        try {
            return (JSON.parse(str) && !!str);
        } catch (e) {
            return false;
        }
    }

    const getContent = () => {
        switch(typeof value) {
            case "string": {
                if(isJSON(value)) {
                    return(
                        <ReactJson src={JSON.parse(value)} />
                    )
                } else {
                    return (
                        <Typography variant="body1" sx={{ textAlign: "center" }}>
                            {value}
                        </Typography>
                    )
                }
            }

            case "boolean": {
                return (
                    <Typography variant="body1" sx={{ textAlign: "center" }}>
                        {value}
                    </Typography>
                )
            }
            
            case "number": {
                return (
                    <Typography variant="body1" sx={{ textAlign: "center" }}>
                        {value}
                    </Typography>
                )
            }

            case "object": {
                return (
                    <ReactJson src={value} />
                )
            }

            default: {
                return (
                    <>OUTPUT FORMAT NOT SPECIFIED</>
                )
            }
        }
    }

    return (
        <Box sx={{ px: 2, display: "flex", flexDirection: "column", gap: 2, maxHeight: "100%" }}>
            <Box>
                <Typography variant="h3">
                    Action Execution Output
                </Typography>
            </Box>
            <Divider orientation="horizontal"/>
            <Box sx={{ height: "100%", overflowY: "auto"}}>
                {getContent()}
            </Box>
        </Box>
    )
}

export default ViewActionExecutionOutput;