import dataManager from "@/api/dataManager"
import { FileSchema, SetUploadTableStateContext, Status, UploadTableStateContext, getActiveExtractedCSV } from "@/contexts/UploadTablePageContext"
import { TableProperties } from "@/generated/entities/Entities"
import { ActionDefinitionDetail, TableAndColumns } from "@/generated/interfaces/Interfaces"
import { labels } from "@/helpers/constant"
import ExternalStorageUploadRequestContentType from "@/helpers/enums/ExternalStorageUploadRequestContentType"
import S3UploadState from "@/helpers/enums/S3UploadState"
import Papa from "papaparse"
import { config } from "process"
import React from "react"
import { useMutation } from "react-query"
import { v4 as uuidv4 } from 'uuid'

const dataManagerInstance = dataManager?.getInstance as { saveData: Function, s3PresignedUploadUrlRequest: Function, s3UploadRequest: Function, getTableAndColumnTags: Function, getRecommendedQuestions?: Function }

export type UseTableUploadParam = {
    onStatusChangeDebug?: (newStatus: Status) => void
    onStatusChangeInfo?: (newStatus: Status) => void
    onCSVToUploadValidationFail?: (reason: string, fileName?: string) => void
    onRecommendedQuestionsGenerated?: (recommendedActions: any) => void
}

export type UseTableUploadReturnValue = {
    setSourceFile: (file: File) => void,
    uploading: boolean,
    tableNameExists: boolean,
    forceUpload: () => void
}

type S3UploadInformation = {
    requestUrl: string,
    headers: any,
    file: File
}


// 1. Get the file from the context
// 2. Parse the file
// 3. Validate the file
// 4. Upload the file
// 5. Create the table
// 6. Create the columns
// 7. Create the tags
// 8. Create the recommended questions
function useTableUpload(params: UseTableUploadParam) {
    const uploadTableContext = React.useContext(UploadTableStateContext)
    const setUploadTableContext = React.useContext(SetUploadTableStateContext)

    const [uploading, setUploading] = React.useState(false)
    const [tableNameExists, setTableNameExists] = React.useState(false)
    const [tableId, setTableId] = React.useState<string | undefined>(undefined)

    const activeFile = getActiveExtractedCSV(uploadTableContext)
    const activeFileSchema = activeFile?.FileSchema

    React.useEffect(() => {
        if(uploadTableContext?.activeExtractedCSVFileForUpload?.validationSummary === true) {
            uploadFile()
        } else if(uploadTableContext?.activeExtractedCSVFileForUpload?.validationSummary === false) {
            if(uploadTableContext?.activeExtractedCSVFileForUpload?.validationsPerformed === true) {
                params?.onCSVToUploadValidationFail?.(uploadTableContext?.activeExtractedCSVFileForUpload?.validationComments || "", activeFile?.CsvFile?.name)
            }
        }
    }, [uploadTableContext?.activeExtractedCSVFileForUpload?.validationSummary, uploadTableContext?.activeExtractedCSVFileForUpload?.validationsPerformed])

    React.useEffect(() => {
        setTableNameExists(activeFile?.validations?.TABLE_NAME_NOT_PRESENT_IN_SYSTEM?.value || false)
    }, [activeFile?.validations?.TABLE_NAME_NOT_PRESENT_IN_SYSTEM?.value])

    React.useEffect(() => {
        if(uploadTableContext?.status){
            params?.onStatusChangeDebug?.(uploadTableContext?.status)
        }
    }, [params, uploadTableContext?.status])

    // Network Calls made as part of Uploading a File

    // We upload the file to S3 to insert it into our postgres for further processing. Backend provides us with a presigned URL which we use to upload the file to S3
    const fetchPresignedUrlMutation = useMutation<S3UploadInformation, unknown, { file: File, expirationDurationInMinutes: number }, unknown>(
        "GetS3PreSignedUrl",
        (config) => dataManagerInstance.s3PresignedUploadUrlRequest(config.file, config.expirationDurationInMinutes, ExternalStorageUploadRequestContentType.TABLE),
        {
            onMutate: () => setUploadTableContext({ type: "SetStatus" , payload: { uploadState: S3UploadState.PRESIGNED_URL_FETCH_LOADING }})
        }
    );

    const uploadToS3Mutation = useMutation<unknown, unknown, S3UploadInformation, unknown>(
        "UploadToS3",
        (config) => dataManagerInstance.s3UploadRequest(config.requestUrl, config.headers, config.file),
        {
            onMutate: () => setUploadTableContext({ type: "SetStatus" , payload: { uploadState: S3UploadState.S3_UPLOAD_LOADING }})
        }
    );

    const loadTableFromS3Action = useMutation<unknown, unknown, { entityName: string, actionProperties: any }, unknown>(
        "LoadTableFromS3",
        (config) => dataManagerInstance.saveData(config.entityName, config.actionProperties),
        {
            onMutate: () => setUploadTableContext({ type: "SetStatus" , payload: { uploadState: S3UploadState.FDS_TABLE_FETCH_LOADING }})
        }
    );

    const getRecommenededQuestions = useMutation<ActionDefinitionDetail[], unknown, {tableId: string}, unknown>(
        "GetRecommenedActions",
        (config) => dataManagerInstance.getRecommendedQuestions?.(config.tableId),
        {
            onMutate: () => {
                setUploadTableContext({ type: "SetStatus" , payload: { uploadState: S3UploadState.FETCHING_TABLE_QUESTIONS }})
                params?.onStatusChangeInfo?.(S3UploadState?.GENERATING_QUESTIONS(activeFileSchema?.tableName))
            }
        }
    )

    const tableDeleteMutation = useMutation<TableProperties[], unknown, {tableName?: string}, unknown>("DeleteOldTable", (context) => 
        dataManager.getInstance.deleteData(labels.entities.TABLE_PROPERTIES, {
            filter: {
                UniqueName: context.tableName
            }
        }
    ))

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
                Columns: config?.columnSchema?.map((columnSchema:any) => ({
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
        },
        {
            onMutate: () => setUploadTableContext({ type: "SetStatus" , payload: { uploadState: S3UploadState.CREATING_TABLE_IN_SYSTEM }})
        }
    )

    const uploadFile = () => {
        if(activeFile && activeFileSchema) {
            setUploading(true)
            // params?.onStatusChangeInfo?.(S3UploadState?.UPLOADING)
            setUploadTableContext({ type: "SetStatus" , payload: { uploadState: S3UploadState.BUIDING_FILE_FOR_UPLOAD }});
            Papa.parse(activeFile?.CsvFile,
                {
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        const newCsvFileJson = {
                            data: result.data.slice(activeFileSchema?.dataStartsFromRow),
                            fields: activeFileSchema?.columnSchema?.map?.(col => col.columnName) || []
                        }
                        const fileName = activeFileSchema?.tableName + ".csv";
                        const newCsvFileContent = Papa.unparse(newCsvFileJson)
                        const csvToUpload = new File([newCsvFileContent], fileName, { type: activeFile?.CsvFile?.type })
                        setUploadTableContext({ type: "SetStatus" , payload: { uploadState: S3UploadState.FILE_BUILT_FOR_UPLOAD }});
                        netowrkCallsToUploadFile(csvToUpload, activeFileSchema)
                        setTableId(activeFileSchema?.tableId)
                    },
                    error: (errors, file) => {
                        setUploading(false)
                    }
                }
            )
        }
    }

    const netowrkCallsToUploadFile = async (fileToUpload: File, fileSchema: FileSchema) => {

        try {
            // loading or Uploading in the beginning
            setUploadTableContext({ type: "SetStatus", payload: { uploadState: S3UploadState.UPLOADING } });

          const presignedUrlData = await fetchPresignedUrlMutation.mutateAsync({ file: fileToUpload, expirationDurationInMinutes: 5 });
          setUploadTableContext({ type: "SetStatus", payload: { uploadState: S3UploadState.PRESIGNED_URL_FETCH_SUCCESS } });
      
          await uploadToS3Mutation.mutateAsync({ requestUrl: presignedUrlData.requestUrl, headers: presignedUrlData.headers, file: fileToUpload });
          setUploadTableContext({ type: "SetStatus", payload: { uploadState: S3UploadState.S3_UPLOAD_SUCCESS } });
      
          await loadTableFromS3Action.mutateAsync({
                                        entityName: "ActionInstance",
            actionProperties: formActionPropertiesForLoadTableIntoLocal(presignedUrlData, fileToUpload, fileSchema)
          });
          setUploadTableContext({ type: "SetStatus", payload: { uploadState: S3UploadState.FDS_TABLE_FETCH_SUCCESS } });
          
          // TODO (Ritesh): Delete old table if it exists (if the user is uploading a new file with the same name) from backend
          try {
            await tableDeleteMutation.mutateAsync({ tableName: fileSchema.tableName })  
          } catch (error) {
            setUploadTableContext({ type: "SetStatus", payload: { uploadState: S3UploadState.CREATING_TABLE_IN_SYSTEM_FAILURE } });
            console.log("Error while deleting old table. It probably does not exist!", error);
          }
          
          await createTableColumnMutation.mutateAsync(fileSchema);
          setUploadTableContext({ type: "SetStatus", payload: { uploadState: S3UploadState.CREATING_TABLE_IN_SYSTEM_SUCCESS } });
          setUploading(false);
          params?.onStatusChangeInfo?.({...S3UploadState?.UPLOAD_COMPLETED_SUCCESSFULLY(fileSchema?.tableName), tableName: fileSchema?.tableName});
          
          const recommendedQuestionsData = await getRecommenededQuestions.mutateAsync({ tableId: fileSchema.tableId! });
          setUploadTableContext({ type: "SetStatus", payload: { uploadState: S3UploadState.GENERATING_QUESTIONS_SUCCESS } });
          params?.onRecommendedQuestionsGenerated?.(recommendedQuestionsData);
          
        } catch (error) {
            // TODO(Ritesh): Handle error
        //   if (error?.response?.data?.code === "AWSS3Error") {
        //     setUploadTableContext({ type: "SetStatus", payload: { uploadState: S3UploadState.S3_UPLOAD_ERROR } });
        //   } else if (error?.response?.data?.code === "PresignedUrlError") {
        //     setUploadTableContext({ type: "SetStatus", payload: { uploadState: S3UploadState.PRESIGNED_URL_FETCH_ERROR } });
        //   } else if (error?.response?.data?.code === "FdsTableFetchError") {
        //     setUploadTableContext({ type: "SetStatus", payload: { uploadState: S3UploadState.FDS_TABLE_FETCH_ERROR } });
        //   } else if (error?.response?.data?.code === "CreateTableInSystemFailure") {
        //     setUploadTableContext({ type: "SetStatus", payload: { uploadState: S3UploadState.CREATING_TABLE_IN_SYSTEM_FAILURE } });
        //   } else {
        //     setUploadTableContext({ type: "SetStatus", payload: { uploadState: S3UploadState.GENERATING_QUESTIONS_ERROR } });
        //   }
            console.log("Error while uploading table!", error);
            setUploadTableContext({ type: "SetStatus", payload: { uploadState: S3UploadState.CREATING_TABLE_IN_SYSTEM_FAILURE } });
            setUploading(false);
        }
    }
        
    const setSourceFile = (file: File) => {
        // params?.onStatusChangeInfo?.(S3UploadState?.SELECTED_FILE_OK(file.name, file.size))
        setUploadTableContext({
            type: "SetSourceFile",
            payload: file
        })
    }

    return {
        uploading,
        tableNameExists,
        setSourceFile,
        forceUpload: uploadFile,
        tableId: tableId,
    }
}

const formActionPropertiesForLoadTableIntoLocal = (fdsResponse: { requestUrl?: string; headers?: any; file?: File; key?: any; }, selectedFile: File, fileSchema: FileSchema) => {
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

export default useTableUpload
