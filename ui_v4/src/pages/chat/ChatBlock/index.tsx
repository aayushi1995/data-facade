import Avatar from 'antd/es/avatar'
import { FlexBox } from '../ChatFooter/ChatFooter.styles'
import { ChatBlockWrapper, ChatMetaData, ChatStyles, StyledTime, StyledUserName } from './ChatBlock.styles'

const ChatBlock = ({message, id, type, ...props}:any) => {
   
    const getTime = (time:any)=>{
        var date = new Date(time).toLocaleDateString()
        var hours = new Date(time).getHours()
        var minutes = new Date(time).getMinutes()
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        var minute = minutes < 10 ? '0'+minutes : minutes;
        var strTime = date +" "+ hours + ':' + minute + ' ' + ampm;
        return (strTime)
    }

    return (
        <ChatBlockWrapper {...props}>
            <FlexBox style={{alignItems: 'flex-end'}}>
                <div>
                    {(type=='recommended_actions' || type=='confirmation')?<></>:
                        <ChatMetaData {...props}><StyledUserName>{props?.username || 'DataFacade'} </StyledUserName> <StyledTime>{getTime(Number.isNaN(props.time) ? new Date() : props.time)}</StyledTime></ChatMetaData>
                    }
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