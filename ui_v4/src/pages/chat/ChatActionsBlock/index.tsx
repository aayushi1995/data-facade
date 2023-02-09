import { Button, Grid } from 'antd'
import React from 'react'
import { FlexBox } from '../ChatFooter/ChatFooter.styles'
import { ChatActionsBlockStyled } from './ChatActionsBlock.styles'

const ChatActionsBlock = ({actions}:any) => {
    return (
        <ChatActionsBlockStyled>
            {actions?.map((m:any) => {
                return (
                    <Button type="default" size='large' onClick={m.handleClickHandler} key={m.id} style={{color:'#0770E3', border: '1px solid #0770E3'}}>
                        {m.label}
                    </Button>
                )
            })}
        </ChatActionsBlockStyled>
        
    )
}

export default ChatActionsBlock