
import dataManager from "@/api/dataManager"
import { ActionExecutionIncludeDefinitionInstanceDetailsResponse } from "@/generated/interfaces/Interfaces"
import { Button, Card, Space, Typography } from "antd"
import React from "react"
import { useMutation } from "react-query"

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

const FailedActionOutput = (props: ResolvedActionExecutionProps) => {
    const [errorDescription, setErrorDescription] = React.useState<string | undefined>()
    const { actionExecutionDetail } = props;
    const actionOutput = JSON.parse(actionExecutionDetail?.ActionExecution?.Output || "{}")
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const failureMessage = getFailureMessage(actionOutput)
    const script = actionOutput?.script
    const traceId = actionOutput?.traceId

    const fetchErrorDescriptionMutation = useMutation("GetErrorDescription", 
        (config: {errorMessage: string}) => {
            const fetchedDataManager = dataManager.getInstance as {getErrorDescription: Function}

            return fetchedDataManager.getErrorDescription(config.errorMessage)
        }
    )

    const onGetErrorDescription = () => {
        fetchErrorDescriptionMutation.mutate({
            errorMessage: failureMessage as string
        }, {
            onSuccess: (data) => {
                const casetedData = data as {ErrorDescription: string}
                setErrorDescription(casetedData.ErrorDescription)
            }
        })
        
    }

    React.useEffect(() => {
        if(buttonRef.current) {
            buttonRef.current.click()
        }
    }, [props])

    return (
        <Space direction="vertical" style={{width:'100%'}}>
            {
                script &&
                <Card size="small" bordered={false} title="Script">
                    <Typography.Text code>
                        {(script || "NA")}
                    </Typography.Text>
                </Card>
            }
            <Card size="small" title="Error">
                <Typography.Text style={{whiteSpace: 'pre-line'}} code type="danger">
                    {failureMessage as string}
                </Typography.Text>
                <Typography>
                    Request Id: {traceId || "Not found"}
                </Typography>
            </Card>
            {!!errorDescription ? <Typography>
                {errorDescription}
            </Typography> : 
            <>
                {fetchErrorDescriptionMutation.isLoading ? <>Explaining Error...</> : <Button ref={buttonRef} onClick={onGetErrorDescription}>
                    Explain this error
                </Button>}
                
            </>
            }
            
        </Space>
    )
}

export default FailedActionOutput