
import React from 'react'
import { Box, Card, Chip, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SvgIcon, TextField, Typography, useTheme} from '@material-ui/core';
import {Tabs, Tab} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import PencilAltIcon from "../../../../../../icons/PencilAlt"
import DeleteIcon from "@material-ui/icons/Delete"
import { ActionParameterDefinition, ActionTemplate, Tag } from '../../../../../../generated/entities/Entities';
import { DataGrid, GridToolbarContainer } from '@material-ui/data-grid';
import { CustomToolbar } from '../../../../CustomToolbar';
import { InputMap } from '../../../../../../custom_enums/ActionParameterDefinitionInputMap';


export interface EditActionParameterDefinitionProps {
    parameterDefinition?: ActionParameterDefinition,
    template: ActionTemplate
}


const EditActionParameterDefinition = (props: EditActionParameterDefinitionProps) => {
    const theme = useTheme();
    
    const handleParameterNameChange = () => {}
    const handleParameterTypeChange = () => {}
    const handleUserInputRequiredChange = () => {}

    if(!!props.parameterDefinition) {
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} md={8} lg={6}>
                    <FormControl sx={{width: "100%"}}>
                        <InputLabel htmlFor="component-outlined">Type Parameter Name</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            value={props.parameterDefinition.ParameterName}
                            onChange={handleParameterNameChange}
                            label="Type Parameter Name"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <FormControl sx={{width: "100%"}}>
                        <InputLabel htmlFor="component-outlined">Type</InputLabel>
                        <Select
                            variant="outlined"
                            value={props.parameterDefinition.Type}
                            fullWidth
                            onChange={handleParameterTypeChange}
                            label="Type"
                        >
                            {Object.keys(InputMap[props.template.Language!]).map((inputType) => {
                                return <MenuItem value={inputType}>{inputType}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <FormControl sx={{width: "100%"}}>
                        <InputLabel htmlFor="component-outlined">User Input Required</InputLabel>
                        <Select
                            variant="outlined"
                            value={false}
                            fullWidth
                            onChange={handleUserInputRequiredChange}
                            label="User Input Required"
                        >
                            <MenuItem value={"Yes"}>Yes</MenuItem>
                            <MenuItem value={"No"}>No</MenuItem>
                        </Select>
                    </FormControl>    
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    DEFAULT VALUE SELECTOR
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    SELECT TAGS
                </Grid>
            </Grid>
        )
    } else {
        return <></>
    }
}


  


export default EditActionParameterDefinition;