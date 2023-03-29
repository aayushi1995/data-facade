import dataManager from "@/api/dataManager";
import { Message } from "@/generated/entities/Entities";
import { ActionInstanceWithParameters } from "@/generated/interfaces/Interfaces";
import { labels } from "@/helpers/constant";
import MessageTypes from "@/helpers/enums/MessageTypes";
import { message } from "antd";
import React, { useEffect, useRef } from "react";
import { useMutation, UseMutationResult } from "react-query";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ActionDefination from "../../chatActionDefination/actionDefination";
import ActionOutput from "../../chatActionOutput/actionOutput";
import ChatBlock from "../../ChatBlock";
import { IChatMessage } from "../../ChatBlock/ChatBlock.type";
import ChatTableInput from "../../chatTableInput";
import { SenderPreview } from "../../tableUpload/SenderPreview";
import { LoaderContainer } from "../Chat.styles";
import ChatLoader from "../ChatLoader";
import MultipleTypeMessageComponent from "../chatMultipleMessages";
import ChatTablePropeties from "../chatTableProperties";
import ConfirmationInput from "../ConfirmationInput";
import { ActionMessageContent, TablePropertiesContent } from "../ConfirmationInput/Chat.types";
import RecommendedActionsInput from "../RecommendedActions/RecommendedActions";



const MessageOutputs = ({  handleAddMessage, loading, setLoadingMessage,  handleConversation,  handleDeepDive, handleUpdateMessages, handleBOTMessage }: any ) => {
    const chatWrapperRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const {chatId} = useParams()

    const chats = useSelector((state:any) => state.chats)

    const messages = chatId && chats?.[chatId]


    useEffect(() => {
        chatWrapperRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages,loading]);

    const handleActionInstanceSubmit = (messageContent: ActionInstanceWithParameters, type: string, id?:string, isExternalExecutionId?:string) => {           
            const messageObj = {actionInstanceWithParameterInstances: messageContent}
            if(isExternalExecutionId) {
                handleConversation(JSON.stringify(messageObj), 'user', type, undefined, isExternalExecutionId)
            } else {
                updateMessageMutation.mutate({
                    filter: {Id: id},
                    newProperties: {MessageContent: JSON.stringify(messageObj)},
                    trigger: true
                }, {
                    onSuccess: (data: any) => {
                        const castedData = data as Message[]
                        setLoadingMessage(false)
                        handleBOTMessage(castedData[0])
                    }
                })
            }
    }

    const onTableSelected = (tableIds: string[], prompt: string) => {
        console.log(tableIds)
        if(!!tableIds && tableIds.length > 0) {
            handleConversation({tableId: tableIds, prompt: prompt}, 'user', 'table_input', undefined, true)
        }
    }

    const updateMessageMutation = useMutation("UpdateMessage", 
        (config: {filter: Message, newProperties: Message, trigger?: boolean}) => {
            const fetchedDataManager = dataManager.getInstance as {patchData: Function}
            
            return fetchedDataManager.patchData(labels.entities.Message, {
                filter: config.filter,
                newProperties: config.newProperties,
                "addBotResponseToChat": config.trigger
            })
        }, {
            onMutate: () => setLoadingMessage(true)
        }
    )

    const hanldeLikeDislike = (value: boolean, id: string) => {
        updateMessageMutation.mutate({
            filter: {Id: id},
            newProperties: {MessageFeedback: value},
            trigger: false
        }, {
            onSuccess: () => {

                let newChats = messages && messages?.map((message:any) => message.id !== id ? message : {
                    ...message,
                    messageFeedback: value
                })
                handleAddMessage(newChats, chatId)
                setLoadingMessage(false)
            }
        })
    }
    

    return (
        <div>
            {messages?.length > 0 && messages?.map((message: IChatMessage, index:number) => {
                const tempArr = messages?.slice(0,index)
                tempArr?.reverse()
                // calculate latest message
                const latestMessage = tempArr?.find((message:IChatMessage)=> {
                    return message?.from === "user" && message?.type === "text"
                }) || " "
                
               return (<SmartChatBlock 
                    message={{...message, preMessage: message?.preMessage || `${latestMessage?.message ? "Here is the response generated: "+latestMessage?.message : "Here it is:"}`}} 
                    handleConversation={handleConversation} 
                    handleDeepDive={handleDeepDive} 
                    handleActionInstanceSubmit={handleActionInstanceSubmit}
                    onTableSelected={onTableSelected}
                    hanldeLikeDislike={hanldeLikeDislike}
                    updateMessageMutation={updateMessageMutation}
                    setMessages={handleAddMessage}
                    setLoadingMessage={setLoadingMessage}
                />)}
            )}
            <div ref={chatWrapperRef} />
            <LoaderContainer>
                    {loading && <ChatLoader />}
            </LoaderContainer>
        </div>
    )
}
export default MessageOutputs


interface ISmartBlock {
    message: IChatMessage,
    handleConversation: (props:any) => void,  
    handleDeepDive: (props:any) => void, 
    onTableSelected: (tableIds: string[], prompt: string) => void, 
    handleActionInstanceSubmit: (messageContent: ActionInstanceWithParameters, type: string, id?:string, isExternalExecutionId?:string) => void,  
    hanldeLikeDislike: (value: boolean, id: string) => void,
    updateMessageMutation: UseMutationResult<unknown, unknown, {filter: Message, newProperties: Message}, unknown>,
    setMessages: any,
    setLoadingMessage: any
}
const SmartChatBlock = ({ message,handleConversation,  handleDeepDive, onTableSelected, handleActionInstanceSubmit,  hanldeLikeDislike, updateMessageMutation, setMessages, setLoadingMessage}:ISmartBlock) => {
    const {id, type, ...props} = message
    
    return (
            <React.Fragment key={id}>
                {(type === "text" || type === "error") && <ChatBlock id={id} key={id + 'Chat'} {...props} type={type} />}
                {type === "recommended_actions" && props?.message && (
                    <ChatBlock id={id} key={id + 'Chat'} {...props} type={type}>
                    <RecommendedActionsInput recommendedActions={props?.message} handleConversation={handleConversation}/>
                    </ChatBlock>
                )}
                {type === 'confirmation' &&
                    <ChatBlock id={id} key={id + 'Chat'} {...props} type={type}>
                        <ConfirmationInput {...props?.message}/>
                    </ChatBlock>
                }
                {type === 'fileInput' &&
                    <ChatBlock id={id} key={id + 'Chat'} {...props} type={type}>
                    <SenderPreview fileName={props?.message} />
                </ChatBlock>
                }
                {type === "action_output" && (JSON.parse(message?.message)?.['executionId']) && 
                    <>
                        <ActionOutput messageFeedback={props?.messageFeedback} 
                            messageId={id} 
                            handleDeepDive={handleDeepDive} 
                            actionExecutionId={message?.message ? JSON.parse(message?.message)?.executionId : null} 
                            showFooter={true} 
                            handleLikeDislike={hanldeLikeDislike} 
                            preMessage={props?.preMessage} fromDeepDive={true}/>
                    </>
                }
                {type === "action_instance" && message?.message && JSON.parse(message?.message)?.actionInstanceWithParameterInstances?.ParameterInstances && <ActionDefination  
                onSubmit={(messageContent:any, type:any) => props?.isExternalExecutionId ? handleActionInstanceSubmit(messageContent,type, id, props.isExternalExecutionId) : handleActionInstanceSubmit(messageContent,type, id)} 
                ActionDefinitionId={(JSON.parse(message?.message) as ActionMessageContent)?.actionInstanceWithParameterInstances?.model?.DefinitionId!} 
                ExistingModels={(JSON.parse(message?.message) as ActionMessageContent)?.actionInstanceWithParameterInstances}
                
                />}

                {type === "table_input" && (JSON.parse(message?.message) && 
                    <>
                    <ChatBlock id={id} key={id + 'chat'} {...props} type={'text'} message={`"${JSON.parse(message?.message)?.prompt}" Looks like a new question. Please select a table to answer it better.`}/>
                    <ChatTableInput onChange={onTableSelected} prompt={JSON.parse(message?.message)?.prompt} selectedTableIds={JSON.parse(message?.message)?.tableId}/>
                    </>
                )}
                {type === MessageTypes.TABLE_PROPERTIES && (JSON.parse(message?.message) as TablePropertiesContent && 
                    <>
                    <ChatTablePropeties Tables={JSON.parse(message?.message)}/>
                    </>
                )}
                {type === MessageTypes.MULTIPLE && 
                    <MultipleTypeMessageComponent messageContent={message?.message!} Id={id} handleDeepDive={handleDeepDive} 
                        updateMessageMutation={updateMessageMutation}
                        setMessages={setMessages}
                        setLoadingMessage={setLoadingMessage}

                    />
                }
             
            </React.Fragment>
                
    
    )
}