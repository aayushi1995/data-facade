import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
    Box,
    Button, Card, FormControl, Grid, InputAdornment, MenuItem, Popover, Select, SelectChangeEvent, TextField
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import Papa from 'papaparse';
import React, { useContext } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import SelectTags from '../../../../common/components/SelectTags.js';
import VirtualTagHandler from '../../../../common/components/tag-handler/VirtualTagHandler';
import S3UploadState from '../../../../custom_enums/S3UploadState';
import dataManager from '../../../../data_manager/data_manager';
import DatafacadeDatatype from '../../../../enums/DatafacadeDatatype';
import ExternalStorageUploadRequestContentType from '../../../../enums/ExternalStorageUploadRequestContentType';
import TagGroups from '../../../../enums/TagGroups';
import TagScope from '../../../../enums/TagScope';
import { TableProperties, Tag } from '../../../../generated/entities/Entities';
import { ActionDefinitionDetail, TableAndColumns } from '../../../../generated/interfaces/Interfaces';
import labels from '../../../../labels/labels';
import { DataContext, SetDataContext } from '../../../../utils/DataContextProvider';
import { SetUploadTableState, SetUploadTableStateContext, UploadState, UploadTableState, UploadTableStateContext } from '../context/UploadTablePageContext';
import './../presentation/css/TableBrowser.css';
import { CancelButtonCss, columnDataTypeSelectCss, ColumnHeaderConatiner, ColumnHeaderTextFieldCss, HeaderButtonContainerCss, HeaderTextFieldConatinerCss, HeaderTextFieldCss, MetaDataContainerBoxCss, SaveButtonCss, StatusContainerCss, statusTypoCss, TableCss, TableHeaderButtonCss, TableHeaderCardCss, TagHeaderSelButtonContainer } from './CssProperties';
import SelectHeaderRowsButton from './SelectHeaderRowsButton';
import { findHeaderRows } from './util';
const dataManagerInstance = dataManager?.getInstance as { saveData: Function, s3PresignedUploadUrlRequest: Function, s3UploadRequest: Function, getTableAndColumnTags: Function, getRecommendedQuestions?: Function }

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
    tagsFetched: boolean,
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
    onCancel: Function,
}

type S3UploadInformation = {
    requestUrl: string,
    headers: any,
    file: File
}

export const ConfigureTableMetadata = (props: ConfigureTableMetadataProps) => {
    const classes = useStyles();
    let history = useHistory();
    const uploadTableStateContext = React.useContext<UploadTableState>(UploadTableStateContext)
    const setUploadTableStateContext = React.useContext<SetUploadTableState>(SetUploadTableStateContext)
    const setUploadState = (uploadState: UploadState) => setUploadTableStateContext({ type: "SetUploadState", payload: { uploadState: uploadState } })
    // States
    const selectedFile = uploadTableStateContext?.CSVFileSelectedForUpload?.CsvFile!
    const [fileStatusInformation, setFileStatusInformation] = React.useState<{ autoUpload: Boolean, errors: string[] }>({ autoUpload: true, errors: [] })
    const [selectedFileSchema, setSelectedFileSchema] = React.useState<FileSchema>({ requiredTableTags: [], tableId: uuidv4(), tagsFetched: false })
    const [uploadButtonState, setUploadButtonState] = React.useState<{ currentEnabled: number, requiredEnabled: number }>({
        currentEnabled: 5,
        requiredEnabled: 31
    })
    const setDataContext = useContext(SetDataContext);
    const dataContext = useContext(DataContext);
    // Upload Button is enabled if all bits are set
    // 2^0: File type/size valid
    // 2^1: File name valid
    // 2^2: No Upload already in progress
    // 2^3: All Column Names are Valid and Distinct
    // 2^4: All Required Tags Fetched
    React.useEffect(() => {
        if (fileStatusInformation.autoUpload) {
            if (uploadButtonState.currentEnabled === uploadButtonState.requiredEnabled && !dataContext?.isUploadSucess) {
                setFileStatusInformation(old => ({ ...old, autoUpload: false }))
                uploadSelectedFiles()
            }
        }
    }, [uploadButtonState.currentEnabled])

    React.useEffect(() => {
        setFileStatusInformation(old => ({ ...old, autoUpload: true }))
    }, [selectedFile])

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

    const fetchPresignedUrlMutation = useMutation<S3UploadInformation, unknown, { file: File, expirationDurationInMinutes: number }, unknown>(
        "GetS3PreSignedUrl",
        (config) => dataManagerInstance.s3PresignedUploadUrlRequest(config.file, config.expirationDurationInMinutes, ExternalStorageUploadRequestContentType.TABLE),
        {
            onMutate: variables => {
                setUploadState(S3UploadState.PRESIGNED_URL_FETCH_LOADING);
                disableUploadButton(4);
            }
        }
    );

    const uploadToS3Mutation = useMutation<unknown, unknown, S3UploadInformation, unknown>(
        "UploadToS3",
        (config) => dataManagerInstance.s3UploadRequest(config.requestUrl, config.headers, config.file),
        {
            onMutate: variables => {
                setUploadState(S3UploadState.S3_UPLOAD_LOADING);
                disableUploadButton(4);
            }
        }
    );

    const loadTableFromS3Action = useMutation<unknown, unknown, { entityName: string, actionProperties: any }, unknown>(
        "LoadTableFromS3",
        (config) => dataManagerInstance.saveData(config.entityName, config.actionProperties),
        {
            onMutate: () => {
                setUploadState(S3UploadState.FDS_TABLE_FETCH_LOADING);
                disableUploadButton(4);
            }
        }
    );

    const getRecommenededQuestions = useMutation<ActionDefinitionDetail[], unknown, {tableId: string}, unknown>(
        "GetRecommenedActions",
        (config) => dataManagerInstance.getRecommendedQuestions?.(config.tableId), {
            onMutate: () => {
                setUploadState(S3UploadState.FETCHING_TABLE_QUESTIONS);
            }
        }
    )

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
        onMutate: (variables) => setUploadState(S3UploadState.CREATING_TABLE_IN_SYSTEM),
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
        setUploadState(S3UploadState.BUIDING_FILE_FOR_UPLOAD);
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
                    const newCsvFile = new File([newCsvFileContent], fileName, { type: selectedFile.type })
                    setUploadState(S3UploadState.FILE_BUILT_FOR_UPLOAD);
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
                    setUploadState(S3UploadState.PRESIGNED_URL_FETCH_SUCCESS);
                    disableUploadButton(4);
                    uploadToS3Mutation.mutate(
                        { requestUrl: data.requestUrl, headers: data.headers, file: variables.file },
                        {
                            onSuccess: () => {
                                setUploadState(S3UploadState.S3_UPLOAD_SUCCESS);
                                disableUploadButton(4);
                                loadTableFromS3Action.mutate(
                                    {
                                        entityName: "ActionInstance",
                                        actionProperties: formActionPropertiesForLoadTableIntoLocal(data, variables.file, selectedFileSchema)
                                    },
                                    {
                                        onSuccess: () => {
                                            setUploadState(S3UploadState.FDS_TABLE_FETCH_SUCCESS);
                                            createTableColumnMutation.mutate(
                                                selectedFileSchema,
                                                {
                                                    onSuccess: (data, variables, context) => {
                                                        setUploadTableStateContext({
                                                            type: "SetLastUploadedTableId",
                                                            payload: {
                                                                tableId: selectedFileSchema.tableId
                                                            }
                                                        })
                                                        refreshIds()
                                                        setUploadState(S3UploadState.CREATING_TABLE_IN_SYSTEM_SUCCESS)
                                                        setDataContext({
                                                            type: 'SetFileUpload',
                                                            payload: {
                                                                isUploadSucess: true,
                                                                status: S3UploadState.CREATING_TABLE_IN_SYSTEM_SUCCESS.message
                                                            }
                                                        })
                                                        enableUploadButton(4);
                                                        getRecommenededQuestions.mutate({
                                                            tableId: selectedFileSchema.tableId!,
                                                        }, {
                                                            onSuccess: (data, variables, context) => {
                                                                setUploadState(S3UploadState.GENERATING_QUESTIONS_SUCCESS)
                                                                setDataContext({
                                                                    type: 'SetFileUpload',
                                                                    payload: {
                                                                        isUploadSucess: true,
                                                                        status: S3UploadState.GENERATING_QUESTIONS_SUCCESS.message
                                                                    }
                                                                })
                                                                setUploadTableStateContext({
                                                                    type: "SetRecommendedQuestions",
                                                                    payload: {
                                                                        recommendedQuestions: data
                                                                    }
                                                                })
                                                            },
                                                            onError: (error, variables, context) => {
                                                                setUploadState(S3UploadState.GENERATING_QUESTIONS_ERROR)
                                                                setDataContext({
                                                                    type: 'SetFileUpload',
                                                                    payload: {
                                                                        isUploadSucess: true,
                                                                        status: S3UploadState.GENERATING_QUESTIONS_ERROR.message
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    },
                                                    onError: (error, variables, context) => {
                                                        setUploadState(S3UploadState.CREATING_TABLE_IN_SYSTEM_FAILURE)
                                                        enableUploadButton(4);
                                                    }
                                                }
                                            )
                                        },
                                        onError: (err, variables, context) => {
                                            console.log(err, variables, context)
                                            setUploadState(S3UploadState.FDS_TABLE_FETCH_ERROR);
                                            enableUploadButton(4);
                                        }
                                    }
                                );
                            },
                            onError: (data, variables, context) => {
                                setUploadState(S3UploadState.S3_UPLOAD_ERROR);
                                enableUploadButton(4);
                            }
                        }
                    );
                },
                onError: (data, variables, context) => {
                    setUploadState(S3UploadState.PRESIGNED_URL_FETCH_ERROR);
                    enableUploadButton(4);
                }
            }
        );
    };

    // TODO: Apply colour to disbaled Upload Button
    return (
        <Grid sx={{ m: -4, mt: -5 }}>
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
                <Box sx={{ ...HeaderButtonContainerCss }}>
                    <Button sx={{ ...CancelButtonCss }} disabled={uploadButtonState.currentEnabled !== uploadButtonState.requiredEnabled}
                        onClick={() => props?.onCancel?.()} variant="outlined" color="error"
                    >
                        Cancel
                    </Button>

                    <Button color="success" variant="contained" sx={{ ...SaveButtonCss }} component="label" onClick={() => uploadSelectedFiles}
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
                    statusMSG={uploadTableStateContext?.uploadState?.message}
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
    const [tableProperties, setTableProperties] = React.useState<{ tableName: string, tags: Tag[], isValid: boolean, tagsFetched: boolean }>({
        tableName: "",
        tags: [],
        isValid: true,
        tagsFetched: false
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
        if (!!props.selectedFile) {
            findHeaderRows(props.selectedFile, setColumnAndDataCallback)
            setTableName(formCloseValidObjectName(props.selectedFile.name.split('.').slice(0, -1).join('')))
        }
    }, [props.selectedFile])

    React.useEffect(() => {
        const tagsFetched = tableProperties?.tagsFetched && columnProperties?.every(c => c?.tagsFetched)
        tagsFetched ? props?.enableUploadButton?.(16) : props?.disableUploadButton(16)
    }, [tableProperties, columnProperties])

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
                    tagsFetched: false,
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
            return { ...old, tableName: tableName }
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
                            let newProp = oldProp?.map(cs => ({ ...cs, tagsFetched: true }))
                            if (column_tags === undefined || column_tags.length == 0) return newProp

                            column_tags.forEach(columnTagProp => {
                                const columnName = columnTagProp.column_name
                                let tags_len = columnTagProp["column_tags"].length
                                let tags = []
                                for (var i = 0; i < tags_len; i++) {
                                    let column_tag = columnTagProp["column_tags"][i]
                                    tags.push({ Name: column_tag })
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
                            if (table_tags === undefined || table_tags.length == 0)
                                return { ...oldProp, tagsFetched: true }
                            let tags_len = table_tags.length
                            let tags = []
                            for (var i = 0; i < tags_len; i++) {
                                let table_tag = table_tags[i]
                                tags.push({ Name: table_tag })
                            }
                            const newProp = {
                                ...oldProp,
                                tags: [...oldProp.tags, ...tags],
                                tagsFetched: true
                            }
                            return newProp
                        })
                    },
                    onSettled: () => {
                    },
                    onError: (data, variables, context) => {
                        setColumnProperties(oldCols => oldCols?.map(col => ({ ...col, tagsFetched: true })))
                        setTableProperties(oldTable => ({ ...oldTable, tagsFetched: true }))
                    }
                })
        }

    }, [parsedFileResult])



    const setColumnProperty = React.useCallback(
        (columnIndex: number, newProperty: ColumnSchema) =>
            setColumnProperties(old => old?.map((col, index) => index === columnIndex ? { ...col, ...newProperty } : col)),
        []
    )

    const schemaDataSelector = (displayColumnProperties || []).map((columnProperty, columnIndex) =>
        <>
            <Box sx={{ px: 1, display: 'flex' }}
                style={((columnProperty.duplicateColor !== undefined) ? { background: columnProperty.duplicateColor } : {})} key={`ColumnIndex-${columnIndex}`}>
                <MemoizedColumnPropertiesSelector columnIndex={columnIndex} columnProperty={columnProperty}
                    setColumnProperty={setColumnProperty} key={columnIndex} />
            </Box>

        </>
    )

    const [tagOpener, setTagOpener] = React.useState<HTMLButtonElement | null>(null);
    const opener = (event: React.MouseEvent<HTMLButtonElement>) => {
        setTagOpener(event.currentTarget);
    };
    const closer = () => {
        setTagOpener(null);
    };
    const open = Boolean(tagOpener);
    const id = open ? 'simple-popover' : undefined;

    const dataContext = useContext(DataContext);
    return (
        <Box sx={{ ...MetaDataContainerBoxCss }}>
            <Box sx={{ display: "flex", mx: 5 }}>
                <Box sx={{ ...StatusContainerCss }}>
                    <Box sx={{ ...statusTypoCss }}>Status : </Box><>{dataContext?.isUploadSucess ? dataContext.uploadStats : props.statusMSG}</>
                </Box>
                <Box sx={{ ...HeaderTextFieldConatinerCss }}>
                    <Box sx={{ m: 'auto' }}>
                        <TextField
                            size="small"
                            variant='standard'
                            value={tableProperties.tableName}
                            error={!!tableProperties.tableName && !tableProperties.isValid}
                            // label="Table Name"
                            onChange={(event) => {
                                setTableName(event.target.value)
                            }}
                            InputProps={{
                                sx: {
                                    ...HeaderTextFieldCss
                                },
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="end">
                                        {/* <CheckCircleIcon sx={{ color: "syncStatusColor1.main", fontSize: '1.2rem', mx: 1 }} /> */}
                                    </InputAdornment>
                                )
                            }}

                        />
                    </Box>
                </Box>
                <Box sx={{ ...TagHeaderSelButtonContainer }}>
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 2, }}>
                        <Button sx={{ ...TableHeaderButtonCss }} variant="contained" aria-describedby={id} onClick={opener}>
                            Add / Show Tag <ArrowDropDownIcon />
                        </Button>
                        <Popover
                            open={open}
                            anchorEl={tagOpener}
                            onClose={closer}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}>
                            <Box sx={{ width: '300px', mr: 1 }}>
                                <VirtualTagHandler
                                    selectedTags={tableProperties.tags}
                                    onSelectedTagsChange={handleTableTagChange}
                                    tagFilter={{ Scope: TagScope.TABLE }}
                                    allowAdd={true}
                                    allowDelete={true}
                                    inputFieldLocation="BOTTOM"
                                />
                            </Box>
                        </Popover>
                        <SelectHeaderRowsButton selectedFile={props.selectedFile} callback={setColumnAndDataCallback} headerRows={parsedFileResult?.headerRows} />
                    </Box>
                </Box>
            </Box>
            <Box>
                <TablePreview
                    selectedFile={props.selectedFile}
                    dataStartsFromRow={parsedFileResult.dataStartsFromRow}
                    columns={columnProperties}
                    tableName={tableProperties?.tableName}
                    data={parsedFileResult.data}
                    columnSelector={schemaDataSelector}
                />
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

    const { selectedFile, dataStartsFromRow, columns, tableName, data, columnSelector } = props
    const [dataGridProps, setDataGridProps] = React.useState<DataGridProps>({ rows: [], columns: [] })

    React.useEffect(() => {
        if (!!selectedFile && !!dataStartsFromRow && !!columns && !!tableName && !!data) {
            const rows = data.map((dataRow, index) => {
                const rowObject = { id: index }
                for (let i = 0; i < columns.length; i += 1) {
                    rowObject[columns[i].columnName] = dataRow[i]
                }
                return rowObject
            })

            const columnProps = columns.map((column, ind) => {
                const headerName = `${column.columnName} (${column.columnDatatype})`
                return {
                    field: column.columnName,
                    minWidth: 300,
                    renderHeader: () => columnSelector[ind],
                    disableColumnMenu: true,
                    sortable: false
                }
            })

            setDataGridProps(oldProps => {
                return {
                    ...oldProps,
                    columns: columnProps,
                    isRowSelectable: () => false,
                    rows: rows,
                    rowsPerPageOptions: [10, 25, 50, 100],
                    headerHeight: '120px'
                }
            })
        }
    }, [selectedFile, dataStartsFromRow, columns, tableName, data])

    return (
        <Box className={classes.TablePreviewBox} >
            <DataGrid
                sx={{ ...TableCss }}
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

    const handleColumnNameChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const newName = event.target.value
        props.setColumnProperty(props.columnIndex, { columnName: newName })
    }

    const handleColumnDataTypeChange = (event: SelectChangeEvent<string>) => {
        const newDataType = event.target.value;
        props.setColumnProperty(props.columnIndex, { columnDatatype: newDataType })
    }

    const handleColumnTagChange = (tags: Tag[]) => {
        const newTags = tags
        props.setColumnProperty(props.columnIndex, { columnTags: newTags })
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
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <Card sx={{ ...TableHeaderCardCss }}>
            <Box sx={{ ...ColumnHeaderConatiner }}>
                <TextField
                    InputProps={{
                        sx: { ...ColumnHeaderTextFieldCss }
                        , disableUnderline: true
                    }}
                    variant='standard'
                    size='small'
                    value={props.columnProperty.columnName}
                    error={!isColumnFieldValid()}
                    onChange={handleColumnNameChange}
                />
            </Box>
            <Box sx={{ height: '30px' }}>
                <FormControl className={classes.formControl}>
                    <Select
                        variant='standard'
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Datatype"
                        value={props.columnProperty.columnDatatype}
                        onChange={handleColumnDataTypeChange}
                        disableUnderline
                        sx={{ ...columnDataTypeSelectCss }}
                    >
                        <MenuItem value={DatafacadeDatatype.INT}>Integer</MenuItem>
                        <MenuItem value={DatafacadeDatatype.STRING}>String</MenuItem>
                        <MenuItem value={DatafacadeDatatype.BOOLEAN}>Boolean</MenuItem>
                        <MenuItem value={DatafacadeDatatype.FLOAT}>Float</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ m: -1 }}>
                <Button sx={{ color: '#A6ABBD' }} aria-describedby={id} onClick={handleClick}>
                    Add/Show Tag <ArrowDropDownIcon />
                </Button>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}>
                    <Box sx={{ width: '300px', mr: 1 }}>
                        <VirtualTagHandler
                            selectedTags={props.columnProperty.columnTags}
                            onSelectedTagsChange={handleColumnTagChange}
                            tagFilter={{ Scope: TagScope.COLUMN }}
                            allowAdd={true}
                            allowDelete={true}
                            inputFieldLocation="TOP"
                        />
                    </Box>
                </Popover>
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
