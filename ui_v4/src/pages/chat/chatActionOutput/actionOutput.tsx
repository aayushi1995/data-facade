
import { ReactQueryWrapper } from "@/components/ReactQueryWrapper/ReactQueryWrapper"
import useActionExecutionDetails from "@/hooks/actionOutput/useActionExecutionDetails"
import { ui_v3_url } from "@/settings/config"
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined, UserOutlined } from "@ant-design/icons"
import { ReactComponent as DeepDiveIcon } from '@assets/icons/scuba_diving.svg'
import { ReactComponent as BotIcon } from '@assets/icons/smart_toy.svg'
import { Button, Skeleton, Space } from "antd"
import React from "react"
import ChatBlock from "../ChatBlock"
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
    showFooter?:boolean,
    preMessage?:string
    handleLikeDislike?: (value: boolean, messageId: string) => void,
    messageId?: string,
    messageFeedback?: boolean
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

    const handleShowReference = () => {
        window.open(`${ui_v3_url}/application/edit-action/${actionExecutionDetailQuery?.data?.ActionDefinition?.Id}`)
    }

    return ( 
        <ReactQueryWrapper  {...actionExecutionDetailQuery}>
            <FlexBox style={{alignItems:'center'}}>
                <>
                <OutputContainer> 
                    <Space style={{marginBottom: '20px'}}>
                        <ChatBlock id={"Dummy Message"} key={"Dummy Message" + 'Chat'} message={props?.preMessage} type={'text'} time={new Date().getTime()} from="system"/>
                    </Space>
                        
                        {/* <div>{props?.preMessage}</div> */}
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
                            {props?.showFooter && 
                            <div style={{display: 'flex', gap: 3, alignItems: 'center'}}>
                            <StyledActionOutput isBot={actionExecutionDetailQuery?.data?.ActionDefinition?.UpdatedBy === "AI"}>
                                <StyledIcon> 
                                    <Space size={6}>
                                        {actionExecutionDetailQuery?.data?.ActionDefinition?.UpdatedBy === "AI"
                                        ? <><BotIcon/> AI Insight</> 
                                        : <><UserOutlined /> {actionExecutionDetailQuery?.data?.ActionDefinition?.UpdatedBy}</>}
                                    </Space> 
                                </StyledIcon> 
                                <Button type="link" style=  {{marginRight:'10px'}} onClick={() => handleDeepDiveData(actionExecutionDetailQuery,actionExecutionDetailQuery.data?.ActionInstance?.Name)}>Check Code</Button><Button type="link" onClick={handleShowReference}>Reference</Button>
                                {actionExecutionDetailQuery?.data?.ActionDefinition?.UpdatedBy === "AI" && <Button onClick={onTrainModel} type="link"> Accept Answer </Button>}
                            </StyledActionOutput>
                            <Button icon={props.messageFeedback ? <LikeFilled /> : <LikeOutlined />} onClick={() => props?.handleLikeDislike?.(true, props.messageId || "")}/>
                            <Button icon={props.messageFeedback === false ? <DislikeFilled /> : <DislikeOutlined />} onClick={() => props?.handleLikeDislike?.(false, props.messageId || "")}/>

                            </div>}   
                    </OutputContainer>
                </>
                {props.handleDeepDive && actionExecutionTerminalState && <Button icon={<DeepDiveIcon />} type="default" onClick={() => handleDeepDiveData(actionExecutionDetailQuery,actionExecutionDetailQuery.data?.ActionInstance?.Name)} size="large" style={{display: 'flex',margin: '0px 20px',width: '150px',alignItems: 'center',justifyContent: 'space-around'}} >DeepDive</Button>}
            </FlexBox>
        </ReactQueryWrapper>
    )
}

export default ActionOutput