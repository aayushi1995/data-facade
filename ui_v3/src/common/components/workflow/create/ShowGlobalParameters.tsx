import { Box, IconButton, Tooltip } from "@mui/material"
import { DataGrid, DataGridProps, GridCellParams } from "@mui/x-data-grid"
import React from "react"
import ConfirmationDialog from "../../../../../src/common/components/ConfirmationDialog"
import { ActionParameterDefinition } from "../../../../generated/entities/Entities"
import { SetWorkflowContext, WorkflowContext } from "../../../../pages/applications/workflow/WorkflowContext"
import { DefaultValueInputFromAllParameters } from "../../../../pages/build_action/components/common-components/parameter_input/DefaultValueInput"
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

            return {
                GlobalParameterName: globalParameter.ParameterName || "NA",
                MappedActionLevelParameters: details.map(detail => detail.stageName + " | " + detail.actionName + " | " + detail.parameterName).join(', '),
                InputType: globalParameter.Tag || "NA",
                DataType: globalParameter.Datatype || "NA",
                id: globalParameter.Id || "id",
                options: globalParameter.OptionSetValues || "NA",
                Parameter: globalParameter
            }
        })
    }

    // if(!params.row.MappedActionLevelParameters){
    //     setWorkflowContext({
    //         type: 'DELETE_GLOBAL_PARAMETER',
    //         payload: {
    //             parameterId: params.row.id
    //         }
    //     })
    // }
    

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
                renderCell: (params: GridCellParams<any, GlobalParametersRow, any>) => <DefaultValueInputFromAllParameters
                                                                                            activeParameterDefinitionId={params.row.Parameter?.Id}
                                                                                            parameterDefinitions={workflowContext.WorkflowParameters}
                                                                                            parameterAdditionalConfigs={workflowContext.WorkflowParameterAdditionalConfigs}
                                                                                            onDefaultValueChange={(newDefaultValue?: string) => {
                                                                                                const newParamDef: ActionParameterDefinition = {
                                                                                                    Id: params.row.Parameter?.Id,
                                                                                                    DefaultParameterValue: newDefaultValue
                                                                                                }
                                                                                                setWorkflowContext({type: "SetWorkflowGlobalParameter", payload: { newParamConfig: newParamDef }})
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
        disableSelectionOnClick: true,
        hideFooterSelectedRowCount: true,
        sx: {
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},
                backgroundColor: 'ActionCardBgColor.main',
                backgroundBlendMode: "soft-light, normal",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
        },
        autoHeight: true,
        headerHeight: 70,
        
        
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
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const handleDialogClose = () => setDialogOpen(false)
    const handleDialogOpen = () => setDialogOpen(true)

    const deleleteParameterFunc = ()=>{
        deleteParameter(props?.id)
        handleDialogClose()
    }
    if(!props.MappedActionLevelParameters){
        deleteParameter(props?.id)
    }
    return (
        <Box>
            <ConfirmationDialog
                messageHeader={'Delete Parameter'}
                messageToDisplay={`Do you want to delete ${props.GlobalParameterName} ? `}
                acceptString={'Delete'}
                declineString={'Cancel'}
                dialogOpen={dialogOpen}
                onDialogClose={handleDialogClose}
                onAccept={deleleteParameterFunc}
                onDecline={handleDialogClose}
            />
            <Tooltip title="Delete">
                <IconButton sx={{ width: "40px", height: "40px" }} onClick={handleDialogOpen}>
                    <DeleteIcon/>
                </IconButton>
            </Tooltip>
        </Box>
    )
}

export default ShowGlobalParameters