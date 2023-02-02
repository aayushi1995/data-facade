import { Box, Typography } from "@mui/material"
import React from "react"
import { DownloadAndDisplayLogsProps } from "../action_execution/view_action_execution/DownloadAndDisplyaLogs"
import useDonwloadAndDisplayLogs from "../action_execution/view_action_execution/hooks/useDownloadAndDisplayLogs"
import LoadingIndicator from "../LoadingIndicator"


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

    return (
        <Box sx={{width: '100%'}}>
            {logsReady ? <Typography variant="executeActionName" sx={{whiteSpace: 'pre-line'}}>
                {logs}
            </Typography> : <LoadingIndicator />}
            

        </Box>
    )
}

export default DisplayLogs