/* eslint-disable react-hooks/exhaustive-deps */
import { initiateChat, startConversation } from "@/actions/chat.actions";
import Loader from "@/components/Loader";
import AppContext from "@/contexts/AppContext";
import { DataContext, SetDataContext } from "@/contexts/DataContextProvider";
import { ActionDefinitionDetail, ActionInstanceWithParameters } from "@/generated/interfaces/Interfaces";

import { getLocalStorage } from "@/utils";
import { ChatProvider } from '@contexts/ChatContext/index';
import ReactSplit from '@devbookhq/splitter';
import { Alert, Col, List, Row, Spin } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatWrapperStyled, DeepDiveWrapperStyled, MainWrapper, MessageWrapper, RecommendedActionsMainDiv, RecommendedActionsMainListItem } from "./Chat.styles";
import ChatBlock from "./ChatBlock";
import { ConfirmationPayloadType, IChatMessage, IChatResponse } from "./ChatBlock/ChatBlock.type";
import ChatFooter from "./ChatFooter";
import { FlexBox } from "./ChatFooter/ChatFooter.styles";
import ActionDefination from "./chatActionDefination/actionDefination";
import DeepDiveTabs from "./chatActionOutput/DeepDive/DeepDiveTabs";
import ActionOutput from "./chatActionOutput/actionOutput";
import ChatComponentIconTabExperience from "./chatActionOutput/chatDeepDiveTab";
import ChatTableInput from "./chatTableInput";


const defaultBotMessage = (username: string): IChatMessage => {
   
    return {
        id: new Date().toTimeString(),
        message: `Welcome ${username.split(' ')[0]} ! What insight do you need ?`,
        time: new Date().getTime(),
        from: 'system',
        username: 'DataFacade',
        type: 'text'
    }
}

type ActionMessageContent = {actionInstanceWithParameterInstances: ActionInstanceWithParameters, actionDefinitionDetail?: ActionDefinitionDetail}

export type TableInputContent = {tableId?: string, prompt: string}


const MessageOutputs = ({ messages, executionId, loading, showActionOutput, actionDefinitions, handleConversation, handleDeepDive, tableInputs }: any ) => {
    const chatWrapperRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    useEffect(() => {
        chatWrapperRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleActionInstanceSubmit = (messageContent: ActionInstanceWithParameters, type: string) => {
        handleConversation({actionInstanceWithParameterInstances: messageContent}, 'user', type, undefined, true)
    }

    const onTableSelected = (tableId: string, prompt: string) => {
        handleConversation({tableId: tableId, prompt: prompt}, 'user', 'table_input', undefined, true)
    }

    return (
        <div>
            {messages?.map(({ id, type, ...props }: IChatMessage) =>
                <React.Fragment key={id}>
                    {(type === "text" || type === "error") && <ChatBlock id={id} key={id + 'Chat'} {...props} type={type} />}
                    {type === "recommended_actions" && 
                        <ChatBlock id={id} key={id + 'Chat'} {...props} type={type}>
                            <RecommendedActionsInput recommendedActions={props?.message} handleConversation={handleConversation}/>
                        </ChatBlock>
                    }
                    {type === 'confirmation' &&
                        <ChatBlock id={id} key={id + 'Chat'} {...props} type={type}>
                            <ConfirmationInput {...props?.message}/>
                        </ChatBlock>
                    }
                    {type === "action_output" && (Object.keys(executionId).length > 0 || showActionOutput) && <ActionOutput handleDeepDive={handleDeepDive} actionExecutionId={executionId[id]} />}
                    {type === "action_instance" && (Object.keys(actionDefinitions).length > 0) && actionDefinitions[id] && <ActionDefination  onSubmit={handleActionInstanceSubmit} ActionDefinitionId={(actionDefinitions[id] as ActionMessageContent).actionDefinitionDetail?.ActionDefinition?.model?.Id!} ExistingModels={(actionDefinitions[id] as ActionMessageContent).actionInstanceWithParameterInstances}/>}
                    {type === "table_input" && (Object.keys(tableInputs).length > 0 && tableInputs[id] && 
                        <>
                        <ChatBlock id={id} key={id + 'chat'} {...props} type={'text'} message={"Looks like a new question. Please select a table to answer it better."}/>
                        <ChatTableInput onChange={onTableSelected} prompt={tableInputs[id].prompt} selectedTableId={tableInputs[id].tableId}/>
                        </>
                    )}
                </React.Fragment>
            )}
            {loading && <Spin />}

            <div ref={chatWrapperRef} />
        </div>
    )
}


const InitiateChat = () => {

    // central data provider context
    const setDataContext = useContext(SetDataContext);
    const dataContext = useContext(DataContext);
    const appContext: any = useContext(AppContext);

    const { chatId } = useParams();
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(false);
    const [messages, setMessages] = useState<IChatMessage[] | undefined>([])
    const [showActionOutput, setShowActionOutput] = useState(false)
    const [executionId, setExecutionId]: any = useState({})
    const [actionDefinitions, setActionDefinitions] = useState<Record<string, ActionMessageContent>>({})
    const [tableInnputIds, setTableInputIds] = useState<Record<string, TableInputContent>>({})
    const [showDeepDive, setShowDeepDive] = useState(false)
    const [deepdiveData, setDeepDiveData] = useState<any | undefined>()

    // function that calls setChatData reducer to store message data in context
    const persistState = () => {
        messages !== undefined && setDataContext({
            type: "setChatData",
            payload: {
                chatData: {
                    messages: messages,
                    executionId: executionId,
                    chatId: chatId,
                }
            }
        })
    }

    //persist the chat if there is any chatData in the DataProvider
    useEffect(() => {
        if (chatId) {
            setMessages(dataContext?.chatData[chatId]?.messages || [defaultBotMessage(appContext?.userName)])
            setExecutionId(dataContext?.chatData[chatId]?.executionId || {})
        }

    }, [chatId])


    // persists data whenever messages are added
    useEffect(() => {
        return (() => {
            persistState()

        })
    }, [messages])


    useEffect(() => {
        if (chatId) {
            if (chatId !== getLocalStorage(`chat_${chatId}`)) {
                setIsError(true);
            }
            else {
                setLoading(true)
                initiateChat(chatId, appContext.userName).then(response => {
                    setLoading(false)
                }).catch(err => {
                    setLoading(false);
                    setIsError(true)
                })
            }
        }
    }, [chatId])

    const handleConversation = (message?: any, user?: any, type?: string, responseID?: string, ignoreMessage?: boolean) => {
        let temp: IChatMessage = {
            id: responseID ? responseID : new Date().toTimeString(),
            message: message,
            time: new Date().getTime(),
            from: user,
            username: user === 'system' ? 'DataFacade' : appContext?.userName,
            type: type ? type : 'text'
        }
        
        if(!ignoreMessage) {
            setMessages(messages => messages ? [...messages, {...temp, message: message?.text || message?.error}] : [{...temp, message: message?.text}])
        }

        if (user === "user") {
            setLoadingMessage(true)
            startConversation(chatId, appContext.userName, message, type).then(response => {
                if (response.length > 0) {
                    for (let i = 0; i < response.length; i++) {
                        handleBOTMessage(response[i])
                    }
                }
                else {
                    handleConversation('No output found for this message :(', 'system', 'error')
                    setLoadingMessage(false)
                }
            }).catch(error => {
                return handleConversation('I am sorry, it looks like something went wrong on our end.', 'system', 'error',)

            });
        }
    }

    const handleBOTMessage = (messageBody: IChatResponse) => {
        const messageType = messageBody ? messageBody.MessageType : 'error';
        setTimeout(() => {
            setLoadingMessage(false)
            switch (messageType) {
                case 'text': {
                    return handleConversation(JSON.stringify(messageBody?.MessageContent?.text), 'system', 'text', messageBody?.Id);
                }
                case 'action_output': {
                    return handleActionOutput(messageBody)
                }
                case 'action_instance': {
                    return handleActionDefinition(messageBody)
                }
                case 'error': {
                    return handleConversation(JSON.parse(messageBody?.MessageContent)?.error, 'system', 'error', messageBody?.Id)
                }
                case 'recommended_actions': {
                    return handleRecommendedActions(messageBody)
                }

                case 'confirmation': {
                    return handleConfirmationActions(messageBody)
                }
                case 'table_input': {
                    return handleTableInput(messageBody)
                }

                default: break;
            }

        }, 1000)
    }

    const handleConfirmationActions = (messageBody: IChatResponse) => {
        const confirmations = messageBody?.MessageContent as ConfirmationPayloadType
        handleConversation(confirmations, 'system', 'confirmation', messageBody?.Id)
    }

    const handleRecommendedActions = (messageBody: IChatResponse) => {
        const recommendedActions = messageBody?.MessageContent as ActionDefinitionDetail[]
        handleConversation(recommendedActions, 'system', 'recommended_actions', messageBody?.Id)
    }

    const handleActionOutput = (messageBody: IChatResponse | any) => {
        const actionOutputId = messageBody?.MessageContent ? JSON.parse(messageBody?.MessageContent)['executionId'] : null
        handleConversation(JSON.stringify(messageBody?.MessageContent?.text), 'system', 'action_output', messageBody?.Id);
        if (actionOutputId) {
            setShowActionOutput(true)
            setExecutionId((prevState: any) => ({
                ...prevState,
                [messageBody?.Id]: actionOutputId
            }))
        }
    }

    const handleTableInput = (messageBody: IChatResponse) => {
        const messageContent =  JSON.parse(messageBody?.MessageContent) as TableInputContent
        handleConversation(messageBody, 'system', 'table_input', messageBody?.Id)

        setTableInputIds(prevState => ({
            ...prevState,
            [messageBody.Id!]: messageContent
        }))

    }

    
    const handleActionDefinition = (messageBody: IChatResponse) => {
        const messageContent = JSON.parse(messageBody.MessageContent) as ActionMessageContent
        handleConversation(messageBody, 'system', 'action_instance', messageBody?.Id)

        setActionDefinitions(prevState => ({
            ...prevState,
            [messageBody.Id!]: messageContent
        }))

    }

    const handleDeepDive = (data:any) => {
        handleTerminalClick()
        setShowDeepDive(true)
        setDeepDiveData(data)
    }

    const handleChatClick = () => {
        setShowDeepDive(false)
        setSize([96,4])
    }

    const handleTerminalClick = () => {
        setShowDeepDive(true)
        setSize([60,40])
    }

    const [size, setSize] = useState([96,4])


    return (
        
       <ChatProvider>
            <MainWrapper>
                <ReactSplit 
                    initialSizes={[...size]}>
                    <ChatWrapperStyled>
                        {
                            isError ? <Alert
                                message="Error!!"
                                description="The chat session is not matching. Please initiate the chat again"
                                type="error"
                            />
                                :
                                <Row>
                                    {
                                        loading ?
                                            <Loader />
                                            :
                                            <Col sm={24}>
                                                <MessageWrapper>
                                                    <MessageOutputs messages={messages} executionId={executionId} loading={loadingMessage} showActionOutput={showActionOutput} handleDeepDive={handleDeepDive} actionDefinitions={actionDefinitions} handleConversation={handleConversation} tableInputs={tableInnputIds} />
                                                </MessageWrapper>
                                                <ChatFooter handleSend={handleConversation} loading={loadingMessage} />
            
                                            </Col>
                                    }
                                </Row>
            
                        }
                    </ChatWrapperStyled>
                    <FlexBox>
                    <ChatComponentIconTabExperience handleChatClick={handleChatClick} handleTerminalClick={handleTerminalClick} showDeepDive={showDeepDive} />
                        <DeepDiveWrapperStyled>
                            <DeepDiveTabs deepdiveData={deepdiveData} />
                        </DeepDiveWrapperStyled>
                    </FlexBox>
                </ReactSplit>
                
            </MainWrapper>
        </ChatProvider>
    )

}

function RecommendedActionsInput(props: {recommendedActions?: ActionDefinitionDetail[], handleConversation?: Function}) {
    const options = (props?.recommendedActions || [])?.map(action => action?.ActionDefinition?.model?.UniqueName)

    const onSelect = (action: ActionDefinitionDetail) => {
        props?.handleConversation?.({text: action?.ActionDefinition?.model?.UniqueName}, "user", "text")
    }

    return (
        <RecommendedActionsMainDiv>
            <h2>Recommended Actions</h2>
            <List
                itemLayout="horizontal"
                dataSource={props?.recommendedActions?.slice(0, 5) || []}
                size="small"
                renderItem={(item) => (
                <RecommendedActionsMainListItem onClick={() => onSelect(item)} className="list-item" style={{ cursor: 'pointer' }}>
                    <List.Item.Meta
                        title={item?.ActionDefinition?.model?.UniqueName || "NA"}
                    />
                </RecommendedActionsMainListItem>
            )}
            />
        </RecommendedActionsMainDiv>
    )
}

function ConfirmationInput(props: ConfirmationPayloadType) {
    const [clicked, setClicked] = React.useState(false)
    console.log(props)
    const handleConfirm = () => {
        setClicked(true)
        props?.onAccept?.()
      };
    
      const handleCancel = () => {
        setClicked(true)
        props?.onReject?.()
      };
    
      return (
        <div className="confirm-dialog">
            <div className="confirm-dialog-content">
            <h2>{props?.header}</h2>
            <p>{props?.moreinfo}</p>
            <div className="confirm-dialog-buttons">
                <button disabled={clicked} onClick={handleConfirm}>Confirm</button>
                <button disabled={clicked} onClick={handleCancel}>Cancel</button>
            </div>
            </div>
        </div>
      );
}


export default InitiateChat
