import React, { useEffect, useState } from 'react'
import {  PlayCircleOutlined } from "@ant-design/icons"
import {  Button, Card, Col, Collapse, Divider, Modal, Row, Select, Space, Table, Typography } from "antd"
import useFetchActionDefinitions from '@/hooks/actionDefinitions/useFetchActionDefinitions'
import ActionDefinitionActionType from '@/utils/actionDefinitionLabels'
import { Skeleton } from 'antd';
import Input from 'antd/es/input/Input'
import styled from 'styled-components'

const StyledInput = styled(Input)`
    width: 100%;
    margin: 20px 0px;
    height: 50px;
    border-radius: 0px;
`

const RenderAllActions = ({handleActionSelection}:any) => {
    const [actions, setActions] = useState<any[]>([])
    const [displayActions, setDisplayActions] = useState<any[]>([])
    const [showSeeAllModal, setShowSeeAllModal]= useState(false)

    // input field search state
    const [search, setSearch] = useState<any>("")
    const [filteredActions, setFilteredActions] = useState<any[]>([])
    

    // hoooks
    const [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError]  = useFetchActionDefinitions({filter: {IsVisibleOnUI:true}})
    
    useEffect(() => {
        const filteredActionDefinitions:any[] = allActionDefinitionsData?.filter?.(actionDefinition => actionDefinition?.ActionDefinition?.model?.ActionType !== ActionDefinitionActionType.WORKFLOW && actionDefinition.ActionDefinition?.model?.ActionType !== ActionDefinitionActionType.AUTO_FLOW)
        setActions(filteredActionDefinitions)
        const filteredActions = [...filteredActionDefinitions].slice(0,3)
        setDisplayActions(filteredActions)
        setFilteredActions(filteredActionDefinitions)

    },[allActionDefinitionsData])

    const handleSeeAll = (value:boolean) => {
        setShowSeeAllModal(value)
    }

    const handleActionClick = (obj:any) => {
        handleActionSelection(obj)
        setShowSeeAllModal(false)
    }

    // filter search
    const handleSearch = (event:any) => {
        setSearch(event?.target?.value)
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
                                                <Button type="link" shape="circle" icon={<PlayCircleOutlined style={{ fontSize: 24 }}/>}  onClick={() => handleActionClick(action)}/>
                                                <Typography.Text strong >{action?.ActionDefinition?.model?.UniqueName}</Typography.Text>
                                                <Typography.Paragraph ellipsis={true}>{action?.ActionDefinition?.model?.DisplayName}</Typography.Paragraph>
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
                <StyledInput placeholder="Search for Action" onChange={handleSearch} style={{ width: '100%' }} />
                <Row gutter={8} justify="space-between" style={{overflow:'scroll', height: '500px'}}>
                    {search === "" ? actions.map((action: any, index: number) => {
                        return (
                                <ActionCard key={action?.id} action={action} index={index} handleActionClick={handleActionClick}/>
                            ) 
                        }) : actions?.filter?.((obj:any) => obj?.ActionDefinition?.model?.UniqueName?.toLowerCase()?.includes(search.toLowerCase()))?.map((action: any, index: number) => {
                            return (
                                    <ActionCard action={action} index={index} handleActionClick={handleActionClick}/>
                                )
                            })
                    }</Row>
                </Modal>
        </>
    )
}

const ActionCard = ({action, index, handleActionClick}:any) => {
    return (
        <Col sm={8} key={index}>
        <Card size="small">
            <Space direction="vertical" style={{ width: '100%' }} size="small">
                <Button type="link" shape="circle" icon={<PlayCircleOutlined style={{ fontSize: 24 }} />} onClick={() => handleActionClick(action)}/>
                <Typography.Text strong >{action?.ActionDefinition?.model?.UniqueName}</Typography.Text>
                <Typography.Paragraph ellipsis={true}>{action?.ActionDefinition?.model?.DisplayName}</Typography.Paragraph>
            </Space>
        </Card>
    </Col>
    )
}

export default RenderAllActions