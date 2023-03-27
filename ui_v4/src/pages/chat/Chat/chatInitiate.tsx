/* eslint-disable react-hooks/exhaustive-deps */
import { initiateChat, startConversation } from "@/actions/chat.actions";
import dataManager from "@/api/dataManager";
import DraggableSlider from "@/components/DraggableSlider";
import AppContext from "@/contexts/AppContext";
import { DataContext, SetDataContext } from "@/contexts/DataContextProvider";
import { UploadTableStateContext } from "@/contexts/UploadTablePageContext";
import { ActionDefinitionDetail } from "@/generated/interfaces/Interfaces";
import MessageTypes from "@/helpers/enums/MessageTypes";
import useFetchActionDefinitions from "@/hooks/actionDefinitions/useFetchActionDefinitions";
import useCreateActionInstance, { MutationContext } from "@/hooks/actionInstance/useCreateActionInstance";
import { getLocalStorage } from "@/utils";
import {  ChatProvider } from '@contexts/ChatContext/index';
import { Alert, Col, Row } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import DeepDiveTabs from "../chatActionOutput/DeepDive/DeepDiveTabs";
import { ConfirmationPayloadType, IChatMessage, IChatResponse } from "../ChatBlock/ChatBlock.type";
import ChatFooter from "../ChatFooter";
import ChatHistory from "../ChatHistory";
import { defaultActions, defaultBotMessage, getRandomItems, IconStack, postProcessingFetchingMessage, furtherAssistanceMessage } from "../utils";
import { ChatWrapperStyled, MessageWrapper, RightWrapperStyled } from "./Chat.styles";
import ChatLoader from "./ChatLoader";
import { ActionMessageContent, TableInputContent, TablePropertiesContent } from "./ConfirmationInput/Chat.types";
import MessageOutputs from "./MessageOutput/MessageOutput";


const InitiateChat = () => {
    // central data provider context
    const dataContext = useContext(DataContext);
    const appContext: any = useContext(AppContext);
        // local states
    const { chatId } = useParams<string>();
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(false);
    // const [messages, setMessages] = useState<IChatMessage[] | undefined>([])
    const [deepdiveData, setDeepDiveData] = useState<any | undefined>()
    const [size, setSize] = useState([96,3])
    const uploadTableContext = React.useContext(UploadTableStateContext)
    const [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError]  = useFetchActionDefinitions({filter: {IsVisibleOnUI:true}}) 
    const conversationStarted = useRef(false)

    // reducer
    const dispatch = useDispatch()
    const chats = useSelector((state:any) => state.chats)
    const uploadTable = useSelector((state:any) => state.loading)

    const messages = chatId && chats?.[chatId]
    const uploadTableLoading = chatId && uploadTable?.[chatId]


    const handleAddMessage = (data:any, id?:string) => {
        id && dispatch({type: "ADD_CHAT", payload: {
            data: data,
            id: id
        }})
    }

    const handleUpdateMessages = (message:any, id?:string) => {
        id && dispatch({type: "SET_CHAT", payload: {
            message: message,
            id: id
        }})
    }

    const handleConversationFooter = (message?: any, user?: any, type?: string, chatId?:string) => {
        console.log('Message from Chat Footer', message)
        chatId && handleConversation(message,user,type, undefined, undefined, undefined, undefined, undefined, chatId)
    }


    // Caching the calculation of fetching random items again and again 
    let fiveActions: any[] = React.useMemo(() => {
        let arr:any[] = []
        if(!allActionDefinitionsIsLoading){
            if(allActionDefinitionsData.length > 5 ){
                arr = getRandomItems(allActionDefinitionsData, 5)
            }
        }
        return arr
    },[chatId, allActionDefinitionsData, allActionDefinitionsIsLoading])

   
    const fetchFiveRandomItems = () => {
        let arr:any[] = []
        if(!allActionDefinitionsIsLoading){
            if(allActionDefinitionsData.length > 5 ){
                arr = getRandomItems(allActionDefinitionsData, 5)
            }
        }
        return arr
    }

    useEffect(()=>{
        
        // if(uploadTableContext.status?.message=='Loading Table into System' || uploadTableContext.status?.message=='Authorising Upload' || uploadTableContext.status?.message=='Preparing File' || uploadTableContext.status?.message=='Fetching Table Questions' || uploadTableContext.status?.message=='Uploading File'){
        //     setLoadingMessage(true)
        // }else if(uploadTableContext.status?.message=='Questions generated for table'){
        //     setLoadingMessage(false)
        // }
        uploadTableLoading ? setLoadingMessage(uploadTableLoading) : setLoadingMessage(false)

    },[uploadTableLoading])

    useEffect(()=>{
        if(allActionDefinitionsIsLoading){
            setLoadingMessage(true)
        }else{
            setLoadingMessage(false)
        }
    },[allActionDefinitionsIsLoading])


    // persist the chat if there is any chatData in the DataProvider or get from the BE
    useEffect(() => {
        if (chatId) {
                    if(!messages || messages?.length < 1) { 
                        dataManager.getInstance.retreiveData("Message",{filter: {ChatId: chatId}}).then((response:any) => {
                            if(response.length > 0){
                                let {messagesArray} = postProcessingFetchingMessage(response)
                                messagesArray.length > 0 && handleAddMessage([defaultBotMessage(appContext?.userName), ...messagesArray], chatId)
        
                            } else { 
                                handleDummyDataAdding()
                            }
                        }).catch((error:any) => {
                            console.log(error)
                            handleDummyDataAdding()
                        })
                    } 
        }
    }, [chatId])

    const handleDummyDataAdding = () => {
        if(allActionDefinitionsIsLoading){
            handleAddMessage([defaultBotMessage(appContext?.userName)], chatId)
        }else{
            handleAddMessage([defaultBotMessage(appContext?.userName),defaultActions(fiveActions)],chatId)
        }
    }

    useEffect(()=>{
        if(allActionDefinitionsData.length>0){
                if(!!messages){
                    if(messages?.length<2){
                        handleUpdateMessages(defaultActions(fiveActions), chatId)
                    }
                }else{
                    handleUpdateMessages(defaultActions(fiveActions), chatId)
                }
            
        }
        
    },[allActionDefinitionsData])




    useEffect(() => {
        if (chatId) {
            if (chatId !== getLocalStorage(`chat_${chatId}`)) {
                setIsError(true);
            }
            else {
                /* resize the slider*/
                handleTabClick('chat')
            }
        }
    }, [chatId])

    useEffect(() => {
        const userObj = messages?.length > 0 && messages?.filter((obj:any) => {
            return obj?.from === 'user'
           })
        if(!conversationStarted.current && userObj && userObj?.length === 1) {
                setLoading(true)
                initiateChat(chatId, appContext.userName, userObj[0]?.message).then(response => {
                    conversationStarted.current = true
                    setLoading(false)
                    
                }).catch(err => {
                    setLoading(false);
                    setIsError(true)
                })
                setDeepDiveData(undefined)
         }
    }, [messages])

   

    const handleConversation = (message?: any, user?: any, type?: string, responseID?: string, ignoreMessage?: boolean, isExternalExecutionId?:string | boolean, getResponseFromBot?: boolean, preMessage?:string, mainId?:string) => {
        
        // if didnt recieve from Function then use the chatId from the state 
        let chat_id = mainId || chatId
        
        let temp: IChatMessage = {
            id: responseID ? responseID : new Date().toTimeString(),
            message: message,
            time: new Date().getTime(),
            from: user,
            username: user === 'system' ? 'DataFacade' : appContext?.userName,
            type: type ? type : 'text',
            preMessage: preMessage || '',
            chat_id: chat_id || ''
        }

        if(isExternalExecutionId) {
            handleUpdateMessages({...temp, isExternalExecutionId: isExternalExecutionId}, chat_id)
        }

        if(!ignoreMessage) {
           handleUpdateMessages({...temp, message: message?.text || message }, chat_id) 
        }

        if (user === "user") {
            setLoadingMessage(true)
            startConversation(chat_id, appContext.userName, message, type, getResponseFromBot).then(response => {
                setLoadingMessage(false)
                if (response.length > 0) {
                    if(getResponseFromBot !== false) {
                        for (let i = 0; i < response.length; i++) {
                            handleBOTMessage(response[i])
                        }
                    }
                } else {
                    handleConversation('No output found for this message :(', 'system', 'error', undefined, undefined, undefined, undefined, undefined)
                    setLoadingMessage(false)
                }
            }).catch(error => {
                return handleConversation('I am sorry, it looks like something went wrong on our end.', 'system', 'error',)

            });
        }

        if(type === "error") {
            handleUpdateMessages(furtherAssistanceMessage(), chatId)
            handleUpdateMessages(defaultActions(fetchFiveRandomItems()), chatId) 
        }
    }
    
    const handleBOTMessage = (messageBody: IChatResponse) => {

        const messageType = messageBody ? messageBody.MessageType : 'error';


        switch (messageType) {
            case 'text': {
                return handleConversation(JSON.stringify(messageBody?.MessageContent?.text), 'system', 'text', messageBody?.Id);
            }
            case 'action_output': {
                return handleConversation(messageBody?.MessageContent, 'system', 'action_output', messageBody?.Id, false, undefined, undefined);
                // return handleActionOutput(messageBody)
            }
            case 'action_instance': {
                return handleConversation(messageBody.MessageContent, 'system', 'action_instance', messageBody?.Id)

                //  handleActionDefinition(messageBody)
            }
            case 'error': {
                return handleConversation(({text:JSON.parse(messageBody?.MessageContent)?.error}), 'system', 'error', messageBody?.Id)
            }
            case 'recommended_actions': {
                return handleConversation(messageBody?.MessageContent as ActionDefinitionDetail[], 'system', 'recommended_actions', messageBody?.Id)
                // return handleRecommendedActions(messageBody)
            }
            case 'confirmation': {
                return handleConversation(messageBody?.MessageContent as ConfirmationPayloadType, 'system', 'confirmation', messageBody?.Id)
                // return handleConfirmationActions(messageBody)
            }
            case 'table_input': {
                return handleConversation(messageBody?.MessageContent, 'system', 'table_input', messageBody?.Id)
                // return handleTableInput(messageBody)
            }
            case MessageTypes.TABLE_PROPERTIES: {
                return handleConversation(messageBody?.MessageContent, 'system', MessageTypes.TABLE_PROPERTIES, messageBody?.Id)
                // return handleTableProperties(messageBody)
            }

            case MessageTypes.MULTIPLE : {
                return handleConversation(messageBody?.MessageContent, 'system', MessageTypes.MULTIPLE, messageBody?.Id)
            }
            
            default: break;
            }
       
    }

  

    const handleDeepDive = (data:any) => {
        setDeepDiveData(data)
        handleTabClick('deepdive')
    }
    
    const handleActionSelected = (paramsData:any) => {
        const MessageId = v4()
        const obj = makeActionInstancesWithParameterInstances(paramsData)
        handleConversation(JSON.stringify(obj), 'system', 'action_instance', MessageId, true, paramsData?.executionId || true, undefined, paramsData?.action?.ActionDefinition?.model?.DisplayName || "Action run on chat")  
    }


    // Draggable Slider Component states and functions
    const [visibleTab, setVisibleTab] = useState<string>('chat')
  
    const handleTabClick = (value:string) => {
        if(value === 'chat') {
            setSize([96,3])
            setVisibleTab('chat')
        } else if (value === 'deepdive'){
            setSize([60,40])
            setVisibleTab('deepdive')
        } else if (value === 'history') {
            setSize([60,40])
            setVisibleTab('history')
        }
    }

        // Run 1000 Rows
    const handlefetch1000Rows = (tableName?:string) => {
        const Table1000Obj = allActionDefinitionsData?.find((obj:any) => {
            // TODO(Aayushi): Is this required, I can see you are crafting SQL anyway. 
            return obj?.ActionDefinition?.model?.UniqueName === "Table1000Rows" 
        })
        handleRunQuery(Table1000Obj, tableName)
    }

    const { createActionInstanceAsyncMutation } = useCreateActionInstance({
        asyncOptions: {
            onMutate: () => {
            }
        },
        syncOptions: {
            onMutate: () => {
                console.log('syncOptions')
            }
        }
    })
    
    const handleRunQuery = async (actionDefinitionObj:any, tablename?:string) => {
        const newExecutedId = v4()
        const actionInstanceId = v4()

        let obj = {
            email: 'aayushi@data-facade.com',
            actionInstance: {
                    ActionType: "Profiling",
                    CreatedBy: "aayushi@data-facade.com",
                    DefinitionId: "0",
                    DisplayName: 'Aayushi Action',
                    Id: actionInstanceId,
                    RenderTemplate: false,
                    RenderedTemplate: `select * from "${tablename}" limit 100`
                },
                actionExecutionToBeCreatedId: newExecutedId
        }
        createActionInstanceAsyncMutation.mutate((obj as unknown as MutationContext), {
            onSuccess: () => {
                const ChatObj = {
                    ChatId: chatId,
                    Id: v4(),
                    MessageContent: JSON.stringify({executionId:newExecutedId}),
                    MessageType: "action_output",
                    SentBy: "Bot",
                    SentOn: new Date().getTime()
                }

                handleConversation(ChatObj?.MessageContent, 'system', 'action_output', ChatObj?.Id, false, undefined, undefined, "Previewing the Table you uploaded.");
                handleConversation(`Finding some insights for ${tablename} table`, 'system', 'text', ChatObj?.Id, false, undefined, undefined, undefined);

            }
        })
    }


    return (
       <ChatProvider>
            <DraggableSlider 
                    size={[...size]}
                    leftChild={
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
                                        <>
                                            <ChatLoader/>
                                        </>
                                            :
                                            <Col sm={24}>
                                                <MessageWrapper>
                                                    <MessageOutputs 
                                                    setLoadingMessage={setLoadingMessage}
                                                    setMessages={handleAddMessage} 
                                                    messages={messages}
                                                    loading={loadingMessage} 
                                                    handleDeepDive={handleDeepDive}
                                                    handleConversation={handleConversation}/>
                                                </MessageWrapper>
                                                <ChatFooter handleSend={handleConversationFooter} loading={loadingMessage} handlefetch1000Rows={handlefetch1000Rows}/>
                                            </Col>
                                    }
                                </Row>
            
                        }
                        </ChatWrapperStyled>
                    }
                    rightChild={
                        visibleTab === "deepdive" ?
                        <RightWrapperStyled>
                            <DeepDiveTabs deepdiveData={deepdiveData} handleActionSelected={handleActionSelected}/>
                        </RightWrapperStyled> 
                        :  visibleTab === "history" ? <RightWrapperStyled >
                            <ChatHistory />
                        </RightWrapperStyled> : <></>
                    }
                    iconStack={IconStack(handleTabClick)}
                    activeTab={visibleTab}
                    />
        </ChatProvider>
        )
    }


export const makeActionInstancesWithParameterInstances = (paramsData: any) => {
    let data = paramsData?.action
        // // ids generated
    const actionInstanceWithParameterInstances_model_id = v4()


    // Create an action object similar to that we recieve from backend
    const obj = {
        actionDefinitionDetail: data,
        actionInstanceWithParameterInstances: {
            model : {
                DefinitionId: data?.ActionDefinition?.model?.Id,
                DisplayName: data?.ActionDefinition?.model?.DisplayName,
                Id: actionInstanceWithParameterInstances_model_id,
                Name: data?.ActionDefinition?.model?.UniqueName,
                RenderTemplate: true,
                ResultSchemaName: "datafacade_tmp",
                ResultTableName: `${data?.ActionDefinition?.model?.DisplayName}${actionInstanceWithParameterInstances_model_id}`,
                TemplateId: data?.ActionDefinition?.model?.DefaultActionTemplateId
            },
            ParameterInstances: data?.ActionTemplatesWithParameters?.[0]?.actionParameterDefinitions?.map((obj:any) => {
                let DefaultObj = {
                    ActionInstanceId: actionInstanceWithParameterInstances_model_id,
                    ActionParameterDefinitionId: obj?.model?.Id,
                    Id: v4(),
                }
                
                return (obj?.model?.ParameterName === "table_name" && paramsData?.executionId) ? {
                    ParameterValue: "Previous Execution",
                    SourceExecutionId: paramsData?.executionId,
                    TableId: paramsData?.executionId,
                    ...DefaultObj
                }: {
                    ...DefaultObj
                }
            })
        }
    }

    return obj
}


export default InitiateChat
