import dataManager from "@/api/dataManager"
import { useMutation } from "react-query"


export const useGetPreSignedUrlForExecutionOutput = (s3Path: string, expirationDurationInMinutes: number) => {

    const dataManagerType = dataManager.getInstance as {s3PresignedDownloadUrlRequest: Function}

    return useMutation(
        "GetExecutionOutputDownloadLink",
        () => {
            return dataManagerType.s3PresignedDownloadUrlRequest(s3Path + "/output.txt", expirationDurationInMinutes, "JobOutput")
        }
    )
}

export const useGetPreSignedUrlForExecutionLogs = (s3Path: string, expirationDurationInMinutes: number) => {
    const dataManagerType = dataManager.getInstance as {s3PresignedDownloadUrlRequest: Function}

    return useMutation(
        "GetExecutionOutputDownloadLink",
        () => {
            return dataManagerType.s3PresignedDownloadUrlRequest(s3Path + "/logs.txt", expirationDurationInMinutes, "JobOutput")
        }
    )
}