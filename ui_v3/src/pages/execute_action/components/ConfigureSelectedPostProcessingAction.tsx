import { Checkbox, FormControl, FormControlLabel, Switch, Typography } from "@mui/material"
import { DataGrid, DataGridProps, GridRenderCellParams } from "@mui/x-data-grid"
import ParameterDefinitionsConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import TagHandler from "../../../common/components/tag-handler/TagHandler"
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag"
import { ActionParameterDefinition, ActionParameterInstance, Tag } from "../../../generated/entities/Entities"
import { ActionInstanceWithParameters } from "../../../generated/interfaces/Interfaces"
import labels from "../../../labels/labels"
import DefaultValueInput from "../../build_action/components/common-components/parameter_input/DefaultValueInput"
import { TextCell } from "../../table_browser/components/AllTableView"
import useConfigureSelectedPostProcessingAction from "../hooks/useConfigureSelectedPostProcessingAction"


export interface ConfigureSelectedPostProcessingActionProps {
    selectedActionDetails: ActionInstanceWithParameters,
    sourceActionName: string,
    handlers: {
        onParameterValueChange: (newActionParameterInstances: ActionParameterInstance[], actionIndex: number) => void,
    },
    selectedActionIndex: number

}

const ConfigureSelectedPostProcessingAction = (props: ConfigureSelectedPostProcessingActionProps) => {

    const {selectedActionDetails} = props
    const {
        getRows, 
        fetchActionDefinitionQuery, 
        handleParameterChange, 
        getProviderInstanceForProviderDefinition, 
        changeSourceExecutionId
    } = useConfigureSelectedPostProcessingAction(props)

    const sxProps = {
        "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},
        backgroundColor: 'ActionCardBgColor.main',
        backgroundBlendMode: "soft-light, normal",
        border: "2px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
        borderRadius: "15px"
    }

    const dataGridProps: DataGridProps = {
        columns: [
            {
                field: "ParameterName",
                headerName: "Parameter Name",
                flex: 1,
                minWidth: 100,
                renderCell: (params: GridRenderCellParams<any, ActionParameterDefinition, any>) => <TextCell text={params.row.DisplayName || params.row.ParameterName}/>
            },
            {
                field: "ParameterValue",
                headerName: "Parameter Value",
                flex: 2,
                minWidth: 200,
                renderCell: (params: GridRenderCellParams<any, ActionParameterDefinition, any>) => {
                    return (
                        <>
                            {getProviderInstanceForProviderDefinition(params.row.Id!)?.SourceExecutionId ? <Typography color="text.disabled">Disabled</Typography> : 
                                <ParameterDefinitionsConfigPlane 
                                    parameterDefinitions={[params.row]}
                                    parameterInstances={selectedActionDetails.ParameterInstances || []}
                                    handleChange={handleParameterChange}
                                />
                            }
                        </>    
                    )
                }
                    
            },
            {
                field: "tags",
                headerName: "ParameterTags",
                flex: 2,
                minWidth: 200,
                renderCell: (params: GridRenderCellParams<any, ActionParameterDefinition & {tags: Tag[]}>) => (
                    <TagHandler 
                        entityId={params.row.Id!} 
                        entityType="ActionParameterDefinition"
                        tagFilter={{}}
                        allowAdd={false}
                        allowDelete={true}
                        inputFieldLocation="RIGHT"
                        maxNumberOfTags={1}/>)
            },
            {
                field: "takeFromUpstream",
                headerName: "Take Input from Previous Execution",
                flex: 1,
                minWidth: 100,
                renderCell: (params: GridRenderCellParams<any, ActionParameterDefinition, any>) => (
                    <FormControl>
                        <FormControlLabel control={
                            <Switch 
                                disabled={!(params.row.Tag === ActionParameterDefinitionTag.TABLE_NAME || params.row.Tag === ActionParameterDefinitionTag.DATA)}
                                checked={!!getProviderInstanceForProviderDefinition(params.row.Id!)?.SourceExecutionId}
                                onChange={(e) => changeSourceExecutionId(e, params.row.Id!)}
                            />}  label=""
                        />
                    </FormControl>
                )
            }
        ],
        rows: getRows(),
        autoHeight: true,
        headerHeight: 70,
        rowsPerPageOptions: [5, 10, 25, 50, 100, 200],
        hideFooterSelectedRowCount: true,
        disableSelectionOnClick: true,
        initialState: {
            pagination: {
                pageSize: 50
            }
        },
        sx: sxProps
    }

    return (
        <ReactQueryWrapper {...fetchActionDefinitionQuery}>
            {() => <DataGrid {...dataGridProps}/>}
        </ReactQueryWrapper>
    )

}

export default ConfigureSelectedPostProcessingAction