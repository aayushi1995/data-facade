
import { ActionExecutionIncludeDefinitionInstanceDetailsResponse } from "@/generated/interfaces/Interfaces"
import { Card, Space, Typography } from "antd"

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
    const { actionExecutionDetail } = props;
    const actionOutput = JSON.parse(actionExecutionDetail?.ActionExecution?.Output || "{}")
    const failureMessage = getFailureMessage(actionOutput)
    const script = actionOutput?.script
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
                <Typography.Text type="danger" code>
                    {failureMessage as string}
                </Typography.Text>
            </Card>
        </Space>
    )
}

export default FailedActionOutput