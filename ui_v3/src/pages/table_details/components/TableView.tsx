import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Autocomplete, Box, Card, Chip, createFilterOptions, Divider, FormControl, Grid, IconButton, NativeSelect, Popover, TextField, Typography } from "@mui/material";
import { DataGrid, GridColumnHeaderParams } from "@mui/x-data-grid";
import React from "react";
import LoadingWrapper from "../../../common/components/LoadingWrapper";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import useFetchTags from "../../../common/components/tag-handler/hooks/useFetchTags";
import DatafacadeDatatype from "../../../enums/DatafacadeDatatype";
import { ColumnInfo } from "../../../generated/interfaces/Interfaces";
import labels from "../../../labels/labels";
import { formDataGridPropsFromResponse, useColumn, useColumnDataTypeMutation, useTableView } from "./TableViewHooks";

const TableView = (props: {TableId?: string}) => {
    const tableViewQuery = useTableView({ TableId: props.TableId, options: {}})
    return (
        <Card sx={{ p:1 , borderRadius: 2 }}>
            <Box>
                <LoadingWrapper
                    isLoading={tableViewQuery.isLoading}
                    error={tableViewQuery.error}
                    data={tableViewQuery.data}
                >
                    <DataGrid sx={{ 
                        "& .MuiDataGrid-columnHeaderTitleContainerContent": { width: "100%" },
                        "& .MuiDataGrid-columnHeaders": { background: "#E8E8E8"}
                    }}
                        {...formDataGridPropsFromResponse(tableViewQuery.data)}  
                    />
                </LoadingWrapper>
            </Box>
        </Card>
    )
}

export interface TableViewColumnHeaderProps {
    gridColumnHeaderParams: GridColumnHeaderParams,
    columnInfo?: ColumnInfo
}

export const TableViewColumnHeader = (props: TableViewColumnHeaderProps) => {
    const { gridColumnHeaderParams, columnInfo } = props
    const editDatatypeMutation = useColumnDataTypeMutation({options: {}})

    const columnQuery = useColumn({ ColumnId: columnInfo?.ColumnProperties?.Id, options: {} })
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
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Box>
                    <Typography sx={{
                        fontFamily: "'Open Sans'",
                        fontStyle: "normal",
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: "24px"
                    }}>
                    {columnInfo?.ColumnProperties?.UniqueName}
                    </Typography>
                </Box>
                <Box>
                    <IconButton sx={{ height: "24px"}}>
                        <MoreHorizIcon/>
                    </IconButton>
                </Box>
            </Box>
            <Divider/>
            <Box>
                <ReactQueryWrapper
                    isLoading={columnQuery.isLoading}
                    error={columnQuery.error}
                    data={columnQuery.data}
                    children={() => 
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
                                    color: "#253858"
                                }}
                            >
                                <option value={DatafacadeDatatype.BOOLEAN}>{DatafacadeDatatype.BOOLEAN}</option>
                                <option value={DatafacadeDatatype.STRING}>{DatafacadeDatatype.STRING}</option>
                                <option value={DatafacadeDatatype.INT}>{DatafacadeDatatype.INT}</option>
                                <option value={DatafacadeDatatype.FLOAT}>{DatafacadeDatatype.FLOAT}</option>
                            </NativeSelect>
                        </FormControl>
                    }
                />
            </Box>
            <Divider/>
            <Box>
                { !!props?.columnInfo?.ColumnProperties?.Id && <ColumnHeaderTagSelector ColumnId={props?.columnInfo?.ColumnProperties?.Id}/> }
            </Box>
            <Divider/>
            <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Typography sx={{
                    fontFamily: "'Open Sans'",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    display: "flex",
                    alignItems: "center",
                    letterSpacing: "0.25px",
                    color: "#253858"
                }}>
                    Number of Actions: {columnInfo?.NumberOfActions}
                </Typography>
            </Box>
        </Box>    
    )
}

export type ColumnHeaderTagSelectorProps = {
    ColumnId: string
}

export const ColumnHeaderTagSelector = (props: ColumnHeaderTagSelectorProps) => {
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

    return(
        <LoadingWrapper
            isLoading={isLoading}
            error={error}
            data={tagsSelectedForEntity}
        >
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={handleClick}>
                <Box sx={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center" }}>
                    <Typography sx={{
                        fontFamily: "'Open Sans'",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "20px",
                        display: "flex",
                        alignItems: "center",
                        letterSpacing: "0.25px",
                        color: "#253858"
                    }} onClick={handleClick}>
                            Tag
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center" }}>
                    <ArrowDropDownIcon/>
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
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{display: "flex", flexDirection: "row", gap: 1, flexWrap: "wrap", alignItems: "center", height: "100%"}}>
                            {tagsSelectedForEntity.length > 0 ? 
                                tagsSelectedForEntity.map(tagName => 
                                    <Box>
                                        <Chip variant="outlined" color="primary" size="small" 
                                            label={tagName} 
                                            onDelete={() => deleteTag(tagName)}
                                            sx={{
                                                fontFamily: "SF Pro Text",
                                                fontStyle: "normal",
                                                fontWeight: "normal",
                                                fontSize: "13px",
                                                lineHeight: "24px",
                                                display: "flex",
                                                alignItems: "center",
                                                letterSpacing: "0.073125px",
                                                color: "#253858",
                                                pt: 2,
                                                pb: 2
                                            }}
                                        />
                                    </Box>
                                )
                            :
                                <Box>
                                    <Chip variant="outlined" color="primary" size="small" 
                                        label={"No Tags"} 
                                        sx={{
                                            fontFamily: "SF Pro Text",
                                            fontStyle: "normal",
                                            fontWeight: "normal",
                                            fontSize: "13px",
                                            lineHeight: "24px",
                                            display: "flex",
                                            alignItems: "center",
                                            letterSpacing: "0.073125px",
                                            color: "#253858",
                                            pt: 2,
                                            pb: 2
                                        }}
                                    />
                                </Box>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Popover>
        </LoadingWrapper>
    )
}


export default TableView;