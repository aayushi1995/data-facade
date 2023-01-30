import React from "react"
import { useMutation, useQuery } from "react-query"
import { v4 as uuidv4 } from 'uuid'
import dataManager from "../../../data_manager/data_manager"
import ActionDefinitionId from "../../../enums/ActionDefinitionId"
import ActionExecutionStatus from "../../../enums/ActionExecutionStatus"
import ProviderInstanceId from '../../../enums/ProviderInstanceId'
import { ActionExecution } from "../../../generated/entities/Entities"
import labels from "../../../labels/labels"

const dataManagerInstance = dataManager.getInstance as { saveData: Function, retreiveData: Function }

const sandboxId = ProviderInstanceId.PYTHON_SANDBOX_DEV_INSTANCE

export type UseImportSheetParamsType = {
    providerInstanceId?: string
}

export type useImportSheetReturnType = {
    importGoogleSheet: (spreadsheetId: string, worksheetId?: string) => void,
    uploading: boolean,
    error: any,
    s3Url: string
}

export function useImportGoogleSheet(params: UseImportSheetParamsType) {
    const { providerInstanceId } = params
    const [actionExection, setActionExecution] = React.useState<{
        Id?: string,
        IsLoading?: boolean,
        Status?: string,
        Output?: string
    }>({})
    const [uploading, setUploading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<any>()
    const [s3Url, setS3Url] = React.useState<string|undefined>(undefined)

    React.useEffect(() => {
        if(!!actionExection?.Output) {
            setS3Url(actionExection?.Output)
        }
    }, [actionExection?.Output])

    const createImportGoogleSheetToS3ActionMutation = useMutation<unknown, unknown, {SpreadSheetId?: string, WorkSheetId?: string, ProviderInstanceId?: string, ActionExecutionId?: string }, unknown>(["Create", labels.entities.ActionInstance, ""],
            async ({ SpreadSheetId, WorkSheetId, ProviderInstanceId, ActionExecutionId }) => {
                return dataManagerInstance.saveData(labels.entities.ActionInstance,
                    {
                        entityProperties: {
                            Id: uuidv4(),
                            ProviderInstanceId: sandboxId,
                            DefinitionId: ActionDefinitionId.UPLOAD_GOOGLE_SHEET_TO_S3,
                            Name: `Upload Table from Google Sheets to S3`,
                            DisplayName: `Upload Table from Google Sheetsto S3`,
                            IsRecurring: false,
                            RenderTemplate: true
                        },
                        OtherInfo: {
                            SpreadSheetId: SpreadSheetId,
                            WorkSheetId: WorkSheetId,
                            ProviderInstanceId: ProviderInstanceId
                        },
                        UploadGoogleSheetToS3: true,
                        withExecutionId: ActionExecutionId
                    }
                )
            },
            {
                onMutate(variables) {
                    setError(undefined)
                    setUploading(true)
                },
                onSuccess(data, variables, context) {
                    setActionExecution(old => ({
                        ...old,
                        Id: variables?.ActionExecutionId,
                        IsLoading: true,
                        Status: undefined,
                        Output: undefined
                    }))
                },
                onError(error, variables, context) {
                    setUploading(false)
                    setError(error)
                },
            }
    )

    const actionExecutionOutputQuery = useQuery<ActionExecution, unknown, ActionExecution, (string|undefined)[]>([labels.entities.ActionExecution, "GetParsedOutput", actionExection?.Id],
        () => dataManagerInstance.retreiveData(labels.entities.ActionExecution, {
                filter: {Id: actionExection?.Id},
                "getExecutionParsedOutput": true
            }
        ).then((response: ActionExecution[]) => response[0]),
        {
            staleTime: 2000,
            cacheTime: 2000,
            refetchInterval: 4000,
            enabled: actionExection?.Id!==undefined && ![ActionExecutionStatus.COMPLETED, ActionExecutionStatus.FAILED].includes(actionExection?.Status || "NA"),
            onSuccess: (data) => {
                setActionExecution(old => {
                    const state = JSON.parse(data?.Output || "{}")?.State
                    const output = JSON.parse(data?.Output || "{}")?.value
                    if(!!state){
                        setUploading(false)
                    }
                    if(state===ActionExecutionStatus.FAILED) {
                        setError((JSON.parse(data?.Output || "{}")?.Message || []).join("\n"))
                    }
                    if(old?.Id===data?.Id){
                        return {
                            ...old,
                            Status: data?.Status,
                            Output: output
                        }
                    } else {
                        return old
                    }
                })
            },
            onError(err) {
                setUploading(false)
                setError(err)
            }
        }
    )
    
    const importGoogleSheet = (spreadsheetId: string, worksheetId?: string) => {
        if(!!providerInstanceId && !!spreadsheetId) {
            const actionExecutionId = uuidv4()
            createImportGoogleSheetToS3ActionMutation.mutate({
                SpreadSheetId: spreadsheetId,
                WorkSheetId: worksheetId,
                ProviderInstanceId: providerInstanceId,
                ActionExecutionId: actionExecutionId
            })
        }
    }

    return {
        importGoogleSheet,
        uploading,
        error,
        s3Url
    } as useImportSheetReturnType
}

export const getActionExecutionOutput = (actionExecutionId?: string) => dataManagerInstance.retreiveData("ActionExecution",
    {
        filter: {Id: actionExecutionId},
        "getExecutionParsedOutput": true
    }).then((response: any[]) => {
        return response[0]
    })

export default useImportGoogleSheet;