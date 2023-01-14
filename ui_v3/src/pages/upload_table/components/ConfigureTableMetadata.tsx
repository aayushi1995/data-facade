import {
    Box,
    Button, Card, Divider,
    FormControl, Grid, InputLabel,Typography,
    List,
    ListItem, MenuItem,
    Select, TextField,
    IconButton,
    InputAdornment,
    SelectChangeEvent
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import Papa from 'papaparse';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { DATA_ALL_TABLES_ROUTE } from '../../../common/components/header/data/DataRoutesConfig';
import VirtualTagHandler from '../../../common/components/tag-handler/VirtualTagHandler';
import SelectTags from '../../../common/components/SelectTags.js';
import './../../../css/table_browser/TableBrowser.css';
import S3UploadState from '../../../custom_enums/S3UploadState';
import dataManager from '../../../data_manager/data_manager';
import ColumnDataType from '../../../enums/ColumnDataType';
import ExternalStorageUploadRequestContentType from '../../../enums/ExternalStorageUploadRequestContentType';
import TagGroups from '../../../enums/TagGroups';
import TagScope from '../../../enums/TagScope';
import SelectHeaderRowsButton from './SelectHeaderRowsButton';
import { findHeaderRows } from './util';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CollapsibleDrawer from "../../build_action/components/form-components/CollapsibleDrawer"
import DoubeLeftIcon from '../../../../src/images/Group 691.svg';
import {Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search'; 
import TableIcon from '../../../../src/images/table_2.svg'
import { TableProperties, Tag } from '../../../generated/entities/Entities';
import { TableAndColumns } from '../../../generated/interfaces/Interfaces';
import labels from '../../../labels/labels';
import DatafacadeDatatype from '../../../enums/DatafacadeDatatype';

const dataManagerInstance = dataManager?.getInstance as { saveData: Function, s3PresignedUploadUrlRequest: Function, s3UploadRequest: Function, getTableAndColumnTags: Function}

const useStyles = makeStyles(() => ({
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
    selectEmpty: {},
    disabledButton: {
        background: "#classes"
    },
    formControl: {
        width: "100%"
    },
    TablePreview: {
        width: "100%",
    },
    TablePreviewBox: {
        height: 600,
        overflow: 'auto',
        width: '100%'
    }
}))

type ColumnSchema = {
    Id: string,
    columnDatatype: string,
    columnIndex: number,
    columnName: string,
    columnTags: Tag[],
    duplicateColor: any,
    isDuplicate: boolean,
    isValid: boolean,
}

type FileSchema = {
    columnSchema?: ColumnSchema[],
    dataStartsFromRow?: number,
    requiredTableTags?: Tag[],
    tableName?: string,
    tableId?: string,
    tableTags?: Tag[]
}

type ParsedFileResult = {
    columnNames?: string[],
    headerRows?: number[],
    dataStartsFromRow?: number,
    data?: any[]
}

export type ConfigureTableMetadataProps = {
    isApplication?: boolean,
    nextStep?: Function,
    prevStep?: Function,
    setUploadState?: Function,
    stateData?: string,
    file: File,
    setLastUploadedTableId: React.Dispatch<React.SetStateAction<string|undefined>>
}

type S3UploadInformation = {
    requestUrl: string, 
    headers: any, 
    file: File
}

export const ConfigureTableMetadata = (props: ConfigureTableMetadataProps) => {
    const classes = useStyles();
    let history = useHistory();
    // States
    const selectedFile = props.file
    const [fileStatusInformation, setFileStatusInformation] = React.useState<{ autoUpload: Boolean, errors: string[] }>({ autoUpload: true, errors: []})
    const [selectedFileSchema, setSelectedFileSchema] = React.useState<FileSchema>({ requiredTableTags: [], tableId: uuidv4() })
    const [uploadButtonState, setUploadButtonState] = React.useState<{ currentEnabled: number, requiredEnabled: number}>({
        currentEnabled: 5,
        requiredEnabled: 15
    })

    // Upload Button is enabled if all bits are set
    // 2^0: File type/size valid
    // 2^1: File name valid
    // 2^2: No Upload already in progress
    // 2^3: All Column Names are Valid and Distinct
    // 2^4: All Required Table Tags Configured
    React.useEffect(() => {
        if(fileStatusInformation.autoUpload) {
            if(uploadButtonState.currentEnabled === uploadButtonState.requiredEnabled) {
                setFileStatusInformation(old => ({ ...old, autoUpload: false }))
                uploadSelectedFiles()
            }
        }
    }, [uploadButtonState.currentEnabled])

    React.useEffect(() => {
        setFileStatusInformation(old => ({ ...old, autoUpload: true }))
    }, [props.file])

    const enableUploadButton = (value: number) => {
        setUploadButtonState(old => {
            return {
                ...old,
                currentEnabled: old.currentEnabled | value
            };
        });
    };

    const disableUploadButton = (value: number) => {
        setUploadButtonState(old => {
            return {
                ...old,
                currentEnabled: (old.requiredEnabled ^ value) & old.currentEnabled
            };
        });
    };

    const fetchPresignedUrlMutation = useMutation<S3UploadInformation, unknown, {file: File, expirationDurationInMinutes: number}, unknown>(
        "GetS3PreSignedUrl",
        (config) => dataManagerInstance.s3PresignedUploadUrlRequest(config.file, config.expirationDurationInMinutes, ExternalStorageUploadRequestContentType.TABLE),
        {
            onMutate: variables => {
                props?.setUploadState?.(S3UploadState.PRESIGNED_URL_FETCH_LOADING);
                disableUploadButton(4);
            }
        }
    );

    const uploadToS3Mutation = useMutation<unknown, unknown, S3UploadInformation, unknown>(
        "UploadToS3",
        (config) => dataManagerInstance.s3UploadRequest(config.requestUrl, config.headers, config.file),
        {
            onMutate: variables => {
                props?.setUploadState?.(S3UploadState.S3_UPLOAD_LOADING);
                disableUploadButton(4);
            }
        }
    );

    const loadTableFromS3Action = useMutation<unknown, unknown, {entityName: string, actionProperties: any}, unknown>(
        "LoadTableFromS3",
        (config) => dataManagerInstance.saveData(config.entityName, config.actionProperties),
        {
            onMutate: () => {
                props?.setUploadState?.(S3UploadState.FDS_TABLE_FETCH_LOADING);
                disableUploadButton(4);
            }
        }
    );

    const createTableColumnMutation = useMutation<TableProperties, unknown, FileSchema, unknown>(
        "CreateTableColumn",
        (config) => {
            const entities: TableAndColumns = {
                Table: {
                    TableEntity: {
                        Id: config?.tableId,
                        UniqueName: config?.tableName,
                        DisplayName: config?.tableName
                    },
                    Tags: config?.tableTags
                },
                Columns: selectedFileSchema?.columnSchema?.map(columnSchema => ({
                    ColumnEntity: {
                        Id: columnSchema?.Id,
                        Datatype: columnSchema?.columnDatatype,
                        ColumnIndex: columnSchema?.columnIndex,
                        UniqueName: columnSchema?.columnName,
                    },
                    Tags: columnSchema?.columnTags
                }))
            }

            return dataManagerInstance?.saveData(labels.entities.TABLE_PROPERTIES, {
                CreateTableColumnFromUpload: true,
                TableColumnEntities: entities
            })
        }, {
            onMutate: (variables) => props?.setUploadState?.(S3UploadState.CREATING_TABLE_IN_SYSTEM),
        }
    )

    const setSelectedFileColumnSchema = React.useCallback((columnSchema: ColumnSchema[]) =>
        setSelectedFileSchema(old => ({ ...old, columnSchema: columnSchema })),
        []
    );

    const setSelectedFileTableName = React.useCallback((tableName) =>
        setSelectedFileSchema(old => ({ ...old, tableName: tableName })),
        []
    );

    const setSelectedFileTableTags = React.useCallback((tableTags) => 
        setSelectedFileSchema(old => ({ ...old, "tableTags": tableTags })),
        []
    );

    const setSelectedFileDataStartsFromRow = React.useCallback((dataStartsFromRow) =>
        setSelectedFileSchema(old => ({ ...old, "dataStartsFromRow": dataStartsFromRow })),
        []
    );

    const setTag = (tagModel: Tag) => {
        setSelectedFileSchema(oldSchema => {
            const oldRequiredTableTags = (oldSchema?.requiredTableTags || []);
            const newRequiredTableTags = oldRequiredTableTags.some(oldTag => oldTag.TagGroup === tagModel.TagGroup) ?
                oldRequiredTableTags.map(oldTag => oldTag.TagGroup === tagModel.TagGroup ?
                    { ...oldTag, ...tagModel }
                    :
                    oldTag
                )
                :
                [...oldRequiredTableTags, tagModel];

            return {
                ...oldSchema,
                requiredTableTags: newRequiredTableTags
            };
        });
    };

    const getTag = (tagGroupName: string) => {
        return ((selectedFileSchema?.requiredTableTags || []).filter(tagModel => tagModel.TagGroup === tagGroupName)[0]) || { Name: "" };
    };

    const uploadSelectedFiles = () => {
        props?.setUploadState?.(S3UploadState.BUIDING_FILE_FOR_UPLOAD);
        Papa.parse(selectedFile,
            {
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const newCsvFileJson = {
                        data: result.data.slice(selectedFileSchema.dataStartsFromRow),
                        fields: selectedFileSchema?.columnSchema?.map?.(col => col.columnName)
                    }
                    const fileName = selectedFileSchema.tableName + ".csv";
                    const newCsvFileContent = Papa.unparse(newCsvFileJson)
                    const newCsvFile = new File([newCsvFileContent], fileName, {type: selectedFile.type})
                    props?.setUploadState?.(S3UploadState.FILE_BUILT_FOR_UPLOAD);
                    uploadGivenFile(newCsvFile)
                },
                error: (errors, file) => {
                    console.log(errors)
                }
            }
        )
    }

    const refreshIds = () => {
        setSelectedFileSchema(oldSchema => ({
            ...oldSchema,
            tableId: uuidv4(),
            columnSchema: oldSchema?.columnSchema?.map(column => ({
                ...column,
                Id: uuidv4()
            }))
        }))
    }

    const uploadGivenFile = (newFile: File) => {
        fetchPresignedUrlMutation.mutate(
            { file: newFile, expirationDurationInMinutes: 5 },
            {
                onSuccess: (data, variables, context) => {
                    props?.setUploadState?.(S3UploadState.PRESIGNED_URL_FETCH_SUCCESS);
                    disableUploadButton(4);
                    uploadToS3Mutation.mutate(
                        { requestUrl: data.requestUrl, headers: data.headers, file: variables.file },
                        {
                            onSuccess: () => {
                                props?.setUploadState?.(S3UploadState.S3_UPLOAD_SUCCESS);
                                disableUploadButton(4);
                                loadTableFromS3Action.mutate(
                                    {
                                        entityName: "ActionInstance",
                                        actionProperties: formActionPropertiesForLoadTableIntoLocal(data, variables.file, selectedFileSchema)
                                    },
                                    {
                                        onSuccess: () => {
                                            props?.setUploadState?.(S3UploadState.FDS_TABLE_FETCH_SUCCESS);
                                            createTableColumnMutation.mutate(
                                                selectedFileSchema,
                                                {
                                                    onSuccess: (data, variables, context) => {
                                                        props?.setLastUploadedTableId?.(selectedFileSchema.tableId)
                                                        refreshIds()
                                                        props?.setUploadState?.(S3UploadState.CREATING_TABLE_IN_SYSTEM_SUCCESS)
                                                        enableUploadButton(4);
                                                    },
                                                    onError: (error, variables, context) => {
                                                        props?.setUploadState?.(S3UploadState.CREATING_TABLE_IN_SYSTEM_FAILURE)
                                                        enableUploadButton(4);
                                                    }
                                                }
                                            )
                                        },
                                        onError: (err, variables, context) => {
                                            console.log(err, variables, context)
                                            props?.setUploadState?.(S3UploadState.FDS_TABLE_FETCH_ERROR);
                                            enableUploadButton(4);
                                        }
                                    }
                                );
                            },
                            onError: (data, variables, context) => {
                                props?.setUploadState?.(S3UploadState.S3_UPLOAD_ERROR);
                                enableUploadButton(4);
                            }
                        }
                    );
                },
                onError: (data, variables, context) => {
                    props?.setUploadState?.(S3UploadState.PRESIGNED_URL_FETCH_ERROR);
                    enableUploadButton(4);
                }
            }
        );
    };



    // TODO: Apply colour to disbaled Upload Button
    return (
        <Grid sx={{m:-4 , mt:-5}}>
            {props?.isApplication &&
                <Grid item xs={12}>
                    <Box m={2}>
                        <Grid container spacing={3}>
                            <Grid item xs={3}>
                                <SelectTags
                                    setTags={setTag}
                                    maxHeight={120}
                                    tagOptionFilter={{ TagGroup: TagGroups.CUSTOMER_NAME }}
                                    tagSelectionMode="single"
                                    label="Customer Name"
                                    allowNewTagCreation={false}
                                ></SelectTags>
                            </Grid>
                            <Grid item xs={3}>
                                <SelectTags
                                    setTags={setTag}
                                    maxHeight={120}
                                    tagOptionFilter={{ TagGroup: TagGroups.SUBSIDIARY, ParentTagName: getTag(TagGroups.CUSTOMER_NAME)?.Name }}
                                    readOnly={getTag(TagGroups.CUSTOMER_NAME)?.Name === ""}
                                    tagSelectionMode="single"
                                    label="Subsidiary"
                                ></SelectTags>
                            </Grid>
                            <Grid item xs={3}>
                                <SelectTags
                                    setTags={setTag}
                                    maxHeight={120}
                                    tagOptionFilter={{ TagGroup: TagGroups.YEAR }}
                                    tagSelectionMode="single"
                                    label="FY Year"
                                ></SelectTags>
                            </Grid>
                            <Grid item xs={3}>
                                <SelectTags
                                    setTags={setTag}
                                    maxHeight={120}
                                    tagOptionFilter={{ TagGroup: TagGroups.FILE_TYPE }}
                                    tagSelectionMode="single"
                                    label="File Type"
                                ></SelectTags>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>}
                <Grid container item xs={12} direction="row">
                        <Box  sx={{width:'100%',mx:1,px:2,pb:2, display:'flex' , flexDirection:'row', justifyContent:'flex-end'}}>
                            <Link to="/data/connections" style={{textDecoration: 'none'}}>
                                <Button  sx={{borderRadius:'5px',width:'115px',mr:2,textDecoration:'none'}} variant="outlined" color="error">
                                    Cancel
                                </Button>
                            </Link>

                            <Button color="success" variant="contained" sx={{borderRadius:'5px', width:'115px'}} component="label" onClick={uploadSelectedFiles}
                                // classes={{ root: "select-all", disabled: classes.disabledButton }}
                                disabled={uploadButtonState.currentEnabled !== uploadButtonState.requiredEnabled}>
                                Save
                            </Button>
                        </Box>
                </Grid>
            <Grid container item xs={12}>
                <TableSchemaSelection selectedFile={selectedFile}
                    setSelectedFileColumnSchema={setSelectedFileColumnSchema}
                    setSelectedFileTableName={setSelectedFileTableName}
                    enableUploadButton={enableUploadButton} disableUploadButton={disableUploadButton}
                    setSelectedFileTablTags={setSelectedFileTableTags}
                    setSelectedFileDataStartsFromRow={setSelectedFileDataStartsFromRow} 
                    statusMSG = {props.stateData}
                />
            </Grid>
        </Grid>
    );
};

type TableSchemaSelectionProps = {
    selectedFile: File,
    setSelectedFileColumnSchema: Function,
    setSelectedFileTableName: Function,
    enableUploadButton: Function,
    disableUploadButton: Function,
    setSelectedFileTablTags: Function,
    setSelectedFileDataStartsFromRow: Function, 
    statusMSG?: string
    mode?: "READONLY"
}

const TableSchemaSelection = (props: TableSchemaSelectionProps) => {
    const classes = useStyles()
    /**
     * parsedFileResult
     *      columnNames
     *      headerRows
     *      dataStartsFromRow
     *      data
     */
    const [parsedFileResult, setParsedFileResult] = React.useState<ParsedFileResult>({})
    const [columnProperties, setColumnProperties] = React.useState<ColumnSchema[]>()
    const [displayColumnProperties, setDisplayColumnProperties] = React.useState<ColumnSchema[]>()
    const [columnSearchQuery, setColumnSearchQuery] = React.useState<string>("")
    const [tableProperties, setTableProperties] = React.useState<{tableName: string, tags: Tag[], isValid: boolean}>({
        tableName: "",
        tags: [],
        isValid: true
    })

    const setColumnAndDataCallback = (columnNames: string[], dataStartsFromRow: number, data: any[], headerRows: number[]) => {
        props.setSelectedFileDataStartsFromRow(dataStartsFromRow)
        setParsedFileResult(oldResult => {
            return {
                ...oldResult,
                columnNames: columnNames,
                dataStartsFromRow: dataStartsFromRow,
                data: data,
                headerRows: headerRows
            }
        })
    }
    /**
     * Responsible for
     *      1. Assigning the TableName
     *      2. Assigning the ColumnNames and DataStartsFromRow to parsedFileResult
     */
    React.useEffect(() => {
        if(!!props.selectedFile) {
            findHeaderRows(props.selectedFile, setColumnAndDataCallback)
            setTableName(formCloseValidObjectName(props.selectedFile.name.split('.').slice(0, -1).join('')))
        }
    }, [props.selectedFile])

    // Responsible for populating columnProperties from parsedFileResult
    React.useEffect(() => {
        if (!!parsedFileResult && !!parsedFileResult?.columnNames && !!parsedFileResult?.data) {
            const colProps = parsedFileResult.columnNames.map((columnName, columnIndex) => {
                const calculatedDataType = getTypeOfValue(parsedFileResult?.data?.map?.(x => x[columnIndex]))
                return {
                    Id: uuidv4(),
                    columnName: formCloseValidObjectName(columnName),
                    columnDatatype: calculatedDataType,
                    columnIndex: columnIndex,
                    columnTags: [],
                    isValid: true,
                    isDuplicate: false,
                    duplicateColor: undefined
                } as ColumnSchema
            })
            setColumnProperties(colProps)
        
        } else {
            setColumnProperties([])
        }
    }, [parsedFileResult])

    const fetchTags = useMutation(
        "FetchTags",
        (config) => dataManagerInstance.getTableAndColumnTags(config),
        {
            onMutate: variables => {
            }
        }
    )

    const setTableName = (tableName: string) => {
        setTableProperties(old => {
            return {...old, tableName: tableName}
        })
    }

    const handleTableTagChange = (newTags: Tag[]) => {
        setTableProperties((oldProps) => {
            return {
                ...oldProps,
                tags: newTags
            }
        })
    }

    // Responsible for checking if the TableName is a valid String
    React.useEffect(() => {
        setTableProperties(old => {
            isValidObjectName(old.tableName) ? props.enableUploadButton(2) : props.disableUploadButton(2)
            return {
                ...old,
                isValid: isValidObjectName(old.tableName)
            }
        })

    }, [tableProperties.tableName])

    // Responsible for filterting which columnProperties are shown on screen
    React.useEffect(() => {
        setDisplayColumnProperties((columnProperties || []).filter(column => column.columnName.search(columnSearchQuery) >= 0))
    }, [columnSearchQuery, JSON.stringify(columnProperties)])


    const finalColumnProperties = (columnProperties: ColumnSchema[]) => {
        if (columnProperties !== undefined) {
            const newColumnPropertiesConfig: any = {}
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

    /**
     * Responsible for
     *      1. Checking if all columnNames are Valid.
     *      2. Checking if all columnNames are Distinct.
     */
    React.useEffect(() => {
        if (columnProperties !== undefined) {
            const columnNames = columnProperties.map(columnProperty => columnProperty.columnName)
            const allColumnNamesValid = columnProperties.map(columnProperty => columnProperty.isValid).every(x => x === true)
            const allColumnNamesDistinct = !((new Set(columnNames)).size !== columnNames.length)

            if (allColumnNamesValid && allColumnNamesDistinct) {
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

    // Responsible for fetching Tags from Prediction Service
    React.useEffect(() => {
        if (!!parsedFileResult && !!columnProperties && !fetchTags.data) {
            const tagRequest = {
                name: tableProperties.tableName,
                column_names: parsedFileResult.columnNames,
                data: parsedFileResult.data
            }

            fetchTags.mutate(JSON.stringify(tagRequest),
                {
                    onSuccess: (parsedData, variables, context) => {
                        setColumnProperties(oldProp => {
                            let column_tags = parsedData["column_tags"]
                            if (column_tags === undefined || column_tags.length == 0) return oldProp
                            
                            let newProp = [...oldProp]
                            column_tags.forEach(columnTagProp => {
                                const columnName = columnTagProp.column_name
                                let tags_len = columnTagProp["column_tags"].length
                                let tags = []
                                for (var i=0; i < tags_len; i++){
                                    let column_tag = columnTagProp["column_tags"][i]
                                    tags.push({Name: column_tag})
                                }
                                
                                newProp = newProp.map(col => {
                                    if (col["columnName"] === columnName) {
                                        return {
                                            ...col,
                                            columnTags: [...col.columnTags, ...tags]
                                        }
                                    } else {
                                        return col
                                    }
                                })
                            })

                            return newProp
                        })

                        setTableProperties(oldProp => {
                            let table_tags = parsedData["table_tags"]
                            if (table_tags === undefined 
                                || table_tags.length == 0)
                                return oldProp
                            let tags_len = table_tags.length
                            let tags = []
                            for (var i=0; i < tags_len; i++){
                                let table_tag = table_tags[i]
                                tags.push({Name: table_tag})
                            }
                            const newProp = {
                                ...oldProp,
                                tags: [...oldProp.tags, ...tags]
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



    const setColumnProperty = React.useCallback(
        (columnIndex: number, newProperty: ColumnSchema) =>
            setColumnProperties(old => old?.map((col, index) => index===columnIndex ? { ...col, ...newProperty} : col)), 
            []
    )

    const schemaDataSelector = (displayColumnProperties || []).map((columnProperty, columnIndex) =>
        <>
            <Box sx={{px:1,display:'flex'}}
                style={((columnProperty.duplicateColor !== undefined) ? {background: columnProperty.duplicateColor} : {})} key={`ColumnIndex-${columnIndex}`}>
                <MemoizedColumnPropertiesSelector columnIndex={columnIndex} columnProperty={columnProperty}
                                                  setColumnProperty={setColumnProperty} key={columnIndex}/>
            </Box>
            
        </>
    )

    const [opener , setopener] = React.useState<boolean>(true);
    const drawerOpenHandler = (mp: boolean) => setopener(mp)
    
    return (
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%", gap: 0 }}>
                {/* <CollapsibleDrawer
                open={opener || false}
                openWidth="400px"
                closedWidth="50px"
                openDrawer={() => {drawerOpenHandler(true)}}
                >
                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", flex: 1 }}>
                            <IconButton onClick={() => drawerOpenHandler(false)}>
                                <img src={DoubeLeftIcon} alt="NA"/>
                            </IconButton>
                        </Box>
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 0 ,px:1, borderRadius:'10px' }}>
                    <Box sx={{ display: "flex", flexDirection: "row", width: "100%", gap: 1,pr:2 }}>
                        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "300px" }}>
                            <TextField
                                fullWidth
                                sx={{
                                    backgroundColor: 'allTableTextfieldbgColor1.main',
                                    boxSizing: 'border-box', 
                                    boxShadow: 'inset -4px -6px 16px rgba(255, 255, 255, 0.5), inset 4px 6px 16px rgba(163, 177, 198, 0.5)',
                                    borderRadius: '15px'
                                }}
                                placeholder="Search Column"
                                value={columnSearchQuery}
                                onChange={(event) => {
                                    setColumnSearchQuery(event.target.value)
                                }}
                                InputProps={{
                                    disableUnderline: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{marginLeft: 0}}/>
                                        </InputAdornment>
                                    )
                            }}
                            />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", flex: 1 , width:'100px' }}>
                            <SelectHeaderRowsButton selectedFile={props.selectedFile} callback={setColumnAndDataCallback} headerRows={parsedFileResult?.headerRows}/>
                        </Box>
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'row'}}>
                        <Box sx={{ height: 700, overflow: 'auto', width: "100%" ,p:0}}>
                            {schemaDataSelector}
                        </Box>
                    </Box>
                </Box>
                </CollapsibleDrawer> */}
            <Box sx={{  display: "flex",
                        flexDirection: "column", 
                        width: "100%", 
                        }}>
                <Box sx={{ display: "flex", 
                            flexDirection: "row", 
                            backgroundColor: 'ActionDefinationHeroCardBgColor.main',
                            
                            // boxShadow: '-10px -10px 15px #FFFFFF, 10px 10px 10px rgba(0, 0, 0, 0.05), inset 10px 10px 10px rgba(0, 0, 0, 0.05), inset -10px -10px 20px #FFFFFF' 
                        }}>
                    <Box sx={{ width: "50%",p:2, display:'flex', flexDirection:'column'}}>
                        <TextField
                            variant="standard"
                            value={tableProperties.tableName}
                            error={!!tableProperties.tableName && !tableProperties.isValid}
                            // label={tableProperties.tableName && whyTableNameNotValid()}
                            onChange={(event) => {
                                setTableName(event.target.value)
                            }}
                            InputProps={{
                                sx: {
                                    fontFamily: "SF Pro Display",
                                    fontStyle: "normal",
                                    fontWeight: 600,
                                    fontSize: "1.2rem",
                                    color: "ActionDefinationHeroTextColor1.main",
                                    backgroundColor: "ActionCardBgColor.main",
                                    ":hover": {
                                        ...(props?.mode==="READONLY" ? {
                                            
                                        } : {
                                            backgroundColor: "ActionDefinationTextPanelBgHoverColor.main"
                                        })
                                    }
                                },
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <CheckCircleIcon sx={{ color: "syncStatusColor1.main" ,fontSize:'1.2rem', mx:1}}/>
                                    </InputAdornment>
                                )
                            }}
                            
                        />
                            <Box  sx={{mt:2, display:'flex', flexDirection:'row'}}>
                                <img src={TableIcon} alt="table" style={{width:'40px' , height:'40px'}}/>
                                <Box sx={{px:2,ml:2, borderLeft:'3px solid black'}}>
                                    <Box sx={{display:'inline',fontWeight:'600' , color:'gray'}}>Status : </Box>{props.statusMSG}
                                </Box>
                            </Box>
                    </Box>
                    <Box sx={{ flex: 1 , my:1,px:2}}>
                            
                            <Box sx={{
                                borderRadius: "5px",
                                boxShadow: '-10px -10px 15px #FFFFFF, 10px 10px 10px rgba(0, 0, 0, 0.05), inset 10px 10px 10px rgba(0, 0, 0, 0.05), inset -10px -10px 20px #FFFFFF',
                                backgroundColor: "ActionCardBgColor.main",
                                p:1,
                                mt:2,
                                height:'130px',
                                overflow:'scroll'

                                
                            }}>
                            <VirtualTagHandler
                                selectedTags={tableProperties.tags}
                                onSelectedTagsChange={handleTableTagChange}
                                tagFilter={{Scope: TagScope.TABLE}}
                                allowAdd={true}
                                allowDelete={true}
                                inputFieldLocation="BOTTOM"
                                />
                            </Box>
                        
                            <SelectHeaderRowsButton selectedFile={props.selectedFile} callback={setColumnAndDataCallback} headerRows={parsedFileResult?.headerRows}/>
                    </Box>
                </Box>
                <Box>
                    <TablePreview 
                        selectedFile={props.selectedFile}
                        dataStartsFromRow={parsedFileResult.dataStartsFromRow}
                        columns={columnProperties}
                        tableName={tableProperties?.tableName}
                        data={parsedFileResult.data}
                        columnSelector = {schemaDataSelector}
                    />
                </Box>
            </Box>
        </Box>
    )
}

type TablePreviewProps = {
    selectedFile: File,
    dataStartsFromRow?: number,
    data?: any[],
    columns?: ColumnSchema[],
    tableName: string,
    columnSelector: JSX.Element[]
}

const TablePreview = (props: TablePreviewProps) => {
    const classes = useStyles()

    const {selectedFile, dataStartsFromRow, columns, tableName, data, columnSelector} = props
    const [dataGridProps, setDataGridProps] = React.useState<DataGridProps>({rows: [], columns: []})

    React.useEffect(() => {
        if(!!selectedFile && !!dataStartsFromRow && !!columns && !!tableName && !!data) {
            const rows = data.map((dataRow, index) => {
                const rowObject = {id: index}
                for(let i=0; i<columns.length; i+=1) {
                    rowObject[columns[i].columnName] = dataRow[i]
                }
                return rowObject
            })
            
            const columnProps = columns.map((column,ind) => {
                const headerName = `${column.columnName} (${column.columnDatatype})`
                return {
                    field: column.columnName,
                    minWidth: 300,
                    headerName: columnSelector[ind]
                }
            })
            
            setDataGridProps(oldProps => {
                return {
                    ...oldProps,
                    columns: columnProps,
                    isRowSelectable: () => false,
                    rows: rows,
                    rowsPerPageOptions: [10, 25, 50, 100]
                }
            })
        }
    }, [selectedFile, dataStartsFromRow, columns, tableName, data])

    return (
        <Box className={classes.TablePreviewBox} sx={{p:4}}>
            <DataGrid
                sx={{
                    "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},    backgroundColor: 'ActionCardBgColor.main',
                    backgroundBlendMode: "soft-light, normal",
                    border: "2px solid rgba(255, 255, 255, 0.4)",
                    borderRadius: "10px",
                    
                }}
                headerHeight={150}
                {...dataGridProps}
            />
        </Box>
    )
}

type ColumnPropertiesSelectorProps = {
    columnIndex: number,
    columnProperty: ColumnSchema,
    setColumnProperty: Function,
}

const ColumnPropertiesSelector = (props: ColumnPropertiesSelectorProps) => {
    const classes = useStyles()

    const handleColumnNameChange = (event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) => {
        const newName = event.target.value
        props.setColumnProperty(props.columnIndex, {columnName: newName})
    }

    const handleColumnDataTypeChange = (event: SelectChangeEvent<string>) => {
        const newDataType = event.target.value;
        props.setColumnProperty(props.columnIndex, {columnDatatype: newDataType})
    }

    const handleColumnTagChange = (tags: Tag[]) => {
        const newTags = tags
        props.setColumnProperty(props.columnIndex, {columnTags: newTags})
    }

    const isColumnFieldValid = () => {
        return props.columnProperty.isValid && (!props.columnProperty.isDuplicate)
    }

    const whyColumnFieldNotValid = () => {
        if (props.columnProperty.isValid === true && props.columnProperty.isDuplicate === true) {
            return "Duplicate Name"
        } else if (props.columnProperty.isValid === true && props.columnProperty.isDuplicate === false) {
            return "Column Name Valid"
        } else if (props.columnProperty.isValid === false && props.columnProperty.isDuplicate === true) {
            return `Duplicate. Non Empty except '"'`
        } else {
            return `Non Empty except '"'`
        }
    }

    return (
        <Card sx={{px:2 , background:'transparent',border:'none'}}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1}}>
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <Box sx={{ width: "250px"}}>
                        <TextField 
                        InputProps={{
                            sx:{
                                fontSize:'1.1rem',
                                fontWeight:600
                            }
                            ,disableUnderline:true}}
                            variant='standard'
                            size='small'
                            value={props.columnProperty.columnName} 
                            error={!isColumnFieldValid()}
                            onChange={handleColumnNameChange} 
                            />
                    </Box>
                    <Box>
                        <FormControl className={classes.formControl}>
                            <Select
                            variant='standard'
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                label="Datatype"
                                value={props.columnProperty.columnDatatype}
                                onChange={handleColumnDataTypeChange}
                                disableUnderline
                            >
                                <MenuItem value={DatafacadeDatatype.INT}>Integer</MenuItem>
                                <MenuItem value={DatafacadeDatatype.STRING}>String</MenuItem>
                                <MenuItem value={DatafacadeDatatype.BOOLEAN}>Boolean</MenuItem>
                                <MenuItem value={DatafacadeDatatype.FLOAT}>Float</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box sx={{m:-1}}>
                    <VirtualTagHandler
                        selectedTags={props.columnProperty.columnTags}
                        onSelectedTagsChange={handleColumnTagChange}
                        tagFilter={{Scope: TagScope.COLUMN}}
                        allowAdd={true}
                        allowDelete={true}
                        inputFieldLocation="TOP"
                    />
                </Box>
            </Box>
        </Card>
    )
}

const MemoizedColumnPropertiesSelector = (props: ColumnPropertiesSelectorProps) => {
    return React.useMemo(() => {
        return <ColumnPropertiesSelector
            columnProperty={props.columnProperty}
            columnIndex={props.columnIndex}
            setColumnProperty={props.setColumnProperty}
        />
    }, [props.columnProperty, props.columnIndex])
}

const formActionPropertiesForLoadTableIntoLocal = (fdsResponse, selectedFile, fileSchema) => {
    return {
        entityProperties: {
            Id: uuidv4(),
            DefinitionId: "12",
            Name: `Load Table(${selectedFile.name}) from S3`,
            DisplayName: `Load Table(${selectedFile.name}) from S3`,
            IsRecurring: false,
            RenderTemplate: false,
            ProviderInstanceId: "8"
        },
        tableSchema: fileSchema,
        SynchronousActionExecution: true,
        otherConfig: {
            filePath: fdsResponse.key
        }
    }
}

const isValidObjectName = (name: string) => {
    if (name !== undefined) {
        return !(name.includes(`"`) || name.length === 0)
    } else {
        return false;
    }
}

const getColor = (x: number) => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[(i * x + i * x * x + i * x * x * x) % 16];
    }
    return color;
}

const getTypeOfValue = (dataPoints?: any[]) => {
    const dataTypeList = dataPoints?.map(dataPoint => {
        if (dataPoint === null || dataPoint === undefined) {
            return null;
        } else {
            if (typeof dataPoint === "number") {
                // if (Number(dataPoint) === dataPoint && dataPoint % 1 === 0) {
                //     return ColumnDataType.INT
                // } else {
                    return DatafacadeDatatype.FLOAT
                // }
            } else if (typeof dataPoint === "boolean") {
                return DatafacadeDatatype.BOOLEAN
            } else {
                return DatafacadeDatatype.STRING
            }
        }
    }).filter(x => x !== null)

    if (dataTypeList?.length === 0) {
        return DatafacadeDatatype.STRING
    } else if (dataTypeList?.every(dataType => dataType === DatafacadeDatatype.BOOLEAN)) {
        return DatafacadeDatatype.BOOLEAN
    } else if (dataTypeList?.every(dataType => dataType === DatafacadeDatatype.INT)) {
        return DatafacadeDatatype.INT
    } else if (dataTypeList?.every(dataType => dataType === DatafacadeDatatype.INT || dataType === DatafacadeDatatype.FLOAT)) {
        return DatafacadeDatatype.FLOAT
    } else {
        return DatafacadeDatatype.STRING
    }
}

const formCloseValidObjectName = (name: string) => {
    return name
}

export default ConfigureTableMetadata;
