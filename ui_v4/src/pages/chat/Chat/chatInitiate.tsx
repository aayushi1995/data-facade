/* eslint-disable react-hooks/exhaustive-deps */
import { fetchChats, initiateChat, startConversation } from "@/actions/chat.actions";
import Loader from "@/components/Loader";
import AppContext from "@/contexts/AppContext";
import { DataContext, SetDataContext } from "@/contexts/DataContextProvider";
import { ActionDefinitionDetail } from "@/generated/interfaces/Interfaces";
import { getLocalStorage } from "@/utils";
import { ChatProvider } from '@contexts/ChatContext/index';
import ReactSplit from '@devbookhq/splitter';
import { Alert,  Col, Row,  } from "antd";
import  { useContext, useEffect,  useState } from "react";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import { ChatWrapperStyled, DeepDiveWrapperStyled, MainWrapper, MessageWrapper } from "./Chat.styles";
import ChatComponentIconTabExperience from "../chatActionOutput/chatDeepDiveTab";
import DeepDiveTabs from "../chatActionOutput/DeepDive/DeepDiveTabs";
import { ConfirmationPayloadType, IChatMessage, IChatResponse } from "../ChatBlock/ChatBlock.type";
import ChatFooter from "../ChatFooter";
import { FlexBox } from "../ChatFooter/ChatFooter.styles";
import { ActionMessageContent, TableInputContent } from "./ConfirmationInput/Chat.types";
import MessageOutputs from "./MessageOutput/MessageOutput";
import { UploadTableStateContext } from "@/contexts/UploadTablePageContext";
import React from "react";
import dataManager from "@/api/dataManager";
import { postProcessingFetchingMessage } from "../chatActionOutput/utils";
import useFetchActionDefinitions from "@/hooks/actionDefinitions/useFetchActionDefinitions";


const defaultBotMessage = (username: string): IChatMessage => {
   
    return {
        id: new Date().toTimeString(),
        message: `Welcome ${username.split(' ')[0]} ! What insight do you need ?` ,
        time: new Date().getTime(),
        from: 'system',
        username: 'DataFacade',
        type: 'text'
    }
}

function getRandomItems(arr: any[], numItems: number): any[] {
    const result = new Array(numItems);
    let len = arr.length;
    const taken = new Array(len);
    if (numItems > len) {
      throw new RangeError("getRandomItems: more elements taken than available");
    }
    while (numItems--) {
      const randomIndex = Math.floor(Math.random() * len);
      result[numItems] = arr[randomIndex in taken ? taken[randomIndex] : randomIndex];
      taken[randomIndex] = --len in taken ? taken[len] : len;
    }
    return result;
  }

const defaultActions = (allActionDefinitionsData: ActionDefinitionDetail[]): IChatMessage => {
   
    return {
        id: new Date().toTimeString(),
        message: allActionDefinitionsData,
        time: new Date().getTime(),
        from: 'system',
        username: 'DataFacade',
        type: 'recommended_actions'
    }
}
const InitiateChat = () => {
    const [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError]  = useFetchActionDefinitions({filter: {IsVisibleOnUI:true}}) 
    let fiveActions: any[] = []
    if(!allActionDefinitionsIsLoading){
    fiveActions = getRandomItems(allActionDefinitionsData, 5)
    }
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
    const [showDeepDive, setShowDeepDive] = useState(false)
    const [deepdiveData, setDeepDiveData] = useState<any | undefined>()
    const [size, setSize] = useState([100,0])
    const uploadTableContext = React.useContext(UploadTableStateContext)
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

    // persist the chat if there is any chatData in the DataProvider
    useEffect(() => {
        console.log('setting data from context')
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
                setMessages([...messages,defaultActions(fiveActions)])
                }else{
                    setMessages([defaultActions(fiveActions)])
                }
            
        }
        console.log(allActionDefinitionsData.length);
        
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

   

    const handleConversation = (message?: any, user?: any, type?: string, responseID?: string, ignoreMessage?: boolean, isExternalExecutionId?:string | boolean) => {

        let temp: IChatMessage = {
            id: responseID ? responseID : new Date().toTimeString(),
            message: message,
            time: new Date().getTime(),
            from: user,
            username: user === 'system' ? 'DataFacade' : appContext?.userName,
            type: type ? type : 'text'
        }

        if(isExternalExecutionId) {
            
           setMessages((prevState:any) => [...prevState, {...temp, isExternalExecutionId: isExternalExecutionId}])
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

        handleConversation(messageBody, 'system', 'action_output', messageBody?.Id);

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
    
    const handleActionSelected = (paramsData:any) => {

        let data = paramsData?.action
        // // ids generated
        const actionInstanceWithParameterInstances_model_id = v4()
        const MessageId = v4()

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
                ParameterInstances: data?.ActionTemplatesWithParameters[0]?.actionParameterDefinitions?.map((obj:any) => {
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
    
        let messageContent = {
            ChatId: v4(),
            Id: MessageId,
            MessageContent: JSON.stringify(obj),
            MessageType: "action_instance",
            SentBy: "Bot",
            SentOn: new Date().getTime(),

        }

        handleConversation(JSON.stringify(obj), 'system', 'action_instance', MessageId, true, paramsData?.executionId || true)
        
        setActionDefinitions((prevState:any) => ({
            ...prevState,
            [MessageId]: obj
        }))   
    }
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
                                                <ChatFooter handleSend={handleConversation} loading={loadingMessage}/>
            
                                            </Col>
                                    }
                                </Row>
            
                        }
                    </ChatWrapperStyled>
                    <FlexBox>
                    <ChatComponentIconTabExperience handleChatClick={handleChatClick} handleTerminalClick={handleTerminalClick} showDeepDive={showDeepDive} />
                    <DeepDiveWrapperStyled>
                        <DeepDiveTabs deepdiveData={deepdiveData} handleActionSelected={handleActionSelected}/>
                    </DeepDiveWrapperStyled>
                    </FlexBox>
                </ReactSplit>
            </MainWrapper>
        </ChatProvider>
    )

    }



export default InitiateChat

