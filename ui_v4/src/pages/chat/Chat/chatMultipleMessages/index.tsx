import { Message } from "@/generated/entities/Entities"
import { ActionExecutionIncludeDefinitionInstanceDetailsResponse, ActionInstanceWithParameters } from "@/generated/interfaces/Interfaces"
import ActionExecutionStatus from "@/helpers/enums/ActionExecutionStatus"
import MessageTypes from "@/helpers/enums/MessageTypes"
import { UseMutationResult } from "react-query"
import ActionDefination from "../../chatActionDefination/actionDefination"
import ActionOutput from "../../chatActionOutput/actionOutput"
import ChatBlock from "../../ChatBlock"
import { IChatMessage } from "../../ChatBlock/ChatBlock.type"
import ChatTableInput from "../../chatTableInput"
import { ActionMessageContent, ActionOutputContent, ErrorMessageContent, MessageContentTypes, MultipleMessageContent, TableInputContent } from "../ConfirmationInput/Chat.types"


export interface MessageTypeAndContent {
    messageType: string,
    messageContent: MessageContentTypes
}

interface MultipleTypeMessageComponentProps {
    Id: string,
    messageContent: string,
    handleDeepDive: (data:any, title?:string) => void,
    updateMessageMutation: UseMutationResult<unknown, unknown, {filter: Message, newProperties: Message, trigger?: boolean}, unknown>,
    setMessages: any,
    setLoadingMessage: any
}

const MultipleTypeMessageComponent = (props: MultipleTypeMessageComponentProps) => {


    const {Id, messageContent} = props
    const parsedMessageContent = JSON.parse(messageContent) as MultipleMessageContent

    const onActionCompleted = (actionExecutionDetails: ActionExecutionIncludeDefinitionInstanceDetailsResponse, messageIndex?: number) => {
        if(actionExecutionDetails.ActionExecution?.Status === ActionExecutionStatus.COMPLETED) {
            const indexToProcess = (parsedMessageContent.processedIndex || 0) + 1
            if(indexToProcess < parsedMessageContent.messages.length && messageIndex === parsedMessageContent.processedIndex) {
                if(parsedMessageContent.messages[indexToProcess].messageType === MessageTypes.TABLE_INPUT) {
                    const tableInputContent = parsedMessageContent.messages[indexToProcess].messageContent as TableInputContent
                    const newTableInput: TableInputContent = {
                        ...tableInputContent,
                        tableId: actionExecutionDetails.ActionExecution?.Id,
                        tableType: "execution"
                    }
                    parsedMessageContent.messages[indexToProcess].messageContent = newTableInput
                    parsedMessageContent.processedIndex = indexToProcess
                } else {
                    parsedMessageContent.processedIndex = indexToProcess
                }

                updateCurrentMessage(parsedMessageContent)
            }
        }
    }

    const updateCurrentMessage = (newMessageContent: MultipleMessageContent) => {
        props.setLoadingMessage(true)
        props.updateMessageMutation.mutate({filter: {Id}, newProperties: {MessageContent: JSON.stringify(newMessageContent)}, trigger: true}, {
            onSuccess: (data: unknown) => {
                props.setLoadingMessage(false)
                const updateMessage = (data as Message[])?.[0]
                if(updateMessage) {
                    props?.setMessages((messages: IChatMessage[]) => {
                        const newMessages = [...messages]
                        const index = messages.findIndex((message: IChatMessage) => message.id === updateMessage.Id)
                        if(index >= 0) {
                            newMessages[index]!.message = updateMessage?.MessageContent
                        }
                        return newMessages
                    })
                }
            },
            onError: () => {
                console.log("error")
            },
        })
    }

    const handleTableChange = (tableId: string) => {
        const indexToProcess = (parsedMessageContent.processedIndex || 0)
        if(indexToProcess < parsedMessageContent.messages.length) {
            if(parsedMessageContent.messages[indexToProcess].messageType === MessageTypes.TABLE_INPUT) {
                const tableInputContent = parsedMessageContent.messages[indexToProcess].messageContent as TableInputContent
                
                const newTableInput: TableInputContent = {
                    ...tableInputContent,
                    tableId: tableId
                }
                parsedMessageContent.messages[indexToProcess].messageContent = newTableInput
            }
            updateCurrentMessage(parsedMessageContent)
        }
    }

    const handleActionInstanceSubmit = (messageContent: ActionInstanceWithParameters, type: string, id?:string, isExternalExecutionId?:string) => {           
        const messageObj = {actionInstanceWithParameterInstances: messageContent}
        // handleConversation(JSON.stringify(messageObj), 'user', type, undefined, isExternalExecutionId)
        parsedMessageContent.messages[parsedMessageContent.processedIndex || 0].messageContent = messageObj
        updateCurrentMessage(parsedMessageContent)
    }
    const decompositionString = parsedMessageContent.decompositions?.join('\n')
    const messagesToProcess = parsedMessageContent.messages.slice(0, (parsedMessageContent.processedIndex || 0) + 1)
    return (
        <div>
            <ChatBlock id={props.Id} key={props.Id} {...props} type={'text'} message={"Steps to do: \n" + decompositionString}/>
            
            {messagesToProcess.map((message: MessageTypeAndContent, index: number) => {
                const {messageType, messageContent} = message
                const parsedMessage = messageContent as ActionMessageContent
                if(messageType === MessageTypes.ACTION_INSTANCE) {
                    return <ActionDefination  
                        ActionDefinitionId={parsedMessage?.actionInstanceWithParameterInstances?.model?.DefinitionId!} 
                        ExistingModels={parsedMessage?.actionInstanceWithParameterInstances}
                        onSubmit={handleActionInstanceSubmit}
                
                    />
                } else if(messageType === MessageTypes.ACTION_OUTPUT) { 
                    const parsedMessage = messageContent as ActionOutputContent
                    return <ActionOutput
                        messageIndex={index}
                        actionExecutionId={parsedMessage?.executionId}
                        onCompletion={onActionCompleted}
                        showFooter={true} 
                        handleDeepDive={props.handleDeepDive}
                    /> 
                } else if(messageType === MessageTypes.TABLE_INPUT && index === 0) {
                    const parsedMessage = messageContent as TableInputContent
                    return <div>
                            <ChatBlock id={index} key={index + 'chat'} {...props} type={'text'} message={`"${parsedMessage.prompt}" Looks like a new question. Please select a table to answer it better.`}/>
                            <ChatTableInput
                            prompt={parsedMessage.prompt}
                            selectedTableId={parsedMessage?.tableId}
                            onChange={handleTableChange}
                        />  
                    </div>
                } else if(messageType === MessageTypes.ERROR) {
                    const parsedMessage = messageContent as ErrorMessageContent
                    return <ChatBlock id={index} key={index + 'chat'} {...props} type={'text'} message={parsedMessage.error}/>
                }
            })}
        </div>
    )

}


export default MultipleTypeMessageComponent