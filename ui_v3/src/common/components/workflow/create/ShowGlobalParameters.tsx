import { Box, IconButton, Tooltip } from "@mui/material"
import { DataGrid, DataGridProps, GridCellParams } from "@mui/x-data-grid"
import React from "react"
import { ActionParameterDefinition } from "../../../../generated/entities/Entities"
import { SetWorkflowContext, WorkflowContext } from "../../../../pages/applications/workflow/WorkflowContext"
import { DefaultValueSelector } from "../../../../pages/build_action/components/common-components/EditActionParameter"
import { TextCell } from "../../../../pages/table_browser/components/AllTableView"
import { ReactComponent as DeleteIcon } from "./../../../../../src/images/DeleteIcon.svg"

interface GlobalParametersRow {
    GlobalParameterName: string,
    MappedActionLevelParameters: string,
    InputType: string,
    DataType: string,
    id: string,
    options: string,
    Parameter: ActionParameterDefinition
}

const ShowGlobalParameters = () => {
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)

    const getRows = () : GlobalParametersRow[] => {
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

            console.log(globalParameter)

            return {
                "GlobalParameterName": globalParameter.ParameterName || "NA",
                "MappedActionLevelParameters": details.map(detail => detail.stageName + " | " + detail.actionName + " | " + detail.parameterName).join(', '),
                "InputType": globalParameter.Tag || "NA",
                "DataType": globalParameter.Datatype || "NA",
                "id": globalParameter.Id || "id",
                "options": globalParameter.OptionSetValues || "NA",
                Parameter: globalParameter
            }
        })
    }

    const dataGridProps: DataGridProps = {
        columns: [
            {
                field: "GlobalParameterName",
                headerName: "Global Parameter Name",
                renderCell: (params: GridCellParams<any, GlobalParametersRow, any>) => <TextCell {...{text: params.row.GlobalParameterName}} />,
                flex: 2
            },
            {
                field: "DefaultValue",
                headerName: "Default Value",
                renderCell: (params: GridCellParams<any, GlobalParametersRow, any>) => <DefaultValueSelector
                                                                                            allParameters={workflowContext.WorkflowParameters}
                                                                                            parameter={params.row.Parameter}
                                                                                            onDefaultValueChange={(newParamConfig: ActionParameterDefinition) => {
                                                                                                setWorkflowContext({type: "SetWorkflowGlobalParameter", payload: {newParamConfig: newParamConfig}})
                                                                                            }}
                                                                                        />,
                flex: 2,
            },
            {
                field: "MappedActionLevelParameters",
                headerName: "Mapped Parameter",
                renderCell: (params: GridCellParams<any, GlobalParametersRow, any>) => <TextCell {...{text: params.row.MappedActionLevelParameters}} />,
                flex: 2
            },
            {
                field: "InputType",
                headerName: "Input Type",
                renderCell: (params: GridCellParams<any, GlobalParametersRow, any>) => <TextCell {...{text: params.row.InputType}} />,
                flex: 1
            },
            {
                field: "DataType",
                headerName: "Data Type",
                renderCell: (params: GridCellParams<any, GlobalParametersRow, any>) => <TextCell {...{text: params.row.DataType}} /> ,
                flex: 1
            },
            {
                field: "options",
                headerName: "Options",
                renderCell: (params: GridCellParams<any, GlobalParametersRow, any>) => <TextCell {...{text: params.row.options}} /> ,
                flex: 1
            },
            {
                field: "Action",
                flex: 1,
                renderCell: (params: GridCellParams<any, GlobalParametersRow, any>) => <DeleteCell {...params.row}/>
            }
        ].map(column => { return {...column, width: column.field.length*20}}),
        rows: getRows(),
        rowsPerPageOptions: [5, 10, 15, 20, 50],
        disableSelectionOnClick: true,
        hideFooterSelectedRowCount: true,
        sx: {
            "& .MuiDataGrid-columnHeaders": { background: "#E8E8E8"}
        },
        autoHeight: true,
        headerHeight: 70,
        initialState: {
            pagination: {
                pageSize: 20
            }
        },
    }

    return (
        <DataGrid {...dataGridProps}/>
    )
    
}

const DeleteCell = (props: GlobalParametersRow) => {
    const setWorkflowContext = React.useContext(SetWorkflowContext)

    const deleteParameter = (parameterId: string) => {
        setWorkflowContext({
            type: 'DELETE_GLOBAL_PARAMETER',
            payload: {
                parameterId: parameterId
            }
        })
    }

    return (
        <Box>
            <Tooltip title="Delete">
                <IconButton sx={{ width: "40px", height: "40px" }} onClick={ (event) => {event.stopPropagation(); deleteParameter(props?.id)} }>
                    <DeleteIcon/>
                </IconButton>
            </Tooltip>
        </Box>
    )
}

type DefaultValueCellProps = {
    parameter: ActionParameterDefinition,
    allParameters: ActionParameterDefinition[],
    onParameterDefaultValueChange: Function
}

export default ShowGlobalParameters