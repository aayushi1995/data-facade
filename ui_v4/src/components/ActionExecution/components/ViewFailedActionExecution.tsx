import { ActionExecutionIncludeDefinitionInstanceDetailsResponse } from "@/generated/interfaces/Interfaces"

export interface ResolvedActionExecutionProps {
    actionExecutionDetail: ActionExecutionIncludeDefinitionInstanceDetailsResponse,
    hideParams?: boolean
}

const getFailureMessage = (actionOutput: any): Object => {
    try {
        return actionOutput.Message[0]
    } catch (e) {
        return actionOutput.Message
    }
}

const divCss = {
    background: "#F4F5F7",
    width:'100%',
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25), 0px 0px 1px rgba(0, 0, 0, 0.25)",
    overflow:'scroll',
    display: 'flex',
    gap: 2,
    borderRadius:'10px'
}

const ViewFailedActionExecution = (props: ResolvedActionExecutionProps) => {
    const { actionExecutionDetail } = props
    const actionOutput = JSON.parse(actionExecutionDetail?.ActionExecution?.Output || "{}")
    const failureMessage = getFailureMessage(actionOutput)
    const script = actionOutput?.script
    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 2}}>
            {/* <div  style={{display: 'flex'}}>
                <span  style={{fontSize: '2.5vh'}}>
                    Input Parameter
                </span>
            </div> */}
            {/* <div>
                <ViewConfiguredParameters
                    parameterDefinitions={actionExecutionDetail?.ActionParameterDefinitions||[]}
                    parameterInstances={actionExecutionDetail?.ActionParameterInstances||[]}
                />
            </div> */}
            <div style={{width:'100%', display: "flex", flexDirection: "column", gap: 1 }}>
                <div>
                    <div style={{
                       ...divCss,
                       flexDirection: 'column'
                    }}>
                        {!!script ? (
                            <div style={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                <span  style={{fontSize: '2.5vh'}}>
                                    SCRIPT
                                </span>
                                <div style={{padding: 1, backgroundColor:'#FFFFFF',borderRadius:'10px'}}>
                                    <span style={{fontSize: '1.5vh', whiteSpace: 'pre-line'}}>
                                        {(script || "NA")}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        
                        <div style={{display: 'flex', gap: 1, flexDirection: 'column'}}>
                            <span style={{fontSize: '2.5vh',color:'#f70505'}}>
                                ERROR
                            </span>
                            <div style={{padding: 1,backgroundColor:'#FFFFFF',borderRadius:'10px'}}>
                                <span style={{fontSize: '1.5vh', whiteSpace: 'pre-line'}}>
                                    {failureMessage as string}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ViewFailedActionExecution