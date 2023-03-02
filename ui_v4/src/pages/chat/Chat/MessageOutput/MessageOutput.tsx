import { ActionDefinitionDetail, ActionInstanceWithParameters } from "@/generated/interfaces/Interfaces";
import { Spin } from "antd";
import React from "react";
import { useEffect, useRef } from "react";
import ActionDefination from "../../chatActionDefination/actionDefination";
import ActionOutput from "../../chatActionOutput/actionOutput";
import ChatBlock from "../../ChatBlock";
import { IChatMessage } from "../../ChatBlock/ChatBlock.type";
import ChatTableInput from "../../chatTableInput";
import { SenderPreview } from "../../tableUpload/SenderPreview";
import { LoaderContainer } from "../Chat.styles";
import ConfirmationInput from "../ConfirmationInput";
import { ActionMessageContent } from "../ConfirmationInput/Chat.types";
import RecommendedActionsInput from "../RecommendedActions/RecommendedActions";




const MessageOutputs = ({ messages, executionId, loading, showActionOutput, actionDefinitions, handleConversation,  handleDeepDive, tableInputs }: any ) => {
    
    const chatWrapperRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    
    useEffect(() => {
        chatWrapperRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleActionInstanceSubmit = (messageContent: ActionInstanceWithParameters, type: string, id?:string, isExternalExecutionId?:string) => {           
            handleConversation({actionInstanceWithParameterInstances: messageContent}, 'user', type, undefined, isExternalExecutionId)
    }

    const onTableSelected = (tableId: string, prompt: string) => {
        handleConversation({tableId: tableId, prompt: prompt}, 'user', 'table_input', undefined, true)
    }


    return (
        <div>
            {messages?.map(({ id, type, ...props }: IChatMessage) => {
               return ( <React.Fragment key={id}>
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
                    {type === 'fileInput' &&
                        <ChatBlock id={id} key={id + 'Chat'} {...props} type={type}>
                        <SenderPreview fileName={props?.message} />
                    </ChatBlock>
                    }
                    {type === "action_output" && (Object.keys(executionId).length > 0 || showActionOutput) && <ActionOutput handleDeepDive={handleDeepDive} actionExecutionId={executionId[id]} />}
                    {type === "action_instance" && (Object.keys(actionDefinitions).length > 0) && actionDefinitions[id] && <ActionDefination  onSubmit={(messageContent:any, type:any) => props?.isExternalExecutionId ? handleActionInstanceSubmit(messageContent,type, id, props.isExternalExecutionId) : handleActionInstanceSubmit(messageContent,type, id)} ActionDefinitionId={(actionDefinitions[id] as ActionMessageContent).actionDefinitionDetail?.ActionDefinition?.model?.Id!} ExistingModels={(actionDefinitions[id] as ActionMessageContent).actionInstanceWithParameterInstances}/>}
                    {type === "table_input" && (Object.keys(tableInputs).length > 0 && tableInputs[id] && 
                        <>
                        <ChatBlock id={id} key={id + 'chat'} {...props} type={'text'} message={"Looks like a new question. Please select a table to answer it better."}/>
                        <ChatTableInput onChange={onTableSelected} prompt={tableInputs[id].prompt} selectedTableId={tableInputs[id].tableId}/>
                        </>
                    )}
                </React.Fragment>)}
            )}
            <LoaderContainer>
            {loading && <Spin />}
            </LoaderContainer>

            <div ref={chatWrapperRef} />
        </div>
    )
}
export default MessageOutputs