import dataManager from "@/api/dataManager";
import { TableProperties, Tag } from "@/generated/entities/Entities";
import { labels } from "@/helpers/constant";
import DatafacadeDatatype from "@/helpers/enums/DatafacadeDatatype";
import S3UploadState from "@/helpers/enums/S3UploadState";
import { convertToCsv } from "@/pages/chat/tableUpload/util";
import Papa from "papaparse";
import React from "react";
import { useMutation } from "react-query";
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';

type ColumnTag = {
    column_name: string,
    column_tags: string[]
}

type TagResponse = {
    name: string,
    table_tags: string[],
    column_tags: ColumnTag[]
}

type ValidationStatus = {
    value: boolean,
    comments?: string,
    onConfirmAction?: Function
}

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

export type FileSchema = {
    columnSchema?: ColumnSchema[],
    dataStartsFromRow?: number,
    requiredTableTags?: Tag[],
    tableName?: string,
    tableId?: string,
    tableTags?: Tag[],
    tagsFetched?: boolean
}

export type ExtractedCSVFileValidations = {
    TABLE_NAME_NOT_PRESENT_IN_SYSTEM?: ValidationStatus,
    TAGS_ASSIGNED?: ValidationStatus,
    COLUMN_NAMES_DISTINCT?: ValidationStatus,
    COLUMN_NAMES_VALID?: ValidationStatus,
}

type ExtractedCSVFile = {
    id: string,
    CsvFile: File,
    FileSchema?: FileSchema,
    validations: ExtractedCSVFileValidations
}

export type Status = {
    message: string,
    colour: string,
    icon: JSX.Element,
    tableName?:string
}

type SourceFileValidations = {
    FILE_SELECTED?: ValidationStatus,
    FILE_SIZE_VALID?: ValidationStatus,
    FILE_TYPE_VALID?: ValidationStatus
}

type FileParsingValidations = {
    FILE_PARSED?: ValidationStatus
}

type ActiveExtractedCSVFileForUpload = {
    Id?: string,
    validationSummary?: boolean,
    validationComments?: string,
    validationsPerformed?: boolean
}

// Contains :-
// Type
// Default
// Context
// for UploadTableStateContext
export type UploadTableState = {
    sourceFile?: File,
    extractedCSVFiles?: ExtractedCSVFile[],
    activeExtractedCSVFileForUpload?: ActiveExtractedCSVFileForUpload,
    status?: Status,
    validations: {
        sourceFile: SourceFileValidations,
        fileParsing: FileParsingValidations
    }
}
const defaultEmptyContext: UploadTableState = {
    validations: {
        sourceFile: {

        },
        fileParsing: {

        }
    }
}
export const UploadTableStateContext = React.createContext<UploadTableState>(defaultEmptyContext)

// Contains :-
// Type
// Default
// Context
// for SetUploadTableStateContext
export type SetUploadTableState = (action: UploadTableStateAction) => void
const defaultSetUploadTableStateContext: SetUploadTableState = (action: UploadTableStateAction) => {}
export const SetUploadTableStateContext = React.createContext<SetUploadTableState>(defaultSetUploadTableStateContext)

// UploadTableStateContext Update Actions
export type SetStatusAction = {
    type: "SetStatus",
    payload: {
        uploadState: Status
    }
}

export type SetExtractedCSVFilesAction = {
    type: "SetExtractedCSVFiles",
    payload: {
        files?: ExtractedCSVFile[]
    }
}

export type SetActiveExtractedCSVFileForUploadAction = {
    type: "SetActiveExtractedCSVFileForUpload",
    payload: ActiveExtractedCSVFileForUpload
}

export type SetSourceFileAction = {
    type: "SetSourceFile",
    payload: File
}

export type SetFileSchemaAction = {
    type: "SetFileSchema",
    payload: {
        fileId?: string,
        newFileSchema: FileSchema
    }
}

export type SetTagsAction = {
    type: "SetTags",
    payload: {
        fileId?: string,
        tagRespone: TagResponse
    }
}

export type SetExtractedCSVFileValidationAction = {
    type: "SetExtractedCSVFileValidation",
    payload: {
        fileId?: string,
        validations: ExtractedCSVFileValidations
    }
}

export type FileParsedValidationAction = {
    type: "FileParsedValidation",
    payload: ValidationStatus
}

export type UploadTableStateAction = SetStatusAction |
                                     SetExtractedCSVFilesAction |
                                     SetActiveExtractedCSVFileForUploadAction |
                                     SetSourceFileAction |
                                     SetTagsAction |
                                     SetFileSchemaAction |
                                     SetExtractedCSVFileValidationAction |
                                     FileParsedValidationAction


const reducer = (state: UploadTableState, action: UploadTableStateAction): UploadTableState => {
    switch (action.type) {
        case "SetStatus": {
            return {
                ...state,
                status: action?.payload?.uploadState
            }
        }

        case "SetExtractedCSVFiles": {
            return {
                ...state,
                extractedCSVFiles: action?.payload?.files,
                validations: {
                    ...state.validations,
                    fileParsing: {
                        ...state.validations.fileParsing,
                        FILE_PARSED: {
                            value: true,
                            comments: undefined
                        }
                    }
                }
            }
        }

        case "SetActiveExtractedCSVFileForUpload": {
            return {
                ...state,
                activeExtractedCSVFileForUpload: {
                    ...state?.activeExtractedCSVFileForUpload,
                    ...action?.payload
                }
            }
        }

        case "SetSourceFile": {
            const newSourceFile = action?.payload
            const newSourceFileValidations: SourceFileValidations = {}
            newSourceFileValidations.FILE_SELECTED = {
                value: !!newSourceFile,
                comments: !newSourceFile ? "No File Selected" : undefined
            }
            
            if(!!newSourceFile) {
                const exceedsBy = newSourceFile.size - FILE_SIZE_LIMIT
                newSourceFileValidations.FILE_SIZE_VALID ={ 
                    value: exceedsBy <= 0, 
                    comments: (exceedsBy > 0) ? `File Size exceeds by ${exceedsBy} B` : undefined
                }
                
                const fileTypeValid = ALLOWED_FILE_TYPES?.includes?.(newSourceFile.type)
                newSourceFileValidations.FILE_TYPE_VALID = {
                    value: fileTypeValid,
                    comments: !fileTypeValid ? `Invalid FileType: ${newSourceFile.type}` : undefined
                }
            }

            return {
                sourceFile: newSourceFile,
                validations: {
                    sourceFile: newSourceFileValidations,
                    fileParsing: {}      
                }
            }
        }

        case "FileParsedValidation": {
            return {
                ...state,
                validations: {
                    ...state.validations,
                    fileParsing: {
                        FILE_PARSED: {
                            ...state.validations.fileParsing.FILE_PARSED,
                            ...action.payload
                        }
                    }
                }
            }
        }

        case "SetExtractedCSVFileValidation": {
            const newExtractedCSVFiles = state?.extractedCSVFiles?.map(csv => csv?.id===action.payload.fileId ? ({
                ...csv, 
                validations: {
                    ...csv?.validations,
                    ...action?.payload?.validations
                }
            }) : csv)

            return {
                ...state,
                extractedCSVFiles: newExtractedCSVFiles,
                activeExtractedCSVFileForUpload: {
                    ...state?.activeExtractedCSVFileForUpload,
                    validationSummary: undefined
                }
            }
        }

        case "SetFileSchema": {
            const newExtractedCSVFiles = state?.extractedCSVFiles?.map(csv => csv?.id===action.payload.fileId ? ({...csv, FileSchema: action?.payload?.newFileSchema}) : csv)
            return {
                ...state,
                extractedCSVFiles: newExtractedCSVFiles
            }
        }

        case "SetTags": {
            const tagsResponse = action?.payload?.tagRespone
            const activeFile = getActiveExtractedCSV(state)
            const newFileSchema: FileSchema = {
                ...activeFile?.FileSchema,
                tableTags: tagsResponse?.table_tags?.map(tagName => ({ Name: tagName })),
                columnSchema: activeFile?.FileSchema?.columnSchema?.map(column => {
                    const columnTags = tagsResponse?.column_tags?.find(col => col?.column_name === column?.columnName)?.column_tags || []
                    const columnDatatypeFromTags = getDatatypeFromTag(columnTags)
                    return {
                        ...column,
                        columnTags: columnTags?.map(tagName => ({ Name: tagName })),
                        columnDatatype: columnDatatypeFromTags!==undefined ? columnDatatypeFromTags : column.columnDatatype
                    }
                })
            }

            return {
                ...state,
                extractedCSVFiles: state?.extractedCSVFiles?.map(csv => csv?.id===action.payload.fileId ? ({ 
                    ...csv, 
                    FileSchema: newFileSchema,
                    validations: {
                        ...csv?.validations,
                        TAGS_ASSIGNED: {
                            value: true,
                            comments: undefined
                        }
                    }
                }) : csv)
            }
        }

        default: {
            const neverAction: never = action
            return state
        }
    }
}

export const areValidationsSuccessful = (validations?: (ValidationStatus | undefined)[]) => validations?.every(validation => validation?.value) || false;
export const getActiveExtractedCSV = (context: UploadTableState) => context?.extractedCSVFiles?.find(csv => csv.id === context?.activeExtractedCSVFileForUpload?.Id)

export const FILE_SIZE_LIMIT = 20000000
export const ALLOWED_FILE_TYPES = ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]

const UploadTableContextProvider = ({children}: {children: React.ReactElement}) => {
    const [contextState, dispatch] = React.useReducer(reducer, defaultEmptyContext)
    const setContextState: SetUploadTableState = ( args: UploadTableStateAction) => dispatch(args)

    const sourceFileValidations = contextState?.validations?.sourceFile
    const sourceFileValidationsSuccessful= areValidationsSuccessful([sourceFileValidations?.FILE_SELECTED, sourceFileValidations?.FILE_SIZE_VALID, sourceFileValidations?.FILE_TYPE_VALID])
    
    const fileParsingValidations = contextState?.validations?.fileParsing
    const fileParsingValidationsSuccessful= areValidationsSuccessful([fileParsingValidations?.FILE_PARSED])

    const activeFile = getActiveExtractedCSV(contextState)

    // Responsible for parsing the Source File and extracting individual CSV Files
    React.useEffect(() => {
        if(sourceFileValidationsSuccessful) {
            setContextState({
                type: "SetStatus",
                payload: {
                    uploadState: S3UploadState.SELECTED_FILE_OK(contextState?.sourceFile?.name, contextState?.sourceFile?.size)
                }
            })

            const fileParseSuccess = (files?: File[]) => {
                if(!!files) {
                    const extractedCSVFiles: (ExtractedCSVFile[] | undefined) = files?.map(file => ({
                        CsvFile: file,
                        id: uuidv4(),
                        validations: {}
                    }))
                    setContextState({
                        type: "SetExtractedCSVFiles",
                        payload: {
                            files: extractedCSVFiles
                        }
                    })
                }
            }
    
            const fileParseError = (error?: any) => {
                setContextState({
                    type: "FileParsedValidation",
                    payload: {
                        value: false,
                        comments: error
                    }
                })
            }
            
            if(!!contextState?.sourceFile) {
                fileHandlers.forEach(fileHandlerConfig => {
                    if(fileHandlerConfig.canProcess(contextState?.sourceFile!)) {
                        fileHandlerConfig.handler(contextState?.sourceFile!, fileParseSuccess, fileParseError)
                    }
                })
            }
        }
    }, [sourceFileValidationsSuccessful, contextState?.sourceFile])

    // Responsible for selecting the default CSV file for upload from extracted CSV Files
    React.useEffect(() => {
        if(fileParsingValidationsSuccessful) {
            if(!!contextState?.extractedCSVFiles?.[0]){
                setContextState({
                    type: "SetActiveExtractedCSVFileForUpload",
                    payload: {
                        Id: contextState?.extractedCSVFiles?.[0]?.id
                    }
                })
            }
        }
    }, [fileParsingValidationsSuccessful])

    // Responsible for extracting table/column information for the Active Extracted CSV File
    React.useEffect(() => {
        if(activeFile?.CsvFile && !activeFile?.FileSchema) {
            const fileId = contextState?.activeExtractedCSVFileForUpload?.Id
            Papa.parse(activeFile?.CsvFile, {
                dynamicTyping: true,
                skipEmptyLines: true,
                header: false,
                preview: 200,
                complete: (result) => {
                    const tableName = activeFile?.CsvFile?.name?.split('.')?.slice(0, -1)?.join('')?.split(' ')?.join('_')
                    const columnNames = (result?.data?.[0] as any[])?.map?.((cellValue, index) => (cellValue||"").length>0?cellValue.trim().split(' ').join('_'):`Column-${index+1}`)

                    const columnSchemas: ColumnSchema[] = columnNames.map((columnName, columnIndex) => {
                        const calculatedDataType = getTypeOfValue((result?.data as any[])?.map?.(x => x?.[columnIndex]))
                        return {
                            Id: uuidv4(),
                            columnName: columnName,
                            columnDatatype: calculatedDataType,
                            columnIndex: columnIndex,
                            columnTags: [],
                            tagsFetched: false,
                            isValid: true,
                            isDuplicate: false,
                            duplicateColor: undefined
                        } as ColumnSchema
                    })

                    const newFileSchema: FileSchema = {
                        tableId: uuidv4(),
                        tableTags: [],
                        requiredTableTags: [],
                        tagsFetched: false,
                        dataStartsFromRow: 1,
                        tableName: tableName,
                        columnSchema: columnSchemas
                    }

                    setContextState({ type: "SetFileSchema", payload: { fileId: fileId, newFileSchema: newFileSchema }})
        
                    fetchTagsMutation.mutate(JSON.stringify({
                            name: tableName,
                            column_names: columnNames,
                            data: result?.data
                        }),
                        {
                            onSuccess: (data, variables, context) => setContextState({ type: "SetTags", payload: { fileId: activeFile?.id, tagRespone: data } })
                        }
                    )
                }
            })
        }
    }, [activeFile])

    // Responsible for validating table/column information for the Active Extracted CSV File
    React.useEffect(() => {
        const activeFileSchema = activeFile?.FileSchema
        const activeFileId = activeFile?.id
        if(activeFileSchema) {
            const columnNames = activeFileSchema?.columnSchema?.map(columnProperty => columnProperty.columnName)
            const allColumnNamesValid = activeFileSchema?.columnSchema?.map(columnProperty => columnProperty.isValid)?.every(x => x === true) || false
            const allColumnNamesDistinct = !((new Set(columnNames)).size !== columnNames?.length)


            setContextState({
                type: "SetExtractedCSVFileValidation",
                payload: {
                    fileId: activeFileId,
                    validations: {
                        COLUMN_NAMES_DISTINCT: {
                            value: allColumnNamesDistinct,
                            comments: undefined
                        },
                        COLUMN_NAMES_VALID: {
                            value: allColumnNamesValid,
                            comments: undefined
                        }
                    }
                }
            })
        }
    }, [activeFile?.FileSchema])


    const fetchTagsMutation = useMutation<TagResponse, unknown, string,unknown>("FetchTags", (config) => dataManager.getInstance.getTableAndColumnTags(config))


    // Responsible for fetching the Tags for the Active Extracted CSV File
    React.useEffect(() => {
        if(!activeFile?.validations?.TAGS_ASSIGNED?.value) {
            
        }
    }, [activeFile?.validations?.TAGS_ASSIGNED])

    // Responsible for setting the summarised value of all validations for the Active File
    React.useEffect(() => {
        if(activeFile) {
            const validationsToCheck = [
                contextState?.validations?.sourceFile?.FILE_SELECTED,
                contextState?.validations?.sourceFile?.FILE_SIZE_VALID,
                contextState?.validations?.sourceFile?.FILE_TYPE_VALID,
                contextState?.validations?.fileParsing?.FILE_PARSED,
                activeFile?.validations?.COLUMN_NAMES_DISTINCT,
                activeFile?.validations?.COLUMN_NAMES_VALID,
                activeFile?.validations?.TABLE_NAME_NOT_PRESENT_IN_SYSTEM,
                activeFile?.validations?.TAGS_ASSIGNED
            ]
            const activeFileAllValidationsSuccessful = areValidationsSuccessful(validationsToCheck)
            const validationComments = validationsToCheck?.filter(validation => validation?.value === false)?.map(validation => validation?.comments)?.join("\n")
        
            setContextState({
                type: "SetActiveExtractedCSVFileForUpload",
                payload: {
                    validationSummary: activeFileAllValidationsSuccessful,
                    validationComments: validationComments,
                    validationsPerformed: validationsToCheck?.every(validation => validation?.value !== undefined)
                }
            })
        }
    }, [activeFile])

    const tableNameMutation = useMutation<TableProperties[], unknown, {tableName: string}, unknown>("DuplicateTableNameCheck", (context) => 
        dataManager.getInstance.retreiveData(labels.entities.TABLE_PROPERTIES, {
            filter: {
                UniqueName: context.tableName
            }
        }
    ))


    // Responsible for checking if table with same name exists for the Active File
    React.useEffect(() => {
        const activeFileId = activeFile?.id
        const tableName = activeFile?.FileSchema?.tableName
        if(tableName) {
            tableNameMutation.mutate({ tableName: tableName }, {
                onSuccess(data, variables, context) {
                    setContextState({
                        type: "SetExtractedCSVFileValidation",
                        payload: {
                            fileId: activeFileId,
                            validations: {
                                TABLE_NAME_NOT_PRESENT_IN_SYSTEM: {
                                    value: data.length === 0,
                                    comments: data.length === 0 ?`No Table present with Name: ${tableName}` : `A table with same name already present. It'll be overwritten.: ${tableName}`,
                                }
                            }
                        }
                    })
                }
            })
        }
    }, [activeFile?.FileSchema?.tableName])


    return (
        <UploadTableStateContext.Provider value={contextState}>
            <SetUploadTableStateContext.Provider value={setContextState}>
                {children}
            </SetUploadTableStateContext.Provider>
        </UploadTableStateContext.Provider>
    )
}


const getFileExtension = (file: File) => file.name.split(".").pop()
const fileHandlers = [
    {
        canProcess: (file: File) => file.type==="text/csv" || (getFileExtension(file)=="csv" && file.type==="application/vnd.ms-excel"),
        handler: async (file: File, fileParseSuccess: Function, fileParseError: Function) => {
            fileParseSuccess([file])
        }
    },
    {
        canProcess: (file: File) => file.type==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        handler: async (file: File, fileParseSuccess: Function, fileParseError: Function) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
        
            fileReader.onload = (e) => {
                const bufferedArray = e?.target?.result;
                const wb = XLSX.read(bufferedArray, { type: 'buffer' });
                const parsedCsvFilesPromises = convertToCsv(wb)
                parsedCsvFilesPromises.then((results) => {
                    const parsedCsvFiles = results.
                    filter(settledPromise => settledPromise.status === 'fulfilled').
                    map((fulfilledPromise:any) => fulfilledPromise.value)

                    fileParseSuccess(parsedCsvFiles)
                })
            }
        
            fileReader.onerror = (error) => {
                fileParseError(error)
            };
        }
    }
]

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

const getDatatypeFromTag = (tags: string[]) => {
    const validDataTypes = Object.values(DatafacadeDatatype)
    const columnDataType = validDataTypes.filter(dataType => tags.includes(dataType))
    
    return columnDataType.length === 1 ? columnDataType?.[0] : undefined
}

export default UploadTableContextProvider;
