import { ActionExecution } from "../../../generated/entities/Entities"
import { Card, Grid, Box, Typography, Button, IconButton, LinearProgress, Tooltip } from "@mui/material"
import ArrowDropDownIcon from "../../../../src/images/DropDown.svg"
import DownloadIcon from "../../../../src/images/DownloadData.svg"
import DownloadAndDisplayLogs from "../../view_action_execution/DownloadAndDisplyaLogs"
import { useGetPreSignedUrlForExecutionOutput } from "../../view_action_execution/hooks/useGetPreSignedUrlForExecutionOutput"
import { useDownloadExecutionOutputFromS3 } from "../../view_action_execution/hooks/useDownloadExecutionOutputFromS3"
import LoadingIndicator from "../../../common/components/LoadingIndicator"

interface ActionExecutionCardProps {
    elapsedTime: string,
    actionExecution: ActionExecution,
    arrowState: "DOWN" | "UP",
    terminalState: boolean,
    error: boolean
    handleClickArrow?: () => void,
    isWorkflow?: boolean,
    handleShowResult?: () => void
}

const ActionExecutionCard = (props: ActionExecutionCardProps) => {
    var background = '#F8F8F8'
    switch(props.terminalState) {
        case true: {
            switch(props.error) {
                case true: {
                    background = '#FFBDBD'
                    break;
                }
                case false: {
                    background = '#DFFFEA'
                }
            }
        } 
    }

    const useGetPresignedDowloadUrl = useGetPreSignedUrlForExecutionOutput(props.actionExecution?.OutputFilePath || "NA", 5)
    const {downloadExecutionOutputFromS3, download} = useDownloadExecutionOutputFromS3()

    const handleDownloadResult = () => {
        useGetPresignedDowloadUrl.mutate(
            (undefined),
            {
                onSuccess: (data, variables, context) => {
                    const s3Data = data as {requestUrl: string, headers: any}
                    downloadExecutionOutputFromS3.mutate(
                        ({requestUrl: s3Data.requestUrl as string, headers: s3Data.headers}), {
                            onSuccess: (data, variables, context) => {
                                download(data as Blob, props.actionExecution?.ActionInstanceName + ".csv" || "DataFacadeOutput")
                            }
                        }
                    )
                }
            }
        )
    }

    const handleMoreInfoClick = () => {
        const actionExecutionId = props?.actionExecution?.Id
        if(actionExecutionId !== undefined) {
            window.open(`/application/jobs/${actionExecutionId}`)
        }
    }

    return (
        <Box>
            <Card sx={{
                borderRadius: '12px',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                minWidth: '100%',
                justifyContent: 'center',
                p: 1,
                background: background
            }}>
                <Grid container alignItems="center" sx={{maxWidth: '100%'}}>
                    <Grid item xs={12}>
                        <Box sx={{display: 'flex', gap: 2, alignItem: 'center'}}>
                            <Box sx={{display: 'flex', flexDirection: 'column', flex: 3, justifyContent: 'center',px:6}}>
                                <Typography sx={{
                                    fontFamily: "'SF Pro Display'",
                                    fontStyle: "normal",
                                    fontWeight: 600,
                                    fontSize: "21.3786px",
                                    lineHeight: "116.7%",
                                    color: "#253858"
                                }}>
                                    {props.actionExecution?.ActionInstanceName}
                                </Typography>
                                <Typography sx={{
                                    fontFamily: "'SF Pro Text'",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: "15.1992px",
                                    lineHeight: "18px",
                                    textTransform: "uppercase",
                                    color: "#353535"
                                }}>
                                    ELAPSED TIME : {props.elapsedTime}
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 2}}>
                                {downloadExecutionOutputFromS3.isLoading ? (
                                    <LoadingIndicator />
                                ) : (
                                    <Tooltip title="Download Result as CSV">
                                        <IconButton onClick={handleDownloadResult}>
                                            <img src={DownloadIcon} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                
                                <Button variant="outlined" sx={{border: '1.28323px solid #0A414D;'}} onClick={handleMoreInfoClick}>
                                    More Info
                                </Button>
                                {props.terminalState ? (
                                    <DownloadAndDisplayLogs actionExecution={props.actionExecution} />
                                ) : (<></>)}
                                {
                                    props.isWorkflow ? (props.terminalState && !props.error ? (
                                        <Button variant="outlined" sx={{border: '1.28323px solid #0A414D;'}} onClick={() => props.handleShowResult?.()}>
                                            View Result
                                        </Button>
                                    ) : (<></>)) : (<></>)
                                }
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Card>
            {!props.terminalState ? (
                <Box sx={{width: '100%', pl: 1, pr: 1, mb: '3px'}}>
                    <LinearProgress/>
                </Box>
            ) : (
                <></>
            )}
        </Box>
    )
}

export default ActionExecutionCard