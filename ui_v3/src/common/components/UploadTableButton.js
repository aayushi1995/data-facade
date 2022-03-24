import React from 'react'
import Papa from 'papaparse';
import {v4 as uuidv4} from 'uuid'
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    List,
    ListItem,
    MenuItem,
    Select,
    Typography,
    TextField, Stack, LinearProgress, useTheme
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import './../../css/table_browser/TableBrowser.css'
import CloseIcon from '@mui/icons-material/Close';
import dataManagerInstance from './../../data_manager/data_manager'
import TagGroups from './../../enums/TagGroups'
import ColumnDataType from './../../enums/ColumnDataType'
import TagScope from './../../enums/TagScope'
import {useMutation} from 'react-query'
import SelectTags from './SelectTags.js'
import AddIcon from "@mui/icons-material/Add";
import {DataGrid} from "@mui/x-data-grid";
import {UploadTableDialogContent} from './UploadTableDialogContent';

export const useStyles = makeStyles(() => ({
    requiredTags: {
        width: "100%",
        height: 200,
        overflow: 'auto',
    },
    displayFileDetail: {
        height: 200,
        overflow: 'auto',
        width: "100%"
    },
    dialog: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid'
    },
    dialogPaper: {
        minWidth: 1200,
        height: "auto",
        overflowY: "hidden"
    },
    columnSchemaDefault: {
        // background: "#DBFCFE"
    },
    columnPropertiesList: {
        height: 600,
        overflow: 'auto',
        width: "100%",
    },
    selectEmpty: {},
    disabledButton: {
        background: "#classes"
    },
    TablePreview: {
        width: "100%",
    },
    TablePreviewBox: {},
    TableNameTextField: {
        height: 75,
    },
    ColumnSearchTextField: {
        height: 75
    },
    TagDropDown: {
        maxHeight: 75
    },
    headerClassName: {
        height: 1000
    }
}))


const UploadTableButton = (props) => {
    const classes = useStyles();
    // States
    const [uploadDialogState, setUploadDialogState] = React.useState({isDialogOpen: false})

    const handleDialogClose = () => {
        setUploadDialogState(oldState => {
                return {
                    ...oldState,
                    isDialogOpen: false
                }
            }
        )
    }
    const memoizedHandleDialogClose = React.useCallback(handleDialogClose)

    const handleDialogOpen = () => {
        setUploadDialogState(oldState => {
                return {
                    ...oldState,
                    isDialogOpen: true
                }
            }
        )
    }

    return (
        <>
            <Button color="primary" aria-label="upload table" onClick={handleDialogOpen} variant="contained">
                <AddIcon fontSize="small"/> Add Table
            </Button>

            <Dialog onClose={handleDialogClose} open={uploadDialogState.isDialogOpen} fullWidth
                    classes={{paper: classes.dialogPaper}} scroll="paper">
                <Grid item xs={12} className={classes.dialog}>
                    <DialogTitle id="simple-dialog-title">
                        <Box mx={1} py={0}>
                            Upload CSV/Excel File
                        </Box>
                    </DialogTitle>
                    <IconButton aria-label="close" onClick={handleDialogClose}>
                        <CloseIcon/>
                    </IconButton>
                </Grid>
                <DialogContent className={classes.dialog}>
                    <Box my={1} style={{width: "100%", height: "100%"}}>
                        <UploadTableDialogContent closeDialogFunction={memoizedHandleDialogClose}
                                                  isApplication={props?.isApplication}/>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

const TableRequiredTagSelection = (props) => {
    const classes = useStyles()
    const requiredTagGroups = [TagGroups.CUSTOMER_NAME, TagGroups.SUBSIDIARY, TagGroups.YEAR, TagGroups.ASSIGNED_TO]
    const {selectedFileSchema, setSelectedFileSchema} = props
    const getTag = (tagGroupName) => {
        return ((selectedFileSchema?.requiredTableTags || []).filter(tagModel => tagModel.TagGroup === tagGroupName)[0]) || {Name: ""}
    }

    const setTag = (tagModel) => {
        setSelectedFileSchema(oldSchema => {
            const oldRequiredTableTags = (oldSchema?.requiredTableTags || [])
            const newRequiredTableTags = oldRequiredTableTags.some(oldTag => oldTag.TagGroup === tagModel.TagGroup) ?
                oldRequiredTableTags.map(oldTag =>
                    oldTag.TagGroup === tagModel.TagGroup ?
                        {...oldTag, ...tagModel}
                        :
                        oldTag
                )
                :
                [...oldRequiredTableTags, tagModel]

            return {
                ...oldSchema,
                requiredTableTags: newRequiredTableTags
            }
        })
    }

    // This hook is responsible for enabling/disabling the Upload Button based on Required Tags Filled Status
    React.useEffect(() => {
        const allRequiredTagsPresent = requiredTagGroups.every(requiredTagGroup =>
            (selectedFileSchema?.requiredTableTags || []).some(tagModel =>
                tagModel.TagGroup === requiredTagGroup
            )
        )

        if (allRequiredTagsPresent) {
            props.enableUploadButton(0)
        } else {
            props.disableUploadButton(0)
        }

    }, [selectedFileSchema?.requiredTableTags])

    return (
        <Box className={classes.requiredTags}>
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <Box px={1}>
                        <SelectTags
                            setTags={setTag}
                            maxHeight={120}
                            selectedTags={getTag(TagGroups.ASSIGNED_TO)}
                            tagOptionFilter={{TagGroup: TagGroups.ASSIGNED_TO}}
                            tagSelectionMode="single"
                            label="Assigned To"
                            generatePrompt={(newTagName) => `Create New Asignee: ${newTagName}`}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box px={1}>
                        <SelectTags
                            setTags={setTag}
                            maxHeight={120}
                            selectedTags={getTag(TagGroups.FILE_TYPE)}
                            tagOptionFilter={{TagGroup: TagGroups.FILE_TYPE}}
                            tagSelectionMode="single"
                            label="File Type"
                            allowNewTagCreation={false}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export const TableSchemaSelection = (props) => {
    const classes = useStyles()
    const [headerRow, setHeaderRow] = React.useState(true)
    const [parsedFileResult, setParsedFileResult] = React.useState()
    const [columnProperties, setColumnProperties] = React.useState()
    const [displayColumnProperties, setDisplayColumnProperties] = React.useState()
    const [columnSearchQuery, setColumnSearchQuery] = React.useState("")
    const [tableProperties, setTableProperties] = React.useState({
        tableName: "",
        tags: [],
        isValid: true
    })

    const fetchTags = useMutation(
        "FetchTags",
        (config) => dataManagerInstance.getInstance.getTableAndColumnTags(config),
        {
            onMutate: variables => {
            }
        }
    )

    const setTableName = (tableName) => {
        setTableProperties(old => {
            return {...old, tableName: tableName}
        })
    }

    const handleTableTagChange = (newTags) => {
        setTableProperties((oldProps) => {
            return {
                ...oldProps,
                tags: newTags
            }
        })
    }
    React.useEffect(() => {
        setTableProperties(old => {
            isValidObjectName(old.tableName) ? props.enableUploadButton(2) : props.disableUploadButton(2)
            return {
                ...old,
                isValid: isValidObjectName(old.tableName)
            }
        })

    }, [tableProperties.tableName])

    React.useEffect(() => {
        setDisplayColumnProperties((columnProperties || []).filter(column => column.columnName.search(columnSearchQuery) >= 0))
    }, [columnSearchQuery, JSON.stringify(columnProperties)])

    const finalColumnProperties = (columnProperties) => {
        if (columnProperties !== undefined) {
            const newColumnPropertiesConfig = {}
            for (var i = 0; i < columnProperties.length; i++) {
                var columnName = columnProperties[i].columnName
                if (columnName in newColumnPropertiesConfig) {
                    newColumnPropertiesConfig[columnName] = {
                        ...newColumnPropertiesConfig[columnName],
                        isDuplicate: true,
                        duplicateColor: getColor(i)
                    }
                } else {
                    newColumnPropertiesConfig[columnName] = {
                        isDuplicate: false,
                        duplicateColor: undefined
                    }
                }
            }

            const newColumnProperties = columnProperties.map(columnProperty => {
                return {
                    ...columnProperty,
                    ...newColumnPropertiesConfig[columnProperty.columnName],
                    isValid: isValidObjectName(columnProperty.columnName)
                }
            })

            return newColumnProperties
        }
    }

    React.useEffect(() => {
        if (columnProperties !== undefined) {
            const columnNames = columnProperties.map(columnProperty => columnProperty.columnName)
            const allColumnNamesValid = columnProperties.map(columnProperty => columnProperty.isValid).every(x => x === true)
            const allColumnNamesDistinct = !((new Set(columnNames)).size !== columnNames.length)

            if (allColumnNamesValid & allColumnNamesDistinct) {
                props.enableUploadButton(8)
            } else {
                props.disableUploadButton(8)
            }
            setColumnProperties(finalColumnProperties(columnProperties))
        }
        props.setSelectedFileColumnSchema(columnProperties)
    }, [JSON.stringify(columnProperties)])

    React.useEffect(() => {
        if (tableProperties.isValid) {
            props.setSelectedFileTableName(tableProperties.tableName)
        }
        props.setSelectedFileTablTags(tableProperties.tags)
    }, [JSON.stringify(tableProperties)])

    React.useEffect(() => {
        if (props.selectedFile !== undefined) {
            Papa.parse(
                props.selectedFile,
                {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    preview: 200,
                    complete: (result) => {
                        setParsedFileResult({columnNames: result.meta.fields, data: result.data})
                    }
                }
            )
            setTableName(formCloseValidObjectName(props.selectedFile.name.split('.').slice(0, -1).join('')))
        } else {
            setParsedFileResult({columnNames: [], data: []})
        }
    }, [props.selectedFile])

    React.useEffect(() => {
        if (parsedFileResult !== undefined) {
            const tagRequest = {
                name: tableProperties.tableName,
                column_names: parsedFileResult.columnNames,
                data: parsedFileResult.data
            }

            fetchTags.mutate(JSON.stringify(tagRequest),
                {
                    onSuccess: (data, variables, context) => {
                        const parsedData = JSON.parse(data)

                        setColumnProperties(oldProp => {
                            let newProp = [...oldProp]
                            parsedData["ColumnTags"].forEach(columnTagProp => {
                                const mostConfidentTag = {
                                    tag: "NA",
                                    confidence: -1
                                }
                                const columnName = columnTagProp.column_name
                                for (const [tag, confidence] of Object.entries(columnTagProp["column_tags"])) {
                                    if (confidence > mostConfidentTag.confidence) {
                                        mostConfidentTag.tag = tag
                                        mostConfidentTag.confidence = confidence
                                    }
                                }
                                newProp = newProp.map(col => {
                                    if (col["columnName"] === columnName) {
                                        return {
                                            ...col,
                                            columnTags: [...col.columnTags, ...[{Name: mostConfidentTag.tag}]]
                                        }
                                    } else {
                                        return col
                                    }
                                })
                            })

                            return newProp
                        })

                        setTableProperties(oldProp => {
                            const mostConfidentTag = {
                                tag: "NA",
                                confidence: -1
                            }
                            for (const [tag, confidence] of Object.entries(parsedData["table_tags"])) {
                                if (confidence > mostConfidentTag.confidence) {
                                    mostConfidentTag.tag = tag
                                    mostConfidentTag.confidence = confidence
                                }
                            }
                            const newProp = {
                                ...oldProp,
                                tags: [...oldProp.tags, ...[{Name: mostConfidentTag.tag}]]
                            }
                            return newProp
                        })
                    },
                    onSettled: () => {
                    },
                    onError: (data, variables, context) => {
                    }
                })
        }

    }, [parsedFileResult])

    React.useEffect(() => {
        if (parsedFileResult !== undefined) {
            if (headerRow === true) {
                const colProps = parsedFileResult.columnNames.map((columnName) => {
                    const calculatedDataType = getTypeOfValue(parsedFileResult.data.map(x => x[columnName]))
                    return {
                        columnName: formCloseValidObjectName(columnName),
                        columnDatatype: calculatedDataType,
                        columnTags: [],
                        isValid: true,
                        isDuplicate: false,
                        duplicateColor: undefined
                    }
                })
                setColumnProperties(colProps)
            } else {
                setColumnProperties([])
            }
        } else {
            setColumnProperties([])
        }
    }, [headerRow, parsedFileResult])

    const setColumnProperty = React.useCallback(
        (columnIndex, newProperty) => {
            setColumnProperties(old => {
                return [
                    ...old.slice(0, columnIndex),
                    {
                        ...old[columnIndex],
                        ...newProperty
                    },
                    ...old.slice(columnIndex + 1)
                ]
            })
        }, [])
    const getColumnPropertiesLayout = (columnProperty, columnIndex) =>
        <>
            <ListItem
                style={((columnProperty.duplicateColor !== undefined) ? {background: columnProperty.duplicateColor} : {})}>
                <MemoizedColumnPropertiesSelector columnIndex={columnIndex} columnProperty={columnProperty}
                                                  setColumnProperty={setColumnProperty} key={columnIndex}/>
            </ListItem>
            {columnIndex !== displayColumnProperties.length - 1 &&
                <Divider style={{height: 4, background: "#FFFFFF"}} variant="middle"/>}
        </>

    const whyTableNameNotValid = () => {
        if (tableProperties.isValid) {
            return "Table Name Valid"
        } else {
            return `Non Empty except '"'`
        }
    }

    return (
        <Stack flex={1} spacing={2}>
            <TablePreview data={parsedFileResult?.data} columns={columnProperties}
                          tableName={tableProperties?.tableName} getColumnPropertiesLayout={getColumnPropertiesLayout}/>
            <SelectTags setTags={handleTableTagChange}
                        tagOptionFilter={{Scope: TagScope.TABLE, TagGroup: TagGroups.GENERIC}} label="Tags"
                        selectedTags={tableProperties.tags}/>
        </Stack>
    )
}

const ColumnPropertiesSelector = (props) => {
    const classes = useStyles()

    const handleColumnNameChange = (event) => {
        const newName = event.target.value
        props.setColumnProperty(props.columnIndex, {columnName: newName})
    }

    const handleColumnDataTypeChange = (event) => {
        const newDataType = event.target.value;
        props.setColumnProperty(props.columnIndex, {columnDatatype: newDataType})
    }

    const handleColumnTagChange = (tags) => {
        const newTags = tags
        props.setColumnProperty(props.columnIndex, {columnTags: newTags})
    }

    const isColumnFieldValid = () => {
        return props.columnProperty.isValid & (!props.columnProperty.isDuplicate)
    }

    const whyColumnFieldNotValid = () => {
        if (props.columnProperty.isValid === true & props.columnProperty.isDuplicate === true) {
            return "Duplicate Name"
        } else if (props.columnProperty.isValid === true & props.columnProperty.isDuplicate === false) {
            return "Column Name Valid"
        } else if (props.columnProperty.isValid === false & props.columnProperty.isDuplicate === true) {
            return `Duplicate. Non Empty except '"'`
        } else {
            return `Non Empty except '"'`
        }
    }

    return (
        <Stack direction="column">

            <TextField value={props.columnProperty.columnName} error={!isColumnFieldValid()}
                       variant="standard"
                       helperText={whyColumnFieldNotValid()} onChange={handleColumnNameChange}/>
            <FormControl>
                <Select
                    variant="standard"
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={props.columnProperty.columnDatatype}
                    onChange={handleColumnDataTypeChange}
                >
                    <MenuItem value={ColumnDataType.INT}>Integer</MenuItem>
                    <MenuItem value={ColumnDataType.STRING}>String</MenuItem>
                    <MenuItem value={ColumnDataType.BOOLEAN}>Boolean</MenuItem>
                    <MenuItem value={ColumnDataType.FLOAT}>Float</MenuItem>
                </Select>
                <FormHelperText>Datatype</FormHelperText>
            </FormControl>

            <SelectTags setTags={handleColumnTagChange}
                        tagOptionFilter={{Scope: TagScope.COLUMN, TagGroup: TagGroups.GENERIC}} label="Tags"
                        selectedTags={props.columnProperty.columnTags}/>

        </Stack>
    )
}

function MemoizedColumnPropertiesSelector(props) {
    return React.useMemo(() => {
        return <ColumnPropertiesSelector
            columnProperty={props.columnProperty}
            columnIndex={props.columnIndex}
            setColumnProperty={props.setColumnProperty}
        />
    }, [props.columnProperty, props.columnIndex])
}

const TablePreview = (props) => {
    const classes = useStyles()
    const theme = useTheme();
    const formData = () => {
        if (props.data === undefined) {
            return []
        } else {
            const finalData = props.data.map((row, index) => {
                return {id: index, ...row}
            })
            return finalData
        }
    }

    const formColumns = () => {
        if (props.columns === undefined) {
            return []
        } else {
            const columnProp = props.columns.map((column, index) => {
                const headerName = `${column.columnName} (${column.columnDatatype})`
                return {
                    field: column.columnName,
                    width: headerName.length * 12,
                    headerName: headerName,
                    height: 1000,
                    headerClassName: classes.headerClassName,
                    renderHeader: (headerparams) => {
                        console.log(headerparams);
                        return (
                            <Stack direction="column" flexGrow={1}>
                                {props.getColumnPropertiesLayout(column, index)}
                                <LinearProgress color='success' sx={{height: 10}} />
                            </Stack>
                        )
                    }
                }
            })
            return columnProp
        }
    }
    const [pageSize, setPageSize] = React.useState(10);
    return (
        <Box className={classes.TablePreviewBox} fullWidth sx={{
            '& .MuiDataGrid-window': {
                top: '300px!important'
            },
            '& .MuiDataGrid-columnsContainer': {
                height: 300,
                maxHeight: '300px!important'
            },
            '& .MuiDataGrid-columnHeaderWrapper': {
                background: theme.palette.background.default
            },
            py: 2
        }}>
            <DataGrid autoHeight className={classes.TablePreview}
                      title={props.tableName || "Not Named"}
                      rows={formData()}
                      columns={formColumns()}
                      rowsPerPageOptions={[10, 25, 50, 100]}
                      onPageSizeChange={(newPage) => setPageSize(newPage)}
                      pageSize={pageSize}
                />
        </Box>
    )
}

const getTypeOfValue = (dataPoints) => {
    const dataTypeList = dataPoints.map(dataPoint => {
        if (dataPoint === null || dataPoint === undefined) {
            return null;
        } else {
            if (typeof dataPoint === "number") {
                // if (Number(dataPoint) === dataPoint && dataPoint % 1 === 0) {
                //     return ColumnDataType.INT
                // } else {
                return ColumnDataType.FLOAT
                // }
            } else if (typeof dataPoint === "boolean") {
                return ColumnDataType.BOOLEAN
            } else {
                return ColumnDataType.STRING
            }
        }
    }).filter(x => x !== null)

    if (dataTypeList.length === 0) {
        return ColumnDataType.STRING
    } else if (dataTypeList.every(dataType => dataType === ColumnDataType.BOOLEAN)) {
        return ColumnDataType.BOOLEAN
    } else if (dataTypeList.every(dataType => dataType === ColumnDataType.INT)) {
        return ColumnDataType.INT
    } else if (dataTypeList.every(dataType => dataType === ColumnDataType.INT || dataType === ColumnDataType.FLOAT)) {
        return ColumnDataType.FLOAT
    } else {
        return ColumnDataType.STRING
    }
}

export const formActionPropertiesForLoadTableIntoLocal = (fdsResponse, selectedFile, fileSchema) => {
    return {
        entityProperties: {
            Id: uuidv4(),
            DefinitionId: "12",
            Name: `Load Table(${selectedFile.name}) from S3`,
            DisplayName: `Load Table(${selectedFile.name}) from S3`,
            IsRecurring: false,
            RenderTemplate: false,
            ProviderInstanceId: "8",
        },
        SynchronousActionExecution: true,
        tableSchema: fileSchema,
        otherConfig: {
            filePath: fdsResponse.key
        }
    }
}

const isValidObjectName = (name) => {
    if (name !== undefined) {
        return !(name.includes(`"`) || name.length === 0)
    } else {
        return false;
    }
}

const getColor = (x) => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[(i * x + i * x * x + i * x * x * x) % 16];
    }
    return color;
}

const formCloseValidObjectName = (name) => {
    return name
}

export default UploadTableButton;
