import dataManager from "@/api/dataManager"
import { CommentBlankIcon } from "@/assets/icon.theme"
import { RouteContext } from "@/components/BrowserTab"
import { BtnText, ChatCreateButton, HeaderTextTypo, HeaderTypo, InputStyle } from "@/components/LandingPageHeader/LandingPageHeader.style"
import { HomeChatContext } from "@/contexts/HomeChatContext"
import { Chat } from "@/generated/entities/Entities"
import { TextTypo1 } from "@/pages/home/chatHeder/chatHeader.style"
import { setLocalStorage } from "@/utils"
import { getUniqueId } from "@/utils/getUniqueId"
import Icon, { SearchOutlined } from "@ant-design/icons"
import { Col, Input, Row } from "antd"
import Paragraph from "antd/es/typography/Paragraph"
import React from "react"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChatCardContainer, ChatStyledCard, TextTypo2, TextTypo3 } from "./Recent.style"

export const RecenetChats = ()=>{

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
    const handleChatClick= (id:any,name?:string) => {
        handleNewTabWithId(id,name)
    }
    const ChatCard = ({handleChatClick, ...props}:any)=>{
        const [showCard,setShowCard] = useState<boolean>(true)
        const styles = `
    .my-typography {
      margin-bottom: 0em;
    }
  `;
        return(
            showCard?
            <Col span={8}>
            <ChatStyledCard onClick={() => handleChatClick(props?.Id , props?.Name)}>
                <div>
                <Icon style={{ color: '#0770E3'}}  component={CommentBlankIcon as React.ForwardRefExoticComponent<any>} />
                <TextTypo2><Paragraph ellipsis={{ rows: 1}}>{props?.Name || props?.Id}</Paragraph></TextTypo2>
                </div>
                <TextTypo3></TextTypo3>
            </ChatStyledCard>
            </Col>
            :<></>
        )
    }
    const HEADER_ENUMS = {
        title:"Your Chats",
        desc:"Manage all your Chats.",
        btnText:"Start new Chat",
        page:'chat',
        Ipplace:'Search for a Chat'
    }
    const navigate = useNavigate()
    const [searchText, setSearchText] = React.useState<string>('');
    const { myValue ,setMyValue } = useContext(HomeChatContext);
    const handleSearchChange = (e:any)=>{
        setSearchText(e.target.value)
        setMyValue(e.target.value)
    }
    const onMenuItemClick =()=>{
        let chatID = getUniqueId();
        setLocalStorage(`chat_${chatID}`, chatID)
        navigate(`/chats/${chatID}?tabKey=New Chats`);
    }
    const searchPredicate = (obj:Chat) => !!searchText && obj?.Name ?
        (obj?.Name||"").toLowerCase().includes(searchText.toLowerCase()) : true;
    const top3ChatHistory = chatHistory.filter(searchPredicate).slice(0,3)
    return(<>
        <>
        <Row style={{marginTop:'35px'}}>
            <Col span={6}>
                <HeaderTypo>{HEADER_ENUMS.title}</HeaderTypo>
                <HeaderTextTypo>{HEADER_ENUMS.desc}</HeaderTextTypo>
            </Col>
            <Col span={10}>
                
            </Col>
            <Col span={5} style={{paddingRight:'20px'}}>
            <Input
                        prefix={<SearchOutlined style={{color:"#9CA3AF"}}/>} size="large"
                        id="search connector"
                        value={searchText}
                        onChange={handleSearchChange}
                        placeholder="Search Connector"
                        style={InputStyle} 
                    />
            </Col>
            <Col span={3}>
                <ChatCreateButton block onClick={onMenuItemClick}>
                    <BtnText>{HEADER_ENUMS.btnText}</BtnText>
                </ChatCreateButton>
            </Col>
        </Row>
        </>
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
                {
                    (chatHistory.length!=0 && top3ChatHistory.length==0)?
                    <TextTypo2 >
                        No Chat found related <i>{searchText}</i> ,<br/><br/> Please start a new Chat !
                    </TextTypo2 >
                    :
                    <></>
                }
            </ChatCardContainer>
    </>)
}