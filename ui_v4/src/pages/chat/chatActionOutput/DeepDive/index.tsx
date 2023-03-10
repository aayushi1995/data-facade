import { getActionDefinitionDetails } from "@/actions/chat.actions";
import dataManager from "@/api/dataManager";
import ReactAceEditor from "@/components/Editor";
import AppContext from "@/contexts/AppContext";
import { ChatContext,SetChatContext } from "@/contexts/ChatContext/index";
import { Fetcher } from "@/generated/apis/api";
import { TableProperties, TablePropertiesColumns } from "@/generated/entities/Entities";
import { labels } from "@/helpers/constant";
import ActionDefinitionId from "@/helpers/enums/ActionDefinitionId";
import ActionDefinitionQueryLanguage from "@/helpers/enums/ActionDefinitionQueryLanguage";
import ProviderInstanceId from "@/helpers/enums/ProviderInstanceId";
import useCreateActionInstance, { MutationContext } from "@/hooks/actionInstance/useCreateActionInstance";
import { ReactComponent as EditIcon } from '@assets/icons/edit.svg';
import { Button, Collapse, Divider, Row, Space, Tooltip } from "antd";
import React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import ReactAce from "react-ace/lib/ace";
import { v4 } from "uuid";
import ActionOutput from "../actionOutput";
import OutputComponent from "../TableChartComponent/OutputComponent";
import DataSource from "./DataSource";
import { DeepDiveCollapsable, PlaceHolderText, StyledPanel } from './DeepDive.styles';
import RenderAllActions from "./RecommendedActions";

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

const DeepDiveDetails = ({defaultCode, actionExecutionDetailQuery, ResultTableName, handleActionSelected}:any) => {
    // chat global context 
    const chatContext = useContext(ChatContext)
    const appContext: any = useContext(AppContext);
    const setChatContext = useContext(SetChatContext)

    // ref to scroll into view
    const bottomRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const topRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const codeRef = React.useRef<ReactAce>(null) as any

    // local states 
    const [autoCompleteionData, setAutoCompleteionData] = useState<any>([])
    const [providerInstance, setProviderInstance] = useState<any | undefined>(undefined)
    const [activeKey, setActiveKeys] = useState<string[]>(defaultCode ? ['2','4', '1']: ['1'])
    
    // store generated ID for future use
    const [actionExecutionId, setActionExecutionId] = useState<any>(false)
    const [newExecutedId, setnewExecutedId]= useState('')
    const [code, setCode] = useState('')
    const [actionDef, setActionDef]= useState<any>('')
    const [allowEditActionDefinition, setAllowEditActionDefinition]= useState(true)



    useEffect(() => {
        // scroll to output 
        scrollToTop()  
        handleFetchActionDefinitionById(actionExecutionDetailQuery?.ActionDefinition?.Id)
    },[])

    useEffect(() => {
        let PID:string
        if(providerInstance! && typeof providerInstance === "object"){
            PID = providerInstance?.options?.[0]?.Id
        } else {
            PID = providerInstance
        }
        fetchAutoCompletionData(PID)     
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
        
            setCode(code)

            const newExecutedId = v4()
            const actionInstanceId = v4()

            setnewExecutedId(newExecutedId)
            setActionExecutionId(actionInstanceId)

            const previousProviderInstanceId = actionExecutionDetailQuery?.ActionDefinition?.QueryLanguage === ActionDefinitionQueryLanguage.PYTHON ? ProviderInstanceId.PYTHON_LAMBDA_DEV_INSTANCE : actionExecutionDetailQuery?.ActionInstance?.ProviderInstanceId
            const definitionId = actionExecutionDetailQuery?.ActionDefinition?.QueryLanguage === ActionDefinitionQueryLanguage.PYTHON ? "01" : ActionDefinitionId.SCRATCHPAD_ACTION
            
            let obj = {
                email: appContext?.userEmail || "admin@data-facade.com",
                actionInstance: {
                        ActionType: "Profiling",
                        CreatedBy: appContext?.userEmail || "admin@data-facade.com",
                        DefinitionId: definitionId,
                        DisplayName: "Aayushi Action",
                        Id: actionInstanceId,
                        ProviderInstanceId: previousProviderInstanceId ,
                        RenderTemplate: false,
                        RenderedTemplate: code,
                        DataProviderInstanceId: providerInstance
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

    const handleActionSelection = (data:any) => {
        // send all data for executing action
        handleActionSelected({
            action: data,
            providerInstanceId: providerInstance,
            executionId: newExecutedId || actionExecutionDetailQuery?.ActionExecution?.Id || undefined
        })
    }

    const handleFetchActionDefinitionById = (id?:string) => {
        getActionDefinitionDetails(id).then((response) => {
            if(response?.[0]?.ActionTemplatesWithParameters?.[0]?.actionParameterDefinitions.length > 0) {
                setAllowEditActionDefinition(false)
            }
            setActionDef({...response})
        }).catch((error) => {
            if(error) {
                console.log(error)
            } else {
                console.log("Action Definition not found")
            }
            
        })
    }

    const handleSaveClick = () => {
       
        let obj = {
            ActionDefinitionForm: true,
            UpdatedAction: {
                ActionDefinition: {
                    model: {
                        ...actionDef?.[0]?.ActionDefinition?.model,
                        DeepDiveConfig: "[]",
                        UpdatedBy: appContext?.userEmail || "admin@datafacade.com",
                        UpdatedOn: new Date().getTime()
                    },
                    tags: [],
                },
                ActionTemplatesWithParameters: [{
                    model: {
                        ...actionDef?.[0].ActionTemplatesWithParameters[0]?.model,
                        Text: code
                    },
                    actionParameterDefinitions: [],
                    tags:[]
                }]
            }
            
        }
        handleActionDefinitionUpdationCall(obj)
    }
    
    const handleActionDefinitionUpdationCall = (obj:any) => {
        dataManager.getInstance.patchData('ActionDefinition',obj).then((_response:any) => {            
            setChatContext({
                type: "setActionOwner",
                payload: {
                    actionData: {
                        actionId: obj?.UpdatedAction?.ActionDefinition?.model?.Id,
                        actionUpdatedBy: obj?.UpdatedAction?.ActionDefinition?.model?.UpdatedBy,
                    }
                }
            })

        }).catch((error:any) => {
            console.log(error)
        })

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
                        <ReactAceEditor codeRef={codeRef} defaultCode={defaultCode || ''} language={actionExecutionDetailQuery?.ActionDefinition?.QueryLanguage} handleRunQuery={handleRunQuery} autoCompleteionData={autoCompleteionData}/>
                    </StyledPanel>
            
                    <StyledPanel
                        header="Actions"
                        key="3"
                        showArrow={false}
                        extra={<EditIcon/>}
                       
                    >
                        <RenderAllActions handleActionSelection={handleActionSelection}/>
                    </StyledPanel>
           
                    <StyledPanel
                        header="Output"
                        key="4"
                        showArrow={false}
                        extra={<EditIcon/>}
                       
                    >
                        {defaultCode && !actionExecutionId && (
                            <OutputComponent dataGridColumns={chatContext?.tableData?.[ResultTableName]?.dataGridColumns || []} dataGridRows={chatContext?.tableData?.[ResultTableName]?.dataGridRows || []} tableName={ResultTableName || ''}/>
                        )}
                        {actionExecutionId && (
                            <ActionOutput actionExecutionId={actionExecutionId} showFooter={false}/>
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
                        {!allowEditActionDefinition 
                        ? <Tooltip placement="topRight" title={"Use the reference button to edit the action"}>
                            <Button type="primary" onClick={handleSaveClick} disabled={true}>Save</Button>
                        </Tooltip> 
                        : <Button type="primary" onClick={handleSaveClick}>Save</Button>}
                </Space>
            </Row>
            
        </DeepDiveCollapsable>
    )
}


export default DeepDiveDetails




