import React from 'react'
import { Box, Card, Chip, Grid, IconButton, InputAdornment, SvgIcon, TextField, Typography, useTheme} from '@material-ui/core';
import {Tabs, Tab} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import PencilAltIcon from "../../../../../../icons/PencilAlt"
import DeleteIcon from "@material-ui/icons/Delete"
import { ActionParameterDefinition, Tag } from '../../../../../../generated/entities/Entities';
import { DataGrid, GridRowId, GridSelectionModel, GridToolbarContainer } from '@material-ui/data-grid';
import { CustomToolbar } from '../../../../CustomToolbar';
import { TemplateWithParams } from '../hooks/UseViewAction';
import TagHandler from '../../../../tag-handler/TagHandler';
import { getInputTypeFromAttributesNew, InputMap } from '../../../../../../custom_enums/ActionParameterDefinitionInputMap';
import { template } from '@babel/core';
import TemplateLanguage from '../../../../../../enums/TemplateLanguage';


export interface ActionParameterDefinitionListProps {
    templateWithParams?: TemplateWithParams,
    onParameterSelectForEdit: (actionParameter: ActionParameterDefinition) => void,
    deleteParametersWithIds: (actionParameterIds: string[]) => void
}


const ActionParameterDefinitionList = (props: ActionParameterDefinitionListProps) => {
    const theme = useTheme();
    const [selectedParameterIds, setSelectedParameterIds] = React.useState<string[]>(new Array<string>())

    const handleParameterDelete = () => {
        if(selectedParameterIds.length > 0) {
            props.deleteParametersWithIds(selectedParameterIds)
        }
    }
    
    const datagridProps = {
        columns: [
            {
                field: "ParameterName",
                headerName: "Parameter Name"
            },
            {
                field: "InputType",
                headerName: "Input Type"
            },
            {
                field: "DefaultValue",
                headerName: "Default Value"
            },
            {
                field: "User Input Required",
                headerName: "User Input Required"
            },
            {
                field: "Tags",
                headerName: "Tags",
                width: 200,
                renderCell: (props: any) => <TagHandler
                    entityType="ActionParameterDefinition"
                    entityId={props.row.id}
                    tagFilter={{}}
                    allowAdd={false}
                    allowDelete={true}
                />   
            },
            {
                field: "Actions",
                headerName: "Actions",
                width: 200,
                renderCell: (props: any) => {
                    const handleClick = (event:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                        event.stopPropagation()
                        props.api.componentsProps.onParameterSelectForEdit(props.row)
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
        rows: (props?.templateWithParams?.actionParameterDefinitions || []).map(param => {
            return {
                ...param.model,
                id: param.model.Id,
                "User Input Required": false,
                InputType: getInputTypeFromAttributesNew(props?.templateWithParams?.model?.Language || TemplateLanguage.SQL, param.model.Tag, param.model.Type, param.model.Datatype)
            }
        }),
        autoHeight: true,
        autoPageSize: true,
        rowsPerPageOptions: [5, 10, 15],
        checkboxSelection: true,
        componentsProps: {
            onParameterSelectForEdit: props.onParameterSelectForEdit
        },
        components: {
            Toolbar: CustomToolbar([
                <IconButton onClick={handleParameterDelete}><DeleteIcon/></IconButton>
            ])
        },
        selectionModel: selectedParameterIds,
        onSelectionModelChange: (newSelectedParameterIds: GridRowId[]) => { 
            setSelectedParameterIds(newSelectedParameterIds.map(x => x.toString())) 
        }
    }

    return(
        <Box>
            <DataGrid {...datagridProps}/> 
        </Box>
        
    )
}

export default ActionParameterDefinitionList;