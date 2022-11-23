import {Dialog, DialogTitle, DialogContent, Grid, Typography, IconButton, Box, TextField, Button, Snackbar, Alert, Autocomplete} from "@mui/material"
import React from "react"
import CloseIcon from "../../../../src/images/close.svg"
import LoadingIndicator from "../../../common/components/LoadingIndicator"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import ProviderDefinitionId from "../../../enums/ProviderDefinitionId"
import { ProviderInstance } from "../../../generated/entities/Entities"
import useGetProviders from "../hooks/useGetProviders"
import useSyncApplicationToGit from "../hooks/useSyncApplicationToGit"


interface SyncWithGitDialogProps {
    applicationId: string,
    open: boolean,
    attatchNewProvider: boolean
    onClose: () => void
}

const SyncWithGitDialog = (props: SyncWithGitDialogProps) => {

    const [branchName, setBranchName] = React.useState<string|undefined>()
    const [commitMessage, setCommitMessage] = React.useState<string|undefined>()
    const [providerInstance, setProviderInstance] = React.useState<ProviderInstance | undefined>() 
    const [successSnackbarState, setSuccessSnackbarState] = React.useState(false)
    const [failureSnackbarState, setFailureSnackbarState] = React.useState(false)

    const getProvidersQuery = useGetProviders({
        filter: {
            ProviderDefinitionId: ProviderDefinitionId.DBT_REPO
        }
    })

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
        console.log(providerInstance)
        return !(
            (!!branchName?.length) && (!!commitMessage?.length) && ((props.attatchNewProvider && !!providerInstance) || !props.attatchNewProvider)
        )
    }

    const handleSync = () => {
        syncToGitMutation.mutate(({
            commitMessage: commitMessage!,
            applicationId: props.applicationId,
            branchName: branchName!,
            providerInstanceId: providerInstance?.Id
        }))
    }

    const handleSnackbarClose = () => {
        setSuccessSnackbarState(false)
        setFailureSnackbarState(false)
    }

    return (
        <Box>
            <Dialog open={props.open} maxWidth="md" fullWidth>
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
                        {props.attatchNewProvider ? (
                            <ReactQueryWrapper  {...getProvidersQuery} 
                              children={() =>
                                <Autocomplete 
                                    options={getProvidersQuery.data || []}
                                    getOptionLabel={(option) => option.Name || "Name NA"}
                                    clearOnBlur
                                    fullWidth
                                    onChange={(event, value, reason, details) => {
                                        if(value !== null) {
                                            setProviderInstance(value)
                                        } else {
                                            setProviderInstance(undefined)
                                        }
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Select Git Provider"/>}
                                />
                            }      
                            />
                        ) : (
                            <></>
                        )}
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