import Avatar from 'antd/es/avatar'
import { FlexBox } from '../ChatFooter/ChatFooter.styles'
import { ChatBlockWrapper, ChatMetaData, ChatStyles, StyledTime, StyledUserName } from './ChatBlock.styles'

const ChatBlock = ({message, id, type, ...props}:any) => {
    return (
        <ChatBlockWrapper {...props}>
            <FlexBox style={{alignItems: 'flex-end'}}>
                <div>
                    <ChatMetaData {...props}><StyledUserName>{props.username || 'DataFacade'} </StyledUserName> <StyledTime>{new Date(props.time).getHours()+':'+new Date(props.time).getMinutes() }</StyledTime></ChatMetaData>
                    <ChatStyles {...props} key={id} type={type}>{props?.children === undefined ? message : props?.children}</ChatStyles>
                </div>
                <div style={{marginLeft: '10px'}}>
                    {props.from === "user" && <Avatar style={{ backgroundColor: '#0770E3', verticalAlign: 'middle' }} size="default" gap={5}>
                        {props.username.charAt(0)}
                    </Avatar>}
                </div>
            </FlexBox>
        </ChatBlockWrapper>     
    )
}

export default ChatBlock