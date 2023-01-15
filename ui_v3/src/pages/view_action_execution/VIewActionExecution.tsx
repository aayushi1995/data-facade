import { Box, Button, Card, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import React from "react";
import { useQueryClient } from "react-query";
import SaveAndBuildChartContextProvider from "../../common/components/charts/SaveAndBuildChartsContext";
import SaveAndBuildChartsFromExecution from "../../common/components/charts/SaveAndBuildChartsFromExecution";
import LoadingIndicator from "../../common/components/LoadingIndicator";
import LoadingWrapper from "../../common/components/LoadingWrapper";
import ProgressBar from "../../common/ProgressBar";
import S3UploadState from "../../custom_enums/S3UploadState";
import ActionDefinitionPresentationFormat from "../../enums/ActionDefinitionPresentationFormat";
import ActionExecutionStatus from "../../enums/ActionExecutionStatus";
import { ActionExecutionIncludeDefinitionInstanceDetailsResponse } from "../../generated/interfaces/Interfaces";
import ViewConfiguredParameters from "../execute_action/components/ViewConfiguredParameters";
import useActionExecutionParsedOutput from "../execute_action/hooks/useActionExecutionParsedOutput";
import ConfigureTableMetadata from "../upload_table/components/ConfigureTableMetadata";
import DownloadAndDisplayLogs from "./DownloadAndDisplyaLogs";
import FetchActionExecutionDetails from "./hooks/FetchActionExecutionDetails";
import { useDownloadExecutionOutputFromS3 } from "./hooks/useDownloadExecutionOutputFromS3";
import { useGetPreSignedUrlForExecutionOutput } from "./hooks/useGetPreSignedUrlForExecutionOutput";

export interface ViewActionExecutionProps {
    actionExecutionId?: string,
    hideParams?: boolean
}

interface ResolvedActionExecutionProps {
    actionExecutionDetail: ActionExecutionIncludeDefinitionInstanceDetailsResponse,
    hideParams?: boolean
}

const ViewActionExecution = (props: ViewActionExecutionProps) => {
    const { actionExecutionId, hideParams } = props
    const queryClient = useQueryClient()
    const [executionTerminal, setExecutionTerminal] = React.useState(false)

    const actionExecutionDetailQuery = FetchActionExecutionDetails({actionExecutionId: actionExecutionId, queryOptions: {
        enabled: !executionTerminal
    }})
    
    const handleMoreInfoClick = () => {
        const actionExecutionId = actionExecutionDetailQuery.data?.ActionExecution?.Id
        if(actionExecutionId !== undefined) {
            window.open(`/application/jobs/${actionExecutionId}`)
        }
    }

    React.useEffect(() => {
        const actionStatus = actionExecutionDetailQuery.data?.ActionExecution?.Status
        if(actionStatus === ActionExecutionStatus.FAILED || actionStatus === ActionExecutionStatus.COMPLETED) {
            setExecutionTerminal(true)
        }
    }, [actionExecutionDetailQuery.data])

    React.useEffect(() => {
        setExecutionTerminal(false)
    }, [actionExecutionId])

    const getToRenderComponent = () => {
        const data = actionExecutionDetailQuery?.data
        if(!!data){
            const props = {actionExecutionDetail: data, hideParams: hideParams}
            switch(actionExecutionDetailQuery.data?.ActionExecution?.Status) {
                case ActionExecutionStatus.COMPLETED:
                    return <ViewCompletedActionExecution {...props}/>
                case ActionExecutionStatus.FAILED:
                    return <ViewFailedActionExecution {...props}/>
                default:
                    return <ViewActionExecutionInNonTerminalState {...props}/>
            }
        }
    }
    return(
        <Box sx={{width:'100%',display:'flex'}}>
            <LoadingWrapper
                data={actionExecutionDetailQuery.data}
                isLoading={actionExecutionDetailQuery.isLoading}
                error={actionExecutionDetailQuery.error}
            >
                <Box sx={{width:'100%', display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{width:'100%'}}>
                    {getToRenderComponent()}
                    </Box>
                    <Box>
                        {/* <Button variant="contained" onClick={handleMoreInfoClick}>More Info</Button> */}
                    </Box>
                </Box>
            </LoadingWrapper>
        </Box>
        
    )
}

const getFailureMessage = (actionOutput: any): Object => {
    try {
        return actionOutput.Message[0]
    } catch (e) {
        return actionOutput.Message
    }
}

export const ViewFailedActionExecution = (props: ResolvedActionExecutionProps) => {
    const { actionExecutionDetail } = props
    const actionOutput = JSON.parse(actionExecutionDetail?.ActionExecution?.Output || "{}")
    const failureMessage = getFailureMessage(actionOutput)
    const script = actionOutput?.script
    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2}}>
            <Box p={2} sx={{display: 'flex', justifyContent: 'center'}}>
                <Typography variant="heroHeader">
                    {actionExecutionDetail.ActionExecution?.ActionInstanceName}
                </Typography>
            </Box>
            <Box>
                <ViewConfiguredParameters
                    parameterDefinitions={actionExecutionDetail?.ActionParameterDefinitions||[]}
                    parameterInstances={actionExecutionDetail?.ActionParameterInstances||[]}
                />
            </Box>
            <Box sx={{width:'100%', display: "flex", flexDirection: "column", gap: 1 }}>
                <Box>
                    <Card sx={{
                        p: 3,
                        background: "#F4F5F7",
                        width:'100%',
                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25), 0px 0px 1px rgba(0, 0, 0, 0.25)",
                        overflow:'scroll',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                    }}>
                        {!!script ? (
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                <Typography variant="heroHeader" sx={{fontSize: '2.5vh'}}>
                                    SCRIPT
                                </Typography>
                                <Card sx={{p: 1}}>
                                    <Typography variant="heroMeta" sx={{fontSize: '1.5vh', whiteSpace: 'pre-line'}}>
                                        {(script || "NA")}
                                    </Typography>
                                </Card>
                            </Box>
                        ) : (
                            <></>
                        )}
                        
                        <Box sx={{display: 'flex', gap: 1, flexDirection: 'column'}}>
                            <Typography variant="heroHeader" sx={{fontSize: '2.5vh'}}>
                                ERROR
                            </Typography>
                            <Card sx={{p: 1}}>
                                <Typography variant="heroMeta" sx={{fontSize: '1.5vh', whiteSpace: 'pre-line'}}>
                                    {failureMessage}
                                </Typography>
                            </Card>
                        </Box>
                    </Card>
                </Box>
                <Box>
                        <DownloadAndDisplayLogs actionExecution={actionExecutionDetail.ActionExecution || {}}/>
                </Box>
            </Box>
        </Box>
    )
}

const ViewCompletedActionExecution = (props: ResolvedActionExecutionProps) => {
    const { actionExecutionDetail, hideParams } = props
    const [dialogState, setDialogState] = React.useState(false)
    const [importTableDialog, setImportTableDialog] = React.useState(false)
    const [fileFetched, setFileFetched] = React.useState(false)
    const [outputFile, setOutputFile] = React.useState<File | undefined>()
    const handleClose = () => setDialogState(false)
    const handleOpen = () => setDialogState(true)

    const useActionExecutionParsedOutputQuery = useActionExecutionParsedOutput({ actionExecutionFilter: {Id: actionExecutionDetail?.ActionExecution?.Id}, queryOptions: {}})
    const useGetPresignedDowloadUrl = useGetPreSignedUrlForExecutionOutput(actionExecutionDetail.ActionExecution?.OutputFilePath || "NA", 5)
    const {downloadExecutionOutputFromS3, download} = useDownloadExecutionOutputFromS3()

    const viewResult = () => {
        useActionExecutionParsedOutputQuery.refetch()
    }

    const handleExportResults = () => {
        const s3Path = props.actionExecutionDetail.ActionExecution?.OutputFilePath || "s3Path"
        setImportTableDialog(true)
        useGetPresignedDowloadUrl.mutate(
            (undefined),
            {
                onSuccess: (data, variables, context) => {
                    const s3Data = data as {requestUrl: string, headers: any}
                    downloadExecutionOutputFromS3.mutate(
                        ({requestUrl: s3Data.requestUrl as string, headers: s3Data.headers}),
                        {
                            onSuccess: (data, variables, context) => {
                                setOutputFile(new File([data as Blob], `Table.csv`))
                                setFileFetched(true)
                            }
                        }
                    )
                },
            }
        )
    }
    
    const progressBarProps = {
        Progress: 100,
        Label: "Execution Completed Successfully"
    }

    const handleDownloadResult = () => {
        useGetPresignedDowloadUrl.mutate(
            (undefined),
            {
                onSuccess: (data, varaibles, context) => {
                    const s3Data = data as {requestUrl: string, headers: any}
                    downloadExecutionOutputFromS3.mutate(
                        ({requestUrl: s3Data.requestUrl as string, headers: s3Data.headers}), {
                            onSuccess: (data, variables, context) => {
                                download(data as Blob, props.actionExecutionDetail.ActionInstance?.Name + ".csv" || "DataFacadeOutput")
                            }
                        }
                    )
                }
            }
        )
    }
    
    return (
        <Box>
            <Dialog open={importTableDialog} onClose={() => {setImportTableDialog(false); setFileFetched(false)}} fullWidth maxWidth="xl">
                <DialogTitle>
                    Export As Table
                </DialogTitle>
                <DialogContent>
                    {fileFetched ? (
                        <ConfigureTableMetadata file={outputFile} uploadState={S3UploadState.FILE_BUILT_FOR_UPLOAD} currentEnabled={5} setUploadState={() => {return}}/>
                    ) : (
                        <LoadingIndicator/>
                    )}
                </DialogContent>
            </Dialog>
            <Dialog open={dialogState} onClose={handleClose} fullWidth maxWidth="xl">
                <DialogContent sx={{ height: "800px"}}>
                    <SaveAndBuildChartContextProvider>
                        {/* <ViewActionExecutionOutput 
                            ActionDefinition={actionExecutionDetail.ActionDefinition!}
                            ActionInstance={actionExecutionDetail.ActionInstance!}
                            ActionExecution={actionExecutionDetail.ActionExecution!}
                        /> */}
                        <SaveAndBuildChartsFromExecution executionId={actionExecutionDetail?.ActionExecution?.Id!}/>
                    </SaveAndBuildChartContextProvider>
                </DialogContent>
            </Dialog>
            {hideParams ? (
                <></>
            ) : (
                <Box p={2} sx={{display: 'flex', justifyContent: 'center'}}>
                    <Typography variant="heroHeader">
                        {actionExecutionDetail.ActionExecution?.ActionInstanceName}
                    </Typography>
                </Box>
            )}
            <Box>
                {hideParams ? (
                    <></>
                ) : (
                    <ViewConfiguredParameters
                        parameterDefinitions={actionExecutionDetail?.ActionParameterDefinitions||[]}
                        parameterInstances={actionExecutionDetail?.ActionParameterInstances||[]}
                    />
                )}
            </Box>
            <Box>
                <ProgressBar {...progressBarProps}/>
            </Box>
            <Box>
                <Card sx={{
                    p: 3,
                    background: "#F4F5F7",
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25), 0px 0px 1px rgba(0, 0, 0, 0.25)"
                }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <Box>
                            <Typography>
                                Review Results in Insights using a Interactive Dashboard or Download csv  
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 4, justifyContent: "center"}}>
                            <Box>
                                <Button variant="contained" onClick={() => {handleOpen()}}>
                                    View Results
                                </Button>
                            </Box>
                            <Box>
                                {downloadExecutionOutputFromS3.isLoading ? (
                                    <LoadingIndicator/>
                                ) : (
                                    <Button variant="contained" onClick={handleDownloadResult}>
                                        Download File
                                    </Button>
                                )}
                                
                            </Box>
                            <Box>
                                <Button variant="contained" disabled={actionExecutionDetail.ActionDefinition?.PresentationFormat !== ActionDefinitionPresentationFormat.TABLE_VALUE} onClick={handleExportResults}>
                                    Export Results
                                </Button>
                            </Box>
                            <Box>
                                <DownloadAndDisplayLogs actionExecution={actionExecutionDetail.ActionExecution || {}}/>
                            </Box>                         
                        </Box>
                    </Box>
                </Card>
            </Box>
        </Box>
    )
}

const ViewActionExecutionInNonTerminalState = (props: ResolvedActionExecutionProps) => {
    const [componentRenderedAt, setComponentRenderedAt] = React.useState<number>(Date.now())
    const [timer, setTimer] = React.useState<number>(Date.now())
    const [timerValueWhenActionStarted, setTimerValueWhenActionStarted] = React.useState<number|undefined>(undefined)
    
    const formFormattedElapsedTime = () => {
        const elapsedTime = timer - (timerValueWhenActionStarted || componentRenderedAt)
        return `Time Elapsed: ${(elapsedTime/1000).toFixed(0)} s`
    }
    
    React.useEffect(() => {
        setTimerValueWhenActionStarted(props?.actionExecutionDetail?.ActionExecution?.ExecutionStartedOn)
    }, [props?.actionExecutionDetail?.ActionExecution?.ExecutionStartedOn])
    
    React.useEffect(() => {
        const interval = setInterval(() => {
            setTimer(Date.now())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
            <Box>
                <>Action Execution Status: {props?.actionExecutionDetail?.ActionExecution?.Status}</>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Box>
                    <LoadingIndicator/>
                </Box>
                <Box>
                    <>{formFormattedElapsedTime()}</>
                </Box>
            </Box>
            
        </Box>
    )
}

export default ViewActionExecution;