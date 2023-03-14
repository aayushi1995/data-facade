import dataManager from "@/api/dataManager";
import { Message } from "@/generated/entities/Entities";
import { ActionInstanceWithParameters } from "@/generated/interfaces/Interfaces";
import { labels } from "@/helpers/constant";
import MessageTypes from "@/helpers/enums/MessageTypes";
import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import React, { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import ActionDefination from "../../chatActionDefination/actionDefination";
import ActionOutput from "../../chatActionOutput/actionOutput";
import ChatBlock from "../../ChatBlock";
import { IChatMessage } from "../../ChatBlock/ChatBlock.type";
import ChatTableInput from "../../chatTableInput";
import { SenderPreview } from "../../tableUpload/SenderPreview";
import { detectDefaultMessage } from "../../utils";
import { LoaderContainer } from "../Chat.styles";
import ChatLoader from "../ChatLoader";
import ChatTablePropeties from "../chatTableProperties";
import ConfirmationInput from "../ConfirmationInput";
import { ActionMessageContent } from "../ConfirmationInput/Chat.types";
import RecommendedActionsInput from "../RecommendedActions/RecommendedActions";




const MessageOutputs = ({setMessages, messages, executionId, loading, showActionOutput, actionDefinitions, handleConversation,  handleDeepDive, tableInputs, setActionDefinitions, tableProperties }: any ) => {
    
    const chatWrapperRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    
    useEffect(() => {
        chatWrapperRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages,loading]);

    const handleActionInstanceSubmit = (messageContent: ActionInstanceWithParameters, type: string, id?:string, isExternalExecutionId?:string) => {           
            handleConversation({actionInstanceWithParameterInstances: messageContent}, 'user', type, undefined, isExternalExecutionId)
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
            {messages?.map(({ id, type, ...props }: IChatMessage, index:number) => {

                const tempArr = messages?.slice(0,index)

                tempArr?.reverse()

                const latestMessage = tempArr?.find((message:IChatMessage)=> {
                    return message?.from === "user" && message?.type === "text"
                }) || " "
                
               return ( <React.Fragment key={id}>
                    {(type === "text" || type === "error") && <ChatBlock id={id} key={id + 'Chat'} {...props} type={type} />}
                    
                    {type === "recommended_actions" && 
                        <ChatBlock id={id} key={id + 'Chat'} {...props} type={type}>
                            <RecommendedActionsInput setActionDefinitions={setActionDefinitions} recommendedActions={props?.message} handleConversation={handleConversation}/>
                        </ChatBlock>
                    }
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
                    {type === "action_output" && (Object.keys(executionId).length > 0 || showActionOutput) && 
                        <>
                            <ActionOutput messageFeedback={props?.messageFeedback} messageId={id} handleDeepDive={handleDeepDive} actionExecutionId={executionId[id]} showFooter={true} handleLikeDislike={hanldeLikeDislike} preMessage={props?.preMessage || "Here is the response generated: "+(latestMessage?.message || " ")} fromDeepDive={true}/>
                        </>
                    }
                    {type === "action_instance" && (Object.keys(actionDefinitions).length > 0) && actionDefinitions[id] && <ActionDefination  onSubmit={(messageContent:any, type:any) => props?.isExternalExecutionId ? handleActionInstanceSubmit(messageContent,type, id, props.isExternalExecutionId) : handleActionInstanceSubmit(messageContent,type, id)} ActionDefinitionId={(actionDefinitions[id] as ActionMessageContent).actionDefinitionDetail?.ActionDefinition?.model?.Id!} ExistingModels={(actionDefinitions[id] as ActionMessageContent).actionInstanceWithParameterInstances}/>}
                    {type === "table_input" && (Object.keys(tableInputs).length > 0 && tableInputs[id] && 
                        <>
                        <ChatBlock id={id} key={id + 'chat'} {...props} type={'text'} message={"Looks like a new question. Please select a table to answer it better."}/>
                        <ChatTableInput onChange={onTableSelected} prompt={tableInputs[id].prompt} selectedTableId={tableInputs[id].tableId}/>
                        </>
                    )}
                    {type === MessageTypes.TABLE_PROPERTIES && (Object.keys(tableProperties).length > 0 && tableProperties[id] && 
                        <>
                        <ChatTablePropeties Tables={tableProperties[id]}/>
                        </>
                    )}
                    
                    
                </React.Fragment>)}
            )}
            <LoaderContainer>
            {loading && <ChatLoader />}
            </LoaderContainer>

            <div ref={chatWrapperRef} />
        </div>
    )
}
export default MessageOutputs