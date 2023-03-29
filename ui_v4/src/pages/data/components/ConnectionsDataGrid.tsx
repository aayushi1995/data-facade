import DraggableSlider from '@/components/DraggableSlider';
import { LandingPageHeader } from '@/components/LandingPageHeader/LandingPageHeader';
import { ReactQueryWrapper } from '@/components/ReactQueryWrapper/ReactQueryWrapper';
import { DATA_CONNECTIONS_ROUTE } from '@/contexts/ConnectionsContext';
import { Fetcher } from '@/generated/apis/api';
import { ActionInstance, ProviderInstance } from '@/generated/entities/Entities';
import { ProviderCardView, ProviderInstanceStat } from '@/generated/interfaces/Interfaces';
import { labels } from '@/helpers/constant';
import ActionExecutionStatus from '@/helpers/enums/ActionExecutionStatus';
import FetchActionExecutionDetails from '@/hooks/actionOutput/fetchActionExecutionDetails';
import { useDeleteActionInstance } from '@/hooks/connections/hooks/useDeleteActionInstance';
import { useDeleteProviderInstance } from '@/hooks/connections/hooks/useDeleteProviderInstance';
import useSyncProviderInstance from '@/hooks/connections/hooks/useSyncProviderInstance';
import useUpdateSyncActionInstance from '@/hooks/connections/hooks/useUpdateSyncActionInstance';
import { useGetTables } from '@/hooks/tableView/AllTableViewHooks';
import { ChatWrapperStyled } from '@/pages/chat/Chat/Chat.styles';
import Icon, { CloudSyncOutlined, DeleteFilled, MoreOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Col, Collapse, Divider, Input, Modal, Popover, Row, Switch, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { generatePath, useNavigate } from "react-router";
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
// import { ViewFailedActionExecution } from "../../../../common/components/action_execution/view_action_execution/VIewActionExecution";
import { ConnectionDialogContent, ProviderIcon } from './ConnectionDialogContent';
import { CardUniqeName, ConnectionCard, ConnectorCardHeader, LastSyncMsg, NumTableDetails, StyledIconContainer, StyledRow, TableNameTypo } from './ConnectionPage.style';
import { IconStack } from './constants';
import TableDetails from './TableDetails';
import TableChatIcon from '@/assets/icons/table_chart.svg'
// type DataGridRow = ProviderCardView & {id?: string} & {providerName?: string}
interface DataGridRow {
    [key: string]: any;
  }

interface ConnectionDataGridProps {
    filter?: ProviderInstance,
    showSyncStatus?: boolean
}

export interface ProviderInstanceConfig {
    SyncActionInstanceId?: string
}

export interface SyncActionExecutionOutput {
    State?: string,
    Value?: {
        TableProperties?: any[]
    } 
}
export const formDateText = (timestamp?: number) => {
    const dateFormatter = new Intl.DateTimeFormat([], {year: "numeric", month: "numeric", day: "numeric",hour: "numeric", minute: "numeric", second: "numeric", hour12: true})
        
    if(timestamp!==undefined){
        return dateFormatter.format(new Date(timestamp))
    } else {
        return ""
    }
}
export const TextCell = (props: { text?: string}) => {
        
    const textComponent = <Typography>
                            {props?.text}
                        </Typography>
    
    if(!!props?.text) {
        return (
            <>
            <Tooltip title={props?.text}>
                {textComponent}
            </Tooltip>
            </>
        )
    } else {
        return textComponent
    }
}
export const TimestampCell = (props: {timestamp?: number}) => {
    const { timestamp } = props
    const dateString = formDateText(timestamp)

    if( timestamp ) {
        return <>{dateString}</>
    } else {
        return <>NA</>
    }
}
export const DATA_CONNECTION_DETAIL_ROUTE = `${DATA_CONNECTIONS_ROUTE}/detail/:ProviderInstanceId`
export const ConnectionsDataGrid = (props: ConnectionDataGridProps) => {
    const providerCardQuery = useQuery([labels.entities.ProviderInstance, "Card", props.filter], () => Fetcher.fetchData("GET", "/providerCardView", { IsVisibleOnUI: true, ...props.filter }))
    const history = useNavigate()
    const [executionId, setExecutionId] = React.useState<string | undefined>()
    const onClickConnectionCard = (selectedConnectionId: string) => history(generatePath(DATA_CONNECTION_DETAIL_ROUTE, { ProviderInstanceId: selectedConnectionId }));
    const [rows, setRows] = React.useState<DataGridRow[]>([])
    const [actionExecutionFailed, setActionExecutionFailed] = React.useState(false)
    const [syncActionExecutionConfig, setSyncActionExecutionConfig] = React.useState<{
        creatingExecution: boolean,
        polling: boolean,
        queryEnabled: boolean
    }>({creatingExecution: false, polling: false, queryEnabled: false})

    const [tablesSynced, setTablesSynced] = React.useState<number | undefined>()
    
    const actionExecutionDetailQuery = FetchActionExecutionDetails({actionExecutionId: executionId, queryOptions: {
        enabled: syncActionExecutionConfig.queryEnabled
    }})

    const syncyProviderMutation = useSyncProviderInstance({
        mutationOptions: {
            onMutate: () => {
                setSyncActionExecutionConfig({
                    creatingExecution: true,
                    polling: false,
                    queryEnabled: false
                })
                setTablesSynced(undefined)
            },
            onSettled: () => {
                setSyncActionExecutionConfig({
                    creatingExecution: false,
                    polling: true,
                    queryEnabled: true
                })
            }
        }
    })

    React.useEffect(() => {
        const actionStatus = actionExecutionDetailQuery.data?.ActionExecution?.Status
        if(actionStatus === ActionExecutionStatus.FAILED || actionStatus === ActionExecutionStatus.COMPLETED) {
            setSyncActionExecutionConfig(config => ({
                ...config,
                queryEnabled: false
            }))
            if(actionStatus === ActionExecutionStatus.FAILED) {
                setActionExecutionFailed(true)
            } else {
                const aeOutput = JSON.parse(actionExecutionDetailQuery.data?.ActionExecution?.Output || "{}") as SyncActionExecutionOutput
                setTablesSynced(aeOutput?.Value?.TableProperties?.length || 0)
            }
        }
    }, [actionExecutionDetailQuery.data])

    React.useEffect(() => {
        if(!!providerCardQuery.data){
            setRows(providerCardQuery.data)
        }
    }, [providerCardQuery.data])


    const handleForceSync = (providerInstanceId?: string) => {
        const executionId = uuidv4()
        setExecutionId(executionId)
        syncyProviderMutation.mutate({
            providerInstanceId: providerInstanceId,
            syncDepthConfig: {
                providerSyncAction: true,
                SyncDepth: "TablesAndColumns"
            },
            withExecutionId: executionId,
            recurrenceConfig: {}
        })
    }

    const NewRows = Object.values(rows.reduce((acc, obj) => {
        const category : string = obj?.ProviderDefinition?.Id || '';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(obj);
        return acc;
      }, {}));
    if(providerCardQuery.isSuccess && providerCardQuery.data.length==0){
        history('/data/source')
    }

    const [size, setSize] = useState([96,3])
    const [visibleTab, setVisibleTab] = useState<string>('connections')
    const [connectionVisible , setConnectionVisible] = useState<boolean>(true)
    const [tableVisible , setTableVisible] = useState<boolean>(false)
    useEffect(()=>{
        if(connectionVisible && tableVisible){
            setSize([40,50])
            setVisibleTab('tables')
        }else if(connectionVisible && !tableVisible){
            setSize([96,3])
            setVisibleTab('connections')
        }else if(!connectionVisible && tableVisible){
            setSize([3,96])
            setVisibleTab('tables')
        }else if(!connectionVisible && ! tableVisible){
            setSize([96,3])
            setConnectionVisible(true)
            setVisibleTab('connections')
        }
    },[tableVisible,connectionVisible])
    const handleTabClick = (value:string) => {
        if(value === 'connections') {
            setConnectionVisible(!connectionVisible)
        } else if (value === 'tables'){
            setTableVisible(!tableVisible)
        } 
    }
    const { Panel } = Collapse;
    const DataItemsCard = (props: { ProviderDefinition: { Id: any; }; ProviderInstance: ProviderInstance | undefined; ProviderInstanceStat: ProviderInstanceStat | undefined; SyncActionInstance: ActionInstance | undefined; })=>{
        const tableQuery = useGetTables({ options: {}, tableFilter:{ProviderInstanceID:  props.ProviderInstance?.Id}})
        const [showTablesOp , setShowTablesOp] = useState<boolean>(false)
        return(<>
        <ConnectionCard style={{boxShadow:showTablesOp?'0 0 8px rgba(0,128,255,1)':'' }} onClick={()=>setShowTablesOp(!showTablesOp)}>
                    <ConnectionCell providerDefination={props?.ProviderDefinition} providerInstance={props?.ProviderInstance} providerInstancestat={props?.ProviderInstanceStat} handleForceSync={handleForceSync} syncActionInstance={props?.SyncActionInstance}/>
                    
                    {/* <DefaultProviderCell providerInstance={row?.ProviderInstance!}/> */}
        </ConnectionCard>
        {showTablesOp && <div>
                {tableQuery.data?.map(tab=>
                    <StyledRow  onClick={()=>{history(`/data/${tab.TableUniqueName}?tabKey=${tab.TableUniqueName}`);setTableVisible(true)}}><img style={{margin:'0px 10px 0px 0px'}} src={TableChatIcon}/><TableNameTypo>{tab.TableUniqueName}</TableNameTypo></StyledRow>
                    )}
            </div>}
        </>
        )
    }
    const DataCards = ()=>{
        return(
            <Collapse ghost>
                {NewRows?.map(rowd=>
                <>
                
                    <Panel style={{borderBottom:'1px solid #E5E7EB'}} header={<DataSourceCell providerName={rowd[0]?.ProviderDefinition?.UniqueName} />} key={rowd[0]?.ProviderDefinition?.Id ||""}>
                    <Row gutter={[16,16]}>
                    {rowd.map((row: { ProviderDefinition: { Id: any; }; ProviderInstance: ProviderInstance | undefined; ProviderInstanceStat: ProviderInstanceStat | undefined; SyncActionInstance: ActionInstance | undefined; })=>
                    <Col span={tableVisible?24:8}>
                        <DataItemsCard ProviderDefinition={row.ProviderDefinition} ProviderInstance={row?.ProviderInstance} ProviderInstanceStat={row?.ProviderInstanceStat} SyncActionInstance={row?.SyncActionInstance}/>
                    {/* <ConnectionCard>
                    <ConnectionCell providerDefination={row.ProviderDefinition} providerInstance={row?.ProviderInstance} providerInstancestat={row?.ProviderInstanceStat} handleForceSync={handleForceSync} syncActionInstance={row?.SyncActionInstance}/>
                    <DefaultProviderCell providerInstance={row?.ProviderInstance!}/>
                    </ConnectionCard> */}
                    {

                    }
                    </Col>
                    )}
                    </Row>
                    </Panel>
                </>
                )}
                
            </Collapse>
        )
    }
    const HEADER_ENUMS = {
        title:"Your Connections",
        desc:"Manage all your Connections.",
        btnText:"+  Add Data Source",
        page:'data',
        Ipplace:'Search Connector, data base, table...'
    }
    return (<>
                <ReactQueryWrapper
                    isLoading={providerCardQuery.isLoading}
                    error={providerCardQuery.error}
                    data={providerCardQuery.data}
                    children={() => (
                <div>
                    <Modal open={syncActionExecutionConfig.creatingExecution} onCancel={() => setSyncActionExecutionConfig(config => ({...config, creatingExecution: false}))}>
                        <>Loading...</>
                    </Modal>
                    <Modal open={syncActionExecutionConfig.polling}>
                        <div>
                            <div>
                                <Typography>
                                    Syncing Connection
                                </Typography>
                            </div>
                            <div  style={{display: 'flex', justifyContent: 'flex-end'}} onClick={() => setSyncActionExecutionConfig(config => ({...config, polling: false}))}>
                                <Button aria-label="close" >
                                <Icon type="close" />
                                </Button>
                            </div>
                        
                        </div>
                        <div>
                            {tablesSynced !== undefined ? (
                                <Typography>
                                    {tablesSynced !==0 ? (
                                        <span>Connecting <b>{tablesSynced}</b> Tables</span>
                                    ) : (
                                        <span>Sync Complete</span>
                                    )}
                                    
                                </Typography>
                            ) : (
                                <React.Fragment>
                                    {actionExecutionFailed ? (
                                        <>Failed</>// <ViewFailedActionExecution actionExecutionDetail={actionExecutionDetailQuery.data || {}} />
                                    ) : (
                                        <>Loading...</>
                                    )}
                                    
                                </React.Fragment>
                            )}
                            
                        </div>
                    </Modal>
                </div> 
                 )}
                 />

        <DraggableSlider
            size={[...size]}
            leftChild={
                <ChatWrapperStyled>
                    {connectionVisible && 
                    <>
                {tableVisible?<></>:<LandingPageHeader HeaderTitle={HEADER_ENUMS.title} HeaderDesc={HEADER_ENUMS.desc} BtnText={HEADER_ENUMS.btnText} HeaderPage={HEADER_ENUMS.page} IpPlaceholder={HEADER_ENUMS.Ipplace} />}
                    <div style={{ margin: '30px 0px 0px 0px' }}>
                        {DataCards()}
                    </div></>
            }
                </ChatWrapperStyled>
            }
            rightChild={
                <>
                {tableVisible && <><TableDetails/></>}
                </>
            }
            iconStack={IconStack(handleTabClick)}
            activeTab={visibleTab}
        />
    
</>
            
    )
}

export const DataSourceCell = (props: {providerName?: string}) => {
    return (
        <div><Row>
            <StyledIconContainer>
            <ProviderIcon providerUniqueName={props.providerName} />
            </StyledIconContainer>
            <CardUniqeName style={{margin: '10px 0px 0px 12px'}}>{props.providerName} </CardUniqeName>
            </Row>
        </div>
    )
}

export const DetailsCell = (props: {numberOfTables?: number, providerType?: string}) => {
    const relatedEntity = props.providerType === 'DBTRepo' ? 'Application' : 'Tables'
    return (
        <NumTableDetails>
            {props.providerType === 'DBTRepo' ? (
                <></>
            ) : (
                <span>{props.numberOfTables || 0} {relatedEntity}</span>
            )}
            
        </NumTableDetails>
    )
}



export const ConnectionCell = (props: {providerDefination:any,providerInstance?: ProviderInstance,providerInstancestat?:ProviderInstanceStat, syncActionInstance?: ActionInstance, handleForceSync: (providerInstanceId?: string) => void}) => {
    const queryClient = useQueryClient()
    const updateActionInstanceMutation = useUpdateSyncActionInstance({})
    const deleteActionInstanceMutation = useDeleteActionInstance({
        mutationOptions: {
            onSuccess: () => queryClient.invalidateQueries([labels.entities.ProviderInstance, "Card"])
        }
    })
    const deleteProviderInstanceMutation = useDeleteProviderInstance({
        mutationOptions: {
            onSuccess: () => queryClient.invalidateQueries([labels.entities.ProviderInstance, "Card"])
        }
    })

    const deleteActionHandler =()=>{
        deleteActionInstanceMutation.mutate({
            filter: {Id: props.syncActionInstance?.Id},
            hard: true
        })
        handleDialogClose()
    }
    const [createActionInstanceDialog, setCreateActionInstanceDialog] = React.useState(false)
    const syncProviderInstanceScheduled = useSyncProviderInstance({
        mutationOptions: {
            onSuccess: () => {
                queryClient.invalidateQueries([labels.entities.ProviderInstance, "Card"])
                setCreateActionInstanceDialog(false)
            }
        }
    })
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const handleDialogClose = () => setDialogOpen(false)
    const handleDialogOpen = () => setDialogOpen(true)
    const [recurrenceInterval, setRecurrenceInterval] = React.useState<number | undefined>()
    
    const handleUpdateActionInstance = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.checked) {
            if(!!props.syncActionInstance) {
                updateActionInstanceMutation.mutate({
                    newProperties: {IsRecurring: true},
                    filter: {Id: props.syncActionInstance?.Id}
                })
            } else {
                setCreateActionInstanceDialog(true)
                // props?.handleCreateSyncActionInstance?.(props.providerInstance?.Id)
                
            }
        } else {
            if(!!props.syncActionInstance){
                handleDialogOpen()
            }
        }
    }

    const handleForceSync = () => {
        props.handleForceSync(props.providerInstance?.Id)
    }

    const handleRecurrenceChange = (recurrence: number) => {
        setRecurrenceInterval(recurrence > 0 ? recurrence * 60 : undefined)
    }
    
    const handleCreateSyncActionInstance = () => {
        syncProviderInstanceScheduled.mutate({
            providerInstanceId: props.providerInstance?.Id,
            syncDepthConfig: {
                providerSyncAction: true,
                SyncDepth: "TablesAndColumns",
            },
            recurrenceConfig: {
                recurrent: true,
                Interval: recurrenceInterval,
                CopyActionInstanceIdInConfig: true
            }
        })

    }
 
    const handleDeleteProvider = () => {
        deleteProviderInstanceMutation.mutate({
            filter: {Id: props.providerInstance?.Id},
            hard: true
        })
    }

   
    return (
        <div>
            <Modal open={createActionInstanceDialog}>
                <div>
                    <div>
                        <Typography>
                            Schedule Sync {props.providerInstance?.Name}
                        </Typography>
                    </div>
                    <div>
                        <Button aria-label="close" onClick={() => setCreateActionInstanceDialog(false)}>
                        <Icon type="close" />
                        </Button>
                    </div>
                </div>
                <div>
                    <Input placeholder="Recurrence Interval in Minutes" type="number" onChange={(event) => handleRecurrenceChange(event.target.value as unknown as number)}/>
                    <div>
                        {syncProviderInstanceScheduled.isLoading ? (
                            <>Loading...</>
                        ) : (
                            <Button disabled={!!!recurrenceInterval} onClick={handleCreateSyncActionInstance}>Schedule</Button>
                        )}
                    </div>
                </div>
            </Modal>
            <Modal
                title={'Turn off Sync'}
                open={dialogOpen}
                onOk={deleteActionHandler}
                onCancel={handleDialogClose}
            >
                Are you sure you want to turn off sync ? This may result in runtime failure for all linked scheduled actions and flows with the connection.
            </Modal>
            <Row>
                <Col span={12}>
                    <ConnectorCardHeader >{props.providerInstance?.Name}</ConnectorCardHeader >
                </Col>
                <Col span={10}></Col>
                <Col span={2}>
                <Popover placement="bottomRight" showArrow={false} content={
                    <>
                    <Tooltip title="Delete">
                        <Button type="text" onClick={handleDeleteProvider}>
                            <DeleteFilled /> Delete Connection
                        </Button >
                    </Tooltip>
                    <Divider />
                    <LastSyncMsg>Connected on <TimestampCell timestamp={props.providerInstance?.CreatedOn}/></LastSyncMsg>
                    </>} 
                >
                    <MoreOutlined style={{ transform: 'rotate(90deg)', marginLeft: '15px' }} />
                </Popover>
                </Col>
            </Row>
            
            <div style={{ margin: '10px 0px 10px 0px' }}>
                <DetailsCell numberOfTables={props.providerInstancestat?.NumberOfTables} providerType={props.providerDefination?.ProviderType} />
            </div>
            <Row style={{ margin:'10px 0px 10px 0px'}}>
                <LastSyncMsg>Last synced on <TimestampCell timestamp={props.providerInstance?.LastSyncedOn}/></LastSyncMsg>
                <span onClick={handleForceSync} style={{color:'#0770E3',cursor:'pointer',display:'flex',marginLeft:'auto'}}>
                <SyncOutlined style={{color:'#0770E3',marginRight:'10px'}}/> Sync Now
                </span>
            </Row>
    
            <JobStatusCell providerStats={props.providerInstancestat} />
            <Row style={{margin:'20px 0px 0px 0px'}}>
                <Col span={2}>
            <Switch 
                            disabled={deleteActionInstanceMutation.isLoading}
                            checked={props.syncActionInstance?.IsRecurring || false}
                            onChange={()=>handleUpdateActionInstance}
                        />
            </Col>
            <Col span={6}>
            <Button type="text" disabled={!!!recurrenceInterval} onClick={handleCreateSyncActionInstance}>Schedule</Button>
            </Col>
            <Col span={6}></Col>
            <Col span={10}>
            <Input placeholder="Minutes" type="number" onChange={(event) => handleRecurrenceChange(event.target.value as unknown as number)}/>
            </Col>
            </Row>
            
        </div>
    )
}


export const JobStatusCell = (props: {providerStats?: ProviderInstanceStat}) => {
    return (
        <Row gutter={16}>
            <Col span={6}>
            <StatusCard text={props.providerStats?.NumberOfRunningExecutions || 0} color={'#B45309'} background='#FEF3C7' border='0.5px solid #F59E0B' title='Running'/>
            </Col>
            <Col span={6}>
            <StatusCard text={props.providerStats?.NumberOfFailedExecutions || 0} color={'#B91C1C'} background='#FEE2E2' border='0.5px solid #EF4444' title='Failed'/>
            </Col>
            <Col span={6}>
            <StatusCard text={props.providerStats?.NumberOfCompletedExecutions || 0} color={'#047857'} background='#ECFDF5' border='0.5px solid #10B981' title='Completed'/>
            </Col>
            <Col span={6}></Col>
            </Row>
    )
}

const SyncStatusCell = (props: {providerStats?: ProviderInstanceStat}) => {
    return (
        <Row gutter={16}>
            <Col span={6}>
            <StatusCard text={props.providerStats?.SyncRunning || 0} color={'#B45309'} background='#FEF3C7' border='0.5px solid #F59E0B' title='Active'/>
            </Col>
            <Col span={6}>
            <StatusCard text={props.providerStats?.SyncFailed || 0} color={'#B91C1C'} background='#FEE2E2' border='0.5px solid #EF4444' title='Errors'/>
            </Col >
            <Col span={6}>
            <StatusCard text={props.providerStats?.SyncCompleted || 0} color={'#047857'} background='#ECFDF5' border='0.5px solid #10B981' title='Successful'/>
            </Col>
            <Col span={6}></Col>
            </Row>
    )
}


export const StatusCard = (props: {background: string, text: string | number, title?: string,color?: string, border?: string}) => {
    return (
        <Tooltip title={props.title || ""}>
            <StatusCardOnly style={{ backgroundColor: props.background ,border:props.border}}>
                <StatusCardTypography style={{color:props.color}}>    
                    {props.text} {props.title}
                </StatusCardTypography>
            </StatusCardOnly>
        </Tooltip>
    )
}

const StatusCardOnly = styled.div(({ theme }) => ({
    padding: '4px',
    height: "30px",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: "4px"
}))

const StatusCardTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'SF Pro Display'",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "11.5435px",
    lineHeight: "160%",
    letterSpacing: "0.0961957px",
    color: "cardInfoFormCreatedByStringColor.main"
}))

export const DefaultProviderCell = (props: {providerInstance: ProviderInstance}) => {
    const queryClient = useQueryClient()
    const updateProviderInstanceMutation = useMutation(
        (config: {isDefaultProvider: boolean}) => Fetcher.fetchData("PATCH", "/updateProviderInstance", {filter: {Id: props.providerInstance.Id}, newProperties: {IsDefaultProvider: config.isDefaultProvider}}),
        {
            onSuccess: () => queryClient.invalidateQueries([labels.entities.ProviderInstance, "Card"])
        }
    )

    const handleDefaultProviderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateProviderInstanceMutation.mutate({isDefaultProvider: event.target.checked})
    }

    return (
        <div>
            <Tooltip title="Default Provider">
                        <Switch 
                            disabled={updateProviderInstanceMutation.isLoading}
                            checked={props.providerInstance?.IsDefaultProvider || false}
                            onChange={()=>handleDefaultProviderChange}
                        />
            </Tooltip>
        </div>
    )
}