import { Box, Button, Divider, IconButton, Typography } from "@mui/material"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import { ActionParameterInstance } from "../../../generated/entities/Entities"
import useActionExecutionDetails from "../hooks/useActionExecutionDetails"
import { ActionExecutionStyledMainCard, ActionExecutionSubHeaderMainBox, ViewActionExecutionResultButton } from "./styled_components/ActionExcutionStyledMainCard"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import CircularDot from "../../execute_action/presentation/CircularDot"
import ExecutionLoadingIndicator from "../../execute_action/presentation/ExecuteLoadingIndicator"
import SaveAndBuildChartContextProvider from "../../../common/components/charts/SaveAndBuildChartsContext"
import SaveAndBuildChartsFromExecution from "../../../common/components/charts/SaveAndBuildChartsFromExecution"
import { ViewFailedActionExecution } from "../../view_action_execution/VIewActionExecution"
import DeepDive from "../../../common/components/charts/DeepDive"
import ExportAsDashboard from "../../../common/components/workflow/execute/ExportAsDashboard"


export interface ActionExecutionDetailProps {
    actionExecutionId: string,
    childActionExecutionId?: string, 
    showDescription?: boolean, 
    showParametersOnClick?: boolean, 
    fromTestAction?: boolean, 
    fromDeepDive?: boolean,
    onExecutionCreate?: (actionExecutionId: string) => void,
    displayPostProcessed?: boolean
}

const ActionExecutionDetailsNew = (props: ActionExecutionDetailProps) => {
    const {
        actionExecutionDetailQuery,
        actionExecutionError,
        actionExecutionTerminalState,
        getElapsedTime,
        cardExpanded,
        handleResultsToggle,
        onChildExecutionCreated,
        childActionExecutionId,
        fetchChildActionExecutionQuery,
        postProcessedAction,
        selectedActionId,
        setSelectedActionId,
        getProviderInstanceId
    } = useActionExecutionDetails(props)

    const {actionExecutionId} = props

    const boxFlexSx = {
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center'
    }

    const onDeepDiveActionSelected = (actionId?: string) => {
        setSelectedActionId(actionId)
    }

    return (
        <ReactQueryWrapper  {...actionExecutionDetailQuery}>
            {() => <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', gap: 4}}>
                <ActionExecutionStyledMainCard  
                    sx={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                        overflow: 'auto'
                    }}
                >
                    <Box sx={{
                        ...boxFlexSx,
                        p: 2
                    }}>
                        <IconButton onClick={handleResultsToggle} >
                            {!cardExpanded ? <ExpandLessIcon/> : <ExpandMoreIcon />}
                        </IconButton>
                    
                        <Box sx={{flex: 1, width: '100%', display: 'flex', flexDirection: 'column'}}>
                            <Typography variant="executeActionName">
                                {actionExecutionDetailQuery.data?.ActionInstance?.Name}
                            </Typography>
                            <Typography variant="executeActionDescription">
                                Status : {actionExecutionDetailQuery.data?.ActionExecution?.Status}
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', flex: 1, flexDirection: 'column', width: '100%', height: '100%', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                            <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                                <DeepDive buttonElement={
                                    <Button variant="text">
                                        <Typography variant="executeActionSubtext" sx={{cursor: 'pointer'}}>
                                            Deep Dive
                                        </Typography>
                                    </Button>
                                    }
                                    executionId={actionExecutionId}
                                    selectedActionId={selectedActionId}
                                    setSelectedActionId={setSelectedActionId}
                                    onChildExecutionCreated={onChildExecutionCreated}
                                    definitionId={actionExecutionDetailQuery?.data?.ActionDefinition?.Id || "NA"}
                                    parentProviderInstanceId={getProviderInstanceId()}
                                />
                                
                                <CircularDot />
                                <ExportAsDashboard 
                                    buttonEle={<Button variant="text">
                                        <Typography variant="executeActionSubtext" sx={{cursor: 'pointer'}}>
                                            Export as Dashboard
                                        </Typography>
                                    </Button>}
                                    executionId={actionExecutionId}
                                    definitionName={actionExecutionDetailQuery?.data?.ActionDefinition?.DisplayName || "NA"}
                                />
                                
                            </Box>
                        </Box>
                    </Box>
                    {!cardExpanded && <ActionExecutionSubHeaderMainBox sx={{
                        ...boxFlexSx,
                        p: 2
                    }}>
                        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                            <Typography variant="actionExecutionSubText">
                                <span>Created By : <b>{actionExecutionDetailQuery.data?.ActionInstance?.CreatedBy}</b></span>
                            </Typography>
                            <Typography variant="actionExecutionRunTime">
                                Runtime : {getElapsedTime()}
                            </Typography>
                        </Box>
                        <Box sx={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                            <ViewActionExecutionResultButton variant="contained" sx={{
                                background: "#E4E6EB",
                                border: "1px solid #3EB9FF",
                                borderRadius: "6px"
                            }}
                            onClick={handleResultsToggle}
                            >
                                <Typography variant="actionExecutionRunTime">
                                    View Results
                                </Typography>
                            </ViewActionExecutionResultButton>
                        </Box>
                    </ActionExecutionSubHeaderMainBox>}
                    {cardExpanded && 
                        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', gap: 1}}>
                            <Divider orientation="horizontal" sx={{width: '100%'}} />   
                            {!actionExecutionTerminalState ? (
                                <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 3, alignItems: 'center'}}>
                                    <ExecutionLoadingIndicator />
                                    <Typography>
                                        Executing {actionExecutionDetailQuery?.data?.ActionDefinition?.DisplayName}. Please Wait
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                {actionExecutionError ? (
                                    <Box sx={{p: 2}}>
                                    <ViewFailedActionExecution actionExecutionDetail={actionExecutionDetailQuery?.data || {}}/>
                                    </Box>
                                ): <SaveAndBuildChartContextProvider>
                                        <SaveAndBuildChartsFromExecution 
                                            executionId={actionExecutionDetailQuery?.data?.ActionExecution?.Id!}
                                            onChildExecutionCreated={onChildExecutionCreated}
                                            definitionId={actionExecutionDetailQuery?.data?.ActionDefinition?.Id}
                                            onDeepDiveActionSelected={onDeepDiveActionSelected}
                                        />
                                    </SaveAndBuildChartContextProvider>}
                                
                                </>
                            )}
                        </Box>
                    }
                    
                </ActionExecutionStyledMainCard>
                {props.displayPostProcessed && fetchChildActionExecutionQuery.data && <ReactQueryWrapper {...fetchChildActionExecutionQuery}>
                    {() => <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', overflow: 'auto', gap: 2}}>
                        {postProcessedAction?.map(ae => (
                            <>
                            <Divider sx={{width: '100%'}} orientation="horizontal"/>
                            <ActionExecutionDetailsNew actionExecutionId={ae.Id!} displayPostProcessed={false}/>
                            </>
                        ))}
                    </Box>}
                </ReactQueryWrapper>}

                {childActionExecutionId && <ActionExecutionDetailsNew actionExecutionId={childActionExecutionId}/>}
            </Box>}
            
        </ReactQueryWrapper>
    )
}

export default ActionExecutionDetailsNew