import { DeepdiveIcon } from "@/assets/icon.theme"
import { SmallDashOutlined } from "@ant-design/icons"
import { Button, Card, Col, Row } from "antd"
import styled from "styled-components"

const ActionCard = styled(Card)`
    border-radius: 0px 8px 8px 8px;
    border: 0.87659px solid #D1D5DB;
`

interface ActionOutputInterface {
    toggleDeepDive?: ()=> void,
    showDeepdive?:boolean
}

const ActionOutput = ({ toggleDeepDive,showDeepdive }: ActionOutputInterface) => {
    return (
        <Row gutter={18} align="middle">
            <Col span={showDeepdive?16:12}>
                <ActionCard headStyle={{ border: 'none' }} size="small" title="Marketting vs Sales" extra={<Button type="link" icon={<SmallDashOutlined />} />}>
                    action out put graph
                </ActionCard>
            </Col>
            <Col>
                <Button onClick={toggleDeepDive} type="primary" ghost icon={<DeepdiveIcon style={{ fontSize: '20px' }} />}>{showDeepdive ?'Hide Deep Dive':'Deep Dive'}</Button>
            </Col>
        </Row>
    )
}

export default ActionOutput