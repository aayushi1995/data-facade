import Tooltip from 'antd/es/tooltip';
import React, { useRef } from 'react'
import { ChatInput, StyledChatInputWrapper, StyledCardChartFooterWrapper, ChatFooterButtonWrapper, StyledSendIcon, StyledDBConnectionIcon, StyledUploadIcon,StyledFileReplaceIcon, FlexBox } from './ChatFooter.styles'


const ChatFooter = ({handleSend, scrollToBottom}:any) => {
    let inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    
    const handleClick = () => {
        handleSend(inputRef.current.value,'user')
        inputRef.current.value = '';
        scrollToBottom();
    }
    const handleKeyDown = (event:any) => {
        if (event.key === 'Enter') {
           handleClick()
        }
    }

    return (
        <StyledCardChartFooterWrapper  bordered={true}>
            <FlexBox>
                <StyledChatInputWrapper>
                    <ChatInput type="text" placeholder='Type a message...' ref={inputRef} onKeyDown={handleKeyDown}/> 
                    <StyledSendIcon onClick={handleClick} onKeyDown={handleClick}/>
                </StyledChatInputWrapper>
                <ChatFooterButtonWrapper>
                    <Tooltip title="Database Connection">
                        <StyledDBConnectionIcon/>
                    </Tooltip>
                    <Tooltip title="File Upload">
                        <StyledUploadIcon/>
                    </Tooltip>
                    <Tooltip title="FindReplace">
                        <StyledFileReplaceIcon/>
                    </Tooltip>
                    
                    
                </ChatFooterButtonWrapper>
            </FlexBox>
            
		</StyledCardChartFooterWrapper>
    )
}
export default ChatFooter