import React from "react";
import * as XLSX from 'xlsx/xlsx.mjs';
import S3UploadState from "../../../custom_enums/S3UploadState";
import { convertToCsv } from "../components/util";

type ValidationStatus = {
    value: boolean,
    comments?: string
}

type ExtractedCSVFile = {
    id: string,
    CsvFile: File
}

type Step = "SELECT_FILE" | "SELECT_TABLE" | "CONFIGURE_TABLE"

export type UploadState = {
    message: string,
    colour: string,
    icon: JSX.Element
}

// Contains :-
// Type
// Default
// Context
// for UploadTableStateContext
export type UploadTableState = {
    originalSourceFile?: File,
    activeStep: Step,
    validations: {
        file: {
            FILE_SELECTED?: ValidationStatus,
            FILE_SIZE_VALID?: ValidationStatus,
            FILE_TYPE_VALID?: ValidationStatus
        },
        fileParsing: {
            FILE_PARSED?: ValidationStatus
        }
    },
    uploadState?: UploadState,
    sourceFileParsingStatus: "COMPLETED" | "NOT_STARTED",
    extractedCSVFiles?: ExtractedCSVFile[],
    CSVFileSelectedForUpload?: ExtractedCSVFile,
    lastUploadedTableId?: string
}
const defaultEmptyContext: UploadTableState = {
    activeStep: "SELECT_FILE",
    validations: {
        file: {

        },
        fileParsing: {

        }
    },
    sourceFileParsingStatus: "NOT_STARTED"
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
export type SetFileAction = {
    type: "SetFile",
    payload: {
        file?: File
    }
}

export type SetUploadStateAction = {
    type: "SetUploadState",
    payload: {
        uploadState: UploadState
    }
}

export type SetActiveStepAction = {
    type: "SetActiveStep",
    payload: {
        activeStep: Step
    }
}

export type SetExtractedCSVFilesAction = {
    type: "SetExtractedCSVFiles",
    payload: {
        files?: ExtractedCSVFile[]
    }
}

export type SetCSVFileSelectedForUploadAction = {
    type: "SetCSVFileSelectedForUpload",
    payload: {
        extractedFile?: ExtractedCSVFile
    }
}

export type FileSelectedValidationAction = {
    type: "FileSelectedValidation",
    payload: ValidationStatus
}

export type FileSizeValidationAction = {
    type: "FileSizeValidation",
    payload: ValidationStatus
}

export type FileTypeValidationAction = {
    type: "FileTypeValidation",
    payload: ValidationStatus
}

export type FileParsedValidationAction = {
    type: "FileParsedValidation",
    payload: ValidationStatus
}

export type SetLastUploadedTableIdAction = {
    type: "SetLastUploadedTableId",
    payload: {
        tableId?: string
    }
}

export type UploadTableStateAction = SetFileAction |
                                     SetUploadStateAction |
                                     SetActiveStepAction |
                                     SetExtractedCSVFilesAction |
                                     SetCSVFileSelectedForUploadAction |
                                     FileSelectedValidationAction |
                                     FileSizeValidationAction | 
                                     FileTypeValidationAction |
                                     FileParsedValidationAction |
                                     SetLastUploadedTableIdAction


const reducer = (state: UploadTableState, action: UploadTableStateAction): UploadTableState => {
    switch (action.type) {
        case "SetFile": {
            return {
                ...state,
                ...defaultEmptyContext,
                originalSourceFile: action.payload.file,
                sourceFileParsingStatus: "NOT_STARTED"
            }
        }

        case "SetUploadState": {
            return {
                ...state,
                uploadState: action?.payload?.uploadState
            }
        }

        case "SetActiveStep": {
            return {
                ...state,
                activeStep: action.payload.activeStep
            }
        }

        case "SetExtractedCSVFiles": {
            return {
                ...state,
                extractedCSVFiles: action?.payload?.files,
                activeStep: "SELECT_TABLE",
                validations: {
                    ...state.validations,
                    fileParsing: {
                        ...state.validations.fileParsing,
                        FILE_PARSED: {
                            value: true,
                            comments: undefined
                        }
                    }
                },
                sourceFileParsingStatus: "COMPLETED"
            }
        }

        case "SetCSVFileSelectedForUpload": {
            return {
                ...state,
                CSVFileSelectedForUpload: action?.payload?.extractedFile,
                activeStep: "CONFIGURE_TABLE"
            }
        }

        case "FileSelectedValidation": {
            return {
                ...state,
                validations: {
                    ...state.validations,
                    file: {
                        ...state.validations.file,
                        FILE_SELECTED: {
                            ...state.validations.file.FILE_SIZE_VALID,
                            ...action.payload
                        }
                    }
                }
            }
        }

        case "FileSizeValidation": {
            return {
                ...state,
                validations: {
                    ...state.validations,
                    file: {
                        ...state.validations.file,
                        FILE_SIZE_VALID: {
                            ...state.validations.file.FILE_SIZE_VALID,
                            ...action.payload
                        }
                    }
                }
            }
        }

        case "FileTypeValidation": {
            return {
                ...state,
                validations: {
                    ...state.validations,
                    file: {
                        ...state.validations.file,
                        FILE_TYPE_VALID: {
                            ...state.validations.file.FILE_TYPE_VALID,
                            ...action.payload
                        }
                    }
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
                },
                sourceFileParsingStatus: "COMPLETED"
            }
        }

        case "SetLastUploadedTableId": {
            return {
                ...state,
                lastUploadedTableId: action.payload.tableId
            }
        }

        default: {
            const neverAction: never = action
            return state
        }
    }
}

export const isFileValid = (uploadTableState: UploadTableState) => {
    const fileValidations = uploadTableState.validations.file
    return (fileValidations?.FILE_SELECTED?.value && fileValidations.FILE_SIZE_VALID?.value && fileValidations.FILE_TYPE_VALID?.value) || false
}

export const FILE_SIZE_LIMIT = 20000000
export const ALLOWED_FILE_TYPES = ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]

const UploadTableContextProvider = ({children}: {children: React.ReactElement}) => {
    const [contextState, dispatch] = React.useReducer(reducer, defaultEmptyContext)
    const setContextState: SetUploadTableState = ( args: UploadTableStateAction) => dispatch(args)

    // Responsible for validating the file selected for Upload
    React.useEffect(() => {
        const file = contextState?.originalSourceFile
        setContextState({
            type: "FileSelectedValidation",
            payload: {
                value: !!file,
                comments: !file ? "No File Selected" : undefined
            }
        })

        if(!!file) {
            const exceedsBy = file.size - FILE_SIZE_LIMIT
            setContextState({ 
                type: "FileSizeValidation", 
                payload: { 
                    value: exceedsBy <= 0, 
                    comments: (exceedsBy > 0) ? `File Size exceeds by ${exceedsBy} B` : undefined
                }
            })
            
            const fileTypeValid = ALLOWED_FILE_TYPES?.includes?.(file.type)
            setContextState({
                type: "FileTypeValidation",
                payload: {
                    value: fileTypeValid,
                    comments: !fileTypeValid ? `Invalid FileType: ${file.type}` : undefined
                }
            })
        }
    }, [contextState?.originalSourceFile])

    // Responsible for parsing the selected File and extracting individual tables
    React.useEffect(() => {
        if(contextState?.activeStep==="SELECT_FILE" && isFileValid(contextState)) {
            setContextState({
                type: "SetUploadState",
                payload: {
                    uploadState: S3UploadState.SELECTED_FILE_OK(contextState?.originalSourceFile?.name, contextState?.originalSourceFile?.size)
                }
            })
            const fileParseSuccess = (tables?: ExtractedCSVFile[]) => {
                if(!!tables) {
                    setContextState({
                        type: "SetExtractedCSVFiles",
                        payload: {
                            files: tables
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
    
            fileHandlers.forEach(fileHandlerConfig => {
                if(fileHandlerConfig.canProcess(contextState?.originalSourceFile!)) {
                    fileHandlerConfig.handler(contextState?.originalSourceFile!, fileParseSuccess, fileParseError)
                }
            })
        }
    }, [isFileValid(contextState), contextState?.activeStep])

    // Responsible for selecting the first extracted CSV file for upload
    React.useEffect(() => {
        if(contextState?.activeStep === "SELECT_TABLE") {
            if(!!contextState?.extractedCSVFiles?.[0]){
                setContextState({
                    type: "SetCSVFileSelectedForUpload",
                    payload: {
                        extractedFile: contextState?.extractedCSVFiles?.[0]
                    }
                })
            }
        }
    }, [contextState?.activeStep, contextState?.extractedCSVFiles])


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
            const tableObject = {
                CsvFile: file
            }
            const tables = [tableObject]
            fileParseSuccess(tables)
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
                    map(fulfilledPromise => fulfilledPromise.value)
        
                    const tables = parsedCsvFiles.map(file => {return { CsvFile: file}})
                    fileParseSuccess(tables)
                })
            }
        
            fileReader.onerror = (error) => {
                fileParseError(error)
            };
        }
    }
]

export default UploadTableContextProvider;