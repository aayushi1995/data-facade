
import { GridView2Icon, LocalMallIcon, Diversity2Icon} from "@/assets/icon.theme"
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import Icon from "@ant-design/icons"
import { Col, Row, Avatar } from "antd"
import { StyledTypo1 } from "../quicOptions/QuickoptionCard.style"
import { CardDescTypo, CardTitleTypo, StyledCardApp } from "./AppinOrg.style"
import dummyJPG from "@assets/images/dummy.jpg"
import dummy2JPG from "@assets/images/dummy2.jpg"
export const AppinOrg = ()=>{
    const cardItems = [
        {
            icon: LocalMallIcon,
            cardTitle: "Sales Performance",
            cardDescription: "Main insights and numbers on Sales, including all platforms. Features interactions and automations",
            avtar: <><Avatar.Group>
                <Avatar src="https://joesch.moe/api/v1/random?key=1" />
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<AntDesignOutlined />} />
            </Avatar.Group></>,
            bgImg: dummyJPG
        },
        {
            icon: Diversity2Icon,
            cardTitle: "Team Engagement",
            cardDescription: "Track team engagement and results related to sales and administrative teams",
            avtar: <><Avatar.Group>
                <Avatar src="https://joesch.moe/api/v1/random?key=1" />
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<AntDesignOutlined />} />
            </Avatar.Group></>,
            bgImg: dummy2JPG
        },
        {
            icon: undefined,
            cardTitle: "",
            cardDescription: "",
            avtar:<></>,
            bgImg: undefined
        }
    ]
    const cards = (item:any)=>{
        return (
            <Col span={8}  >
            <StyledCardApp backgroundImage={item.bgImg}>
            <Icon style={{ color: '#0770E3'}} component={item.icon as React.ForwardRefExoticComponent<any>} />
            <CardTitleTypo>{item.cardTitle}</CardTitleTypo>
            <CardDescTypo ellipsis={{rows:2}}>{item.cardDescription}</CardDescTypo>
                    {item.avtar}
            </StyledCardApp>
            </Col>
        )
    }
    const cardContainer = cardItems.map(item=>cards(item))
    return(
        <>
        <StyledTypo1><Icon style={{ color: 'green'}} component={GridView2Icon as React.ForwardRefExoticComponent<any>} /> Apps in Your Organization (Coming Soon)</StyledTypo1>
            <Row gutter={36}>
            {cardContainer}
            </Row>
        </>
    )
}