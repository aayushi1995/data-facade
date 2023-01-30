import { Box, Button, Card, Typography } from "@mui/material"
import React from "react"
import { UseQueryResult } from "react-query"
import { useRouteMatch } from "react-router"
import SaveAndBuildChartContextProvider from "../../../common/components/charts/SaveAndBuildChartsContext"
import SaveAndBuildChartsFromExecution from "../../../common/components/charts/SaveAndBuildChartsFromExecution"
import { SetModuleContextState } from "../../../common/components/ModuleContext"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import ActionDescriptionCard from "../../../common/components/workflow-action/ActionDescriptionCard"
import ActionExecutionStatus from "../../../enums/ActionExecutionStatus"
import { ActionParameterInstance } from "../../../generated/entities/Entities"
import { ActionExecutionIncludeDefinitionInstanceDetailsResponse } from "../../../generated/interfaces/Interfaces"
import { SetBuildActionContext } from "../../build_action/context/BuildActionContext"
import { ExecuteActionContextProvider } from "../../execute_action/context/ExecuteActionContext"
import FetchActionExecutionDetails from "../../view_action_execution/hooks/FetchActionExecutionDetails"
import { ViewFailedActionExecution } from "../../view_action_execution/VIewActionExecution"
import ExecuteAction from "../../execute_action/components/ExecuteAction"
import ExecutionLoadingIndicator from "../../execute_action/presentation/ExecuteLoadingIndicator"
import DownloadAndDisplayLogs from "../../view_action_execution/DownloadAndDisplyaLogs"
import { ExecutingContainer, executionContainer, executionHeaderSxProps, moreInfoANDlogsContainer, moreinfoBtnColor, RuntimeStyle } from "./CssProperties"
import ActionExecutionDetailsNew from "./ActionExecutionDetails"

type MatchParams = {
    ActionExecutionId?: string
}


export const ActionExecutionDetails = (props: {
        actionExecutionId: string,
        childActionExecutionId?: string, 
        showDescription?: boolean, 
        showParametersOnClick?: boolean, 
        fromTestAction?: boolean, 
        fromDeepDive?: boolean,
        onExecutionCreate?: (actionExecutionId: string) => void,
        handleGetExistingParameterInstance?: (actionParameterInstances: ActionParameterInstance[]) => void}
    ) => {

    const actionExecutionId = props.actionExecutionId
    const [childActionExecutionId, setChildActionExecutionId] = React.useState<string | undefined>(props.childActionExecutionId)
    const [executionTerminal, setExecutionTerminal] = React.useState(true)
    const [executionError, setExecutionError] = React.useState(false)
    const [showParameters, setShowParameters] = React.useState(false)
    const resultsView = React.useRef<HTMLDivElement | null>(null)
    const childExecution = React.useRef<HTMLDivElement | null>(null)
    const [currentTime, setCurrentTime] = React.useState<number>(Date.now())
    const [intervalId, setIntervalId] = React.useState<any>()
    console.log(currentTime)

    const onChildExecutionCreated = (actionExecutionId: string) => {
        setChildActionExecutionId(actionExecutionId)
        const currentComponent: React.ReactNode = childExecution.current
        if (currentComponent) {
            (currentComponent as {scrollIntoView: Function})?.scrollIntoView?.({
                behavior: 'smooth',
                block: 'start',
            })
        }
    }

    const handleDataFetched = (data?: ActionExecutionIncludeDefinitionInstanceDetailsResponse[]) => {
        const actionExecutionDetails = data?.[0]
        const actionStatus = actionExecutionDetails?.ActionExecution?.Status
        if(actionStatus === ActionExecutionStatus.FAILED || actionStatus === ActionExecutionStatus.COMPLETED) {
            clearInterval(intervalId)
            setExecutionTerminal(true)
            if(actionStatus === ActionExecutionStatus.FAILED) {
                setExecutionError(true)
            } else {
                setExecutionError(false)
            }
        }
    }

    const actionExecutionDetailQuery = FetchActionExecutionDetails({actionExecutionId: actionExecutionId, queryOptions: {
        enabled: !executionTerminal,
        onSuccess: handleDataFetched
    }})


    React.useEffect(() => {
        if(executionTerminal === true) {
            const currentComponent: React.ReactNode = resultsView.current
            if (currentComponent) {
                (currentComponent as {scrollIntoView: Function})?.scrollIntoView?.({
                    behavior: 'smooth',
                    block: 'start',
                })
            }
        } 
    }, [executionTerminal])

    const increaseTime = () => {
        console.log('here')
        setCurrentTime(time => time + 1000)
    }

    const getElapsedTime = () => {
        const timeInMilliSeconds = executionTerminal ? (actionExecutionDetailQuery?.data?.ActionExecution?.ExecutionCompletedOn || Date.now()) - (actionExecutionDetailQuery?.data?.ActionExecution?.ScheduledTime || Date.now()) : currentTime - (actionExecutionDetailQuery?.data?.ActionExecution?.ScheduledTime || currentTime)
        const timeInSeconds = timeInMilliSeconds/1000
        const m = Math.floor(timeInSeconds / 60).toString().padStart(2,'0')
        const s = Math.floor(timeInSeconds % 60).toString().padStart(2,'0');

        return m + ' MIN ' + s + ' SEC'
    }

    React.useEffect(() => {
        setCurrentTime(Date.now())
        const intervalId = setInterval(increaseTime, 1000)
        setIntervalId(intervalId)
        setExecutionTerminal(false)
    }, [props.actionExecutionId])

    let description = actionExecutionDetailQuery?.data?.ActionDefinition?.Description || 
        actionExecutionDetailQuery?.data?.ActionDefinition?.DisplayName;
    
    const handleMoreInfoClick = () => {
        const actionExecutionId = actionExecutionDetailQuery?.data?.ActionExecution?.Id
        if(actionExecutionId !== undefined) {
            window.open(`/application/jobs/${actionExecutionId}`)
        }
    }

    
    return (
        <>
            <ReactQueryWrapper {...actionExecutionDetailQuery}>
                {() => (
                    <Box sx={{...executionContainer}}>
                        {props.showDescription === false ? (<></>): (
                            <ActionDescriptionCard description={description} mode="READONLY"/>
                        )}
                        <Box sx={{display:'flex',flexDirection:!executionTerminal?'column':'row',alignItems:'center'}}>
                        <Box sx={{...RuntimeStyle}}>
                            <Typography variant="executeActionSubtext">
                                Runtime: {getElapsedTime()}
                            </Typography>
                        </Box>
                        {executionTerminal ? (
                            <Box sx={{...moreInfoANDlogsContainer}}>
                                <Button sx={{...moreinfoBtnColor}} onClick={handleMoreInfoClick}>
                                    More Info
                                </Button>
                                {executionTerminal ? (
                                    <DownloadAndDisplayLogs actionExecution={actionExecutionDetailQuery?.data?.ActionExecution || {}} />
                                ) : (<></>)}
                            </Box>
                        ) : (
                            <Box sx={{...ExecutingContainer}}>
                                <ExecutionLoadingIndicator />
                                <Typography>
                                    Executing {actionExecutionDetailQuery?.data?.ActionDefinition?.DisplayName}. Please Wait
                                </Typography>
                            </Box>
                        )}
                        </Box>
                        
                        {showParameters ? (
                            <ExecuteAction hideExecution={true} disableRun={!executionTerminal} actionDefinitionId={actionExecutionDetailQuery?.data?.ActionDefinition?.Id || "NA"} existingParameterInstances={actionExecutionDetailQuery?.data?.ActionParameterInstances} showActionDescription={false} fromTestRun={props.fromTestAction} onExecutionCreate={props.onExecutionCreate} redirectToExecution={!props.fromTestAction} />
                        ) : (
                            <></>
                        )}
                        
                        
                        {executionTerminal ? (
                            <div ref={resultsView}>
                                <Box sx={executionHeaderSxProps} >
                                    {executionError ? (
                                        <ViewFailedActionExecution actionExecutionDetail={actionExecutionDetailQuery?.data || {}}/>
                                    ) : (
                                        <Box>
                                            <SaveAndBuildChartContextProvider>
                                                <SaveAndBuildChartsFromExecution 
                                                    executionId={actionExecutionDetailQuery?.data?.ActionExecution?.Id!}
                                                    onChildExecutionCreated={onChildExecutionCreated}
                                                    definitionId={actionExecutionDetailQuery?.data?.ActionDefinition?.Id}
                                                    />
                                            </SaveAndBuildChartContextProvider>
                                        </Box>
                                    )}
                                    
                                </Box>
                            </div>
                        ) : (
                            <></>
                        )}
                    </Box>
                )}
            </ReactQueryWrapper>
            <div ref={childExecution}>
            {childActionExecutionId ?
            (<ActionExecutionDetails 
                actionExecutionId={childActionExecutionId} 
                showDescription={true} 
                fromDeepDive={true} 
                fromTestAction={true}
                />) :
                <></>
            }
            </div>
        </>
    )
}

const ActionExecutionHomePage = () => {
    const match = useRouteMatch<MatchParams>()

    const actionExecutionId = match.params?.ActionExecutionId

    return (
        <ExecuteActionContextProvider>
            <ActionExecutionDetailsNew actionExecutionId={actionExecutionId || "NA"} />
        </ExecuteActionContextProvider>
    )
}


export default ActionExecutionHomePage

