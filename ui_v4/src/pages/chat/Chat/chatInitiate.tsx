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
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import DeepDiveTabs from "../chatActionOutput/DeepDive/DeepDiveTabs";
import { ConfirmationPayloadType, IChatMessage, IChatResponse } from "../ChatBlock/ChatBlock.type";
import ChatFooter from "../ChatFooter";
import ChatHistory from "../ChatHistory";
import { defaultActions, defaultBotMessage, getRandomItems, IconStack, postProcessingFetchingMessage } from "../utils";
import { ChatWrapperStyled, MessageWrapper, RightWrapperStyled } from "./Chat.styles";
import ChatLoader from "./ChatLoader";
import { ActionMessageContent, TableInputContent, TablePropertiesContent } from "./ConfirmationInput/Chat.types";
import MessageOutputs from "./MessageOutput/MessageOutput";


const InitiateChat = () => {
    // central data provider context
    const setDataContext = useContext(SetDataContext);
    const dataContext = useContext(DataContext);
    const appContext: any = useContext(AppContext);

    // local states
    const { chatId } = useParams();
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(false);
    const [messages, setMessages] = useState<IChatMessage[] | undefined>([])
    const [showActionOutput, setShowActionOutput] = useState(false)
    const [executionId, setExecutionId]: any = useState({})
    const [actionDefinitions, setActionDefinitions] = useState<Record<string, ActionMessageContent>>({})
    const [tableInnputIds, setTableInputIds] = useState<Record<string, TableInputContent>>({})
    const [deepdiveData, setDeepDiveData] = useState<any | undefined>()
    const [size, setSize] = useState([96,3])
    const uploadTableContext = React.useContext(UploadTableStateContext)
    const [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError]  = useFetchActionDefinitions({filter: {IsVisibleOnUI:true}}) 
    const [tableProperties, setTableProperties] = React.useState<Record<string, TablePropertiesContent>>({})

    const conversationStarted = useRef(false)

    // Caching the calculation of fetching random items again and again 
    let fiveActions: any[] = React.useMemo(() => {
        let arr:any[] = []
        if(!allActionDefinitionsIsLoading){
            if(allActionDefinitionsData.length > 5 ){
                arr = getRandomItems(allActionDefinitionsData, 5)
            }
        }
        return arr
    },[allActionDefinitionsData, allActionDefinitionsIsLoading])

   

    useEffect(()=>{
        if(uploadTableContext.status?.message=='Fetching Table Questions' || uploadTableContext.status?.message=='Uploading File'){
            setLoadingMessage(true)
        }else if(uploadTableContext.status?.message=='Questions generated for table'){
            setLoadingMessage(false)
        }
    },[uploadTableContext])

    useEffect(()=>{
        if(allActionDefinitionsIsLoading){
            setLoadingMessage(true)
        }else{
            setLoadingMessage(false)
        }
    },[allActionDefinitionsIsLoading])

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

    // persist the chat if there is any chatData in the DataProvider or get from the BE
    useEffect(() => {
        if (chatId) {
            if(dataContext?.chatData[chatId]?.messages.length > 0) {
                setMessages(dataContext?.chatData[chatId]?.messages)
                setExecutionId(dataContext?.chatData[chatId]?.executionId || {})
            } else {
                dataManager.getInstance.retreiveData("Message",{filter: {ChatId: chatId}}).then((response:any) => {
                    if(response.length > 0){
                        let {messagesArray, executionId, table_input, actionDefinition} = postProcessingFetchingMessage(response)
                        messagesArray.length > 0 && setMessages([defaultBotMessage(appContext?.userName), ...messagesArray])
                        Object.keys(executionId).length > 0 && setExecutionId({...executionId})
                        Object.keys(table_input).length > 0 && setTableInputIds({...table_input})
                        Object.keys(actionDefinition).length > 0 && setTableInputIds({...actionDefinition})

                    } else { 
                        if(allActionDefinitionsIsLoading){
                            setMessages([defaultBotMessage(appContext?.userName)])
                        }else{
                            setMessages([defaultBotMessage(appContext?.userName),defaultActions(fiveActions)])
                        }
                    }
                }).catch((error:any) => {
                    console.log(error)
                })
            }
        }
    }, [chatId])

    useEffect(()=>{
        if(allActionDefinitionsData.length>0){
                if(messages){
                    if(messages.length<2){
                        setMessages([...messages,defaultActions(fiveActions)])
                    }else{
                        setMessages([...messages])
                    }
                }else{
                    setMessages([defaultActions(fiveActions)])
                }
            
        }
        
    },[allActionDefinitionsData])

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
                /* resize the slider*/
                handleTabClick('chat')
            }
        }
    }, [chatId])

    useEffect(() => {
        const userObj = messages?.filter((obj:any) => {
            return obj?.from === 'user'
           })
        if(!conversationStarted.current && userObj && userObj?.length === 1) {
                setLoading(true)
                initiateChat(chatId, appContext.userName, userObj[0]?.message.substring(0,10)).then(response => {
                    conversationStarted.current = true
                    setLoading(false)
                    
                }).catch(err => {
                    setLoading(false);
                    setIsError(true)
                })
                setDeepDiveData(undefined)
         }
    }, [messages])

   

    const handleConversation = (message?: any, user?: any, type?: string, responseID?: string, ignoreMessage?: boolean, isExternalExecutionId?:string | boolean, getResponseFromBot?: boolean, preMessage?:string) => {
        
        let temp: IChatMessage = {
            id: responseID ? responseID : new Date().toTimeString(),
            message: message,
            time: new Date().getTime(),
            from: user,
            username: user === 'system' ? 'DataFacade' : appContext?.userName,
            type: type ? type : 'text',
            preMessage: preMessage || ''
        }

        if(isExternalExecutionId) {
            
           setMessages((prevState:any) => [...prevState, {...temp, isExternalExecutionId: isExternalExecutionId}])
        }

        if(!ignoreMessage) {
            setMessages(messages => messages ? [...messages, {...temp, message: message?.text || message?.error}] : [{...temp, message: message?.text}])
        }

        if (user === "user") {
            setLoadingMessage(true)
            startConversation(chatId, appContext.userName, message, type, getResponseFromBot).then(response => {
                setLoadingMessage(false)
                if (response.length > 0) {
                    if(getResponseFromBot !== false) {
                        for (let i = 0; i < response.length; i++) {
                            handleBOTMessage(response[i])

                        }
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
                return handleConversation(({text:JSON.parse(messageBody?.MessageContent)?.error}), 'system', 'error', messageBody?.Id)
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
            case MessageTypes.TABLE_PROPERTIES: {
                return handleTableProperties(messageBody)
            }

            default: break;
            }
       
    }

    const handleConfirmationActions = (messageBody: IChatResponse) => {
        const confirmations = messageBody?.MessageContent as ConfirmationPayloadType
        handleConversation(confirmations, 'system', 'confirmation', messageBody?.Id)
    }

    const handleRecommendedActions = (messageBody: IChatResponse) => {
        const recommendedActions = messageBody?.MessageContent as ActionDefinitionDetail[]
        handleConversation(recommendedActions, 'system', 'recommended_actions', messageBody?.Id)
    }

    const handleTableProperties = (messageBody: IChatResponse) => {
        console.log(messageBody)
        const tables = JSON.parse(messageBody?.MessageContent) as TablePropertiesContent

        handleConversation(messageBody, 'system', MessageTypes.TABLE_PROPERTIES, messageBody?.Id)

        if(tables) {
            setTableProperties(prevState => ({
                ...prevState,
                [messageBody?.Id!]: tables
            }))
        }
    }

    const handleActionOutput = (messageBody: IChatResponse | any, preMessage?:string) => {

        const actionOutputId = messageBody?.MessageContent ? JSON.parse(messageBody?.MessageContent)['executionId'] : null
        handleConversation(messageBody, 'system', 'action_output', messageBody?.Id, false, undefined, undefined, preMessage);

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
        setDeepDiveData(data)
        handleTabClick('deepdive')
    }
    
    const handleActionSelected = (paramsData:any) => {
        const MessageId = v4()
        const obj = makeActionInstancesWithParameterInstances(paramsData)
        handleConversation(JSON.stringify(obj), 'system', 'action_instance', MessageId, true, paramsData?.executionId || true, undefined, paramsData?.action?.ActionDefinition?.model?.DisplayName || "Action run on chat")
        setActionDefinitions((prevState:any) => ({
            ...prevState,
            [MessageId]: obj
        }))   
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
                    // TODO(Aayushi): We can't hardcode this. We need to find the LocalDB provider instance id. 
                    // ProviderInstanceId: "b126b33f-114c-470f-a56f-e2ecf7b3ff77",
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
                handleActionOutput(ChatObj, "Previewing the Table you uploaded.")
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
                                                    <MessageOutputs setMessages={setMessages} setActionDefinitions={setActionDefinitions} messages={messages} executionId={executionId} loading={loadingMessage} showActionOutput={showActionOutput} handleDeepDive={handleDeepDive} actionDefinitions={actionDefinitions} handleConversation={handleConversation} tableInputs={tableInnputIds} tableProperties={tableProperties}/>
                                                </MessageWrapper>
                                                <ChatFooter handleSend={handleConversation} loading={loadingMessage} handlefetch1000Rows={handlefetch1000Rows}/>
            
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
