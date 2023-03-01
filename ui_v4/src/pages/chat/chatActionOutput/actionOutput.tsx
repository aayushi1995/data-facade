
import { ReactQueryWrapper } from "@/components/ReactQueryWrapper/ReactQueryWrapper"
import useActionExecutionDetails from "@/hooks/actionOutput/useActionExecutionDetails"
import { ReactComponent as DeepDiveIcon } from '@assets/icons/scuba_diving.svg'
import { Badge, Button, Card, Col, Row, Skeleton, Space, Tag, Typography } from "antd"
import React from "react"
import styled from "styled-components"
import { FlexBox } from "../ChatFooter/ChatFooter.styles"
import { ActionCard, StyledActionOutput, StyledIcon } from "./ActionOutput.styles"
import FailedActionOutput from "./failedActionOutput"
import SuccessActionOutput from "./successActionOutput"
import { OutputContainer } from "./successActionOutput.styles"
import {ReactComponent as BotIcon } from '@assets/icons/smart_toy.svg'



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
    handleDeepDive?: (data:any, title?:string) => void
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

    console.log(actionExecutionDetailQuery?.data?.ActionInstance?.CreatedBy)

    const handleDeepDiveData = (data:any, title:any) => {
        props.handleDeepDive && props.handleDeepDive(data, title)
    }

    return ( 
        <ReactQueryWrapper  {...actionExecutionDetailQuery}>
            <FlexBox style={{alignItems:'center'}}>
                <>
                <OutputContainer> 
                        {/* <Badge.Ribbon text={actionExecutionDetailQuery.data?.ActionExecution?.Status}> */}
                            <ActionCard headStyle={{ border: 0 }} size="small">
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
                                                            title={actionExecutionDetailQuery.data?.ActionInstance?.Name}
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
                            <StyledActionOutput isBot={actionExecutionDetailQuery?.data?.ActionInstance?.CreatedBy === "Bot"}>
                                <StyledIcon> 
                                    <Space size={6}>
                                        {actionExecutionDetailQuery?.data?.ActionInstance?.CreatedBy === "Bot"
                                        ? <><BotIcon/> AI Insight</> 
                                        : <><BotIcon/> {actionExecutionDetailQuery?.data?.ActionInstance?.CreatedBy}</>}
                                    </Space> 
                                </StyledIcon> 
                                <Button type="link" disabled={actionExecutionError} style={{marginRight:'10px'}} onClick={() => handleDeepDiveData(actionExecutionDetailQuery,actionExecutionDetailQuery.data?.ActionInstance?.Name)}>Check Code</Button><Button type="link" >Ask for review</Button>
                            </StyledActionOutput>
                            </OutputContainer>
                </>
                {props.handleDeepDive && <Button disabled={actionExecutionError} icon={<DeepDiveIcon />} type="default" onClick={() => handleDeepDiveData(actionExecutionDetailQuery,actionExecutionDetailQuery.data?.ActionInstance?.Name)} size="large" style={{display: 'flex',margin: '0px 20px',width: '150px',alignItems: 'center',justifyContent: 'space-around'}} >DeepDive</Button>}
            </FlexBox>
        </ReactQueryWrapper>
    )
}

export default ActionOutput