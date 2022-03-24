import { useMutation } from "react-query"
import dataManager from "../../../data_manager/data_manager"


export const useDownloadExecutionOutputFromS3 = () => {

    const dataManagerType = dataManager.getInstance as {s3DownloadRequest: Function}

    return useMutation(
        "DownloadExecutionOutputFromS3",
        (config: {requestUrl: string, headers: any}) => {
            return dataManagerType.s3DownloadRequest(config.requestUrl, config.headers)
        }
    )
}