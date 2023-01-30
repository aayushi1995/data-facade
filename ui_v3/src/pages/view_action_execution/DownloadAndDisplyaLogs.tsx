import { ActionExecution } from "../../generated/entities/Entities"
import { Button, Box, Dialog, DialogTitle, DialogContent, Typography, IconButton, Grid } from "@mui/material"
import { useGetPreSignedUrlForExecutionLogs } from "./hooks/useGetPreSignedUrlForExecutionOutput"
import { useDownloadExecutionOutputFromS3 } from "./hooks/useDownloadExecutionOutputFromS3"
import CloseIcon from '@mui/icons-material/Close'
import React from "react"
import LoadingIndicator from "../../common/components/LoadingIndicator"
import useGetLogStatus from "./hooks/useGetLogsStatus"
import useDonwloadAndDisplayLogs from "./hooks/useDownloadAndDisplayLogs"

export interface DownloadAndDisplayLogsProps {
    actionExecution: ActionExecution
}

const DownloadAndDisplayLogs = (props: DownloadAndDisplayLogsProps) => {

    const {
        handleViewLogs,
        logs,
        setLogs,
        logsReady,
        useGetPresignedDowloadUrl,
        downloadExecutionOutputFromS3
    } = useDonwloadAndDisplayLogs(props)

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
                    
                        <Button sx={{color:'#65676B'}} onClick={handleViewLogs}>
                            Logs
                        </Button>
                    
                </>
            )}
        </Box>

    
    )
}

export default DownloadAndDisplayLogs