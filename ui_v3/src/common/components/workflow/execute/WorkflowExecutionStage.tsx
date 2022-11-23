import { Box, Card, Divider, Grid, IconButton, LinearProgress, Typography } from "@mui/material"
import React from "react"
import ArrowDropDownIcon from "../../../../../src/images/DropDown.svg"
import ActionExecutionStatus from "../../../../enums/ActionExecutionStatus"
import { ActionExecutionDetails } from "../../../../pages/apps/components/ActionExecutionHomePage"

export interface WorkflowExecutionStageProps {
    stageId: string
    stageName: string,
    numberOfActions: number,
    actionStatuses: string[],
    stageCompleted: boolean,
    stageFailed: boolean
    stageStarted: boolean
    actionExecutionIds: string[],
    actionCompletionTimes?: number[],
    startTime?: number,
    color?:string
}

const WorkflowExecutionStage = (props: WorkflowExecutionStageProps) => {
    const [showActionExecutions, setShowActionExecutions] = React.useState(false) 
    const [intervalId, setIntervalId] = React.useState<number | undefined>()

    const showExecutions = () => {
        if(props.stageCompleted) {
            setShowActionExecutions(state => !state)
        }
    } 
    const [currentTime, setCurrentTime] = React.useState<number>(Date.now())

    const increaseTime = () => {
        setCurrentTime(time => time + 1000)
    }

    React.useEffect(() => {
        if(props.stageStarted) {
            setCurrentTime(Date.now())
            const intervalId = setInterval(increaseTime, 1000)
            setIntervalId(intervalId as unknown as number)
        }
    }, [props.stageStarted])

    React.useEffect(() => {
        if(props.stageCompleted) {
            clearInterval(intervalId)
        }
    }, [props.stageCompleted])

    const getElapsedTime = () => {
        if(props.stageCompleted === false) {
            const timeInMilliSeconds = Math.max(currentTime - (props.startTime || Date.now()), 0)
            const timeInSeconds = timeInMilliSeconds/1000
            const m = Math.floor(timeInSeconds / 60).toString().padStart(2,'0')
            const s = Math.floor(timeInSeconds % 60).toString().padStart(2,'0');

            return m + ' MIN ' + s + ' SEC'
        } else {
            const timeInMilliSeconds = props.actionCompletionTimes?.reduce((sum, time) => sum + time, 0) || 0
            const timeInSeconds = timeInMilliSeconds
            const m = Math.floor(timeInSeconds / 60).toString().padStart(2,'0')
            const s = Math.floor(timeInSeconds % 60).toString().padStart(2,'0');

            return m + ' MIN ' + s + ' SEC'
        }
    }


    return (
        
        <><Box
            sx={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: props.color,
                alignItems: "center",
                pt: 2,
                pb: 2,
                borderRadius: '5px',
                height: '100%'
            }}
        >

            <Box sx={{
                minWidth: "40px",
                zIndex: 1
            }}></Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflowX: "hidden",
                mr: "2",
                boxSizing: "border-box",
                backgroundColor: "inherit",
                zIndex: 2,
                flexGrow: 1,
                gap: 0,
                cursor: 'pointer'
            }} onClick={showExecutions}>
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ alignItems: "flex-center", textAlign: 'center' }}>

                        <Typography sx={{
                            fontSize: '16px',
                            fontWeight: 700,
                        }}>
                            {props.stageName}
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <Typography sx={{
                        display: 'inline-block',
                        whiteSpace: "nowrap",
                    }}
                    >
                        Actions: {props.numberOfActions} <b>|</b> RunTime: {getElapsedTime()}
                    </Typography>
                </Box>


            </Box>
            {(props.stageId === undefined || props.stageId === props.stageId) &&
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    left: "40px",
                    zIndex: 1
                }}>
                    <Box sx={{
                        width: "0",
                        height: "0",
                        borderTop: "25px solid transparent",
                        borderLeft: "25px solid",
                        borderLeftColor: props.color,
                        borderBottom: "25px solid transparent"
                    }}>
                    </Box>

                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        right: "10px",
                        borderRadius: "5px",
                        minWidth: "20px"
                    }}>
                    </Box>
                </Box>}
        </Box>
        {/* <Card sx={{
            backgroundColor: "ActionDefinationHeroCardBgColor.main",
            border: "0.439891px solid #FFFFFF",
            boxShadow: "3.99px 3.99px 5px rgba(54, 48, 116, 0.3)",
            borderRadius: "26.3934px",
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
                <Box sx={{ width: '100%' }}>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12} sm={6} md={1}>
                            <IconButton onClick={showExecutions}>
                                <img src={ArrowDropDownIcon} style={{ transform: `rotate(${showActionExecutions ? 180 : -90}deg)` }} />
                            </IconButton>
                        </Grid>
                        <Grid item md={12} lg={8}>
                            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                                <Typography sx={{
                                    fontFamily: "'Ubuntu'",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: "15.1688px",
                                    lineHeight: "17px",
                                    color: "typographyColor1.main"
                                }}>
                                    {props.stageName}
                                </Typography>
                                <Typography sx={{
                                    fontFamily: "'Ubuntu'",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: "11.3766px",
                                    lineHeight: "13px",
                                    color: "typographyColor1.main"
                                }}>
                                    {props.numberOfActions} Actions {props.stageCompleted ? "Completed" : "Running"}
                                </Typography>
                                <Typography sx={{
                                    fontFamily: "'Ubuntu'",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: "11.3766px",
                                    lineHeight: "13px",
                                    textTransform: "uppercase",
                                    color: "syncingLogoColor1.main"
                                }}>
                                    ELAPSED TIME: {getElapsedTime()}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: "flex-end" }}>
                            {props.stageCompleted ? (
                                <Box>
                                    {props.stageFailed ? (
                                        <Card sx={{
                                            backgroundColor: "executionCardBgColor1.main", borderRadius: "15px", display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1
                                        }}>
                                            <Typography sx={{
                                                fontFamily: "'Ubuntu'",
                                                fontStyle: "normal",
                                                fontWeight: 500,
                                                fontSize: "13px",
                                                lineHeight: "15px",
                                                color: "typographyColor2.main"
                                            }}>
                                                Failed
                                            </Typography>
                                        </Card>
                                    ) : (
                                        <Card sx={{
                                            backgroundColor: "executionCardBgColor2.main", borderRadius: "15px", display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1
                                        }}>
                                            <Typography sx={{
                                                fontFamily: "'Ubuntu'",
                                                fontStyle: "normal",
                                                fontWeight: 500,
                                                fontSize: "13px",
                                                lineHeight: "15px",
                                                color: "typographyColor3.main"
                                            }}>
                                                Completed Successfully
                                            </Typography>
                                        </Card>
                                    )}
                                </Box>
                            ) : (
                                <Box>
                                    {props.stageStarted ? (
                                        <Card sx={{
                                            backgroundColor: "executionCardBgColor2.main", borderRadius: "15px", display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1
                                        }}>
                                            <Typography sx={{
                                                fontFamily: "'Ubuntu'",
                                                fontStyle: "normal",
                                                fontWeight: 500,
                                                fontSize: "13px",
                                                lineHeight: "15px",
                                                color: "typographyColor3.main"
                                            }}>
                                                Running
                                            </Typography>
                                        </Card>
                                    ) : (
                                        <Card sx={{
                                            width: "119px",
                                            height: "35px",
                                            backgroundColor: "executionCardBgColor3.main",
                                            borderRadius: "15px",
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            Not Started
                                        </Card>
                                    )}

                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '4px', justifyContent: 'flex-start' }}>
                    {props.actionStatuses.map(status => {
                        if (status === ActionExecutionStatus.STARTED || status === ActionExecutionStatus.CREATED) {
                            return (
                                <Box sx={{ flex: 1 }}>
                                    <LinearProgress variant="indeterminate" />
                                </Box>
                            )
                        } else if (status === ActionExecutionStatus.FAILED) {
                            return (
                                <Box sx={{ flex: 1 }}>
                                    <LinearProgress variant="determinate" value={0} color="error" />
                                </Box>
                            )
                        } else if (status === ActionExecutionStatus.WAITING_FOR_UPSTREAM) {
                            return (
                                <Box sx={{ flex: 1 }}>
                                    <LinearProgress variant="determinate" value={100} sx={{
                                        "& .MuiLinearProgress-colorPrimary": {
                                            backgroundColor: "linearProgressBgColor1.main",
                                        },
                                        "& .MuiLinearProgress-barColorPrimary": {
                                            backgroundColor: "linearProgressBgColor1.main",
                                        },
                                    }} />
                                </Box>
                            )
                        } else if (status === ActionExecutionStatus.COMPLETED) {

                            return (
                                <Box sx={{ flex: 1 }}>
                                    <LinearProgress variant="determinate" value={100} color="success" />
                                </Box>
                            )

                        }
                    })}
                </Box>
                {showActionExecutions ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                        <Divider orientation="horizontal" />
                        <Grid container spacing={1}>
                            {props.actionExecutionIds.map(aeId => (
                                <Grid item xs={12}>
                                    <ActionExecutionDetails actionExecutionId={aeId} showDescription={false} showParametersOnClick={false} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ) : (<></>)}
            </Card> */}
            </>
        
    )
}

export default WorkflowExecutionStage