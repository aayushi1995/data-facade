
import { ReactQueryWrapper } from "@/components/ReactQueryWrapper/ReactQueryWrapper"
import useActionExecutionDetails from "@/hooks/actionOutput/useActionExecutionDetails"
import { UserOutlined } from "@ant-design/icons"
import { ReactComponent as DeepDiveIcon } from '@assets/icons/scuba_diving.svg'
import { ReactComponent as BotIcon } from '@assets/icons/smart_toy.svg'
import { Button, Skeleton, Space } from "antd"
import React from "react"
import { FlexBox } from "../ChatFooter/ChatFooter.styles"
import { ActionCard, StyledActionOutput, StyledIcon } from "./ActionOutput.styles"
import FailedActionOutput from "./failedActionOutput"
import SuccessActionOutput from "./successActionOutput"
import { OutputContainer } from "./successActionOutput.styles"



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
    showFooter?:boolean
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
        onTrainModel
    } = useActionExecutionDetails(props)



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
                                                            title={actionExecutionDetailQuery.data?.ActionInstance?.Name || ""}
                                                            time={"Run Time : "+getElapsedTime()}
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
                            {props?.showFooter && <StyledActionOutput isBot={actionExecutionDetailQuery?.data?.ActionDefinition?.CreatedBy === "AI"}>
                                <StyledIcon> 
                                    <Space size={6}>
                                        {actionExecutionDetailQuery?.data?.ActionDefinition?.CreatedBy === "AI"
                                        ? <><BotIcon/> AI Insight</> 
                                        : <><UserOutlined /> {actionExecutionDetailQuery?.data?.ActionDefinition?.CreatedBy}</>}
                                    </Space> 
                                </StyledIcon> 
                                <Button type="link" style=  {{marginRight:'10px'}} onClick={() => handleDeepDiveData(actionExecutionDetailQuery,actionExecutionDetailQuery.data?.ActionInstance?.Name)}>Check Code</Button><Button type="link" >Ask for review</Button>
                                {actionExecutionDetailQuery?.data?.ActionDefinition?.CreatedBy === "AI" && <Button onClick={onTrainModel} type="link">Train Model</Button>}
                            </StyledActionOutput>}  
                    </OutputContainer>
                </>
                {props.handleDeepDive && <Button icon={<DeepDiveIcon />} type="default" onClick={() => handleDeepDiveData(actionExecutionDetailQuery,actionExecutionDetailQuery.data?.ActionInstance?.Name)} size="large" style={{display: 'flex',margin: '0px 20px',width: '150px',alignItems: 'center',justifyContent: 'space-around'}} >DeepDive</Button>}
            </FlexBox>
        </ReactQueryWrapper>
    )
}

export default ActionOutput