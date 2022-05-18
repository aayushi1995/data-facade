import CloseIcon from '@mui/icons-material/Close';
import PreviewIcon from "@mui/icons-material/Preview";
import { Box, Dialog, DialogContent, Grid, IconButton, Link, Tooltip } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from '@mui/styles';
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useMutation } from "react-query";
import LoadingIndicator from "../../../common/components/LoadingIndicator";
import NoData from "../../../common/components/NoData";
import QueryData from '../../../common/components/QueryData';
import S3UploadState from "../../../custom_enums/S3UploadState";
import dataManager, { useRetreiveData } from "../../../data_manager/data_manager";
import { getActionExecutionParsedOutput } from "../../../data_manager/entity_data_handlers/action_execution_data";
import { formTimeStampOrReturnDefault } from '../../jobs/components/JobsRowJobDetail';
import ConfigureTableMetadata from "../../upload_table/components/ConfigureTableMetadata";

const columns = [
    {
        field: "ActionInstanceName",
        headerName: "Name",
        description: "Name of action",
        flex: 0.5
    },
    {
        field: "ExecutionCompletedOn",
        headerName: "Action Completion Time",
        flex: 1,
        valueGetter: (cell) => formTimeStampOrReturnDefault(cell?.value, "NA")
    },
    {
        field: "PreviewTable",
        headerName: "Preview Table",
        flex: 0.5,
        renderCell: (props) => {
            return <PreviewTable {...props}/>
        }
    },
    {
        field: "ImportExecutionOutput",
        headerName: "Import Execution Output",
        flex: 0.5,
        renderCell: (props) => {
            return <ImportTable {...props}/>
        }
    }
]

const useStyles = makeStyles(() => ({
    dialogPaper: {
        minHeight: '60vh',
        maxHeight: '70vh',
        minWidth: 1100
    },
    dialogTable: {
        minWidth: 500,
    },
    dialogUpload: {
        minHeight: '100vh',
        maxHeight: '100vh',
        minWidth: '100vh'
    }
}))



export const PreviewTable = (props) => {
    const fetchActionExecutionWithOutputMutation = useMutation(getActionExecutionParsedOutput)
    const handlePreviewClick = () => {
        console.log("TERM")
        props?.api?.componentsProps?.setFetching(true)
        props?.api?.componentsProps?.setDataDialogOpen(true)
        fetchActionExecutionWithOutputMutation.mutate(props?.row, {
            onSuccess: (data, variables, context) => {
                const preview = data.Output
                props?.api?.componentsProps?.setQueryData(preview)
            },
            onSettled: () => {
                props?.api?.componentsProps?.setFetching(false)
            }
        })
    }
    return (
        <Tooltip title="Preview Table">
            <IconButton
                color="primary"
                aria-label="Preview Table"
                onClick={handlePreviewClick}
            >
                <PreviewIcon/>
            </IconButton>
        </Tooltip>
    )
}

export const ImportTable = (props) => {
    
    const handleImportTable = () => {
        props.api.componentsProps.handleImportTable?.(props.id)
    }
    
    return (
        <Link onClick={handleImportTable}>Import As Table</Link>
    )
}

const IntermediaryTables = (props) => {
    
    const classes = useStyles()
    const tableId = props?.TableId

    const fetchS3PresignedDownloadUrl = useMutation(
        "GetS3PresignedDownloadUrl",
        ({ actionExecutionOutputPath, expirationDurationInMinutes}) => dataManager.getInstance.s3PresignedDownloadUrlRequest(actionExecutionOutputPath, expirationDurationInMinutes, "JobOutput")
    )

    const downloadFileFromS3Mutation = useMutation(
        "DownloadFileFromS3",
        (config) => dataManager.getInstance.s3DownloadRequest(config.requestUrl, config.headers)
    )

    const {isLoading, data, errors} = useRetreiveData(
        "TableProperties",
        {
            filter: {
                Id: tableId
            },
            "withIntermediaryTableExecutions": true
        }
    )

    const [actionExecutions, setActionExecutions] = React.useState()
    const [dataDialogOpen, setDataDialogOpen] = React.useState(false)
    const [queryData, setQueryData] = React.useState([])
    const [fetchingActionexecutionOutput, setFetchingActionexecutionOutput] = React.useState(false)
    const [uploadTableDialog, setUploadDialogOpen] = React.useState(false)
    const [downloadingFile, setDownloadingFile] = React.useState(false)
    
    
    React.useEffect(() => {
        if(data) {
            setActionExecutions(data.map(executions => {return {...executions, id: executions?.Id}}))
        }
    }, [data])

    const handleDialogClose = () => {
        setDataDialogOpen(false)
    }

    const handleImportTable = (actionExecutionId) => {
        const selectedActionExecution = actionExecutions?.find(ae => ae.Id === actionExecutionId)
        if(!!selectedActionExecution) {
            setDownloadingFile(true)
            setUploadDialogOpen(true)
            fetchS3PresignedDownloadUrl.mutate(({actionExecutionOutputPath: selectedActionExecution.OutputFilePath + "/output.txt", expirationDurationInMinutes: 5}), {
                onSuccess: (data, variables, context) => {
                    downloadFileFromS3Mutation.mutate({
                        requestUrl: data.requestUrl,
                        headers: data.headers
                    }, {
                        onSuccess: (data) => {
                            console.log(data)
                            setDownloadingFile(false)
                        }
                    })
                }
            })
        }
    }

    if(actionExecutions) {
        return (
            <Grid container>
                <Dialog open={uploadTableDialog} fullWidth onClose={() => setUploadDialogOpen(false)} maxWidth="xl" scroll="paper" maxHeight="xl">
                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <IconButton aria-label="close" onClick={() => setUploadDialogOpen(false)}>
                                <CloseIcon/>
                            </IconButton>
                        </Grid>
                    <DialogTitle>
                        Import Intermediary Table
                    </DialogTitle>
                    <DialogContent sx={{minHeight: '800px', minWidth: '600px'}}>
                        {downloadingFile ? (
                            <Grid item xs={12}>
                                <LoadingIndicator/>
                            </Grid>
                        ) : (
                            <Box p={1}>
                                <ConfigureTableMetadata file={new File([downloadFileFromS3Mutation.data], "Execution Output.csv")} uploadState={S3UploadState.FILE_BUILT_FOR_UPLOAD} currentEnabled={5} setUploadState={() => {return}}/>
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
                <Dialog open={dataDialogOpen} onClose={handleDialogClose} fullWidth
                classes={{paper: classes.dialogPaper}} scroll="paper" title={"Table Preview"}>
                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <IconButton aria-label="close" onClick={handleDialogClose}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                    <DialogTitle>{"Table Preview"}</DialogTitle>
                    <Grid item xs={12}>
                        {fetchingActionexecutionOutput ?
                            <LoadingIndicator/>
                            :
                            <Box mx={2} my={1}>
                                <QueryData props={[queryData]}></QueryData>
                            </Box>
                        }  
                    </Grid>
                </Dialog>
                <Grid item xs={12}>
                    <DataGrid
                        columns={columns} rows={actionExecutions}
                        autoHeight
                        autoPageSize
                        checkboxSelection
                        disableSelectionOnClick
                        componentsProps={{
                            setDataDialogOpen: setDataDialogOpen,
                            setQueryData: setQueryData,
                            setFetching: setFetchingActionexecutionOutput,
                            handleImportTable: handleImportTable
                        }}
                        sx={{
                            "& .MuiDataGrid-columnHeaders": { background: "#E8E8E8"}
                        }}
                        headerHeight={70}
                        rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
                        initialState={{
                            pagination: {
                                pageSize: 10
                            }
                        }}
                    ></DataGrid>
                </Grid>
            </Grid> 
        )   
    } else if(errors) {
        return <NoData/>
    } else {
        return <LoadingIndicator/>
    }

}

export default IntermediaryTables