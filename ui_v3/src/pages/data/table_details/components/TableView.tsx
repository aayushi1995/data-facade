import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Box, Card, Chip, createFilterOptions, Divider, FormControl, Grid, IconButton, InputAdornment, LinearProgress, NativeSelect, Popover, TextField, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { ChangeEvent, useState } from "react";
import { ReactQueryWrapper } from "../../../../common/components/error-boundary/ReactQueryWrapper";
import LoadingWrapper from "../../../../common/components/LoadingWrapper";
import RunWorkflowButton from '../../../../common/components/RunWorkflowButton';
import useFetchTags from "../../../../common/components/tag-handler/hooks/useFetchTags";
import { SearchBar } from '../../../../css/theme/CentralCSSManager';
import DatafacadeDatatype from "../../../../enums/DatafacadeDatatype";
import labels from "../../../../labels/labels";
import { useTableAndColumnStats } from './ColumnInfoViewHooks';
import { formDataGridPropsFromResponse, isDataGridRenderPossible, useColumn, useColumnDataTypeMutation, useTableView } from "./TableViewHooks";

const TableView = (props: { TableId?: string ,showBTN?:boolean }) => {
    const tableViewQuery = useTableView({ TableId: props.TableId, options: {} })
    const [searchQuery, setSearchQuery] = useState<string | undefined>("")
    const handleSearchChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSearchQuery(event?.target.value)
    }

    const tableCardStyle = {
        borderRadius: '8px', 
        boxShadow: '0px 1.01276px 1.01276px rgba(0, 0, 0, 0.1), 0px 0px 1.01276px rgba(0, 0, 0, 0.25)' 
    }
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Grid container spacing={1} sx={{ display: 'flex', flexDirection: 'row' }}>
                <Grid item xs={12} lg={5}>
                    <TextField variant="standard"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search Columns"
                        multiline={true}
                        sx={{
                            width: '100%',
                            ...SearchBar()
                        }}
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ marginLeft: 1 }} />
                                </InputAdornment>
                            )
                        }} />
                </Grid>
                {props.showBTN &&
                <Grid item xs={12} lg={7}>
                    <Card sx={{ height: '5vh', borderRadius: '5px' }}>
                        <Box sx={{ pt: 1, px: 2 }}>
                            <RunWorkflowButton TableId={props.TableId} />
                        </Box>
                    </Card>
                </Grid>
                } 
            </Grid>
            <Card sx={{...tableCardStyle}}>
                <Box>
                    <ReactQueryWrapper
                        isLoading={tableViewQuery.isLoading}
                        error={tableViewQuery.error}
                        data={tableViewQuery.data}
                        children={() =>
                            isDataGridRenderPossible(tableViewQuery.data) &&
                            <DataGrid sx={{
                                "& .MuiDataGrid-columnHeaderTitleContainerContent": { width: "100%" },
                                "& .MuiDataGrid-columnHeaders": { backgroundColor: "#FFFFFF" },
                                borderRadius: '6px',
                                backgroundColor: '#F0F2F5',
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
    const tableAndColumnStatsQuery = useTableAndColumnStats({ TableId: columnQuery?.data?.TableId })
    const coumnDatatypeMutation = useColumnDataTypeMutation({
        options: {
            onSuccess: () => columnQuery.refetch()
        }
    })

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
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
                        <Box sx={{ px: 3 }}>
                            <Tooltip title={columnQuery?.data?.UniqueName || ""}>
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
                            <IconButton sx={{ height: "24px" }}>
                                <MoreHorizIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    <Divider sx={{ mt: 1 }} />
                    <Box>
                        <FormControl fullWidth>
                            <NativeSelect
                                value={columnQuery?.data?.Datatype}
                                onChange={(event) => { event.stopPropagation(); onColumnDatatypeChange(event.target.value, columnQuery?.data?.Id) }}
                                sx={{
                                    fontFamily: "'Open Sans'",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    letterSpacing: "0.25px",
                                    color: "ActionDefinationHeroTextColor1.main",
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
                    <Divider sx={{ mb: 1 }} />
                    <Box sx={{ mb: "5px" }}>
                        <ColumnHeaderTagSelector ColumnId={ColumnId} />
                    </Box>
                    <Box>
                        <ReactQueryWrapper
                            isLoading={tableAndColumnStatsQuery.isLoading}
                            error={tableAndColumnStatsQuery.error}
                            data={tableAndColumnStatsQuery.data}
                            children={() => {
                                const columnHealth = tableAndColumnStatsQuery?.data?.ColumnInfoAndStats?.find(columnInfo => columnInfo?.ColumnName === columnQuery?.data?.UniqueName)?.ColumnStat?.Health
                                return (
                                    <Tooltip title={columnHealth !== undefined ? `${((columnHealth || 0) * 100).toFixed(2)} %` : "Fetching"}>
                                        <LinearProgress variant={columnHealth !== undefined ? "determinate" : "indeterminate"} value={(columnHealth || 0) * 100} color="success" />
                                    </Tooltip>
                                )
                            }}
                        />
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
        color: "ActionDefinationHeroTextColor1.main",
        borderRadius: '5px',
        py: 1
    }
    const filter = createFilterOptions<string>()
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const [tagsSelectedForEntity, tagsNotSelectedButAvaialbleForEntity, isLoading, isMutating, error, addTag, createAndAddTag, deleteTag] = useFetchTags({
        entityType: labels.entities.ColumnProperties,
        entityId: props?.ColumnId!,
        tagFilter: { Scope: labels.entities.ColumnProperties }
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
        tagCount !== tagsSelectedForEntity.length && tagsToShow.push(`+${tagsSelectedForEntity.length - tagsToShow.length} Tags`)
        return tagsToShow.map((tagName, index) => {
            const tag = <Chip variant="outlined" color="primary" size="small"
                label={tagName}
                onDelete={index < tagCount ? () => deleteTag(tagName) : undefined}
                sx={{ ...chipStyle, maxWidth: chipMaxWidth }} key={`${index}-tag-chip`}
            />
            return <Tooltip title={tagName}>{tag}</Tooltip>
        })
    }

    return (
        <LoadingWrapper
            isLoading={isLoading}
            error={error}
            data={tagsSelectedForEntity}
        >
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={handleClick}>
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
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
                                color: "ActionDefinationHeroTextColor1.main",
                                px: 3,
                                width: "100%"
                            }} onClick={handleClick}>
                                Add / Show Tag
                            </Typography>
                        </Box>
                        <Box sx={{ mr: '7px', display: "flex", height: "100%", justifyContent: "center", alignItems: "center" }}>
                            <ArrowDropDownIcon />
                        </Box>
                    </Box>
                    <Box sx={{ width: "100%", py: "4px" }}>
                        <Divider orientation='horizontal' />
                    </Box>
                    <Box sx={{ px: 3, overflowX: "auto", display: "flex", flexDirection: "row", gap: 1 }}>
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
                <Grid container spacing={2} sx={{ overflowY: 'auto', p: 2, width: "450px" }}>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={tagsNotSelectedButAvaialbleForEntity}
                            filterSelectedOptions
                            fullWidth
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            disabled={(isLoading || isMutating || (!!error))}
                            onChange={(event, value, reason, details) => {
                                if (!!value) {
                                    if (value?.includes("Create Tag: ")) {
                                        createAndAddTag(value.substring(12))
                                    } else {
                                        addTag(value)
                                    }
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="Add Tag" />}
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
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, flexWrap: "wrap", alignItems: "center", height: "100%" }}>
                            {getTagChips(undefined)}
                        </Box>
                    </Grid>
                </Grid>
            </Popover>
        </LoadingWrapper>
    )
}


export default TableView;