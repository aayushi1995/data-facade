import { CommentBlankIcon } from "@/assets/icon.theme"
import { LandingPageHeader } from "@/components/LandingPageHeader/LandingPageHeader"
import { AppsContainer } from "@/pages/apps/apps.style"
import { TutsCard } from "@/pages/home/tutsAndDocs/TutsCard"
import { setLocalStorage } from "@/utils"
import { getUniqueId } from "@/utils/getUniqueId"
import Icon, { SearchOutlined } from "@ant-design/icons"
import { Button, Col, Input, Row, Typography } from "antd"
import { useNavigate } from "react-router-dom"
import { RecenetChats } from "../RecentChats/Recentchats"
import { BtnText, ChatCreateButton, HeaderTextTypo, HeaderTypo, InputStyle } from "./landingpage.style"

export const ChatLandingPage = ()=>{

    const HEADER_ENUMS = {
        title:"Your Chats",
        desc:"Manage all your Chats.",
        btnText:"Start new Chat",
        page:'chat',
        Ipplace:'Search for a Chat'
    }
    const ChatHisCard = ()=>{
        return(
            <>
            <Col span={5}>
            {/* <ChatStyledCard>
                <div style={{display:'flex',flexDirection:'row',gap:20}}>
                <Icon style={{ color: '#0770E3'}}  component={CommentBlankIcon as React.ForwardRefExoticComponent<any>} />
                <TextTypo2 onClick={() => handleChatClick(props?.Id)} ><Paragraph ellipsis={{ rows: 1}}>{props?.Name || props?.Id}</Paragraph></TextTypo2>
                </div>
            </ChatStyledCard> */}
            </Col>
            </>
        )
    }
    
    return(
        <>
        <LandingPageHeader HeaderTitle={HEADER_ENUMS.title} HeaderDesc={HEADER_ENUMS.desc} BtnText={HEADER_ENUMS.btnText} HeaderPage={HEADER_ENUMS.page} IpPlaceholder={HEADER_ENUMS.Ipplace}/>
        
        <AppsContainer >
        <RecenetChats/>             
        </AppsContainer >
        <div>
        <TutsCard/>
        </div>
        </>
    )
}