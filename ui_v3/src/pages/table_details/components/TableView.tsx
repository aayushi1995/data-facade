import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Box, Card, Chip, createFilterOptions, Divider, FormControl, Grid, IconButton, InputAdornment, NativeSelect, Popover, TextField, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { ChangeEvent, useState } from "react";
import LoadingWrapper from "../../../common/components/LoadingWrapper";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import useFetchTags from "../../../common/components/tag-handler/hooks/useFetchTags";
import { lightShadows } from '../../../css/theme/shadows';
import DatafacadeDatatype from "../../../enums/DatafacadeDatatype";
import labels from "../../../labels/labels";
import { formDataGridPropsFromResponse, isDataGridRenderPossible, useColumn, useColumnDataTypeMutation, useTableView } from "./TableViewHooks";

const TableView = (props: {TableId?: string}) => {
    const tableViewQuery = useTableView({ TableId: props.TableId, options: {}})
    const [searchQuery, setSearchQuery] = useState<string|undefined>("")
    const handleSearchChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSearchQuery(event?.target.value)
    }
    
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 5}}>
            <Box>
                <TextField variant="standard" 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search Columns"
                    multiline={true}
                    sx={{width: '40%', 
                        background: '#E0E5EC',
                        boxSizing: 'border-box', 
                        boxShadow: 'inset -4px -6px 16px rgba(255, 255, 255, 0.5), inset 4px 6px 16px rgba(163, 177, 198, 0.5);',
                        backgroundBlendMode: 'soft-light, normal', 
                        borderRadius: '26px',
                        display: 'flex', 
                        justifyContent: 'center', 
                        minHeight: '50px'}}
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{marginLeft: 1}}/>
                            </InputAdornment>
                        )
                }}/>
            </Box>
            <Card sx={{borderRadius: 2, boxShadow: lightShadows[31]}}>
                <Box>
                    <ReactQueryWrapper
                        isLoading={tableViewQuery.isLoading}
                        error={tableViewQuery.error}
                        data={tableViewQuery.data}
                        children={() =>
                            isDataGridRenderPossible(tableViewQuery.data) &&
                                <DataGrid sx={{ 
                                    "& .MuiDataGrid-columnHeaderTitleContainerContent": { width: "100%" },
                                    "& .MuiDataGrid-columnHeaders": { background: "#E8E8E8"}
                                }}
                                    {...formDataGridPropsFromResponse(tableViewQuery.data, searchQuery)}  
                                />
                        }
                    />
                </Box>
            </Card>
        </Box>
    )
}

export interface TableViewColumnHeaderProps {
    ColumnId: string
}

export const TableViewColumnHeader = (props: TableViewColumnHeaderProps) => {
    const { ColumnId } = props
    
    const columnQuery = useColumn({ ColumnId: ColumnId, options: {} })
    const coumnDatatypeMutation = useColumnDataTypeMutation({ options: {
        onSuccess: () => columnQuery.refetch()
    }})

    const onColumnDatatypeChange = (newDatatype: string, columnId?: string) => {
        coumnDatatypeMutation.mutate({
            columnId: columnId,
            newDataType: newDatatype
        })
    }
    
    return (
        <ReactQueryWrapper
            isLoading={columnQuery.isLoading}
            error={columnQuery.error}
            data={columnQuery.data}
            children={() => 
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flex: 1}}>
                        <Box sx={{ px: 2 }}>
                            <Tooltip title={columnQuery?.data?.UniqueName}>
                                <Typography sx={{
                                    fontFamily: "'Open Sans'",
                                    fontStyle: "normal",
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    lineHeight: "24px"
                                }}>
                                    {columnQuery?.data?.UniqueName}
                                </Typography>
                            </Tooltip>
                        </Box>
                        <Box>
                            <IconButton sx={{ height: "24px"}}>
                                <MoreHorizIcon/>
                            </IconButton>
                        </Box>
                    </Box>
                    <Divider sx={{ mt: 1 }}/>
                    <Box>
                        <FormControl fullWidth>
                            <NativeSelect
                                value={columnQuery?.data?.Datatype}
                                onChange={(event) => {event.stopPropagation(); onColumnDatatypeChange(event.target.value, columnQuery?.data?.Id)}}
                                sx={{
                                    fontFamily: "'Open Sans'",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    letterSpacing: "0.25px",
                                    color: "#253858",
                                    px: 3
                                }}
                                disableUnderline
                            >
                                <option value={DatafacadeDatatype.BOOLEAN}>{DatafacadeDatatype.BOOLEAN}</option>
                                <option value={DatafacadeDatatype.STRING}>{DatafacadeDatatype.STRING}</option>
                                <option value={DatafacadeDatatype.INT}>{DatafacadeDatatype.INT}</option>
                                <option value={DatafacadeDatatype.FLOAT}>{DatafacadeDatatype.FLOAT}</option>
                            </NativeSelect>
                        </FormControl>
                    </Box>
                    <Divider sx={{ mb: 1 }}/>
                    <Box sx={{ pb: 1 }}>
                        <ColumnHeaderTagSelector ColumnId={ColumnId}/>
                    </Box>
                </Box>   
            }
        /> 
    )               
}

export type ColumnHeaderTagSelectorProps = {
    ColumnId: string
}

export const ColumnHeaderTagSelector = (props: ColumnHeaderTagSelectorProps) => {
    const chipStyle = {
        fontFamily: "SF Pro Text",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "13px",
        lineHeight: "24px",
        display: "flex",
        alignItems: "center",
        letterSpacing: "0.073125px",
        color: "#253858",
        py: 1
    }
    const filter = createFilterOptions<string>()
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const [tagsSelectedForEntity, tagsNotSelectedButAvaialbleForEntity, isLoading, isMutating, error, addTag, createAndAddTag, deleteTag] = useFetchTags({
        entityType: labels.entities.ColumnProperties,
        entityId: props?.ColumnId!,
        tagFilter: {}
    })

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getTagChips = (howMany?: number, chipMaxWidth: string = "auto") => {
        const tagsToShow = tagsSelectedForEntity.slice(0, howMany || tagsSelectedForEntity.length)
        const tagCount = tagsToShow.length
        tagCount === 0 && tagsToShow.push("No Tags")
        tagCount !== tagsSelectedForEntity.length && tagsToShow.push(`+${tagsSelectedForEntity.length-tagsToShow.length} Tags`)
        return tagsToShow.map((tagName, index) => {
            const tag = <Chip variant="outlined" color="primary" size="small"
                            label={tagName}
                            onDelete={index<tagCount ? () => deleteTag(tagName) : undefined}
                            sx={{...chipStyle, maxWidth: chipMaxWidth }}
                        />
            return <Tooltip title={tagName}>{tag}</Tooltip>
        })
    }

    return(
        <LoadingWrapper
            isLoading={isLoading}
            error={error}
            data={tagsSelectedForEntity}
        >
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={handleClick}>
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%"}}>
                    <Box sx={{ display: "flex", flexDirection: "row", width: "100%"}}>
                        <Box sx={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center", flex: 1 }}>
                            <Typography sx={{
                                fontFamily: "'Open Sans'",
                                fontStyle: "normal",
                                fontWeight: 400,
                                fontSize: "14px",
                                lineHeight: "20px",
                                display: "flex",
                                alignItems: "center",
                                letterSpacing: "0.25px",
                                color: "#253858",
                                px: 3,
                                width: "100%"
                            }} onClick={handleClick}>
                                    Add / Show Tag
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center" }}>
                            <ArrowDropDownIcon/>
                        </Box>
                    </Box>
                    <Box sx={{ width: "100%", py: "4px" }}>
                        <Divider orientation='horizontal'/> 
                    </Box>
                    <Box sx={{ overflowX: "auto", display: "flex", flexDirection: "row", gap: 1}}>
                        {getTagChips(1, "100px")}
                    </Box>
                </Box>
            </Box>
            
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Grid container spacing={2} sx={{overflowY: 'auto', p: 2, width: "450px"}}>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={tagsNotSelectedButAvaialbleForEntity}
                            filterSelectedOptions
                            fullWidth
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            disabled={(isLoading || isMutating ||(!!error))}
                            onChange={(event, value, reason, details) => {
                                if(!!value){
                                    if(value?.includes("Create Tag: ")){
                                        createAndAddTag(value.substring(12))
                                    } else {
                                        addTag(value)
                                    }
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="Add Tag"/>}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                if (params.inputValue !== '') {
                                    filtered.push(`Create Tag: ${params.inputValue}`);
                                }
                                return filtered;
                            }}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{display: "flex", flexDirection: "row", gap: 1, flexWrap: "wrap", alignItems: "center", height: "100%"}}>
                            {getTagChips(undefined)}
                        </Box>
                    </Grid>
                </Grid>
            </Popover>
        </LoadingWrapper>
    )
}


export default TableView;