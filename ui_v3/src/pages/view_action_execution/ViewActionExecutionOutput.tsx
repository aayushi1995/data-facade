import { Box, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { CustomToolbar } from "../../common/components/CustomToolbar"
import LoadingWrapper from "../../common/components/LoadingWrapper"
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
    const actionExecutionParsedOutputQuery = useActionExecutionParsedOutputNew({ actionExecutionFilter: {Id: ActionExecution?.Id}, queryOptions: {}})
    
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
            {outputComponentToRender(actionExecutionParsedOutputQuery.data?.Output)}
        </LoadingWrapper>
    )
}

export interface TableOutputFormat {
    preview: {
        schema: any,
        data: any[],    
    },
    column_stats?: any[]
    
}

export interface SingleValueOutputFormat {
    value: number | string | boolean
}

export interface ViewActionExecutionTableOutputProps {
    TableOutput?: TableOutputFormat
}

const ViewActionExecutionTableOutput = (props: ViewActionExecutionTableOutputProps) => {
    const { TableOutput } = props
    if(!!TableOutput) {
        return (
            <DataGrid autoHeight columns={TableOutput.preview.schema} rows={TableOutput.preview.data.map((row, index) => ({...row, id: row?.Id||index}))}
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
    return (
        <Box m={3}>
            <Typography variant="h3" sx={{ textAlign: "center" }}>
                {props.SingleValueOutput.value}
            </Typography>
        </Box>
    )
}

export default ViewActionExecutionOutput;