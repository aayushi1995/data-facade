import { setLocalStorage } from "@/utils"
import { getUniqueId } from "@/utils/getUniqueId"
import { SearchOutlined } from "@ant-design/icons"
import { Col, Input, Row } from "antd"
import { useNavigate } from "react-router-dom"
import { BtnText, ChatCreateButton, HeaderTextTypo, HeaderTypo, InputStyle } from "./LandingPageHeader.style"

interface LandingPageHeaderProps{
    HeaderTitle?: string,
    HeaderDesc?: string,
    BtnText?: string,
    HeaderPage?: string,
    IpPlaceholder?: string
}

export const LandingPageHeader = (props:LandingPageHeaderProps)=>{
    const InputBox = () => <Input prefix={<SearchOutlined style={{color:"#9CA3AF"}}/>} size="large" placeholder={props.IpPlaceholder} bordered={false} style={InputStyle} />
    const navigate = useNavigate()
    const onMenuItemClick = () => {
            if(props.HeaderPage=='chat'){
            let chatID = getUniqueId();
            setLocalStorage(`chat_${chatID}`, chatID)
            navigate(`/chats/${chatID}?tabKey=New Chats`);
            }
            else if(props.HeaderPage=='playground'){
                navigate(`/playground?tabKey=playground`)
            }
    
    }
    return(
        <>
        <Row style={{marginTop:'35px'}}>
            <Col span={6}>
                <HeaderTypo>{props.HeaderTitle}</HeaderTypo>
                <HeaderTextTypo>{props.HeaderDesc}</HeaderTextTypo>
            </Col>
            <Col span={10}>
                
            </Col>
            <Col span={5} style={{paddingRight:'20px'}}>
                <InputBox/>
            </Col>
            <Col span={3}>
                <ChatCreateButton block onClick={onMenuItemClick}>
                    <BtnText>{props.BtnText}</BtnText>
                </ChatCreateButton>
            </Col>
        </Row>
        </>
    )
}