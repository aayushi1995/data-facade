import { Box, Card } from "@mui/material"
import React from "react"
import { useQueryClient } from "react-query"
import { useRouteMatch } from "react-router"
import SaveAndBuildChartContextProvider from "../../../common/components/charts/SaveAndBuildChartsContext"
import SaveAndBuildChartsFromExecution from "../../../common/components/charts/SaveAndBuildChartsFromExecution"
import { SetModuleContextState } from "../../../common/components/ModuleContext"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import ActionDescriptionCard from "../../../common/components/workflow-action/ActionDescriptionCard"
import ActionExecutionStatus from "../../../enums/ActionExecutionStatus"
import { ActionExecutionIncludeDefinitionInstanceDetailsResponse } from "../../../generated/interfaces/Interfaces"
import { BuildActionContextProvider, SetBuildActionContext } from "../../build_action/context/BuildActionContext"
import useActionDefinitionDetail from "../../build_action/hooks/useActionDefinitionDetail"
import ExecuteActionNew from "../../execute_action/components/ExecuteActionNew"
import { ExecuteActionContextProvider } from "../../execute_action/context/ExecuteActionContext"
import FetchActionExecutionDetails from "../../view_action_execution/hooks/FetchActionExecutionDetails"
import ViewActionExecution, { ViewFailedActionExecution } from "../../view_action_execution/VIewActionExecution"
import ActionExecutionCard from "./ActionExecutionCard"

type MatchParams = {
    ActionExecutionId?: string
}

export const ActionExecutionDetails = (props: {actionExecutionId: string}) => {
    const actionExecutionId = props.actionExecutionId
    const [executionTerminal, setExecutionTerminal] = React.useState(false)
    const [executionError, setExecutionError] = React.useState(false)
    const [showParameters, setShowParameters] = React.useState(false)
    const [currentTime, setCurrentTime] = React.useState<number>(Date.now())
    const setModuleContextState = React.useContext(SetModuleContextState)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const [intervalId, setIntervalId] = React.useState<number | undefined>()
    console.log(props, executionTerminal)

    const handleDataFetched = (data?: ActionExecutionIncludeDefinitionInstanceDetailsResponse[]) => {
        console.log("DATA CHANGED")
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

        if(!!actionExecutionDetails) {
            setModuleContextState({
                type: 'SetHeader',
                payload: {
                    newHeader: {
                        Title: actionExecutionDetails?.ActionExecution?.ActionInstanceName,
                        SubTitle: `Run On ${new Date(actionExecutionDetails?.ActionExecution?.ScheduledTime || Date.now()).toString()}`
                    }
                }
            })
        }
    }

    const actionExecutionDetailQuery = FetchActionExecutionDetails({actionExecutionId: actionExecutionId, queryOptions: {
        enabled: !executionTerminal,
        onSuccess: handleDataFetched
    }})

    const increaseTime = () => {
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
        console.log("TRIGGERED")
        setCurrentTime(Date.now())
        const intervalId = setInterval(increaseTime, 1000)
        setIntervalId(intervalId as unknown as number)
        setExecutionTerminal(false)
    }, [props.actionExecutionId])

    const handleClickArrow = () => {
        setShowParameters(showParameters => !showParameters)
    }

    return (
        <ReactQueryWrapper {...actionExecutionDetailQuery}>
            {() => (
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    <ActionDescriptionCard description={actionExecutionDetailQuery?.data?.ActionDefinition?.Description} mode="READONLY"/>
                    <ActionExecutionCard elapsedTime={getElapsedTime()} actionExecution={actionExecutionDetailQuery?.data?.ActionExecution!} handleClickArrow={handleClickArrow} arrowState={showParameters ? "UP":"DOWN"} terminalState={executionTerminal} error={executionError}/>
                    {showParameters ? (
                        <Box sx={{
                            background: "#F8F8F8",    
                            flexDirection: 'column',
                            gap: 1,
                        }}>
                            <ExecuteActionNew actionDefinitionId={actionExecutionDetailQuery?.data?.ActionDefinition?.Id || "NA"} existingParameterInstances={actionExecutionDetailQuery?.data?.ActionParameterInstances} showActionDescription={false}/>
                        </Box>
                    ) : (
                        <></>
                    )}
                    {executionTerminal ? (
                        <Card sx={{
                            background: "#F8F8F8",
                            boxShadow:
                            "-10px -10px 15px #FFFFFF, 10px 10px 10px rgba(0, 0, 0, 0.05), inset 10px 10px 10px rgba(0, 0, 0, 0.05), inset -10px -10px 20px #FFFFFF",
                            borderRadius: "9.72px",
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            p: 3
                        }}>
                            {executionError ? (
                                <ViewFailedActionExecution actionExecutionDetail={actionExecutionDetailQuery?.data || {}}/>
                            ) : (
                                <Box sx={{maxWidth: '100%'}}>
                                    <SaveAndBuildChartsFromExecution executionId={actionExecutionDetailQuery?.data?.ActionExecution?.Id!}/>
                                </Box>
                            )}
                            
                        </Card>
                    ) : (
                        <></>
                    )}
                </Box>
            )}
        </ReactQueryWrapper>
    )
}

const ActionExecutionHomePage = () => {
    const match = useRouteMatch<MatchParams>()

    const actionExecutionId = match.params?.ActionExecutionId

    return (
        <ExecuteActionContextProvider>
            <SaveAndBuildChartContextProvider>
                <ActionExecutionDetails actionExecutionId={actionExecutionId || "NA"} />
            </SaveAndBuildChartContextProvider>
        </ExecuteActionContextProvider>
    )
}

export default ActionExecutionHomePage