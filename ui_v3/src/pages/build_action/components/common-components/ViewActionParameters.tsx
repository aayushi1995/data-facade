import { Box, Grid, IconButton, useTheme } from "@mui/material";
import React from "react";
import PencilAltIcon from "../../../../icons/PencilAlt"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from "@mui/icons-material/Refresh"
import VirtualTagHandler from "../../../../common/components/tag-handler/VirtualTagHandler";
import { ActionParameterDefinition, ActionTemplate, Tag } from "../../../../generated/entities/Entities";
import { CustomToolbar } from "../../../../common/components/CustomToolbar";
import { DataGrid, GridRowId, GridToolbarContainer, GridValueGetterParams } from "@mui/x-data-grid";
import TemplateLanguage from "../../../../enums/TemplateLanguage";
import { getInputTypeFromAttributesNew } from "../../../../custom_enums/ActionParameterDefinitionInputMap";
import { template } from "@babel/core";

export interface ViewActionParametersProps {
    template?: ActionTemplate,
    paramsWithTag?: {
        parameter: ActionParameterDefinition,
        tags: Tag[],
    }[],
    onSelectParameterForEdit: (selectedParam: {parameter: ActionParameterDefinition, tags: Tag[]}) => void,
    onDeleteParameters: (deletedParams: ActionParameterDefinition[]) => void,
    onParameterReset: () => void,
    onCreateNewParameter: () => void
}

const ViewActionParameters = (props: ViewActionParametersProps) => {
    const theme = useTheme()
    const {paramsWithTag, onSelectParameterForEdit, onDeleteParameters, onCreateNewParameter, onParameterReset} = props

    const [selectedParameters, setSelectedParameters] = React.useState<ActionParameterDefinition[]|undefined>()

    const handleParameterDelete = () => {
        if(!!selectedParameters && selectedParameters.length > 0) {
            onDeleteParameters(selectedParameters)
        }
    }

    React.useEffect(() => {
        if(selectedParameters===undefined && !!paramsWithTag && !!paramsWithTag[0]){
            onSelectParameterForEdit(paramsWithTag[0]!)
        }
    }, [paramsWithTag])
    
    const getDatagridProps = () => ({
        columns: [
            {
                field: "ParameterName",
                headerName: "Parameter Name",
                valueGetter: (params: GridValueGetterParams) => params.row.parameter.ParameterName
            },
            {
                field: "InputType",
                headerName: "Input Type",
                valueGetter: (params: GridValueGetterParams) => {
                    const parameter = params.row.parameter
                    return getInputTypeFromAttributesNew(props.template?.Language || TemplateLanguage.SQL, parameter.Tag, parameter.Type, parameter.Datatype)
                }
            },
            {
                field: "DefaultValue",
                headerName: "Default Value",
                valueGetter: (params: GridValueGetterParams) => {
                    const parameter: ActionParameterDefinition = params.row.parameter
                    return parameter.DefaultParameterValue
                }
            },
            // {
            //     field: "User Input Required",
            //     headerName: "User Input Required"
            // },
            {
                field: "Tags",
                headerName: "Tags",
                width: 300,
                renderCell: (params: any) => 
                <Box sx={{overflowY: "auto"}}>
                    <VirtualTagHandler
                        tagFilter={{}}
                        allowAdd={false}
                        allowDelete={false}
                        selectedTags={params.row.tags}
                        onSelectedTagsChange={() => {}}
                        orientation="VERTICAL"
                        direction="DEFAULT"
                    />
                </Box>
            },
            {
                field: "Actions",
                headerName: "Actions",
                width: 200,
                renderCell: (props: any) => {
                    const handleClick = (event:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                        event.stopPropagation()
                        props.api.componentsProps.onSelectParameterForEdit(props.row)
                    }
                    return (
                        <Box sx={{display: "flex", flexDirection: "row"}}>
                            <Box>
                                <IconButton onClick={handleClick}>
                                    <PencilAltIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    )
                }
            }
        ].map(col => {return {width: 20*col.field.length, ...col}}),
        rows: paramsWithTag!.map(p => ({...p, id: p.parameter.Id})),
        autoHeight: true,
        autoPageSize: true,
        rowsPerPageOptions: [5, 10, 15],
        checkboxSelection: true,
        componentsProps: {
            onSelectParameterForEdit: onSelectParameterForEdit
        },
        components: {
            Toolbar: () => {
                return (
                    <GridToolbarContainer>
                        <Grid container direction="row-reverse">
                            <IconButton onClick={onCreateNewParameter}><AddIcon/></IconButton>
                            <IconButton onClick={handleParameterDelete}><DeleteIcon/></IconButton>
                            <IconButton onClick={onParameterReset}><RefreshIcon/></IconButton>
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
            <Box>
                <DataGrid {...getDatagridProps()}/> 
            </Box>
        )
    } else {
        return <>NO PARAM</>
    }
}

export default ViewActionParameters;