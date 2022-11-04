import AddIcon from '@mui/icons-material/Add';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Autocomplete, Box, Button, Chip, createFilterOptions, Dialog, FormControl, IconButton, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { DataGrid, DataGridProps, GridRenderCellParams, GridRenderEditCellParams, GridRowId, GridToolbarContainer } from "@mui/x-data-grid";
import { ChangeEvent, useState } from 'react';
import ConfirmationDialog from '../../../../common/components/ConfirmationDialog';
import useFetchVirtualTags from '../../../../common/components/tag-handler/hooks/useFetchVirtualTags';
import { ActionParameterAdditionalConfig } from "../../../../common/components/workflow/create/ParameterInput";
import { getAttributesFromInputType, getInputTypeFromAttributesNew, InputMap } from "../../../../custom_enums/ActionParameterDefinitionInputMap";
import ActionParameterDefinitionTag from "../../../../enums/ActionParameterDefinitionTag";
import { ActionParameterDefinition, Tag } from "../../../../generated/entities/Entities";
import { safelyParseJSON } from "../../../execute_action/util";
import { ActionContextActionParameterDefinitionWithTags } from "../../context/BuildActionContext";
import { ActionParameterDefinitionConfig } from "./EditActionParameter";
import DefaultValueInput from "./parameter_input/DefaultValueInput";

const tagFilter = createFilterOptions<Tag>()
const stringFilter = createFilterOptions<string|undefined>()

export const textStyle = {
    fontFamily: "'Rubik'", 
    fontStyle: "normal", 
    fontWeight: 400, 
    fontSize: "16px", 
    lineHeight: "116.7%"
}


export interface ViewActionParametersProps {
    templateLanguage?: string,
    paramsWithTag?: ActionContextActionParameterDefinitionWithTags[],
    paramsAdditionalConfig?: ActionParameterAdditionalConfig[],
    onDeleteParameters?: (deletedParams: ActionParameterDefinition[]) => void,
    onParameterReset?: () => void,
    onTagsChange: (parameterId?: string, newTags?: Tag[]) => void,
    onParameterEdit: (newParameter: ActionParameterDefinition) => void,
    onParameterTypeEdit: (newParameter: ActionParameterDefinition) => void
    onCreateNewParameter?: () => void,
    onParameterDuplicate: (parametersToDuplicate: ActionParameterDefinition[]) => void
}

type ViewActionParametersDataGridRow = {
    id?: string,
    ParameterId?: string,
    ParameterName?: string,
    ParameterInputType?: string,
    ParameterDisplayName?: string,
    ParameterDescription?: string
}

const ViewActionParameters = (props: ViewActionParametersProps) => {
    console.log("ReRendering")
    const { templateLanguage, paramsWithTag, paramsAdditionalConfig, onParameterEdit, onParameterTypeEdit, onDeleteParameters, onCreateNewParameter, onParameterDuplicate, onTagsChange } = props
    const [selectedParams, setSelectedParams] = useState<string[]>([])
    const dataGridRows: ViewActionParametersDataGridRow[] = ( paramsWithTag || [] )?.sort(paramWithTag => paramWithTag?.parameter?.Index || 0)?.map(paramWithTag => {
        const parameter = paramWithTag?.parameter
        const parameterId = parameter?.Id
        const parameterName = parameter?.ParameterName
        const parameterDisplayName = parameter?.DisplayName
        const parameterDescription = parameter?.Description
        const parameterInputType = getInputTypeFromAttributesNew(templateLanguage, parameter?.Tag, parameter?.Type, parameter?.Datatype)

        console.log(parameterName)
        
        return {
            id: parameter?.Id,
            ParameterId: parameterId,
            ParameterName: parameterName,
            ParameterDisplayName: parameterDisplayName,
            ParameterDescription: parameterDescription,
            ParameterInputType: parameterInputType
        } as ViewActionParametersDataGridRow
    })

    const handleParameterChange = (parameterId?: string,  newParameterDefinition?: ActionParameterDefinition) => {
        const parameterDefinition = paramsWithTag?.find(paramWithTag => paramWithTag?.parameter?.Id===parameterId)?.parameter
        onParameterEdit({
            ...parameterDefinition,
            ...newParameterDefinition
        })
    }

    const handleParameterInputTypeChange = (parameterId?: string, newInputType?: string) => {
        const parameterDefinition = paramsWithTag?.find(paramWithTag => paramWithTag?.parameter?.Id===parameterId)?.parameter
        onParameterTypeEdit({
            ...parameterDefinition,
            ...getAttributesFromInputType(newInputType, templateLanguage)
        })
    }

    const getParamWithTags = (paramId?: string) => paramsWithTag?.find(paramWithTag => paramWithTag?.parameter?.Id===paramId)
    const getAdditionalConfig = (paramId?: string) => paramsAdditionalConfig?.find(paramAdditionalConfig => paramAdditionalConfig?.parameterDefinitionId===paramId)
    
    const dataGridProps: DataGridProps = {
        columns: [
            {
                headerName: "Parameter Name",
                flex: 5,
                field: "ParameterName",
                renderCell: (params: GridRenderCellParams<ViewActionParametersDataGridRow>) => {
                    return  <Typography variant="parameterGrid">
                                {params?.row?.ParameterName}
                            </Typography>
                },
                renderEditCell: (params: GridRenderEditCellParams<ViewActionParametersDataGridRow>) => {
                    return <DatagridTextEditCell
                                key={`${params?.row?.ParameterId}-name`}
                                value={params?.row?.ParameterName}
                                setValue={(newValue?: string) => {
                                    handleParameterChange(params?.row?.ParameterId, { ParameterName: newValue })
                                }}
                            />
                },
                editable: true
            },
            {
                headerName: "Description",
                flex: 3,
                field: "Description",
                renderCell: (params: GridRenderCellParams<ViewActionParametersDataGridRow>) => {
                    return <DescriptionEditor
                                parameterId={params?.row?.ParameterId}
                                parameterName={params?.row?.ParameterName}
                                parameterInputType={params?.row?.ParameterInputType}
                                parameterDescription={params?.row?.ParameterDescription}
                                onParameterDescriptionSave={(newParameterDescription?: string) => {
                                    handleParameterChange(params?.row?.ParameterId, { Description: newParameterDescription })
                                }}
                            />
                }
            },
            {
                headerName: "Display Name",
                flex: 5,
                field: "ParameterDisplayName",
                renderCell: (params: GridRenderCellParams<ViewActionParametersDataGridRow>) => {
                    return <Typography variant="parameterGrid">
                            {params?.row?.ParameterDisplayName}
                        </Typography>
                },
                renderEditCell: (params: GridRenderEditCellParams<ViewActionParametersDataGridRow>) => {
                    return <DatagridTextEditCell
                                key={`${params?.row?.ParameterId}-display-name`}
                                value={params?.row?.ParameterDisplayName}
                                setValue={(newValue?: string) => {
                                    handleParameterChange(params?.row?.ParameterId, {DisplayName: newValue})
                                }}
                            />
                },
                editable: true
            },
            {
                headerName: "Input Type",
                flex: 5,
                field: "InputType",
                renderCell: (params?: GridRenderCellParams<ViewActionParametersDataGridRow>) => {
                    const parameter = getParamWithTags(params?.row?.ParameterId)?.parameter
                    return <FormControl sx={{width: "100%"}}>
                                <Select
                                    variant="standard"
                                    value={getInputTypeFromAttributesNew(templateLanguage, parameter?.Tag, parameter?.Type, parameter?.Datatype)}
                                    fullWidth
                                    onChange={(event: SelectChangeEvent<string>) => {
                                        const newInputType = event.target.value
                                        handleParameterInputTypeChange(params?.row?.ParameterId, newInputType)
                                    }}
                                    placeholder="Not Configured"
                                    disableUnderline={true}
                                    sx={{
                                        ...textStyle
                                    }}
                                >
                                    {Object.keys(InputMap[templateLanguage!]).map((inputType) => {
                                        return <MenuItem value={inputType}>{inputType}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                }
            },
            {
                headerName: "Default Value",
                flex: 10,
                field: "DefaultValue",
                renderCell: (params?: GridRenderCellParams<ViewActionParametersDataGridRow>) => {
                    return <DefaultValueInput
                                actionParameterDefinition={getParamWithTags(params?.row?.ParameterId)?.parameter}
                                actionParameterDefinitionAdditionalConfig={getAdditionalConfig(params?.row?.ParameterId)}
                                onDefaultValueChange={(newDefaultValue?: string) => {
                                    handleParameterChange(params?.row?.ParameterId, {DefaultParameterValue: newDefaultValue})
                                }}
                            />
                }
            },
            {
                headerName: "Tags",
                flex: 10,
                field: "Tags",
                renderCell: (params?: GridRenderCellParams<ViewActionParametersDataGridRow>) => {
                    const parameter = getParamWithTags(params?.row?.ParameterId)
                    const onChange = (newTags?: Tag[]) => onTagsChange(parameter?.parameter?.Id, newTags)
                    return (
                        <TagEditor
                            tags={parameter?.tags}
                            onTagsChange={onChange}
                        />
                    )
                }
            },
            {
                headerName: "Parent",
                flex: 6,
                field: "Parent",
                renderCell: (params: GridRenderCellParams<ViewActionParametersDataGridRow>) => {
                    return <ConfigureParentParameter
                                allParamDefs={paramsWithTag?.map(paramWithTag => paramWithTag?.parameter)}
                                currentParamDef={getParamWithTags(params?.row?.ParameterId)?.parameter}
                                onParameterEdit={(editedParam: ActionParameterDefinition) => handleParameterChange(params?.row?.ParameterId, editedParam)}
                            />
                }
            },
            {
                headerName: "Actions",
                flex: 5,
                field: "Actions",
                renderCell: (params: GridRenderCellParams<ViewActionParametersDataGridRow>) => {
                    const parameter = getParamWithTags(params?.row?.ParameterId)?.parameter
                    return (
                        <ActionCell
                            parameterId={parameter?.Id}
                            onParameterDelete={(parameterId?: string) => onDeleteParameters?.([{Id: parameterId}])}
                            onParameterDuplicate={(parameterId?: string) => onParameterDuplicate?.([{Id: parameterId}])}
                        />
                    )
                }
            }
        ],
        rows: dataGridRows,
        checkboxSelection: true,
        disableSelectionOnClick: true,
        selectionModel: selectedParams,
        onSelectionModelChange: (newSelectedParametersIds: GridRowId[]) => setSelectedParams(newSelectedParametersIds as (string[])),
        rowsPerPageOptions: [5, 10, 20],
        initialState: {
            pagination: {
                pageSize: 10
            }
        },
        components: {
            Toolbar: () => {
                const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
                const openDeleteDialog = () => setDeleteDialogOpen(true)
                const closeDeleteDialog = () => setDeleteDialogOpen(false)
                return (
                    <GridToolbarContainer>
                        <Box sx={{ display: "flex", flexDirection: "row", width: "100%", py: 1 }}>
                            <Box sx={{ flex: 1 }}>
                                <Button variant="contained" 
                                    endIcon={<AddIcon/>} 
                                    onClick={() => onCreateNewParameter?.()}
                                >
                                    Add New Parameter
                                </Button>
                            </Box>
                            <Box>
                                <IconButton disabled={selectedParams?.length === 0}  onClick={() => onParameterDuplicate?.((selectedParams || []).map(paramId => ({ Id: paramId })))}><ContentCopyIcon/></IconButton>
                            </Box>
                            <Box>
                                <ConfirmationDialog
                                    messageToDisplay="Are you sure you want to delete the parameter?  This action cannot be undone."
                                    acceptString="Delete"
                                    declineString="Cancel"
                                    onAccept={() => onDeleteParameters?.((selectedParams || []).map(paramId => ({ Id: paramId })))}
                                    onDecline={closeDeleteDialog}
                                    dialogOpen={deleteDialogOpen}
                                    onDialogClose={closeDeleteDialog}
                                />
                                <IconButton disabled={selectedParams?.length === 0} onClick={() => openDeleteDialog()}><DeleteIcon/></IconButton>
                            </Box>
                        </Box>
                    </GridToolbarContainer>
                )
            }
        }
        
    }    
    
    return (
        <Box sx={{ height: "500px", width: "100%" }}>
            <DataGrid sx={{
                "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},
                backgroundColor: 'ActionCardBgColor.main',
                backgroundBlendMode: "soft-light, normal",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
                borderRadius: "10px"
            }} {...dataGridProps}/> 
        </Box>
    )
}


type DatagridTextEditCellProps = {
    id?: string,
    value ?: string,
    setValue?: (newValue?: string) => void
}
const DatagridTextEditCell = (props: DatagridTextEditCellProps) => {
    // TODO: Find a way to get InputProps sx config from index.js
    const {id, value, setValue} = props
    return <TextField
        key={id}
        value={value}
        defaultValue="Hello World"
        variant='standard'
        InputProps={{
            disableUnderline: true,
            sx: {
                ...textStyle
            }
        }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setValue?.(event.target.value)}
    />
}


type DescriptionEditorProps = { 
    parameterId?: string,
    parameterDescription?: string, 
    parameterName?: string,
    parameterInputType?: string,
    onParameterDescriptionSave?: Function 
}
const DescriptionEditor = (props: DescriptionEditorProps) => {
    const {parameterId, parameterDescription, parameterName, parameterInputType, onParameterDescriptionSave}= props
    const [description, setDescription] = useState(parameterDescription || "")
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const closeDialog = () => setDialogOpen(false)
    const openDialog = () => setDialogOpen(true)

    const saveDescription = () => {
        onParameterDescriptionSave?.(description)
        closeDialog()
    }

    const DialogButton = ((description || "").length > 0) ? (
            <Button variant="outlined"
                onClick={() => openDialog()}
                endIcon={<VisibilityIcon/>}
            >
                View
            </Button>
        )
        :
        (
            <Button variant="contained"
                onClick={() => openDialog()}
                endIcon={<AddIcon/>}
            >
                Add
            </Button>
        )
    
    return (
        <>
            {DialogButton}
            <Dialog onClose={() => closeDialog()} open={dialogOpen} fullWidth={true} maxWidth="sm">
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{
                        background: "#66748A",
                        boxShadow: "inset 0px 15px 25px rgba(54, 48, 116, 0.3)", 
                        transform: "matrix(1, 0, 0, -1, 0, 0)",
                        display: "flex", 
                        flexDirection: "row",
                        alignItems: "center",
                        pl: 2,
                        pr: 1,
                        py: 1
                    }}>
                        <Box sx={{ flex: 1, alignItems: "center" }}>
                            <Typography sx={{
                                fontFamily: "'SF Pro Text'", 
                                fontStyle: "normal", 
                                fontWeight: "500", 
                                fontSize: "16px", 
                                lineHeight: "160%", 
                                letterSpacing: "0.15px", 
                                color: "#F8F8F8",
                                transform: "matrix(1, 0, 0, -1, 0, 0)"
                            }}>
                                Add Parameter Description
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton onClick={() => closeDialog()}>
                                <CloseOutlinedIcon sx={{ background: "#FFFFFF" }}/>
                            </IconButton>
                        </Box>
                    </Box>
                    <Box sx={{ px: 3, pt: 2, pb: 1}}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", border: "1px solid #E0E0E0", borderTopLeftRadius: "20px", borderTopRightRadius: "20px", py:1, px: 2 }}>
                                <Box>
                                    <Typography sx={{
                                        fontFamily: "'SF Pro Text'", 
                                        fontStyle: "normal", 
                                        fontWeight: "400", 
                                        fontSize: "16px", 
                                        lineHeight: "175%", 
                                        letterSpacing: "0.15px", 
                                        color: "#253858"
                                    }}>
                                        {parameterName}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{
                                        fontFamily: "'SF Pro Text'", 
                                        fontStyle: "normal", 
                                        fontWeight: "400", 
                                        fontSize: "14px", 
                                        lineHeight: "143%", 
                                        letterSpacing: "0.15px", 
                                        color: "rgba(66, 82, 110, 0.86)"
                                    }}>
                                        Datatype: {parameterInputType}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx= {{ border: "1px solid #E0E0E0", px: 2 }}>
                                <TextField 
                                    key={`${parameterId}-description-editor`}
                                    value={description} 
                                    variant="standard" 
                                    multiline
                                    minRows={6}
                                    maxRows={8}
                                    placeholder={"Enter Description Here"}
                                    onChange={(event) => setDescription(event.target.value)} 
                                    InputProps ={{
                                        sx: {
                                            fontFamily: "'SF Pro Text'", 
                                            fontStyle: "normal", 
                                            fontWeight: "400", 
                                            fontSize: "14px", 
                                            lineHeight: "143%", 
                                            letterSpacing: "0.15px", 
                                            color: "rgba(66, 82, 110, 0.86)"
                                        },
                                        disableUnderline: true
                                    }}
                                    sx={{ width: "100%" }}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ p: 2, pt: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: "row-reverse", gap: 1 }}>
                            <Box>
                                <Button variant="contained" onClick={() => saveDescription()}>
                                    Save
                                </Button>
                            </Box>
                            <Box>
                                <Button variant="outlined" onClick={() => closeDialog()}>
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </>
    )
}


type ConfigureParentParamProps = {
    allParamDefs?: ActionParameterDefinition[],
    currentParamDef?: ActionParameterDefinition,
    onParameterEdit?: (editedParam: ActionParameterDefinition) => void
}
const ConfigureParentParameter = (props: ConfigureParentParamProps) => {
    const tableParams = props?.allParamDefs?.filter(parameter => parameter?.Tag===ActionParameterDefinitionTag.TABLE_NAME || parameter?.Tag===ActionParameterDefinitionTag.DATA) || []
    const paramConfig = safelyParseJSON(props?.currentParamDef?.Config) as ActionParameterDefinitionConfig
    const onParentParameterSelection = (selectedParameter?: ActionParameterDefinition) => {
        if(selectedParameter === undefined) {
            props?.onParameterEdit?.({
                ...props?.currentParamDef,
                Config: JSON.stringify({})
            })
        } else {
            props?.onParameterEdit?.({
                ...props?.currentParamDef,
                Config: JSON.stringify({
                    ...paramConfig,
                    ParentParameterDefinitionId: selectedParameter?.Id,
                    ParentRelationshipName: selectedParameter===undefined ? undefined : "TableColumn"
                })
            })
        }        
    }

    return (
        <Autocomplete
            options={tableParams}
            getOptionLabel={option => option?.DisplayName || option?.ParameterName || ""}
            filterSelectedOptions
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            fullWidth
            value={tableParams.find(param => param.Id === paramConfig?.ParentParameterDefinitionId)}
            onChange={(event, value, reason, details) => {
                onParentParameterSelection(value === null ? undefined : value)
            }}
            renderInput={(params) => <TextField variant="standard" 
                                        {...params} 
                                        placeholder="Not Configured"
                                        InputProps={{
                                            disableUnderline: true,
                                            ...params.InputProps,
                                            sx: {
                                                ...textStyle
                                            }
                                        }}
                                    />}   
        />
    )
}


type TagEditorProps = {
    tags?: Tag[],
    onTagsChange?: (newTags: Tag[]) => void
}
const TagEditor = (props: TagEditorProps) => {
    const { tags, onTagsChange } = props
    const [selectedTags, availableTagsForEntity, isLoading, isMutating, error, deleteTag, addTag, createAndAddTag] = useFetchVirtualTags({ selectedTags: (tags || []), onSelectedTagsChange: onTagsChange, tagFilter: {}})

    return (
        <TagEditorView
            availableTagNames={availableTagsForEntity?.map(tag=> tag?.Name)}
            selectedTagNames={selectedTags?.map(tag=> tag?.Name)}
            deleteTag={deleteTag}
            createAndAddTag={createAndAddTag}
            addTag={addTag}
        />
    )
}


export type TagEditorViewProps = {
    availableTagNames: (string|undefined)[],
    selectedTagNames: (string|undefined)[],
    deleteTag: (tagName: string) => void,
    createAndAddTag: (tagName: string) => void,
    addTag: (tagName: string) => void
}

export const TagEditorView = (props: TagEditorViewProps) => {
    const { availableTagNames, selectedTagNames, deleteTag, createAndAddTag, addTag } = props

    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const closeDialog = () => setDialogOpen(false)
    const openDialog = () => setDialogOpen(true)

    const createChip = (tagName?: string) => {
        return (
            <Chip variant="outlined" color="primary" size="small" 
                label={tagName} 
                onDelete={() => deleteTag?.(tagName!)}
                sx={{
                    fontFamily: "SF Pro Text",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "13px",
                    lineHeight: "24px",
                    display: "flex",
                    alignItems: "center",
                    letterSpacing: "0.073125px",
                    color: "cardInfoFormCreatedByStringColor.main",
                    pt: 2,
                    pb: 2
                }}
            />
        ) 
    } 
    
    const tagChips = selectedTagNames?.map(tag => createChip(tag)) || []
    const tagChipPreview = tagChips.slice(0, 2)
    const tagCount = tagChips?.length
    const tagCountChip = (tagCount > 2)  ?  <Chip variant="outlined" color="primary" size="small" 
                                                label={"+" + String(tagCount - 2)} 
                                                sx={{
                                                    fontFamily: "SF Pro Text",
                                                    fontStyle: "normal",
                                                    fontWeight: "normal",
                                                    fontSize: "13px",
                                                    lineHeight: "24px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    letterSpacing: "0.073125px",
                                                    color: "cardInfoFormCreatedByStringColor.main",
                                                    pt: 2,
                                                    pb: 2
                                                }}
                                            /> : <></>

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}>
                <Box>
                    <Button sx={{ width: "50px" }} variant="contained" onClick={() => openDialog()} endIcon={<AddIcon/>}>Add</Button>
                </Box>
                <Box sx={{display: "flex", flexDirection: "row", gap: 1, alignItems: "center", height: "100%", overflowX: "scroll"}}>
                    {tagChipPreview.map(tagChip => <Box>{tagChip}</Box>)}
                    {tagCountChip}
                </Box>
            </Box>
            <Dialog open={dialogOpen} onClose={closeDialog} fullWidth={true} maxWidth="sm">
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{
                        background: "#66748A",
                        boxShadow: "inset 0px 15px 25px rgba(54, 48, 116, 0.3)", 
                        transform: "matrix(1, 0, 0, -1, 0, 0)",
                        display: "flex", 
                        flexDirection: "row",
                        alignItems: "center",
                        pl: 2,
                        pr: 1,
                        py: 1
                    }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ 
                                fontFamily: "'SF Pro Text'", 
                                fontStyle: "normal", 
                                fontWeight: "500", 
                                fontSize: "16px", 
                                lineHeight: "160%", 
                                letterSpacing: "0.15px", 
                                color: "#F8F8F8",
                                transform: "matrix(1, 0, 0, -1, 0, 0)"
                            }}>
                                Update Parameter Tags
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton onClick={() => closeDialog()}>
                                <CloseOutlinedIcon sx={{ background: "#FFFFFF"}}/>
                            </IconButton>
                        </Box>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ pt: 2, px: 1 }}>
                                <Autocomplete
                                    options={availableTagNames}
                                    filterSelectedOptions
                                    fullWidth
                                    selectOnFocus
                                    clearOnBlur
                                    handleHomeEndKeys
                                    onChange={(event, value, reason, details) => {
                                        if(!!value){
                                            if(value?.includes("Create Tag: ")){
                                                createAndAddTag(value?.substring(12))
                                            } else {
                                                addTag?.(value)
                                            }
                                        }
                                    }}
                                    filterOptions={(options, params) => {
                                        const filtered = stringFilter(options, params);
                                        if (params.inputValue !== '') {
                                            filtered.push(`Create Tag: ${params.inputValue}`);
                                        }
                                        return filtered;
                                    }}
                                    renderInput={(params) => <TextField sx={{width:'100%'}} {...params} label="Add Tags"/>}
                                />
                            </Box>
                            <Box sx={{display: "flex", flexDirection: "row", gap: 1, flexWrap: "wrap", alignItems: "center", height: "100%", p: 2, minHeight: "80px"}}>
                                {tagChips.map(tagChip => <Box>{tagChip}</Box>)}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </>
    )
}


type ActionCellProps = {
    parameterId?: string,
    onParameterDelete: (parameterId?: string) => void,
    onParameterDuplicate: (parameterId?: string) => void
}
const ActionCell = (props: ActionCellProps) => {
    const { parameterId, onParameterDelete, onParameterDuplicate } = props
    return (
        <Box sx={{ display: "flex", flexDirection: "row-reverse", width: "100%", py: 1 }}>
            <Box>
                <IconButton onClick={() => onParameterDelete(parameterId)}><DeleteIcon/></IconButton>
            </Box>
            <Box>
                <IconButton onClick={() => onParameterDuplicate(parameterId)}><ContentCopyIcon/></IconButton>
            </Box>
        </Box>
    )
}

export default ViewActionParameters;