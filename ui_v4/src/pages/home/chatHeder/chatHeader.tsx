import dataManager from "@/api/dataManager"
import { CommentBlankIcon } from "@/assets/icon.theme"
import { RouteContext } from "@/components/BrowserTab"
import AppContext from "@/contexts/AppContext"
import { HomeChatContext } from '@/contexts/HomeChatContext';
import { Chat } from "@/generated/entities/Entities"
import { ChatInput, StyledChatInputWrapper, StyledSendIcon } from "@/pages/chat/ChatFooter/ChatFooter.styles"
import { setLocalStorage } from "@/utils"
import { getUniqueId } from "@/utils/getUniqueId"
import Icon, { CloseOutlined } from "@ant-design/icons"
import { Card, Col, Row } from "antd"
import Paragraph from "antd/es/typography/Paragraph"
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChatCardContainer, ChatStyledCard, HeaderStyledTypo, HeaderWelcm, TextTypo1, TextTypo2 } from "./chatHeader.style"

export const ChatHeader = ()=>{
    const {handleNewTabWithId} = useContext(RouteContext)
    const [chatHistory, setChatHistory] = useState<Chat[] | []>([])
    
    useEffect(() => {
        dataManager.getInstance.retreiveData("Chat",{}).then((response:any) => {
           if(response.length > 0) {
                setChatHistory(response)
           }
        }).catch((error:any) => {
            console.log(error)
        })
    },[])
    const handleChatClick= (id:any, name?:string) => {
        handleNewTabWithId(id, name )
    }
    const navigate = useNavigate()
    const handleChatopen = ()=>{
        let chatID = getUniqueId();
        setLocalStorage(`chat_${chatID}`, chatID)
        navigate(`/chats/${chatID}?tabKey=New Chats`);
    }
    const ChatCard = ({handleChatClick, ...props}:any)=>{
        const [showCard,setShowCard] = useState<boolean>(true)

        return(
            showCard?
            <Col span={5}>
            <ChatStyledCard>
                <div style={{display:'flex',flexDirection:'row',gap:20}}>
                <Icon style={{ color: '#0770E3'}}  component={CommentBlankIcon as React.ForwardRefExoticComponent<any>} />
                <TextTypo2 onClick={() => handleChatClick(props?.Id, props?.Name)} ><Paragraph ellipsis={{ rows: 1}}>{props?.Name || props?.Id}</Paragraph></TextTypo2>
                <CloseOutlined style={{marginLeft:'auto',color:'#9CA3AF'}} onClick={()=>{setShowCard(false)}}/>
                </div>
            </ChatStyledCard>
            </Col>
            :<></>
        )
    }
    let inputRef = useRef<HTMLInputElement>(null);
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleChatopen()
        }
    }
    const { myValue, setMyValue } = useContext(HomeChatContext);
    const [chatMessage, setChatMessage] = useState<string | undefined>()
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setChatMessage(e.target.value)
        setMyValue(e.target.value || "")
    }
    const top3ChatHistory = chatHistory.slice(0,3)
    const appContext: any = useContext(AppContext)
    return(
        <div>
            <HeaderWelcm><HeaderStyledTypo>Welcome, {appContext.userName.split(' ')[0]}</HeaderStyledTypo></HeaderWelcm>
            <div>
            <StyledChatInputWrapper>
            <ChatInput placeholder="Ask Datafacade anything..." type="text" onChange={handleChange} value={chatMessage} onKeyDown={handleKeyDown} ref={inputRef}/>
            <StyledSendIcon  onClick={handleChatopen} onKeyDown={handleChatopen}/>
            </StyledChatInputWrapper>
            </div>
            <ChatCardContainer>
                <TextTypo1>
                    Or start where you let off:
                </TextTypo1>
                <Row gutter={10}>
                    {
                    top3ChatHistory?.map((obj:Chat) => {
                        return <ChatCard {...obj} handleChatClick={handleChatClick}/>
                    })
                }
                </Row>
            </ChatCardContainer>
        </div>
    )
}