import { Col, Row } from 'antd';
import Tooltip from 'antd/es/tooltip';
import React, { useRef } from 'react'
import { ChatInput, StyledChatInputWrapper, StyledCardChartFooterWrapper, StyledSendIcon, StyledDBConnectionIcon, StyledUploadIcon, StyledFileReplaceIcon } from './ChatFooter.styles'


const ChatFooter = ({ handleSend, scrollToBottom,loading }: any) => {
    let inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;


    const handleClick = () => {
        handleSend(inputRef.current.value, 'user')
        inputRef.current.value = '';
        scrollToBottom()
    }
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleClick()
        }
    }

    return (

        <StyledCardChartFooterWrapper>
            <Row gutter={18} align="middle">
                <Col span={22}>
                    <StyledChatInputWrapper>
                        <ChatInput disabled={loading} type="text" placeholder='Type a message...' ref={inputRef} onKeyDown={handleKeyDown} />
                        <StyledSendIcon onClick={handleClick} onKeyDown={handleClick} />
                    </StyledChatInputWrapper>

                </Col>
                <Col span={2}>
                    <Row justify="space-between">
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



    )
}
export default ChatFooter