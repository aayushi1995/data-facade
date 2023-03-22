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

const ChatFooter = ({ handleSend, loading, handlefetch1000Rows }: any) => {
    let inputRef = useRef<HTMLInputElement>(null);
    let fileUploadInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const location = useLocation();

    const s3Url = new URLSearchParams(location.search)?.get("s3Url") || undefined
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [relatedQuestions, setRelatedQuestions] = useState<string[]>([])
    const [chatMessage, setChatMessage] = useState<string | undefined>()
    const [showPopover, setShowPopover]= useState(false)
    const {chatId} = useParams()

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
        // handleFileUpload(event)
        setFileToUpload(file)
        event.target.value='';
        // handleSend(<SenderPreview fileName={file.name} sendBy={uploadTableStateContext?.uploadState?.message || 'local db'}/>,'user')
   
    };

    useEffect(() => {
        if (s3Url) {
            localStorage.setItem('s3Url', s3Url)
        }

    }, [s3Url])

    React.useEffect(() => {
        if(fileToUpload){
            handleSend({ text: fileToUpload.name}, 'user', 'fileInput', chatId)
            chatId && setSourceFile(fileToUpload,chatId)
        }
    }, [fileToUpload])
    

    const { setSourceFile, uploading, forceUpload, tableNameExists } = useTableUpload({
        onRecommendedQuestionsGenerated: (recommended_actions, chatId) => {
        handleSend({text: recommended_actions}, 'system', 'recommended_actions',   chatId)

        },
        onStatusChangeInfo(newStatus, chatId) {
            console.log(chatId)
            handleSend({text: newStatus?.message}, 'system', 'text',  chatId)
            if(newStatus?.tableName) {
                handlefetch1000Rows(newStatus?.tableName)
            }
        },
        onCSVToUploadValidationFail: (reason: string, fileName?: string, chatId?:string) => {
            handleSend({text: {
                header: "File Validation Failed. Upload Anyway ?",
                moreinfo: reason,
                onAccept: () => {
                    // onConfirm
                    // SAME_TABLE_NAME
                    // serializeMutations(deleteTableMutaion, forceUpload)
                    
                    forceUpload()
                },
                onReject: () => {
                    handleSend({ text: `Upload Aborted for ${fileName}`}, 'system', 'text')
                }
            } as ConfirmationPayloadType}, 'system', 'confirmation', chatId)
        }
    })

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
            handleSend({text: myValue}, 'user');
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
                            <Popover open={showPopover} placement="topLeft" trigger="click" content={uploadComponent} showArrow={false} onOpenChange={handleOpenChange}>
                                <Button  type="text" icon={<PlusOutlined style={{ color: '#9CA3AF' }} />}></Button>
                            </Popover>
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