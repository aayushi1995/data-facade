import { PlaygroundWrapper } from "./Playground.styles"
import { useEffect, useState } from "react";

import { ReactComponent as PlaygroundIcon } from '@assets/icons/webhook.svg'
import { ReactComponent as DatabaseIcon } from '@assets/icons/database.svg'
import { ReactComponent as PlayIcon } from '@assets/icons/play_circle.svg'

import DraggableSlider from "@/components/DraggableSlider";
import ReactAceEditor from "@/components/Editor";
import useCreateActionInstance, { MutationContext } from "@/hooks/actionInstance/useCreateActionInstance";
import { v4 } from "uuid";
import ActionOutput from "../chat/chatActionOutput/actionOutput";
import { TableProperties, TablePropertiesColumns } from "@/generated/entities/Entities";
import dataManager from "@/api/dataManager";
import { labels } from "@/helpers/constant";
import { Space } from "antd";

const iconStack = (handleClick:any) => [
    {
        id: new Date().getTime().toString(),
        value: 'playground',
        icon:<PlaygroundIcon/>,
        onClick: handleClick,
    },
    {
        id: new Date().getTime().toString(),
        value: 'database',
        icon:<DatabaseIcon/>,
        onClick: handleClick,
    },
    {
        id: new Date().getTime().toString(),
        value: 'actionrun',
        icon:<PlayIcon/>,
        onClick: handleClick,
    }
]


const Playground = () => {
    const [size, setSize] = useState<number[]>([96,3])
    const [visibleTab, setVisibleTab] = useState<string>('playground')
    const [executionId, setNewExecutedId]= useState('')
    const [autoCompleteionData, setAutoCompleteionData]= useState<any | undefined>()
    const [providerInstance, setProviderInstance] = useState('')

    useEffect(() => {
        fetchAutoCompletionData("e5956814-8477-4215-a087-dddeca6f0651")
    },[])

    const handleReponseData = (response:any) => {
        let newResponse = response?.map((obj:any) => ({name: obj?.UniqueName, description: obj?.UniqueName}))
        autoCompleteionData ? setAutoCompleteionData([...autoCompleteionData, ...newResponse]) : setAutoCompleteionData([...newResponse])
    }

    const fetchAutoCompletionData = async (providerInstanceId:any) => {
       
        const columnsToRetrieve: TablePropertiesColumns[] = ['Id', 'UniqueName']

           const filter: TableProperties = {
                   ProviderInstanceID: "e5956814-8477-4215-a087-dddeca6f0651"
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

    const handleTabClick = (value:string) => {
        if(value === 'playground') {
            setSize([100,3])
            setVisibleTab('playground')
        } else if (value === 'database'){
            setSize([60,40])
            setVisibleTab('database')
        } else if (value === 'actionrun') {
            setSize([60,40])
            setVisibleTab('actionrun')
        }
            

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

            // TODO: Is this intended ?
            let obj = {
                email: 'aayushi@data-facade.com',
                actionInstance: {
                        ActionType: "Profiling",
                        CreatedBy: "aayushi@data-facade.com",
                        DefinitionId: "0",
                        DisplayName: "Aayushi Action",
                        Id: actionInstanceId,
                        ProviderInstanceId: "e5956814-8477-4215-a087-dddeca6f0651",
                        RenderTemplate: false,
                        RenderedTemplate: code
                    },
                    actionExecutionToBeCreatedId: newExecutedId
            }
           
            createActionInstanceAsyncMutation.mutate((obj as MutationContext), {
                onSuccess: () => {
                    setNewExecutedId(newExecutedId)
                }
            })

            // set Collapsible
            // setActiveKeys(['2','4'])
            // // scroll to output
            // scrollToBottom()
    }
    
    return (
        <PlaygroundWrapper>
            <DraggableSlider 
                size={[...size]}
                leftChild={<LeftPlayGround handleRunQuery={handleRunQuery} executionId={executionId}/>}
                rightChild={
                    <RightPanel visibleTab={visibleTab}/>
                }
                iconStack={iconStack(handleTabClick)}
                activeTab={visibleTab}
                />
        </PlaygroundWrapper>
    )
}

export default Playground

const LeftPlayGround = ({handleRunQuery,executionId}:any) => {
    return (
        <div>
              <ReactAceEditor handleRunQuery={handleRunQuery}/>
              <ActionOutput actionExecutionId={executionId} showFooter={false}/>
        </div>
      
    )
}

const RightPanel = ({visibleTab}:any) => {
    return (
        <div style={{padding:'20px'}}>
            {visibleTab === "actionrun" ? <div> Action run </div> : <div>Data Source run </div>}
        </div>
    )
}