import { Button, Collapse, Divider, Row, Space, Table,Empty, Modal, Select } from "antd"
import {ReactComponent as EditIcon} from '@assets/icons/edit.svg'
import { ChatContext } from "@/contexts/ChatContext/index";
import DataSource from "./DataSource";
import { DeepDiveCollapsable, StyledPanel, PlaceHolderText } from './DeepDive.styles'
import { useContext, useEffect, useRef, useState } from "react";
import ReactAceEditor from "@/components/Editor";
import useCreateActionInstance, { MutationContext } from "@/hooks/actionInstance/useCreateActionInstance";
import { v4 } from "uuid";
import { TableProperties, TablePropertiesColumns } from "@/generated/entities/Entities";
import { labels } from "@/helpers/constant";
import dataManager from "@/api/dataManager";
import RenderAllActions from "./RecommendedActions";
import ActionOutput from "../actionOutput";
import OutputComponent from "../TableChartComponent/OutputComponent";

interface IObj {
    email: string;
    actionInstance: {
        ActionType: string;
        CreatedBy: string;
        DefinitionId: string;
        DisplayName: string;
        Id: string;
        ProviderInstanceId: any;
        RenderTemplate: boolean;
        RenderedTemplate: any;
    };
    actionExecutionToBeCreatedId: string;
}

const DeepDiveDetails = ({defaultCode, actionExecutionDetailQuery, ResultTableName}:any) => {
    // chat global context 
    const chatContext = useContext(ChatContext)

    // ref to scroll into view
    const bottomRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const topRef = useRef() as React.MutableRefObject<HTMLInputElement>;


    // local states 
    const [actionExecutionId, setActionExecutionId] = useState<any>(false)
    const [autoCompleteionData, setAutoCompleteionData] = useState<any>([])
    const [providerInstance, setProviderInstance] = useState<string | null>(null)
    const [activeKey, setActiveKeys] = useState<string[]>(defaultCode ? ['2','4']: ['1'])

  

    useEffect(() => {
        setProviderInstance("231646c0-3e6c-4d35-aff6-ebdd62089c3e")
        fetchAutoCompletionData("231646c0-3e6c-4d35-aff6-ebdd62089c3e") 
        // scroll to output 
        scrollToTop()  
    },[])

    useEffect(() => {
        fetchAutoCompletionData(providerInstance)     
    },[providerInstance])

    const handleDataSource = (providerInstance:string) => {
        setProviderInstance(providerInstance)
    }

    const { createActionInstanceAsyncMutation } = useCreateActionInstance({
        asyncOptions: {
            onMutate: () => {
            }
        },
        syncOptions: {
            onMutate: () => {
                console.log('syncOptions')
            }
        }
    })

    const handleRunQuery = async (code:any) => {

            const newExecutedId = v4()
            const actionInstanceId = v4()
            let obj = {
                email: 'aayushi@data-facade.com',
                actionInstance: {
                        ActionType: "Profiling",
                        CreatedBy: "aayushi@data-facade.com",
                        DefinitionId: "0",
                        DisplayName: "Aayushi Action",
                        Id: actionInstanceId,
                        ProviderInstanceId: actionExecutionDetailQuery?.ActionInstance?.ProviderInstanceId,
                        RenderTemplate: false,
                        RenderedTemplate: code
                    },
                    actionExecutionToBeCreatedId: newExecutedId
                }
           
            createActionInstanceAsyncMutation.mutate((obj as MutationContext), {
                    onSuccess: () => {
                        setActionExecutionId(newExecutedId)
                    }
            })

            // set Collapsible
            setActiveKeys(['2','4'])
            // scroll to output
            scrollToBottom()
    }

    const fetchAutoCompletionData = async (providerInstanceId:any) => {
       
        const columnsToRetrieve: TablePropertiesColumns[] = ['Id', 'UniqueName']

           const filter: TableProperties = {
                   ProviderInstanceID: providerInstanceId
           }
           const fetchedDataManager = dataManager.getInstance as { retreiveData: Function }

           fetchedDataManager.retreiveData(labels.entities.TableProperties, {
               filter: filter,
               columnsToRetrieve: columnsToRetrieve
           }).then((response:any) => {
               handleReponseData(response)  
           })   

           fetchedDataManager?.retreiveData(labels.entities.ColumnProperties, {
               filter: filter
           }).then(((response:any) => {
               handleReponseData(response)  
           }))
 
       }

    const handleReponseData = (response:any) => {
        let newResponse = response?.map((obj:any) => ({name: obj?.UniqueName, description: obj?.UniqueName}))
        autoCompleteionData ? setAutoCompleteionData([...autoCompleteionData, ...newResponse]) : setAutoCompleteionData([...newResponse])
    }
    
    const handleActive = (value:any) => {
        setActiveKeys(value)
    }
    
    const scrollToBottom = () => {
        bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
    const scrollToTop = () => {
        topRef?.current?.scrollIntoView({ behavior: "smooth" });
    }

    return (

        <DeepDiveCollapsable>
            <div ref={topRef}></div>
              <Collapse ghost style={{fontSize: '20px'}} activeKey={activeKey} onChange={handleActive}>
                    <StyledPanel
                        header="Data Source"
                        key="1"
                        showArrow={false}
                        extra={<EditIcon/>}
                      
                    >
                        <DataSource handleDataSource={handleDataSource}/>
                    </StyledPanel>
            
                    <StyledPanel
                        header="Scripts"
                        key="2"
                        showArrow={false}
                        extra={<EditIcon/>}
                       
                    >
                        <ReactAceEditor defaultCode={defaultCode} handleRunQuery={handleRunQuery} autoCompleteionData={autoCompleteionData}/>
                    </StyledPanel>
            
                    <StyledPanel
                        header="Actions"
                        key="3"
                        showArrow={false}
                        extra={<EditIcon/>}
                       
                    >
                        <RenderAllActions/>
                    </StyledPanel>
           
                    <StyledPanel
                        header="Output"
                        key="4"
                        showArrow={false}
                        extra={<EditIcon/>}
                       
                    >
                        {defaultCode && !actionExecutionId && (
                            <OutputComponent dataGridColumns={chatContext?.tableData[ResultTableName]?.dataGridColumns || []} dataGridRows={chatContext?.tableData[ResultTableName]?.dataGridRows || []} tableName={ResultTableName}/>
                        )}
                        {actionExecutionId && (
                            <ActionOutput actionExecutionId={actionExecutionId} />
                        )}
                        {!defaultCode && !actionExecutionId && <PlaceHolderText>After setting up Data Source and Actions, your final data tables will be here.</PlaceHolderText>}
                       <Divider plain>Insights</Divider>
                       {/* Charts Output */}
                    </StyledPanel>
            </Collapse>
            {/* Actions on Deep Dive Terminal */}
            <Row justify="end" gutter={8} ref={bottomRef}>
                <Space>
                    <Button type="primary" ghost>Discard Changes</Button>
                    <Button type="primary">Save</Button>
                </Space>
            </Row>
        </DeepDiveCollapsable>
  
        
     
    )
}

export default DeepDiveDetails


