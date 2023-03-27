
import { WebHookIcon, DatabaseIcon, GridViewIcon, QuickOPIcon} from "@/assets/icon.theme"
import Icon from "@ant-design/icons"
import { Card, Col, Row, Typography } from "antd"
import { CardDescTypo, CardTitleTypo, StyledCard, StyledTypo1 } from "./QuickoptionCard.style"
import QuicOpIcon from "@assets/icons/library_add_check.svg"
import { useNavigate} from "react-router-dom"

export const QuickoptionCard = ()=>{
    const cardItems = [
        {
            icon: WebHookIcon,
            cardTitle: "Start a Scratchpad",
            cardDescription: "Start from a blank code block to build any request",
            URL: "/playground?tabKey=playground"
        },
        {
            icon: DatabaseIcon,
            cardTitle: "Setup A Database",
            cardDescription: "Connect a DataBase from available Data Sources",
            URL: "/data?tabKey=data"
        },
        {
            icon: GridViewIcon,
            cardTitle: "Create An App (Coming Soon)",
            cardDescription: "Create a new App to Organize and interact with insights",
            URL: "/"
        }
    ]
    const Cards = (item:any)=>{

        const Navigate = useNavigate();
        return (
            <Col span={8}  >
            <StyledCard onClick={()=>Navigate(item.URL)}>
            <Icon style={{ color: '#0770E3'}} component={item.icon as React.ForwardRefExoticComponent<any>} />
            <CardTitleTypo>{item.cardTitle}</CardTitleTypo>
            <CardDescTypo ellipsis={{rows:1}}>{item.cardDescription}</CardDescTypo>
            </StyledCard>
            </Col>
        )
    }
    const cardContainer = cardItems.map(item=>Cards(item))
    return(
        <>
        <StyledTypo1><Icon style={{ color: '#0770E3'}} component={QuickOPIcon as React.ForwardRefExoticComponent<any>} /> Start a Quick Option</StyledTypo1>
            <Row gutter={36}>
            {cardContainer}
            </Row>
        </>
    )
}