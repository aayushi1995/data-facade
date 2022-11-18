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
import ActionExecutionCard from "./ActionExecutionCard"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoadingIndicator from "../../../common/components/LoadingIndicator"

type MatchParams = {
    ActionExecutionId?: string
}

export const ActionExecutionDetails = (props: {
        actionExecutionId: string, 
        showDescription?: boolean, 
        showParametersOnClick?: boolean, fromTestAction?: boolean, onExecutionCreate?: (actionExecutionId: string) => void,
        handleGetExistingParameterInstance?: (actionParameterInstances: ActionParameterInstance[]) => void}
    ) => {

    const actionExecutionId = props.actionExecutionId
    const [executionTerminal, setExecutionTerminal] = React.useState(true)
    const [executionError, setExecutionError] = React.useState(false)
    const [showParameters, setShowParameters] = React.useState(false)
    const resultsView = React.useRef<HTMLDivElement | null>(null)
    const [currentTime, setCurrentTime] = React.useState<number>(Date.now())
    const setModuleContextState = React.useContext(SetModuleContextState)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const [intervalId, setIntervalId] = React.useState<number | undefined>()

    const handleDataFetched = (data?: ActionExecutionIncludeDefinitionInstanceDetailsResponse[]) => {
        const actionExecutionDetails = data?.[0]
        const actionStatus = actionExecutionDetails?.ActionExecution?.Status
        if(actionStatus === ActionExecutionStatus.FAILED || actionStatus === ActionExecutionStatus.COMPLETED) {
            clearInterval(intervalId)
            setExecutionTerminal(true)
            console.log('termintated')
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
    

    React.useEffect(() => {
        setExecutionTerminal(false)
    }, [props.actionExecutionId])

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
        console.log("time increased")
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
        setIntervalId(intervalId as unknown as number)
        setExecutionTerminal(false)
    }, [props.actionExecutionId])

    const handleClickArrow = () => {
        if(!(props.showParametersOnClick === false)){
            setShowParameters(showParameters => !showParameters)
        }
    }

    return (
        <>
            <ReactQueryWrapper {...actionExecutionDetailQuery}>
                {() => (
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 2, minHeight: '100%'}}>
                        {props.showDescription === false ? (<></>): (
                            <ActionDescriptionCard description={actionExecutionDetailQuery?.data?.ActionDefinition?.Description} mode="READONLY"/>
                        )}
                        <ActionExecutionCard elapsedTime={getElapsedTime()} actionExecution={actionExecutionDetailQuery?.data?.ActionExecution!} handleClickArrow={handleClickArrow} arrowState={showParameters ? "UP":"DOWN"} terminalState={executionTerminal} error={executionError}/>
                        
                        
                        {executionTerminal ? (
                            <div ref={resultsView}>
                                <Card sx={{
                                    background: "#F8F8F8",
                                    boxShadow:
                                    "-10px -10px 15px #FFFFFF, 10px 10px 10px rgba(0, 0, 0, 0.05), inset 10px 10px 10px rgba(0, 0, 0, 0.05), inset -10px -10px 20px #FFFFFF",
                                    borderRadius: "9.72px",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    p: 3
                                }} >
                                    {executionError ? (
                                        <ViewFailedActionExecution actionExecutionDetail={actionExecutionDetailQuery?.data || {}}/>
                                    ) : (
                                        <Box sx={{maxWidth: '100%'}} >
                                            <SaveAndBuildChartContextProvider>
                                                <SaveAndBuildChartsFromExecution executionId={actionExecutionDetailQuery?.data?.ActionExecution?.Id!}/>
                                            </SaveAndBuildChartContextProvider>
                                        </Box>
                                    )}
                                    
                                </Card>
                            </div>
                        ) : (
                            <></>
                        )}
                    </Box>
                )}
            </ReactQueryWrapper>
        </>
    )
}

const ActionExecutionHomePage = () => {
    const match = useRouteMatch<MatchParams>()

    const actionExecutionId = match.params?.ActionExecutionId

    return (
        <ExecuteActionContextProvider>
            <ActionExecutionDetails actionExecutionId={actionExecutionId || "NA"} />
        </ExecuteActionContextProvider>
    )
}


export default ActionExecutionHomePage

// function ActionInputHandler(
//     executionTerminal: boolean, 
//     actionExecutionDetailQuery: UseQueryResult<ActionExecutionIncludeDefinitionInstanceDetailsResponse, unknown>, 
//     userInputOpener: boolean,
//     handleInputOpener: () => void,
//     props: { actionExecutionId: string; showDescription?: boolean | undefined; showParametersOnClick?: boolean | undefined; fromTestAction?: boolean | undefined; onExecutionCreate?: ((actionExecutionId: string) => void) | undefined }): React.ReactNode {
//     return (
//         // <Box sx={{
//         //     background: "#F8F8F8",
//         //     flexDirection: 'column',
//         //     gap: 1,
//         // }}>
//         //     <ExecuteAction disableRun={!executionTerminal} actionDefinitionId={actionExecutionDetailQuery?.data?.ActionDefinition?.Id || "NA"} existingParameterInstances={actionExecutionDetailQuery?.data?.ActionParameterInstances} showActionDescription={false} fromTestRun={props.fromTestAction} onExecutionCreate={props.onExecutionCreate} redirectToExecution={!props.fromTestAction} />
//         // </Box>

//         <Box sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', mt: 4, py: 2, backgroundColor: userInputOpener ? "#e3e1de" : "#e0ecff", borderRadius: '5px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px' }}>
//         {!!actionExecutionDetailQuery?.data?.ActionDefinition?.Id ? (
//             <>
//                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
//                     <Button onClick={handleInputOpener}>
//                         {userInputOpener ? <KeyboardArrowDownIcon /> : <ChevronRightIcon />}
//                     </Button>
//                     <Typography sx={{ color: '#f09124', py: 1, fontSize: '1.1rem', fontWeight: 500 }}>Inputs</Typography>
//                 </Box>
//                 <Box sx={{ px: '20vw' }}>{userInputOpener ?
//                     <ExecuteAction disableRun={!executionTerminal} actionDefinitionId={actionExecutionDetailQuery?.data?.ActionDefinition?.Id || "NA"} existingParameterInstances={actionExecutionDetailQuery?.data?.ActionParameterInstances} showActionDescription={false} fromTestRun={props.fromTestAction} onExecutionCreate={props.onExecutionCreate} redirectToExecution={!props.fromTestAction} /> : <></>}
//                 </Box>
//             </>
//         ) : (
//             <LoadingIndicator/>
//         )}
        
//     </Box>
//     )
// }
