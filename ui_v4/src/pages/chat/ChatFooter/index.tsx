import dataManager from '@/api/dataManager';
import { ConnectionHistoryIcon } from '@/assets/icon.theme';
import { getLocalStorage, setLocalStorage } from '@/utils';
import { BulbOutlined, CloseOutlined, FileExcelOutlined, MinusOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Popover, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
// import { SubmitButton } from '@/assets/component.theme';
import { DataContext, SetDataContext } from '@/contexts/UploadFileDataContextProvider';
import useContextStorageFile from '@/hooks/useContextStorage';
import { useLocation } from 'react-router-dom';
import { ConfirmationPayloadType } from '../ChatBlock/ChatBlock.type';
import useTableUpload from '../tableUpload/useTableUpload';
import { ChatAutocomplete, ConnectionButton, PopOverCard, StyledCardChartFooterWrapper, StyledChatInputWrapper, StyledSendIcon } from './ChatFooter.styles';
import React from 'react';

const ChatFooter = ({ handleSend, loading }: any) => {
    let inputRef = useRef<HTMLInputElement>(null);
    let fileUploadInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const location = useLocation();
    const s3Url = new URLSearchParams(location.search)?.get("s3Url") || undefined
    const s3UrlProviderInstanceId = new URLSearchParams(location.search)?.get("s3UrlProviderInstanceId") || localStorage.getItem('s3Url') || undefined
    const shouldShowTour = getLocalStorage('isTourOpen') === "open" ? false : true;
    const [isTourOpen, setIsTourOpen] = useState(shouldShowTour);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [relatedQuestions, setRelatedQuestions] = useState<string[]>([])
    const tourRef = useRef(null);
    const dataContext = useContext(DataContext);
    const setDataContext = React.useContext(SetDataContext)
        const [chatMessage, setChatMessage] = useState<string | undefined>()

    const getRelatedQuestionsMutations = useMutation("GetRelatedQuestion", 
        (config: {question: string}) => {
            const fetchedDataManager = dataManager.getInstance as {getRelatedQuestions: Function}
            return fetchedDataManager.getRelatedQuestions(config.question)
        }
    )

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

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const onCloseTour = () => {
        setIsTourOpen(false);
        setLocalStorage('isTourOpen', 'open')
    }


    const handleClick = () => {
        if(inputRef !== null) {
            console.log(inputRef)
            handleSend({text: chatMessage}, 'user')
            setChatMessage(undefined)
            inputRef?.current?.focus()
        }
    }
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleClick()
        }
    }

    const [file, handleFileUpload, handleFileRetrieval]: any = useContextStorageFile('file');
    const [fileToUpload, setFileToUpload] = React.useState<File | undefined>(handleFileRetrieval())
    const uploadClick = () => {
        //toggleFileUpload()
        fileUploadInputRef.current.click()
    }
    const changeHandler = (event: any) => {
        const file = event.target.files[0];
        // handleFileUpload(event)
        setFileToUpload(file)
        // handleSend(<SenderPreview fileName={file.name} sendBy={uploadTableStateContext?.uploadState?.message || 'local db'}/>,'user')
    };
    useEffect(() => {
        if (s3Url) {
            localStorage.setItem('s3Url', s3Url)
        }

    }, [s3Url])
    const toggleFileUpload = () => {
        setShowFileUpload(!showFileUpload)
    }

    const popOverTitle = () => <Row justify="space-between"><Col><BulbOutlined style={{ color: '#3488E4' }} /> Getting Insights</Col><Col><Button onClick={() => onCloseTour()} size="small" type="link" icon={<CloseOutlined style={{ fontSize: 8 }} />} /></Col></Row>

    const tourContent = () => <div style={{ width: 300 }}><Typography.Text style={{ fontSize: 12 }}>Remember, you can always start a chat by connecting to a data source, sending us a file, or resuming the conversation based on previous file connections.</Typography.Text></div>

    const { setSourceFile, uploading, forceUpload, tableNameExists } = useTableUpload({
        onRecommendedQuestionsGenerated: (recommended_actions) => {
            handleSend({text: recommended_actions}, 'system', 'recommended_actions')
        },
        onStatusChangeInfo(newStatus) {
            handleSend({text: newStatus?.message}, 'system', 'text')
        },
        onCSVToUploadValidationFail: (reason: string, fileName?: string) => {
            console.log(reason)
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
            } as ConfirmationPayloadType}, 'system', 'confirmation')
        }
    })


    React.useEffect(() => {
        if(fileToUpload){
            setSourceFile(fileToUpload)
        }
    }, [fileToUpload])
    return (
        <Row>
            <Col span={24}>
                <StyledCardChartFooterWrapper>
                    {
                        showFileUpload &&
                        <Row>
                            <Col>
                                <PopOverCard bordered={false} size="small">
                                    <input type="file" ref={fileUploadInputRef} accept={".csv,.xlsx"} hidden onChange={changeHandler} />
                                    <Space direction='vertical' style={{ width: '100%' }}>
                                        {/* TODO: Ritesh - enable googole sheet connectors */}
                                        {/* <ConnectionButton block type='text' icon={<FileExcelOutlined />}>Connect Google Sheets (Coming Soon!)</ConnectionButton> */}
                                        <ConnectionButton block type='text' icon={<UploadOutlined />} onClick={uploadClick}>Upload CSV</ConnectionButton>
                                    </Space>
                                </PopOverCard>
                            </Col>
                        </Row>
                    }
                    
                    <Row align="middle">
                        <Col span={1}>
                            <Popover placement="topLeft" title={popOverTitle} open={isTourOpen} trigger="" content={tourContent}>
                                <Button onClick={toggleFileUpload} ref={tourRef} type="text" icon={showFileUpload?<MinusOutlined style={{ color: '#9CA3AF' }}/>: <PlusOutlined style={{ color: '#9CA3AF' }} />}></Button>
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