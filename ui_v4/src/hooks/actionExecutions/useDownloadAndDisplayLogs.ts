import { ActionExecution } from "@/generated/entities/Entities"
import React from "react"
import { useDownloadExecutionOutputFromS3 } from "./useDownloadExecutionOutputFromS3"
import useGetLogStatus from "./useGetLogsStatus"
import { useGetPreSignedUrlForExecutionLogs } from "./useGetPreSignedUrlForExecutionOutput"

export interface DownloadAndDisplayLogsProps {
    actionExecution: ActionExecution
}

const useDonwloadAndDisplayLogs = (props: DownloadAndDisplayLogsProps) => {

    const [logs, setLogs] = React.useState<string | ArrayBuffer | null | undefined>()

    const logsReady = Boolean(logs)
    const logsLocation = props.actionExecution.ExecutionLogs
    const useGetPresignedDowloadUrl = useGetPreSignedUrlForExecutionLogs(logsLocation || "NA", 5)
    const {downloadExecutionOutputFromS3} = useDownloadExecutionOutputFromS3()
    const executionLogStatus = useGetLogStatus({
        filter: {
            Id: props.actionExecution.Id
        }
    })

    const reader = new FileReader()

    reader.addEventListener('loadend', (e) => {

        setLogs(e.target?.result);
    });

    const handleViewLogs = () => {
        useGetPresignedDowloadUrl.mutate(
            (undefined),
            {
                onSuccess: (data, variables, context) => {
                    const s3Data = data as {requestUrl: string, headers: any}
                    downloadExecutionOutputFromS3.mutate(
                        ({requestUrl: s3Data.requestUrl as string, headers: s3Data.headers}),
                        {
                            onSuccess: (data, variables, context) => {
                                reader.readAsText(data as Blob)
                            }
                        }
                    )
                }
            }
        )
    }

    return {
        handleViewLogs,
        logs,
        executionLogStatus,
        downloadExecutionOutputFromS3,
        useGetPresignedDowloadUrl,
        setLogs,
        logsReady
    }
}

export default useDonwloadAndDisplayLogs