import {Dialog, DialogTitle, DialogContent, Grid, Typography, IconButton, Box, TextField, Button, Snackbar, Alert} from "@mui/material"
import React from "react"
import CloseIcon from "../../../../src/images/close.svg"
import LoadingIndicator from "../../../common/components/LoadingIndicator"
import useSyncApplicationToGit from "../hooks/useSyncApplicationToGit"


interface SyncWithGitDialogProps {
    applicationId: string,
    open: boolean,
    onClose: () => void
}

const SyncWithGitDialog = (props: SyncWithGitDialogProps) => {

    const [branchName, setBranchName] = React.useState<string|undefined>()
    const [commitMessage, setCommitMessage] = React.useState<string|undefined>()
    const [successSnackbarState, setSuccessSnackbarState] = React.useState(false)
    const [failureSnackbarState, setFailureSnackbarState] = React.useState(false)

    const handleSuccess = () => {
        setSuccessSnackbarState(true)
        props.onClose()
    }

    const handleError = () => {
        setFailureSnackbarState(true)
    }

    const syncToGitMutation = useSyncApplicationToGit({
        mutationOptions: {
            onSuccess: () => handleSuccess(),
            onError: () => handleError()
        }
    })
    const checkIfDisabled = () => {
        return !(
            (!!branchName?.length) && (!!commitMessage?.length)
        )
    }

    const handleSync = () => {
        syncToGitMutation.mutate(({
            commitMessage: commitMessage!,
            applicationId: props.applicationId,
            branchName: branchName!
        }))
    }

    const handleSnackbarClose = () => {
        setSuccessSnackbarState(false)
        setFailureSnackbarState(false)
    }

    return (
        <Box>
            <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{display: 'flex', justifyContent: 'center',backgroundColor: "ActionConfigDialogBgColor.main", boxShadow: "inset 0px 15px 25px rgba(54, 48, 116, 0.3)"}}>
                    <Grid item xs={6} sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography variant="heroHeader" sx={{
                            fontFamily: "'SF Pro Text'",
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "18px",
                            lineHeight: "160%",
                            letterSpacing: "0.15px",
                            color: "ActionCardBgColor.main"}}
                        >
                            Sync With Git
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{display: 'flex', justifyContent: 'flex-end'}} onClick={props.onClose}>
                        <IconButton aria-label="close" >
                            <img src={CloseIcon} alt="close"/>
                        </IconButton>
                    </Grid>
                </DialogTitle>
                <DialogContent sx={{mt: 2}}>
                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 3, p: 3}}>
                        <TextField fullWidth label="Branch Name" value={branchName} onChange={(event) => setBranchName(event.target.value)}/>
                        <TextField fullWidth label="Commit Message" value={commitMessage} onChange={(event) => setCommitMessage(event.target.value)}/>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', minWidth: '100%'}}>
                            {syncToGitMutation.isLoading && !syncToGitMutation.isError ? (<LoadingIndicator />) : (
                                <Button disabled={checkIfDisabled()} variant="contained" onClick={handleSync}>Sync</Button>
                            )}
                            
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
            <Snackbar open={successSnackbarState} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Pushed changes to Git!
                </Alert>
            </Snackbar>
            <Snackbar open={failureSnackbarState} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    Something went wrong! Check your credentials
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default SyncWithGitDialog