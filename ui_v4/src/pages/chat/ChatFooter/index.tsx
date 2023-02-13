import { Col, Row } from 'antd';
import Tooltip from 'antd/es/tooltip';
import React, { useEffect, useRef } from 'react'
import { ChatInput, StyledChatInputWrapper, StyledCardChartFooterWrapper, StyledSendIcon, StyledDBConnectionIcon, StyledUploadIcon, StyledFileReplaceIcon } from './ChatFooter.styles'


const ChatFooter = ({ handleSend, scrollToBottom, loading }: any) => {
    let inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);


    const handleClick = () => {
        handleSend(inputRef.current.value, 'user')
        inputRef.current.value = '';
        scrollToBottom()
        inputRef.current.focus()
    }
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleClick()
        }
    }

    return (

        <Row>
            <Col span={24}>
                <StyledCardChartFooterWrapper>
                    <Row gutter={18} align="middle">
                        <Col span={20}>
                            <StyledChatInputWrapper>
                                <ChatInput disabled={loading} type="text" placeholder='Type a message...' ref={inputRef} onKeyDown={handleKeyDown} />
                                <StyledSendIcon onClick={handleClick} onKeyDown={handleClick} />
                            </StyledChatInputWrapper>

                        </Col>
                        <Col span={4}>
                            <Row justify="space-around">
                                <Col>
                                    <Tooltip title="Database Connection">
                                        <StyledDBConnectionIcon />
                                    </Tooltip>
                                </Col>


                                <Col>
                                    <Tooltip title="File Upload">
                                        <StyledUploadIcon />
                                    </Tooltip>
                                </Col>
                                <Col>
                                    <Tooltip title="FindReplace">
                                        <StyledFileReplaceIcon />
                                    </Tooltip>

                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </StyledCardChartFooterWrapper>
            </Col>
        </Row>



    )
}
export default ChatFooter