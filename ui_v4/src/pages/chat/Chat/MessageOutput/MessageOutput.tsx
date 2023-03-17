import dataManager from "@/api/dataManager";
import { Message } from "@/generated/entities/Entities";
import { ActionInstanceWithParameters } from "@/generated/interfaces/Interfaces";
import { labels } from "@/helpers/constant";
import MessageTypes from "@/helpers/enums/MessageTypes";
import React, { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import ActionDefination from "../../chatActionDefination/actionDefination";
import ActionOutput from "../../chatActionOutput/actionOutput";
import ChatBlock from "../../ChatBlock";
import { IChatMessage } from "../../ChatBlock/ChatBlock.type";
import ChatTableInput from "../../chatTableInput";
import { SenderPreview } from "../../tableUpload/SenderPreview";
import { LoaderContainer } from "../Chat.styles";
import ChatLoader from "../ChatLoader";
import ChatTablePropeties from "../chatTableProperties";
import ConfirmationInput from "../ConfirmationInput";
import { ActionMessageContent, TablePropertiesContent } from "../ConfirmationInput/Chat.types";
import RecommendedActionsInput from "../RecommendedActions/RecommendedActions";



const MessageOutputs = ({setMessages, messages,  loading, showActionOutput,  handleConversation,  handleDeepDive }: any ) => {
    const chatWrapperRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    
    useEffect(() => {
        chatWrapperRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages,loading]);

    const handleActionInstanceSubmit = (messageContent: ActionInstanceWithParameters, type: string, id?:string, isExternalExecutionId?:string) => {           
            const messageObj = {actionInstanceWithParameterInstances: messageContent}
            handleConversation(JSON.stringify(messageObj), 'user', type, undefined, isExternalExecutionId)
    }

    const onTableSelected = (tableId: string, prompt: string) => {
        if(!!tableId && tableId !== "") {
            handleConversation({tableId: tableId, prompt: prompt}, 'user', 'table_input', undefined, true)
        }
    }

    const updateMessageMutation = useMutation("UpdateMessage", 
        (config: {filter: Message, newProperties: Message}) => {
            const fetchedDataManager = dataManager.getInstance as {patchData: Function}

            return fetchedDataManager.patchData(labels.entities.Message, {
                filter: config.filter,
                newProperties: config.newProperties
            })
        }
    )

    const hanldeLikeDislike = (value: boolean, id: string) => {
        updateMessageMutation.mutate({
            filter: {Id: id},
            newProperties: {MessageFeedback: value}
        }, {
            onSuccess: () => {
                setMessages((messages: IChatMessage[]) => messages.map(message => message.id !== id ? message : {
                    ...message,
                    messageFeedback: value
                }))
            }
        })
    }
    

    return (
        <div>
            {messages?.map((message: IChatMessage, index:number) => {

                const tempArr = messages?.slice(0,index)
                tempArr?.reverse()
                // calculate latest message
                const latestMessage = tempArr?.find((message:IChatMessage)=> {
                    return message?.from === "user" && message?.type === "text"
                }) || " "

               return (<SmartChatBlock 
                    message={{...message,preMessage: `Here is the response generated: ${latestMessage?.message}`}} 
                    handleConversation={handleConversation} 
                    handleDeepDive={handleDeepDive} 
                    handleActionInstanceSubmit={handleActionInstanceSubmit}
                    onTableSelected={onTableSelected}
                    hanldeLikeDislike={hanldeLikeDislike}
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
    onTableSelected: (tableId: string, prompt: string) => void, 
    handleActionInstanceSubmit: (messageContent: ActionInstanceWithParameters, type: string, id?:string, isExternalExecutionId?:string) => void,  
    hanldeLikeDislike: (value: boolean, id: string) => void
}
const SmartChatBlock = ({ message,handleConversation,  handleDeepDive, onTableSelected, handleActionInstanceSubmit,  hanldeLikeDislike}:ISmartBlock) => {
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
                ActionDefinitionId={(JSON.parse(message?.message) as ActionMessageContent)?.actionDefinitionDetail?.ActionDefinition?.model?.Id!} 
                ExistingModels={(JSON.parse(message?.message) as ActionMessageContent)?.actionInstanceWithParameterInstances}/>}

                {type === "table_input" && (JSON.parse(message?.message) && 
                    <>
                    <ChatBlock id={id} key={id + 'chat'} {...props} type={'text'} message={"Looks like a new question. Please select a table to answer it better."}/>
                    <ChatTableInput onChange={onTableSelected} prompt={JSON.parse(message?.message)?.prompt} selectedTableId={JSON.parse(message?.message)?.tableId}/>
                    </>
                )}
                {type === MessageTypes.TABLE_PROPERTIES && (JSON.parse(message?.message) as TablePropertiesContent && 
                    <>
                    <ChatTablePropeties Tables={JSON.parse(message?.message)}/>
                    </>
                )}
             
            </React.Fragment>
                
    
    )
}