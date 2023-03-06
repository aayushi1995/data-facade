import Loader from "@/components/Loader"
import useDonwloadAndDisplayLogs, { DownloadAndDisplayLogsProps } from "@/hooks/actionExecutions/useDownloadAndDisplayLogs"
import Typography from "antd/es/typography/Typography"
import React from "react"
const DisplayLogs = (props: DownloadAndDisplayLogsProps) => {
    const {handleViewLogs,
        logs,
        executionLogStatus,
        downloadExecutionOutputFromS3,
        useGetPresignedDowloadUrl,
        setLogs,
        logsReady} = useDonwloadAndDisplayLogs(props)
    React.useEffect(() => {
        handleViewLogs()
    }, [props])
    console.log(logs);
    
    return (
        <div style={{width: '100%'}}>
            {logsReady ? <Typography style={{whiteSpace: 'pre-line'}}>
                <>{logs}</>
            </Typography> : <Loader/>}
            
        </div>
    )
}
export default DisplayLogs