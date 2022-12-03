import { ActionExecution } from "../../generated/entities/Entities"
import { Button, Box, Dialog, DialogTitle, DialogContent, Typography, IconButton, Grid } from "@mui/material"
import { useGetPreSignedUrlForExecutionLogs } from "./hooks/useGetPreSignedUrlForExecutionOutput"
import { useDownloadExecutionOutputFromS3 } from "./hooks/useDownloadExecutionOutputFromS3"
import CloseIcon from '@mui/icons-material/Close'
import React from "react"
import LoadingIndicator from "../../common/components/LoadingIndicator"
import useGetLogStatus from "./hooks/useGetLogsStatus"

interface DownloadAndDisplayLogsProps {
    actionExecution: ActionExecution
}

const DownloadAndDisplayLogs = (props: DownloadAndDisplayLogsProps) => {
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

    return (
        <Box>
            <Dialog open={logsReady} onClose={() => setLogs(undefined)} maxWidth="lg" fullWidth>
                <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <IconButton aria-label="close" onClick={() => setLogs(undefined)}>
                        <CloseIcon/>
                    </IconButton>
                </Grid>
                <DialogTitle>
                    Execution Logs
                </DialogTitle>
                <DialogContent sx={{mt: 3}}>
                    <Typography variant="heroHeader" sx={{fontSize: '20px', whiteSpace: 'pre-line'}}>
                        {logs}
                    </Typography>
                </DialogContent>
            </Dialog>
            {useGetPresignedDowloadUrl.isLoading || downloadExecutionOutputFromS3.isLoading ? (
                <LoadingIndicator/>
            ) : (
                <>
                    
                        <Button variant="outlined" onClick={handleViewLogs}>
                            View Logs
                        </Button>
                    
                </>
            )}
            
        </Box>

    
    )
}

export default DownloadAndDisplayLogs