import React from 'react'
import { Box, Card, Chip, Grid, IconButton, InputAdornment, SvgIcon, TextField, Typography, useTheme} from '@material-ui/core';
import {Tabs, Tab} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import PencilAltIcon from "../../../../../../icons/PencilAlt"
import DeleteIcon from "@material-ui/icons/Delete"
import { ActionParameterDefinition, Tag } from '../../../../../../generated/entities/Entities';
import { DataGrid, GridRowId, GridSelectionModel, GridToolbarContainer } from '@material-ui/data-grid';
import { CustomToolbar } from '../../../../CustomToolbar';


export interface ActionParameterDefinitionListProps {
    parameters: ActionParameterDefinition[],
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
                field: "Parameter Name",
                headerName: "Parameter Name"
            },
            {
                field: "Parameter Type",
                headerName: "Parameter Type"
            },
            {
                field: "Default Value",
                headerName: "Default Value"
            },
            {
                field: "User Input Required",
                headerName: "User Input Required"
            },
            {
                field: "Tags",
                headerName: "Tags",
                width: 400,
                renderCell: (props: any) => <></> // TODO: Add Edit Tag component 
            },
            {
                field: "Actions",
                headerName: "Actions",
                width: 120,
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
        ].map(col => {return {width: 15*col.field.length, ...col}}),
        rows: props.parameters.map(param => {
            return {
                "id": param.Id,
                "Parameter Name": param.ParameterName,
                "Parameter Type": param.Type,
                "Default Value": param.DefaultParameterValue,
                "User Input Required": false
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