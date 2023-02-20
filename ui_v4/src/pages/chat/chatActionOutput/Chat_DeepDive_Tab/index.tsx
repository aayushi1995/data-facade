import React from 'react'
import {Button} from 'antd'
import { StyledWrapper, CustomButton } from './Chat_DeepDive_Tab.styles'
import { ReactComponent as CommentChatIcon } from '../../../../assets/icons/commentChat.svg'
import { ReactComponent as TerminalIcon } from '../../../../assets/icons/terminal.svg'

const ChatComponentIconTabExperience = ({showDeepDive, handleChatClick, handleTerminalClick}:any) => {
    return (
        <StyledWrapper>
            <CustomButton type="text" size='middle' icon={<CommentChatIcon />} onClick={handleChatClick} showDeepDive={showDeepDive}/>
            <CustomButton type="text" size='middle' icon={<TerminalIcon />} onClick={handleTerminalClick} showDeepDive={!showDeepDive}/>
        </StyledWrapper>
    )
}

export default ChatComponentIconTabExperience