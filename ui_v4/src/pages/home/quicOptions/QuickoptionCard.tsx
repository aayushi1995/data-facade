
import { WebHookIcon, DatabaseIcon, GridViewIcon, QuickOPIcon} from "@/assets/icon.theme"
import Icon from "@ant-design/icons"
import { Card, Col, Row, Typography } from "antd"
import { CardDescTypo, CardTitleTypo, StyledCard, StyledTypo1 } from "./QuickoptionCard.style"
import QuicOpIcon from "@assets/icons/library_add_check.svg"
export const QuickoptionCard = ()=>{
    const cardItems = [
        {
            icon: WebHookIcon,
            cardTitle: "Start a Scratchpad",
            cardDescription: "Start from a blank code block to build any request"
        },
        {
            icon: DatabaseIcon,
            cardTitle: "Setup A Database",
            cardDescription: "Connect a DataBase from available Data Sources"
        },
        {
            icon: GridViewIcon,
            cardTitle: "Create An App",
            cardDescription: "Create a new App to Organize and interact with insights"
        }
    ]
    const cards = (item:any)=>{
        return (
            <Col span={8}  >
            <StyledCard>
            <Icon style={{ color: '#0770E3'}} component={item.icon as React.ForwardRefExoticComponent<any>} />
            <CardTitleTypo>{item.cardTitle}</CardTitleTypo>
            <CardDescTypo ellipsis={{rows:1}}>{item.cardDescription}</CardDescTypo>
            </StyledCard>
            </Col>
        )
    }
    const cardContainer = cardItems.map(item=>cards(item))
    return(
        <>
        <StyledTypo1><Icon style={{ color: '#0770E3'}} component={QuickOPIcon as React.ForwardRefExoticComponent<any>} /> Start a Quick Option (Coming Soon)</StyledTypo1>
            <Row gutter={36}>
            {cardContainer}
            </Row>
        </>
    )
}