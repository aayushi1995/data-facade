/* eslint-disable react-hooks/exhaustive-deps */
import { initiateChat, startConversation } from "@/actions/chat.actions";
import Loader from "@/components/Loader";
import AppContext from "@/contexts/AppContext";
import { getLocalStorage } from "@/utils";
import { Alert, Col, Row, Spin } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ChatBlock from "./ChatBlock";
import { IChatMessage, IChatResponse } from "./ChatBlock/ChatBlock.type";
import ChatFooter from "./ChatFooter";

const InitiateChat = () => {
    const appContext: any = useContext(AppContext);
    const { chatId } = useParams();
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(false);
    const [messages, setMessages] = useState<IChatMessage[] | undefined>()
    const [showActionOutput, setShowActionOutput] = useState(false)

    const chatFooterRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    const scrollToBottom = () => {
        chatFooterRef?.current?.scrollIntoView({ behavior: "smooth" })
    }

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

    const handleConversation = (message?: any, user?: any, type?: string) => {
        let temp: IChatMessage = {
            id: new Date().toTimeString(),
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
                for(let i=0; i < response.length;i++){
                    handleBOTMessage(response[i])
                }
                
            }).catch(error => {
                console.log('error', error)
                handleConversation('Something went wrong', 'system', 'error')
            });
        }
    }

    const handleBOTMessage = (messageBody: IChatResponse) => {
        const messageType = messageBody ? messageBody.MessageType : 'error';
        setTimeout(() => {
            setLoadingMessage(false)
            switch (messageType) {
                case 'text': {
                    return handleConversation(JSON.stringify(messageBody?.MessageContent?.text), 'system');
                }
                case 'action_output': {
                    return handleActionOutput(messageBody)
                }
                case 'error': {
                    return handleConversation(messageBody?.MessageContent || 'Something went wrong', 'system', 'error')
                }
                default: break;
            }
            scrollToBottom();

        }, 1000)



    }

    const handleActionOutput = (messageBody: IChatResponse) => {
        setShowActionOutput(true)
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
                                    {messages?.map(({ id, type, ...props }: IChatMessage) =>
                                        <ChatBlock id={id} key={id + 'Chat'} {...props} type={type}/>
                                    )}
                                    {loadingMessage && <Spin />}
                                    { showActionOutput && <div>Action output component will go there</div> }

                                    <ChatFooter scrollToBottom={scrollToBottom} handleSend={handleConversation} loading={loadingMessage}/>

                                </Col>
                        }
                    </Row>

            }
        </React.Fragment>
    )

}

export default InitiateChat


