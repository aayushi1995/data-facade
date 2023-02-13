
import { ReactQueryWrapper } from "../ErrorBoundary/ReactQueryWrapper"
import ViewActionExecutionOutput from "./components/ViewActionExecutionOutput"
import ViewFailedActionExecution from "./components/ViewFailedActionExecution"
import useActionExecutionDetails from "./hooks/useActionExecutionDetails"


export interface ActionExecutionDetailProps {
    actionExecutionId: string,
    childActionExecutionId?: string, 
    showDescription?: boolean, 
    showParametersOnClick?: boolean, 
    fromTestAction?: boolean, 
    fromDeepDive?: boolean,
    onExecutionCreate?: (actionExecutionId: string) => void,
    displayPostProcessed?: boolean
    showChart?:boolean
}

const ActionExecutionDetails = (props: ActionExecutionDetailProps) => {
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

    const divFlexSx = {
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
            {() => <div style={{display: 'flex', flexDirection: 'column', width: '100%', gap: 4}}>
                <div  
                    style={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                        overflow: 'auto'
                    }}
                >
                    <div style={{
                        ...divFlexSx,
                        padding: 2
                    }}>
                        <b onClick={handleResultsToggle} >
                            Expand
                        </b>
                    
                        <div style={{flex: 1, width: '100%', display: 'flex', flexDirection: 'column'}}>
                            <span >
                                {actionExecutionDetailQuery.data?.ActionInstance?.Name}
                            </span>
                            <span>
                                Status : {actionExecutionDetailQuery.data?.ActionExecution?.Status}
                            </span>
                        </div>
                        <div style={{display: 'flex', flex: 1, flexDirection: 'column', width: '100%', height: '100%', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                            {/* <div style={{display: 'flex', gap: 1, alignItems: 'center'}}> */}
                                {/* <DeepDive buttonElement={
                                    <Button variant="text">
                                        <span variant="executeActionSubtext" style={{cursor: 'pointer'}}>
                                            Deep Dive
                                        </span>
                                    </Button>
                                    }
                                    executionId={actionExecutionId}
                                    selectedActionId={selectedActionId}
                                    setSelectedActionId={setSelectedActionId}
                                    onChildExecutionCreated={onChildExecutionCreated}
                                    definitionId={actionExecutionDetailQuery?.data?.ActionDefinition?.Id || "NA"}
                                    parentProviderInstanceId={getProviderInstanceId()}
                                /> */}
                                {/* <ExportAsDashboard 
                                    buttonEle={<Button variant="text">
                                        <span variant="executeActionSubtext" style={{cursor: 'pointer'}}>
                                            Export as Dashboard
                                        </span>
                                    </Button>}
                                    executionId={actionExecutionId}
                                    definitionName={actionExecutionDetailQuery?.data?.ActionDefinition?.DisplayName || "NA"}
                                /> */}
                                
                            {/* </div> */}
                        </div>
                    </div>
                    {!cardExpanded && <div style={{
                        ...divFlexSx
                    }}>
                        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                           {!props?.showChart && <span >
                                <span>Created By : <b>{actionExecutionDetailQuery.data?.ActionInstance?.CreatedBy}</b></span>
                            </span>} 
                            <span>
                                Runtime : {getElapsedTime()}
                            </span>
                        </div>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                            <b  style={{
                                background: "#E4E6EB",
                                border: "1px solid #3EB9FF",
                                borderRadius: "6px"
                            }}
                            onClick={handleResultsToggle}
                            >
                                <span >
                                    View Results
                                </span>
                            </b>
                        </div>
                    </div>}
                    {cardExpanded && 
                        <div style={{display: 'flex', flexDirection: 'column', width: '100%', gap: 1}}>
                            {/* <Divider orientation="horizontal" style={{width: '100%'}} />    */}
                            {!actionExecutionTerminalState ? (
                                <div style={{width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 3, alignItems: 'center'}}>
                                    {/* <ExecutionLoadingIndicator /> */}
                                    <span>
                                        Executing {actionExecutionDetailQuery?.data?.ActionDefinition?.DisplayName}. Please Wait
                                    </span>
                                </div>
                            ) : (
                                <>
                                {actionExecutionError ? (
                                    <div style={{padding: 2}}>
                                    <ViewFailedActionExecution actionExecutionDetail={actionExecutionDetailQuery?.data || {}}/>
                                    </div>
                                ): 
                                <ViewActionExecutionOutput 
                                    ActionExecution={actionExecutionDetailQuery?.data?.ActionExecution!} 
                                    ActionDefinition={actionExecutionDetailQuery?.data?.ActionDefinition!} 
                                    ActionInstance={actionExecutionDetailQuery?.data?.ActionInstance!}
                                    showCharts={false}    />
                                    }
                                        
                                
                                </>
                            )}
                        </div>
                    }
                    
                </div>
                {props.displayPostProcessed && fetchChildActionExecutionQuery.data && <ReactQueryWrapper {...fetchChildActionExecutionQuery}>
                    {() => <div style={{display: 'flex', flexDirection: 'column', width: '100%', overflow: 'auto', gap: 2}}>
                        {postProcessedAction?.map(ae => (
                            <>
                            <ActionExecutionDetails actionExecutionId={ae.Id!} displayPostProcessed={false}/>
                            </>
                        ))}
                    </div>}
                </ReactQueryWrapper>}

                {childActionExecutionId && <ActionExecutionDetails actionExecutionId={childActionExecutionId}/>}
            </div>}
            
        </ReactQueryWrapper>
    )
}

export default ActionExecutionDetails