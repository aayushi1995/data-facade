import React, { useEffect, useState } from 'react'
import {  PlayCircleOutlined } from "@ant-design/icons"
import {  Button, Card, Col, Collapse, Divider, Modal, Pagination, Row, Select, Space, Table, Typography } from "antd"
import useFetchActionDefinitions, { fetchAllActions } from '@/hooks/actionDefinitions/useFetchActionDefinitions'
import ActionDefinitionActionType from '@/utils/actionDefinitionLabels'
import { Skeleton } from 'antd';
import Input from 'antd/es/input/Input'
import styled from 'styled-components'
import { v4 } from 'uuid'
import { Fetcher } from '@/generated/apis/api'

const StyledInput = styled(Input)`
    width: 100%;
    margin: 20px 0px;
    height: 50px;
    border-radius: 0px;
`

const RenderAllActions = ({handleActionSelection}:any) => {
    const [displayActions, setDisplayActions] = useState<any[]>([])
    const [showSeeAllModal, setShowSeeAllModal]= useState(false)
    // input field search state
    const [search, setSearch] = useState<any>("")
    
    // hook
    const [allActionDefinitionsData, allActionDefinitionsIsLoading] = useFetchActionDefinitions({filter: {IsVisibleOnUI:true}})
    
    useEffect(() => {
        handleFillingActions(allActionDefinitionsData)
    },[allActionDefinitionsData])


    const handleFillingActions = (allActionDefinitionsData:any) => {
        const filteredActionDefinitions:any[] = allActionDefinitionsData?.filter?.((actionDefinition: { ActionDefinition: { model: { ActionType: string } } }) => actionDefinition?.ActionDefinition?.model?.ActionType !== ActionDefinitionActionType.WORKFLOW && actionDefinition.ActionDefinition?.model?.ActionType !== ActionDefinitionActionType.AUTO_FLOW)
        const filteredActions = [...filteredActionDefinitions].slice(0,3)
        setDisplayActions(filteredActions)
    }

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
                    <ActionsBlock search={search} handleActionClick={handleActionClick}/>
                 
                    </Row>
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

const ActionsBlock = ({search = "", handleActionClick}:any) => {
    const [actions, setActions] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchActions()
        setCurrentPage(1)
        console.log(search)
    },[])

    // hook
    useEffect(() => {
        fetchActions()
        setCurrentPage(1)
        console.log(search)
    },[search])
    
    const fetchActions = async () => {
        await Fetcher.fetchData('GET', '/getActionDefinitionDetails',  {IsVisibleOnUI:true} || {}).then((response) => {
            if(response && response?.length > 0) {
                handleFillingActions(response)
            }
        }).catch((error) => {
            console.log(error)
        })
       
    }

    const handleFillingActions = (allActionDefinitionsData:any) => {
        const filteredActionDefinitions:any[] = allActionDefinitionsData?.filter?.((actionDefinition: { ActionDefinition: { model: { ActionType: string } } }) => actionDefinition?.ActionDefinition?.model?.ActionType !== ActionDefinitionActionType.WORKFLOW && actionDefinition.ActionDefinition?.model?.ActionType !== ActionDefinitionActionType.AUTO_FLOW)
        setActions(filteredActionDefinitions || allActionDefinitionsData)
        console.log(filteredActionDefinitions || allActionDefinitionsData)
    }

    const actionsArray = !search && search === "" ? getData(currentPage, pageSize, actions) : getData(currentPage, pageSize, actions?.filter?.((obj:any) => obj?.ActionDefinition?.model?.UniqueName?.toLowerCase()?.includes(search.toLowerCase())))
    
    console.log(actionsArray,'actionsArray')


    return (
        <>
             {actionsArray.length > 0 ? actionsArray.map((action: any, index: number) => {
                return (
                        <ActionCard key={action?.id} action={action} index={index} handleActionClick={handleActionClick}/>
                    ) 
                }) : <Skeleton active />
            }
            <MyPagination
                total={actions.length}
                current={currentPage}
                onChange={setCurrentPage}
            />
        </>
       
    )
}


let pageSize = 6;

const getData = (current:number, pageSize:number, data:any) => {
    // Normally you should get the data from the server
    return data.slice((current - 1) * pageSize, current * pageSize);
  };

  // Custom pagination component
const MyPagination = ({ total, onChange, current,}:any) => {
    return (
    <div style={{marginTop:'10px', width:'100%', textAlign:'center'}}>
      <Pagination
        onChange={onChange}
        total={total}
        current={current}
        pageSize={6}
      />
      </div>
    );
  };

export default RenderAllActions