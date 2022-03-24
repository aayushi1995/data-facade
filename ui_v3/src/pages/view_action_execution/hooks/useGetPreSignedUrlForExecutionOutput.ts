import { useMutation } from "react-query"
import dataManager from "../../../data_manager/data_manager"


export const useGetPreSignedUrlForExecutionOutput = (s3Path: string, expirationDurationInMinutes: number) => {

    const dataManagerType = dataManager.getInstance as {s3PresignedDownloadUrlRequest: Function}

    return useMutation(
        "GetExecutionOutputDownloadLink",
        () => {
            return dataManagerType.s3PresignedDownloadUrlRequest(s3Path + "/output.txt", expirationDurationInMinutes, "JobOutput")
        }
    )
}