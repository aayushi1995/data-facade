
import { ReactQueryWrapper } from "@/components/ReactQueryWrapper/ReactQueryWrapper"
import useActionExecutionDetails from "@/hooks/actionExecution/useActionExecutionDetails"
import { Badge, Button, Card, Col, Row, Skeleton, Tag, Typography } from "antd"
import React, { useState } from "react"
import styled from "styled-components"
import FailedActionOutput from "./failedActionOutput"
import SuccessActionOutput from "./successActionOutput"
import { ReactComponent as DeepDiveIcon} from '@assets/icons/scuba_diving.svg'
import { FlexBox } from "../ChatFooter/ChatFooter.styles"

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
    handleDeepDive?: (data:any) => void
    onlyTable?:boolean
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


    const handleDeepDiveData = (data:any) => {
        props.handleDeepDive && props.handleDeepDive(data)
    }

    return ( 
        <ReactQueryWrapper  {...actionExecutionDetailQuery}>
            <FlexBox style={{alignItems:'center'}}>
                <>
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
                                                    <>
                                                    <SuccessActionOutput
                                                        ActionExecution={actionExecutionDetailQuery?.data?.ActionExecution!}
                                                        ActionDefinition={actionExecutionDetailQuery?.data?.ActionDefinition!}
                                                        ActionInstance={actionExecutionDetailQuery?.data?.ActionInstance!}
                                                        showCharts={false}
                                                    />
                                                    </>
                                                    
                                                
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
                </>
                <Button icon={<DeepDiveIcon />} type="default" onClick={() => handleDeepDiveData(actionExecutionDetailQuery)} size="large" style={{display: 'flex',margin: '0px 20px',width: '150px',alignItems: 'center',justifyContent: 'space-around'}}>DeepDive</Button>
            </FlexBox>
        </ReactQueryWrapper>
    )
}

export default ActionOutput