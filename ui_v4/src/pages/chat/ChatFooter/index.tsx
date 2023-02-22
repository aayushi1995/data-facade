import { ConnectionHistoryIcon } from '@/assets/icon.theme';
import { getLocalStorage, setLocalStorage } from '@/utils';
import { BulbOutlined, CloseOutlined, FileExcelOutlined, MinusOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Popover, Row, Space, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ChatInput, ConnectionButton, PopOverCard, StyledCardChartFooterWrapper, StyledChatInputWrapper, StyledSendIcon } from './ChatFooter.styles';


const ChatFooter = ({ handleSend, loading }: any) => {
    let inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const shouldShowTour = getLocalStorage('isTourOpen') === "open" ? false : true;
    const [isTourOpen, setIsTourOpen] = useState(shouldShowTour);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const tourRef = useRef(null);

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
        handleSend({text: inputRef.current.value}, 'user')
        inputRef.current.value = '';
        inputRef.current.focus()
    }
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleClick()
        }
    }

    const toggleFileUpload = () => {
        setShowFileUpload(!showFileUpload)
    }

    const popOverTitle = () => <Row justify="space-between"><Col><BulbOutlined style={{ color: '#3488E4' }} /> Getting Insights</Col><Col><Button onClick={() => onCloseTour()} size="small" type="link" icon={<CloseOutlined style={{ fontSize: 8 }} />} /></Col></Row>

    const tourContent = () => <div style={{ width: 300 }}><Typography.Text style={{ fontSize: 12 }}>Remember, you can always start a chat by connecting to a data source, sending us a file, or resuming the conversation based on previous file connections.</Typography.Text></div>

    return (

        <Row>
            <Col span={24}>
                <StyledCardChartFooterWrapper>
                    {
                        showFileUpload &&
                        <Row>
                            <Col>
                                <PopOverCard bordered={false} size="small">
                                    <Space direction='vertical' style={{ width: '100%' }}>
                                        <ConnectionButton block type='text' icon={<FileExcelOutlined />}>Connect Google Sheets</ConnectionButton>
                                        <ConnectionButton block type='text' icon={<ConnectionHistoryIcon />}>Previously Connected</ConnectionButton>
                                        <ConnectionButton block type='text' icon={<UploadOutlined />}>Upload CSV</ConnectionButton>
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
                                <ChatInput disabled={loading} type="text" placeholder="Type a message..." ref={inputRef} onKeyDown={handleKeyDown} />
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