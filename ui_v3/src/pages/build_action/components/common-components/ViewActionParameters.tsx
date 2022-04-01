import { template } from "@babel/core";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Grid, IconButton, useTheme } from "@mui/material";
import { DataGrid, GridRenderCellParams, GridRowId, GridToolbarContainer, GridValueGetterParams } from "@mui/x-data-grid";
import React from "react";
import VirtualTagHandler from "../../../../common/components/tag-handler/VirtualTagHandler";
import { getInputTypeFromAttributesNew } from "../../../../custom_enums/ActionParameterDefinitionInputMap";
import TemplateLanguage from "../../../../enums/TemplateLanguage";
import { ActionParameterDefinition, ActionTemplate, Tag } from "../../../../generated/entities/Entities";
import PencilAltIcon from "../../../../icons/PencilAlt";
import { ActionContextActionParameterDefinitionWithTags } from "../../context/BuildActionContext";

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
        console.log(paramsWithTag, selectedParameters)
        if(selectedParameters===undefined && !!paramsWithTag && !!paramsWithTag[0]){
            console.log(selectedParameters)
            onSelectParameterForEdit?.(paramsWithTag[0]!)
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
                renderCell: (props: GridRenderCellParams) => {
                    const handleClick = (event:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                        event.stopPropagation()
                        onSelectParameterForEdit?.(props.row)
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
            },
            {
                field: "Saved",
                headerName: "Saved",
                width: 100,
                valueGetter: (params: GridValueGetterParams) => params.row.existsInDB
            }
        ].map(col => {return {width: 20*col.field.length, ...col}}),
        rows: paramsWithTag!.map(p => ({...p, id: p.parameter.Id})),
        autoPageSize: true,
        rowsPerPageOptions: [5, 10, 15],
        checkboxSelection: true,
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
            <Box style={{ height: 300, width: "100%" }}>
                <DataGrid {...getDatagridProps()}/> 
            </Box>
        )
    } else {
        return <>NO PARAM</>
    }
}

export default ViewActionParameters;
