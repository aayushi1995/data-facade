import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from "@mui/material"
import { ActionExecution } from "../../../../generated/entities/Entities"
import LoadingIndicator from "../../LoadingIndicator"
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