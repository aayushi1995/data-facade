import { useMutation } from "react-query";
import dataManager from "../../../../../data_manager/data_manager";


export const useDownloadExecutionOutputFromS3 = () => {

    const dataManagerType = dataManager.getInstance as {s3DownloadRequest: Function}

    function download(blob: Blob, filename: string) {
        let newBlob = new Blob([blob], {type: 'text/plain'});
        const url = window.URL.createObjectURL(newBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    const downloadExecutionOutputFromS3 = useMutation(
        "DownloadExecutionOutputFromS3",
        (config: {requestUrl: string, headers: any}) => {
            return dataManagerType.s3DownloadRequest(config.requestUrl, config.headers)
        }
    )

    return {
        downloadExecutionOutputFromS3,   
        download
    }
}