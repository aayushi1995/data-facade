
import { ReactQueryWrapper } from "@/components/ReactQueryWrapper/ReactQueryWrapper"
import useActionExecutionDetails from "@/hooks/actionExecution/useActionExecutionDetails"
import { Badge, Card, Col, Row, Skeleton, Tag, Typography } from "antd"
import React from "react"
import styled from "styled-components"
import FailedActionOutput from "./failedActionOutput"
import SuccessActionOutput from "./successActionOutput"

const ActionCard = styled(Card)`
    border-radius: 0px 8px 8px 8px;
    border: 0.87659px solid #D1D5DB;
    margin-bottom:20px;
`

export interface ActionExecutionDetailProps {
    actionExecutionId: string,
    childActionExecutionId?: string,
    showDescription?: boolean,
    showParametersOnClick?: boolean,
    fromTestAction?: boolean,
    fromDeepDive?: boolean,
    onExecutionCreate?: (actionExecutionId: string) => void,
    displayPostProcessed?: boolean
    showChart?: boolean
}



const ActionOutput = (props: ActionExecutionDetailProps) => {

    const {
        actionExecutionDetailQuery,
        actionExecutionError,
        actionExecutionTerminalState,
        getElapsedTime,
        childActionExecutionId,
        fetchChildActionExecutionQuery,
        postProcessedAction,
    } = useActionExecutionDetails(props)
    return (
        <ReactQueryWrapper  {...actionExecutionDetailQuery}>
            <Row>
                <Col span={8}>
                    <Badge.Ribbon text={actionExecutionDetailQuery.data?.ActionExecution?.Status}>
                        <ActionCard headStyle={{ border: 0 }} size="small" title={<><Typography.Text ellipsis={true} strong>{actionExecutionDetailQuery.data?.ActionInstance?.Name}</Typography.Text></>}>
                            <Row gutter={36}>
                                <Col>
                                    <Typography.Paragraph>Created by : <Tag color="green">{actionExecutionDetailQuery.data?.ActionInstance?.CreatedBy}</Tag></Typography.Paragraph>
                                </Col>

                                <Col>
                                    <Typography.Paragraph>Runtime :  <Tag color="blue">{getElapsedTime()}</Tag></Typography.Paragraph>
                                </Col>

                            </Row>



                            {
                                !actionExecutionTerminalState ?
                                    <Skeleton active />
                                    :
                                    <React.Fragment>
                                        {
                                            actionExecutionError ?
                                                <FailedActionOutput actionExecutionDetail={actionExecutionDetailQuery?.data || {}} />
                                                :
                                                <SuccessActionOutput
                                                    ActionExecution={actionExecutionDetailQuery?.data?.ActionExecution!}
                                                    ActionDefinition={actionExecutionDetailQuery?.data?.ActionDefinition!}
                                                    ActionInstance={actionExecutionDetailQuery?.data?.ActionInstance!}
                                                    showCharts={false}
                                                />
                                        }
                                    </React.Fragment>
                            }

                            {
                                fetchChildActionExecutionQuery.data &&
                                <ReactQueryWrapper {...fetchChildActionExecutionQuery}>
                                    {
                                        postProcessedAction?.map(value => <ActionOutput actionExecutionId={value?.Id!} displayPostProcessed={false} />)
                                    }
                                </ReactQueryWrapper>
                            }
                            {childActionExecutionId && <ActionOutput actionExecutionId={childActionExecutionId} />}
                        </ActionCard>
                    </Badge.Ribbon>
                </Col>
            </Row>


        </ReactQueryWrapper>
    )
}

export default ActionOutput