import { DataGrid } from "@mui/x-data-grid"
import { CustomToolbar } from "../../common/components/CustomToolbar"
import LoadingWrapper from "../../common/components/LoadingWrapper"
import ActionDefinitionPresentationFormat from "../../enums/ActionDefinitionPresentationFormat"
import { ActionDefinition, ActionExecution, ActionInstance } from "../../generated/entities/Entities"
import useActionExecutionParsedOutput from "../execute_action/hooks/useActionExecutionParsedOutput"

export interface ViewActionExecutionOutputProps {
    ActionExecution: ActionExecution,
    ActionInstance: ActionInstance,
    ActionDefinition: ActionDefinition
} 

const ViewActionExecutionOutput = (props: ViewActionExecutionOutputProps) => {
    const { ActionExecution, ActionDefinition } = props
    const actionExecutionParsedOutputQuery = useActionExecutionParsedOutput({ actionExecutionFilter: {Id: ActionExecution?.Id}, queryOptions: {}})
    
    const outputComponentToRender = (output?: any) => {
        if(ActionDefinition.PresentationFormat===ActionDefinitionPresentationFormat.TABLE_VALUE){
            return <ViewActionExecutionTableOutput TableOutput={output as TableOutputFormat}/>
        } else {
            return <>TO BUILD...</>
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
    schema: any,
    data: any[]
}

export interface ViewActionExecutionTableOutputProps {
    TableOutput?: TableOutputFormat
}

const ViewActionExecutionTableOutput = (props: ViewActionExecutionTableOutputProps) => {
    const { TableOutput } = props
    if(!!TableOutput) {
        return (
            <DataGrid autoHeight columns={TableOutput.schema} rows={TableOutput.data.map((row, index) => ({...row, id: row?.Id||index}))}
                components={{
                    Toolbar: CustomToolbar([])
                }}
            ></DataGrid>
        )
    } else {
        return <>Error</>
    }
    
}

export default ViewActionExecutionOutput;