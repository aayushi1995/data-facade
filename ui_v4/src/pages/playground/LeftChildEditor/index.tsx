import dataManager from '@/api/dataManager'
import ReactAceEditor from './Editor/index'
import { TableProperties, TablePropertiesColumns } from '@/generated/entities/Entities'
import { labels } from '@/helpers/constant'
import useCreateActionInstance, { MutationContext } from '@/hooks/actionInstance/useCreateActionInstance'
import ActionOutput from '@/pages/chat/chatActionOutput/actionOutput'
import Button from 'antd/es/button'
import Space from 'antd/es/space'
import React, { useEffect, useRef, useState } from 'react'
import { v4 } from 'uuid'
import ButtonGroup from './ButtonGroup'
import { PlaygroundLeftChildWrapper, StyledInput, StyledLabel, StyledLanguageSelect, FlexBox } from './LeftChildEditor.styles'
import ReactAce from 'react-ace/lib/ace'

const LeftChildEditor = () => {

    const [executionId, setNewExecutedId]= useState<string | undefined>('')
    const [autoCompleteionData, setAutoCompleteionData]= useState<any | undefined>()    
    const [languageMode, setlanguageMode] = useState('mysql')


    useEffect(() => {
        // provider instance ID
        fetchAutoCompletionData()
    },[])

    const handleReponseData = (response:any) => {
        let newResponse = response?.map((obj:any) => ({name: obj?.UniqueName, description: obj?.UniqueName}))
        autoCompleteionData ? setAutoCompleteionData([...autoCompleteionData, ...newResponse]) : setAutoCompleteionData([...newResponse])
    }

    const fetchAutoCompletionData = async () => {
       
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
    }

    const handleChange = (value:any) => {
        setlanguageMode(value)
    }

    const codeRef = React.useRef<ReactAce>(null)

    // Button group handlers

    const handleUndo = () => {
        console.log('dummy click')
    }
    const handleHistory = () => {
        console.log('dummy click')
    }
    const handleAutoRenew = () => {
        console.log('dummy click')
    }
    const handleMoreOptions = () => {
        console.log('dummy click')
    }

    const handleRun = () => {
        handleRunQuery && handleRunQuery(codeRef?.current?.refEditor?.outerText)
    }

    return (
        <PlaygroundLeftChildWrapper>
            <StyledLabel>Playground Name:</StyledLabel>
            <FlexBox>
                <Space size={7} style={{marginBottom: '20px'}}>
                    <StyledInput type="text" placeholder='Playground Name'/>
                    <StyledLanguageSelect
                        defaultValue="SQL"
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={[
                            { value: 'mysql', label: 'SQL' },
                            { value: 'python', label: 'Python' },
                        ]}
                        >
                    </StyledLanguageSelect>
                </Space>
                <Space>
                    <ButtonGroup 
                        handleRun={handleRun}
                        handleUndo={handleUndo}
                        handleHistory={handleHistory}
                        handleAutoRenew={handleAutoRenew}
                        handleMoreOptions={handleMoreOptions}
                        />
                </Space>
            </FlexBox>
          
            <ReactAceEditor languageType={languageMode} handleRunQuery={handleRunQuery} codeRef={codeRef} autoCompleteionData={autoCompleteionData}/>
            {executionId && <ActionOutput actionExecutionId={executionId} showFooter={false}/>}
        </PlaygroundLeftChildWrapper>
    )
}

export default LeftChildEditor