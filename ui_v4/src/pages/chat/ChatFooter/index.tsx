import dataManager from '@/api/dataManager';
import { getLocalStorage, setLocalStorage } from '@/utils';
import { BulbOutlined, CloseOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Popover, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
// import { SubmitButton } from '@/assets/component.theme';
import { DataContext, SetDataContext } from '@/contexts/UploadFileDataContextProvider';
import useContextStorageFile from '@/hooks/useContextStorage';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ConfirmationPayloadType } from '../ChatBlock/ChatBlock.type';
import useTableUpload from '../tableUpload/useTableUpload';
import { ChatAutocomplete, ConnectionButton, PopOverCard, StyledCardChartFooterWrapper, StyledChatInputWrapper, StyledSendIcon } from './ChatFooter.styles';
import { ActionDefinitionDetail } from '@/generated/interfaces/Interfaces';
import useFetchActionDefinitions from '@/hooks/actionDefinitions/useFetchActionDefinitions';
import { HomeChatContext } from '@/contexts/HomeChatContext';
import { useSelector } from 'react-redux';

const ChatFooter = ({ handleSend, loading, handlefetch1000Rows }: any) => {


    const isUploadInProgress = useSelector((state:any) => state.loading)

    let inputRef = useRef<HTMLInputElement>(null);
    let fileUploadInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const location = useLocation();

    const s3Url = new URLSearchParams(location.search)?.get("s3Url") || undefined
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [relatedQuestions, setRelatedQuestions] = useState<string[]>([])
    const [chatMessage, setChatMessage] = useState<string | undefined>()
    const [showPopover, setShowPopover]= useState(false)
    let {chatId}= useParams()
    chatId = chatId || '0'

    const [actionDefinitions, setActionDefinitions] = React.useState<ActionDefinitionDetail[]>()


    const [] = useFetchActionDefinitions({handleSuccess: (data: ActionDefinitionDetail[]) => setActionDefinitions(data), filter: {IsVisibleOnUI: true}})

    const getRelatedQuestionsMutations = useMutation("GetRelatedQuestion", 
        (config: {question: string}) => {
            const fetchedDataManager = dataManager.getInstance as {getRelatedQuestions: Function}
            return fetchedDataManager.getRelatedQuestions(config.question)
        }
    )
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    

    const [handleFileRetrieval]: any = useContextStorageFile('file');

    const [fileToUpload, setFileToUpload] = React.useState<File | undefined>(handleFileRetrieval && handleFileRetrieval())

    const uploadClick = () => {
        //toggleFileUpload()
        fileUploadInputRef.current.click()
    }
    const changeHandler = (event: any) => {
        console.log('file is getting uploaded')
        const file = event.target.files[0];
        const fileInMB = file.size / 1024 ** 2;
        if(fileInMB <= 10) {
            setFileToUpload(file)
            event.target.value='';
        } else {
            handleSend("File size should be less than or equal to 10 MB", 'system', 'text', chatId)
        }
        // handleFileUpload(event)
       
        // handleSend(<SenderPreview fileName={file.name} sendBy={uploadTableStateContext?.uploadState?.message || 'local db'}/>,'user')
   
    };

    useEffect(() => {
        if (s3Url) {
            localStorage.setItem('s3Url', s3Url)
        }

    }, [s3Url])

    React.useEffect(() => {
        if(fileToUpload){
            chatId && handleSetChatId(chatId)
            chatId && setSourceFile(fileToUpload)
            handleSend({ text: fileToUpload.name}, 'user', 'fileInput', chatId)
            
        }
    }, [fileToUpload])
    

    const { setSourceFile, uploading, forceUpload, tableNameExists, handleSetChatId } = useTableUpload({
        onRecommendedQuestionsGenerated: (recommended_actions, chatId, tableName) => {    
            // handleSend({text: `Finding some insights for ${tableName} table`}, 'system', 'text',   chatId)
            handleSend({text: recommended_actions}, 'system', 'recommended_actions',   chatId)
        },
        onStatusChangeInfo(newStatus, chatId) {
            handleSend({text: newStatus?.message}, 'system', 'text',  chatId)
            if(newStatus?.tableName) {
                handlefetch1000Rows(newStatus?.tableName)
            }
        },
        onCSVToUploadValidationFail: (reason: string, fileName?: string, chatId?:string) => {

            console.log("File Validation failed","Upload anyway ?",reason, fileName, chatId)

            handleSend({text: {
                header: "File Validation Failed. Upload Anyway ?",
                moreinfo: reason,
                onAccept: () => {
                   forceUpload()
                },
                onReject: () => {
                    handleSend({ text: `Upload Aborted for ${fileName}`}, 'system', 'text')
                }
            } as ConfirmationPayloadType}, 'system', 'confirmation', chatId)
        }
    }, chatId)

    const handleChange = (e: string) => {
        setChatMessage(e)
        getRelatedQuestionsMutations.mutate({question: e}, {
            onSuccess(data, variables, context) {
                const castedData = data as {RelatedQuestions: string[]}
                const relatedQuestions = castedData?.RelatedQuestions
                setRelatedQuestions(relatedQuestions)
            },
        })
    }
    const handleClick = () => {
        if(inputRef !== null) {
            handleSend({text: chatMessage}, 'user', undefined, chatId)
            setChatMessage(undefined)
            setRelatedQuestions([])
            inputRef?.current?.focus()
        }
    }
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleClick()
        }
    }
    const handleOpenChange = () => {
        setShowPopover(!showPopover)
    }

    const uploadComponent = (
        <>
            <input type="file" ref={fileUploadInputRef} accept={".csv,.xlsx"} hidden onChange={changeHandler} onClick={handleOpenChange}/>
            <Space direction='vertical' style={{ width: '100%' }}>
                {/* TODO: Ritesh - enable googole sheet connectors */}
                {/* <ConnectionButton block type='text' icon={<FileExcelOutlined />}>Connect Google Sheets (Coming Soon!)</ConnectionButton> */}
                <ConnectionButton block type='text' icon={<UploadOutlined />} onClick={uploadClick}>Upload CSV</ConnectionButton>
            </Space>
        </>
    )

    const { myValue ,setMyValue } = useContext(HomeChatContext);
    
    useEffect(()=>{
        if(myValue!=""){
            handleSend({text: myValue}, 'user',undefined, chatId);
        }
    },[myValue])
    return (
        <Row>
            <Col span={24}>
                <StyledCardChartFooterWrapper>
                    {
                        showFileUpload &&
                        <Row>
                            <Col>
                                <PopOverCard bordered={false} size="small">
                                </PopOverCard>
                            </Col>
                        </Row>
                    }
                    
                    <Row align="middle">
                        <Col span={1}>
                            <input type="file" ref={fileUploadInputRef} accept={".csv,.xlsx"} hidden onChange={changeHandler} onClick={handleOpenChange}/>
                            <Button type="ghost" icon={<UploadOutlined/>} onClick={uploadClick} disabled={chatId && isUploadInProgress?.[chatId]}/>
                          
                        </Col>
                        <Col span={23}>
                            <StyledChatInputWrapper>
                                {/* <ChatInput onChange={handleChange} disabled={loading} type="text" placeholder="Type a message..." ref={inputRef} onKeyDown={handleKeyDown} /> */}
                                    <ChatAutocomplete 
                                        options={relatedQuestions.map(question => ({value: question, label: question}))}
                                        onChange={handleChange}
                                        onKeyDown={handleKeyDown}
                                        value={chatMessage}
                                        ref={inputRef}
                                    />
                                <StyledSendIcon onClick={handleClick} onKeyDown={handleClick} />
                            </StyledChatInputWrapper>

                        </Col>
                    </Row>
                </StyledCardChartFooterWrapper>

            </Col>
        </Row>
    )
}
export default ChatFooter