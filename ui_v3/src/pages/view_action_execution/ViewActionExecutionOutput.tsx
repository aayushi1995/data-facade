import { Box, Divider, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import ReactJson from "react-json-view"
import { CustomToolbar } from "../../common/components/CustomToolbar"
import LoadingWrapper from "../../common/components/LoadingWrapper"
import ViewExecutionCharts from "../../common/ViewExecutionCharts"
import ActionDefinitionPresentationFormat from "../../enums/ActionDefinitionPresentationFormat"
import { ActionDefinition, ActionExecution, ActionInstance } from "../../generated/entities/Entities"
import { useActionExecutionParsedOutputNew } from "../execute_action/hooks/useActionExecutionParsedOutput"

export interface ViewActionExecutionOutputProps {
    ActionExecution: ActionExecution,
    ActionInstance: ActionInstance,
    ActionDefinition: ActionDefinition
} 

const ViewActionExecutionOutput = (props: ViewActionExecutionOutputProps) => {
    const { ActionExecution, ActionDefinition } = props
    const actionExecutionParsedOutputQuery = useActionExecutionParsedOutputNew({ actionExecutionFilter: {Id: ActionExecution?.Id}, queryOptions: {staleTime: 1000}})
    
    const outputComponentToRender = (output?: any) => {
        switch(ActionDefinition.PresentationFormat) {
            case ActionDefinitionPresentationFormat.TABLE_VALUE:
                return <ViewActionExecutionTableOutput TableOutput={output as TableOutputFormat}/>
            case ActionDefinitionPresentationFormat.OBJECT:
                return <ViewActionExecutionTableOutput TableOutput={output as TableOutputFormat}/>
            case ActionDefinitionPresentationFormat.SINGLE_VALUE:
                return <ViewActionExecutionSingleValueOutput SingleValueOutput={output as SingleValueOutputFormat}/>
            default:
                return <>Not Supported Format: {ActionDefinition.PresentationFormat}</>
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
                <ViewExecutionCharts executionId={props.ActionExecution.Id || "NA"}/>
            </Box>
        </LoadingWrapper>
        
    )
}

export interface TableOutputFormat {
    preview: string,
    column_stats?: any[]
    
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
    TableOutput: TableOutputFormat
}

const ViewActionExecutionTableOutput = (props: ViewActionExecutionTableOutputProps) => {
    const { TableOutput } = props
    const preview: TablePreview = JSON.parse(TableOutput.preview)
    const dataGridColumns = (preview?.schema?.fields || []).map(f => {return {...f, field: f.name, headerName: f.name}}).filter(col => col.field!=='datafacadeindex')
    const dataGridRows = (preview?.data || []).map((row, index) => ({...row, id: row?.Id||index}))
    if(!!TableOutput) {
        return (
            <DataGrid 
                autoHeight 
                columns={dataGridColumns} 
                rows={dataGridRows}
                components={{
                    Toolbar: CustomToolbar([])
                }}
            ></DataGrid>
        )
    } else {
        return <>Error</>
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
