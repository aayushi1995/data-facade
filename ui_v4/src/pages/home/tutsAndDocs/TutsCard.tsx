import { Article2Icon, ArticleIcon, QuickOPIcon } from "@/assets/icon.theme"
import Icon from "@ant-design/icons"
import { Col, Row, Typography } from "antd"
import { StyledCard, StyledTypo1 } from "../quicOptions/QuickoptionCard.style"
import { CardDescTypo, CardTitleTypo } from "./Tuts.style"

export const TutsCard  =()=>{

    const cardItems = [
        {
            icon: ArticleIcon,
            title: "Data Facade Basics",
            description: "Start from  a blank code block to build any request"
        },
        {
            icon: ArticleIcon,
            title: "Creating Custom Actions",
            description: "Start from  a blank code block to build any request"
        },
        {
            icon: ArticleIcon,
            title: "Programming in Chat",
            description: "Start from  a blank code block to build any request"
        },
        {
            icon: undefined,
            title: "",
            desccription: ""
        }
    ]
    const cards = (item:any)=>{
        return (
            <Col span={6}  >
            <StyledCard>
            <Icon style={{ color: '#0770E3'}} component={item.icon as React.ForwardRefExoticComponent<any>} />
            <CardTitleTypo>{item.title}</CardTitleTypo>
            <CardDescTypo ellipsis={{rows:2}}>{item.description}</CardDescTypo>
            </StyledCard>
            </Col>
        )
    }
    const cardContainer = cardItems.map(item=>cards(item))
    return(
        <>
        <StyledTypo1><Icon style={{ color: '#0770E3'}} component={Article2Icon as React.ForwardRefExoticComponent<any>} /> Tutorials and Documentations (Coming Soon)</StyledTypo1>
            <Row gutter={36}>
            {cardContainer}
            </Row>
        </>
    )
}