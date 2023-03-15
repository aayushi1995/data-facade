import dataManager from "@/api/dataManager"
import { CommentBlankIcon } from "@/assets/icon.theme"
import { RouteContext } from "@/components/BrowserTab"
import { Chat } from "@/generated/entities/Entities"
import { TextTypo1 } from "@/pages/home/chatHeder/chatHeader.style"
import Icon from "@ant-design/icons"
import { Col, Row } from "antd"
import Paragraph from "antd/es/typography/Paragraph"
import { useContext, useEffect, useState } from "react"
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
    const handleChatClick= (id:any) => {
        handleNewTabWithId(id)
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
            <ChatStyledCard>
                <div>
                <Icon style={{ color: '#0770E3'}}  component={CommentBlankIcon as React.ForwardRefExoticComponent<any>} />
                <TextTypo2 onClick={() => handleChatClick(props?.Id)} ><Paragraph ellipsis={{ rows: 1}}>{props?.Name || props?.Id}</Paragraph></TextTypo2>
                </div>
                <TextTypo3>insight 10</TextTypo3>
            </ChatStyledCard>
            </Col>
            :<></>
        )
    }

    const top3ChatHistory = chatHistory.slice(0,3)
    return(<>
    
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
    </>)
}