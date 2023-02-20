import React, { useEffect, useState } from 'react'
import { EditOutlined, PlayCircleOutlined, ThunderboltOutlined } from "@ant-design/icons"
import { Button, Card, Col, Collapse, Divider, Modal, Row, Select, Space, Table, Typography } from "antd"
import useFetchActionDefinitions from '@/hooks/actionDefinitions/useFetchActionDefinitions'
import ActionDefinitionActionType from '@/utils/actionDefinitionLabels'
import { Skeleton } from 'antd';

const RenderAllActions = () => {
    const [actions, setActions] = useState<any[]>([])
    const [displayActions, setDisplayActions] = useState<any[]>([])
    const [showSeeAllModal, setShowSeeAllModal]= useState(false)

    // hoooks
    const [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError]  = useFetchActionDefinitions({})
    
    useEffect(() => {
        const filteredActionDefinitions:any[] = allActionDefinitionsData.filter(actionDefinition => actionDefinition?.ActionDefinition?.model?.ActionType !== ActionDefinitionActionType.WORKFLOW && actionDefinition.ActionDefinition?.model?.ActionType !== ActionDefinitionActionType.AUTO_FLOW)
        setActions(filteredActionDefinitions)
        const filteredActions = [...filteredActionDefinitions].slice(0,3)
        setDisplayActions(filteredActions)

    },[allActionDefinitionsData])

    const handleSeeAll = (value:boolean) => {
        setShowSeeAllModal(value)
    }

    return (
        <>
        <div>
            <Row gutter={8} justify="space-between" >
                {/* initial 4 actions and See All Button */}
                    {allActionDefinitionsIsLoading ? <Skeleton active />
                        : displayActions?.map((action: any, index: number) => {
                            return (
                               
                                    <Col sm={8} key={index}>
                                        <Card size="small">
                                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                                <Button type="link" shape="circle" icon={<PlayCircleOutlined style={{ fontSize: 24 }} />} />
                                                <Typography.Text strong >{action?.ActionDefinition?.model?.UniqueName}</Typography.Text>
                                                <Typography.Paragraph ellipsis={true}>{action.action?.ActionDefinition?.model?.DisplayName}</Typography.Paragraph>
                                            </Space>
                                        </Card>
                                    </Col>
                               
                                        
                            )
                            })}
                    </Row>
            
                <div><Button onClick={() => handleSeeAll(true)}>See All</Button></div>
                </div>
                {/* Modal */}
                <Modal title="All Actions" open={showSeeAllModal} onOk={() => handleSeeAll(false)} onCancel={() => handleSeeAll(false)} >
                <Row gutter={8} justify="space-between" style={{overflow:'scroll', height: '500px'}}>
                    {actions.map((action: any, index: number) => {
                        return (
                                <Col sm={8} key={index}>
                                <Card size="small">
                                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                                        <Button type="link" shape="circle" icon={<PlayCircleOutlined style={{ fontSize: 24 }} />} />
                                        <Typography.Text strong >{action?.ActionDefinition?.model?.UniqueName}</Typography.Text>
                                        <Typography.Paragraph ellipsis={true}>{action.action?.ActionDefinition?.model?.DisplayName}</Typography.Paragraph>
                                    </Space>
                                </Card>
                            </Col>
                            
                            )
                        })
                    }</Row>
                </Modal>
        </>
    )
}

export default RenderAllActions