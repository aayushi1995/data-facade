import React from 'react'
import { makeStyles } from '@mui/styles'
import {v4 as uuidv4} from 'uuid'
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField
} from '@mui/material'
import {useMutation} from 'react-query'
import dataManagerInstance, {useRetreiveData} from './../../data_manager/data_manager'
import S3DownloadState from '../../custom_enums/S3DownloadState'
import DownloadTableStatus from '../../enums/DownloadTableStatus'
import labels from './../../labels/labels'

const useStyles = makeStyles(() => ({
    filedetailgrid: {
        background: "#CBF1F5"
    },
    dialog: {
        background: "#E3FDFD"
    },
    tableschemaselector: {
        background: "#CBF1F5"
    },
    formControl: {
        minWidth: 120,
    },
    selectEmpty: {},
    disabledButton: {
        background: "#classes"
    }
}))

const DownloadTableButton = (props) => {
    const classes = useStyles();
    // States
    const [downloadDialogState, setDownloadDialogState] = React.useState({isDialogOpen: false})

    const handleDialogClose = () => {
        setDownloadDialogState(oldState => {
                return {
                    ...oldState,
                    isDialogOpen: false
                }
            }
        )
    }
    const memoizedHandleDialogClose = React.useCallback(handleDialogClose)

    const handleDialogOpen = () => {
        setDownloadDialogState(oldState => {
                return {
                    ...oldState,
                    isDialogOpen: true
                }
            }
        )
    }

    return (
        <>
            <Button variant="contained" onClick={handleDialogOpen} classes={{root: "select-all"}}>
                {labels.DownloadTableButton.download}
            </Button>
            <Dialog onClose={handleDialogClose} open={downloadDialogState.isDialogOpen} fullWidth={true}>
                <DialogTitle id="simple-dialog-title" className={classes.dialog}>
                    <Box mx={1} py={0}>
                        Download Table
                    </Box>
                </DialogTitle>
                <DialogContent className={classes.dialog}>
                    <Box mx={1} py={2}>
                        <DownloadTableDialogContent closeDialogFunction={memoizedHandleDialogClose} {...props}/>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

const DownloadTableDialogContent = (props) => {
    const [status, setStatus] = React.useState(S3DownloadState.NO_ACTION)
    const [buttonEnabledState, setButtonEnabledState] = React.useState(true)

    const enableButtons = () => {
        setButtonEnabledState(true)
    }
    const disableButtons = () => {
        setButtonEnabledState(false)
    }
    const memoizedEnableButtons = React.useCallback(enableButtons)
    const memoizedDisableButtons = React.useCallback(disableButtons)

    const fetchCheckIfExists = useMutation(
        "CheckIfExists",
        (config) => dataManagerInstance.getInstance.s3CheckIfFileExistsRequest(config.tableName),
        {
            onMutate: variables => {
                setStatus(S3DownloadState.TABLE_EXISTENCE_LOADING)
            }
        }
    )

    const fetchPresignedDownloadUrlMutation = useMutation(
        "GetS3PreSignedDownloadUrl",
        (config) => dataManagerInstance.getInstance.s3PresignedDownloadUrlRequest(config.tableName, config.expirationDurationInMinutes),
        {
            onMutate: variables => {
                setStatus(S3DownloadState.PRESIGNED_URL_FETCH_LOADING)
            }
        }
    )

    const downloadFromS3Mutation = useMutation(
        "DownloadFromS3",
        (config) => dataManagerInstance.getInstance.s3DownloadRequest(config.requestUrl, config.headers),
        {
            onMutate: variables => {
                setStatus(S3DownloadState.FILE_DOWNLOAD_LOADING)
            }
        }
    )

    const uploadTableToS3ActionCreationMutatuon = useMutation(
        "UploadTableToS3ActionCreation",
        (config) => dataManagerInstance.getInstance.saveData(config.entityName, config.actionProperties),
        {
            onMutate: () => {
                setStatus(S3DownloadState.UPLOADING_TO_STORAGE_SERVER_ACTION_CREATION_LOADING)
            }
        }
    )

    const requestTableUpload = () => {
        uploadTableToS3ActionCreationMutatuon.mutate(
            {
                entityName: "DownloadTable",
                actionProperties: formEntityForDownload(props.TableId, props.TableName, props.TableProviderInstanceId)
            },
            {
                onSuccess: (data, variables, context) => {
                    setStatus(S3DownloadState.UPLOADING_TO_STORAGE_SERVER_ACTION_CREATION_SUCCESS)
                    props.closeDialogFunction()
                },
                onError: (data, variables, context) => {
                    setStatus(S3DownloadState.UPLOADING_TO_STORAGE_SERVER_ACTION_CREATION_ERROR)
                }
            }
        )
    }

    const downloadTable = () => {
        fetchCheckIfExists.mutate(
            {tableName: convertTableNameToCsv(props.TableName)},
            {
                onSuccess: (fileExistenceData, fileExistenceVariables, fileExistenceContext) => {
                    console.log(fileExistenceData)
                    if (fileExistenceData.isFilePresent === false) {
                        setStatus(S3DownloadState.TABLE_NOT_EXISTS_SUCCESS)
                    } else {
                        setStatus(S3DownloadState.TABLE_EXISTS_SUCCESS)
                        fetchPresignedDownloadUrlMutation.mutate(
                            {tableName: fileExistenceVariables.tableName, expirationDurationInMinutes: 5},
                            {
                                onSuccess: (presignedDownloadUrlData, presignedDownloadUrlVariables, presignedDownloadUrlContext) => {
                                    setStatus(S3DownloadState.PRESIGNED_URL_FETCH_SUCCESS)
                                    console.log(presignedDownloadUrlData)
                                    downloadFromS3Mutation.mutate(
                                        {
                                            requestUrl: presignedDownloadUrlData.requestUrl,
                                            headers: presignedDownloadUrlData.headers
                                        },
                                        {
                                            onSuccess: (s3DownloadData, s3DownloadVariables, s3DownloadContext) => {
                                                setStatus(S3DownloadState.FILE_DOWNLOAD_SUCCESSFUL)
                                                download(s3DownloadData, fileExistenceVariables.tableName)
                                                props.closeDialogFunction()
                                            },
                                            onError: (s3DownloadData, s3DownloadVariables, s3DownloadContext) => {
                                                setStatus(S3DownloadState.FILE_DOWNLOAD_ERROR)
                                            }
                                        }
                                    )
                                },
                                onError: (data, variables, context) => {
                                    setStatus(S3DownloadState.PRESIGNED_URL_FETCH_ERROR)
                                }
                            }
                        )
                    }
                },
                onError: (data, variables, context) => {
                    setStatus(S3DownloadState.TABLE_EXISTENCE_ERROR)
                }
            }
        )
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <DisplayDownloadEntity {...props} enableButtons={memoizedEnableButtons}
                                       disableButtons={memoizedDisableButtons} setStatus={setStatus}/>
            </Grid>
            <Grid item xs={2}>{status.icon}</Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={3}>
                <Button variant="contained" onClick={requestTableUpload} classes={{root: "select-all"}}
                        disabled={!buttonEnabledState}>
                    {labels.DownloadTableButton.requestTableUpload}
                </Button>
            </Grid>
            <Grid item xs={3}>
                <Button variant="contained" onClick={downloadTable} classes={{root: "select-all"}}
                        disabled={!buttonEnabledState}>
                    {labels.DownloadTableButton.downloadTable}
                </Button>
            </Grid>
            <Grid container spacing={2} item xs={12}>
                <Grid item xs={4}>
                    <TextField
                        disabled
                        multiline
                        rows={1}
                        fullWidth
                        id="outlined-disabled"
                        label="Status"
                        rowsMax="4"
                        value={status.messageP}
                    />
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={7}>
                    <TextField
                        disabled
                        multiline
                        rows={1}
                        fullWidth
                        id="outlined-disabled"
                        label="Message"
                        rowsMax="4"
                        value={status.messageS}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

const DisplayDownloadEntity = (props) => {
    const tableId = props.TableId


    const defaultState = {
        Status: "Table never prepped",
        CreatedOn: "NA",
        ProcessedOn: "NA"
    }
    const {isLoading, error, data} = useRetreiveData(
        labels.entities.DownloadTable,
        {
            filter: {TableId: tableId}
        }
    )
    const [state, setState] = React.useState(defaultState)
    const [terminalState, setTerminalState] = React.useState(false)

    React.useEffect(() => {
        if (data !== undefined) {
            if (data.length === 1) {
                setState({
                    Status: data[0].Status || "Table never prepped",
                    CreatedOn: (data[0].CreatedOn !== undefined ? new Date(data[0].CreatedOn).toString() : "NA"),
                    ProcessedOn: (data[0].ProcessedOn !== undefined ? new Date(data[0].ProcessedOn).toString() : "NA")
                })
            }
        }
    }, [data])

    React.useEffect(() => {
        if (state.Status === "Table never prepped") {
            setTerminalState(false)
        } else if (state.Status === DownloadTableStatus.COMPLETED || state.Status === DownloadTableStatus.FAILED) {
            props.enableButtons()
            setTerminalState(true)
        } else {
            props.disableButtons()
            setTerminalState(false)
            props.setStatus(S3DownloadState.TABLE_PREP_IN_PROGRESS)
        }
    }, [state])

    return (
        <Grid container>
            <Grid item xs={12}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>{labels.DownloadTableButton.status}</TableCell>
                            <TableCell>{state.Status}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{labels.DownloadTableButton.createdOn}</TableCell>
                            <TableCell>{state.CreatedOn}</TableCell>
                        </TableRow>
                        {terminalState ? <TableRow>
                            <TableCell>{labels.DownloadTableButton.processedOn}</TableCell>
                            <TableCell>{state.ProcessedOn}</TableCell>
                        </TableRow> : <></>}
                    </TableBody>
                </Table>
            </Grid>
            <Grid container item xs={12}>
                <Grid item xs={12}>

                </Grid>
            </Grid>
        </Grid>
    )
}

const formEntityForDownload = (tableId, tableName, tableProviderInstanceId) => {
    return {
        entityProperties: {
            Id: uuidv4(),
            TableId: tableId,
            TableProviderInstanceId: tableProviderInstanceId,
            TableName: tableName,
        },
        CreateIfNotExistsAndRefresh: true
    }
}

function convertTableNameToCsv(tableName) {
    return tableName + ".csv"
}

// Taken From https://stackoverflow.com/questions/59394040/how-to-get-a-downloadable-file-from-a-readablestream-response-in-a-fetch-request
function download(blob, filename) {
    const url = window.URL.createObjectURL(blob);
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

export default DownloadTableButton;