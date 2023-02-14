/* eslint-disable react-hooks/exhaustive-deps */
import { initiateChat, startConversation } from "@/actions/chat.actions";
import Loader from "@/components/Loader";
import AppContext from "@/contexts/AppContext";
import { DataContext, SetDataContext } from "@/contexts/DataContextProvider";
import { getLocalStorage } from "@/utils";
import { Alert, Col, Row, Spin } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageWrapper } from "./Chat.styles";
import ActionOutput from "./chatActionOutput/actionOutput";
import ChatBlock from "./ChatBlock";
import { IChatMessage, IChatResponse } from "./ChatBlock/ChatBlock.type";
import ChatFooter from "./ChatFooter";

const defaultBotMessage = (username:string): IChatMessage => {
    return {
        id: new Date().toTimeString(),
        message: `Welcome ${username} ! What insight do you need ?`,
        time: new Date().getTime(),
        from: 'system',
        username: 'Data-Facade',
        type:'text'
    }
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

    const chatFooterRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    const scrollToBottom = () => {
        chatFooterRef?.current?.scrollIntoView({ behavior: "smooth" })
    }

    // function that calls setChatData reducer to store message data in context
    const persistState = () => {
        messages !== undefined && setDataContext({
            type: "setChatData",
            payload: {
                chatData: {
                    messages: messages,
                    executionId: executionId
                }
            }
        })
    }

    //persist the chat if there is any chatData in the DataProvider
    useEffect(() => {
        setMessages(dataContext?.chatData?.messages || [defaultBotMessage(appContext?.userName)])
        setExecutionId(dataContext?.chatData?.executionId || [])
    }, [])


    // persists data whenever messages are added
    useEffect(() => {
        return (() => {
            persistState()

        })
    }, [messages])


    useEffect(() => {
        if (chatId) {
            if (chatId !== getLocalStorage('chat_id')) {
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

    const handleConversation = (message?: any, user?: any, type?: string, responseID?: string) => {
        console.log('responseID', responseID)
        let temp: IChatMessage = {
            id: responseID ? responseID : new Date().toTimeString(),
            message: message,
            time: new Date().getTime(),
            from: user,
            username: user === 'system' ? 'Data-Facade' : appContext?.userName,
            type: type ? type : 'text'
        }

        setMessages(messages => messages ? [...messages, temp] : [temp])

        if (user === "user") {
            setLoadingMessage(true)
            startConversation(chatId, appContext.userName, message).then(response => {
                if (response.length > 0) {
                    for (let i = 0; i < response.length; i++) {
                        handleBOTMessage(response[i])
                    }
                }
                else{
                    handleConversation('No output found for this message :(', 'system', 'error')
                }


            }).catch(error => {
                console.log('error', error)
                
            });
        }
    }

    const handleBOTMessage = (messageBody: IChatResponse) => {
        const messageType = messageBody ? messageBody.MessageType : 'error';
        console.log('messageType', messageType)
        setTimeout(() => {
            setLoadingMessage(false)
            switch (messageType) {
                case 'text': {
                    return handleConversation(JSON.stringify(messageBody?.MessageContent?.text), 'system', 'text', messageBody?.Id);
                }
                case 'action_output': {
                    return handleActionOutput(messageBody)
                }
                case 'error': {
                    return handleConversation(messageBody?.MessageContent, 'system', 'error', messageBody?.Id)
                }
                default: break;
            }
            scrollToBottom();

        }, 1000)



    }

    const handleActionOutput = (messageBody: IChatResponse | any) => {
        const actionExecutionId = messageBody?.MessageContent ? JSON.parse(messageBody?.MessageContent)['executionId'] : null
        handleConversation(JSON.stringify(messageBody?.MessageContent?.text), 'system', 'action_output', messageBody?.Id);
        console.log('actionExecutionId', messageBody)
        if (actionExecutionId) {
            setShowActionOutput(true)
            setExecutionId((prevState: any) => ({
                ...prevState,
                [messageBody?.Id]: actionExecutionId
            }))
        }
    }

    return (
        <React.Fragment>
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
                                        {messages?.map(({ id, type, ...props }: IChatMessage) =>
                                            <>
                                                {type !== "action_output" && <ChatBlock id={id} key={id + 'Chat'} {...props} type={type} />}
                                                {(Object.keys(executionId).length > 0 || showActionOutput) && <ActionOutput actionExecutionId={executionId[id]} />}
                                            </>
                                        )}
                                        {loadingMessage && <Spin />}


                                    </MessageWrapper>


                                    <ChatFooter scrollToBottom={scrollToBottom} handleSend={handleConversation} loading={loadingMessage} />

                                </Col>
                        }
                    </Row>

            }
        </React.Fragment>
    )

}

export default InitiateChat
