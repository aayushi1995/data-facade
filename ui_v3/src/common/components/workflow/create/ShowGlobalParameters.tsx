import { DataGrid } from "@mui/x-data-grid"
import React from "react"
import { WorkflowContext } from "../../../../pages/applications/workflow/WorkflowContext"


const ShowGlobalParameters = () => {
    const workflowContext = React.useContext(WorkflowContext)

    const getRows = () => {
        return workflowContext.WorkflowParameters.map(globalParameter => {
            const details: {stageName: string, actionName: string, parameterName: string}[] = []
            workflowContext.stages.forEach(stage => {
                stage.Actions.forEach(action => {
                    action.Parameters.forEach(parameter => {
                        if(parameter.GlobalParameterId === globalParameter.Id) {
                            details.push({
                                stageName: stage.Name,
                                actionName: action.DisplayName,
                                parameterName: parameter.ParameterName || "NA"
                            })
                        }
                    })
                })
            })
            return {
                "GlobalParameterName": globalParameter.ParameterName || "NA",
                "MappedActionLevelParameters": details.map(detail => detail.stageName + " | " + detail.actionName + " | " + detail.parameterName).join(', '),
                "InputType": globalParameter.Tag || "NA",
                "DataType": globalParameter.Datatype || "NA",
                "id": globalParameter.Id || "id"
            }
        })
    }

    const dataGridProps = {
        columns: [
            {
                field: "GlobalParameterName",
                headerName: "Global Parameter Name"
            },
            {
                field: "MappedActionLevelParameters",
                headerName: "Mapped Parameter"
            },
            {
                field: "InputType",
                headerName: "Input Type"
            },
            {
                field: "DataType",
                headerName: "Data Type"
            }
        ].map(column => { return {...column, width: column.field.length*20}}),
        rows: getRows(),
        autoPageSize: true,
        rowsPerPageOptions: [5, 10, 15],
        disableSelectionOnClick: true
    }
    console.log(dataGridProps)
    return (
        <DataGrid {...dataGridProps} sx={{minHeight: '400px'}}/>
    )
    
}

export default ShowGlobalParameters