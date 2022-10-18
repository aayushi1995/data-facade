import { template } from "@babel/core";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Grid, IconButton, useTheme } from "@mui/material";
import { DataGrid, GridCallbackDetails, GridCellParams, GridRowId, GridToolbarContainer, GridValueGetterParams, MuiEvent } from "@mui/x-data-grid";
import React from "react";
import VirtualTagHandler from "../../../../common/components/tag-handler/VirtualTagHandler";
import { getInputTypeFromAttributesNew } from "../../../../custom_enums/ActionParameterDefinitionInputMap";
import TemplateLanguage from "../../../../enums/TemplateLanguage";
import { ActionParameterDefinition, ActionParameterInstance, ActionTemplate, Tag } from "../../../../generated/entities/Entities";
import { safelyParseJSON } from "../../../execute_action/util";
import { ActionContextActionParameterDefinitionWithTags } from "../../context/BuildActionContext";
import { ActionParameterDefinitionConfig } from "./EditActionParameter";

export interface ViewActionParametersProps {
    template?: ActionTemplate,
    paramsWithTag?: ActionContextActionParameterDefinitionWithTags[],
    onSelectParameterForEdit?: (selectedParam: {parameter: ActionParameterDefinition, tags: Tag[]}) => void,
    onDeleteParameters?: (deletedParams: ActionParameterDefinition[]) => void,
    onParameterReset?: () => void,
    onCreateNewParameter?: () => void
}

const ViewActionParameters = (props: ViewActionParametersProps) => {
    const theme = useTheme()
    const {paramsWithTag, onSelectParameterForEdit, onDeleteParameters, onCreateNewParameter, onParameterReset} = props

    const [selectedParameters, setSelectedParameters] = React.useState<ActionParameterDefinition[]|undefined>()

    const handleParameterDelete = () => {
        if(!!selectedParameters && selectedParameters.length > 0) {
            onDeleteParameters?.(selectedParameters)
        }
    }

    React.useEffect(() => {
        if(selectedParameters===undefined && !!paramsWithTag && !!paramsWithTag[0]){
            onSelectParameterForEdit?.(paramsWithTag[0]!)
        }
    }, [])
    
    const datagridRows = paramsWithTag!.map(p => ({...p, id: p.parameter.Id}))
    const getDatagridProps = () => ({
        columns: [
            {
                field: "ParameterName",
                headerName: "Parameter Name",
                valueGetter: (params: GridValueGetterParams) => params.row.parameter.ParameterName,
                flex: 5
            },
            {
                field: "InputType",
                headerName: "Input Type",
                valueGetter: (params: GridValueGetterParams) => {
                    const parameter = params.row.parameter
                    return getInputTypeFromAttributesNew(props.template?.Language || TemplateLanguage.SQL, parameter.Tag, parameter.Type, parameter.Datatype)
                },
                flex: 3
            },
            {
                field: "DefaultValue",
                headerName: "Default Value",
                valueGetter: (params: GridValueGetterParams) => {
                    const parameter: ActionParameterDefinition = params.row.parameter
                    const defaultValue = safelyParseJSON(parameter.DefaultParameterValue) as ActionParameterInstance
                    return defaultValue?.ParameterValue
                },
                flex: 5
            },
            {
                field: "Tags",
                headerName: "Tags",
                flex: 5,
                renderCell: (params: any) => 
                <Box>
                    <VirtualTagHandler
                        tagFilter={{}}
                        allowAdd={false}
                        allowDelete={false}
                        selectedTags={params.row.tags}
                        onSelectedTagsChange={() => {}}
                        inputFieldLocation="TOP"
                        numberOfTagsToDisplay={1}
                    />
                </Box>
            },
            {
                field: "Parent",
                headerName: "Parent",
                flex: 5,
                renderCell: (params: GridCellParams<any, ActionContextActionParameterDefinitionWithTags, any>) => {
                    const parameterDefinition = params?.row?.parameter
                    const config = safelyParseJSON(parameterDefinition?.Config) as ActionParameterDefinitionConfig
                    const parentParameterDefinitionId = config?.ParentParameterDefinitionId

                    const parentParameterDefinition = datagridRows.find(param => param?.parameter?.Id === parentParameterDefinitionId)
                    const parentParameterDefinitionName = parentParameterDefinition?.parameter?.ParameterName || "Not Configured"
                    return <>{parentParameterDefinitionName}</>
                }
            },
            {
                field: "Saved",
                headerName: "Saved",
                flex: 2,
                valueGetter: (params: GridValueGetterParams) => params.row.existsInDB
            }
        ].map(col => {return {width: 20*col.field.length, ...col}}),
        rows: datagridRows,
        autoPageSize: true,
        rowsPerPageOptions: [5, 10, 20],
        initialState: {
            pagination: {
                pageSize: 10
            }
        },
        checkboxSelection: true,
        disableSelectionOnClick: true,
        onCellClick: (params: GridCellParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => params.field!=="__check__" && props?.onSelectParameterForEdit?.(params.row),
        components: {
            Toolbar: () => {
                return (
                    <GridToolbarContainer>
                        <Grid container direction="row-reverse">
                            {!!onCreateNewParameter && <IconButton onClick={onCreateNewParameter}><AddIcon/></IconButton>}
                            {!!onDeleteParameters && <IconButton onClick={handleParameterDelete}><DeleteIcon/></IconButton>}
                            {!!onParameterReset && <IconButton onClick={onParameterReset}><RefreshIcon/></IconButton>}
                        </Grid>
                    </GridToolbarContainer>
                )
            }
        },
        selectionModel: selectedParameters?.map(parameter => parameter.Id!),
        onSelectionModelChange: (newSelectedParametersIds: GridRowId[]) => { 
            setSelectedParameters(paramsWithTag!.filter(pwt => newSelectedParametersIds.includes(pwt.parameter.Id!)).map(pwt => pwt.parameter))
        }
    })

    if(!!paramsWithTag && !!template) {
        return (
            <Box style={{ height: "500px", width: "100%" }}>
                <DataGrid sx={{
                    "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},
                    backgroundColor: 'ActionCardBgColor.main',
                    backgroundBlendMode: "soft-light, normal",
                    border: "2px solid rgba(255, 255, 255, 0.4)",
                    boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
                    mx:'30px',
                    borderRadius: "10px"
                }} {...getDatagridProps()}/> 
            </Box>
            
        )
    } else {
        return <>NO PARAM</>
    }
}

export default ViewActionParameters;
