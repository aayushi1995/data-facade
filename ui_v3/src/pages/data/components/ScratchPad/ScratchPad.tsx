import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Editor from "@monaco-editor/react";
import { v4 as uuidv4 } from 'uuid'
import { ExecuteActionContext, ExecuteActionContextProvider } from '../../../execute_action/context/ExecuteActionContext';
import { useHistory } from 'react-router';
import useCreateActionInstance from '../../../execute_action/hooks/useCreateActionInstance';
import { ActionExecutionDetails } from '../../../apps/components/ActionExecutionHomePage';
import './styles.css'


const ScratchPad = ({dataSourceId, executionId, current}:any) => {
    const [code, setCode] = useState("")
    const history = useHistory()
    const executeActionContext = React.useContext(ExecuteActionContext)
    const [showTables, setShowTables] = useState(false)
    let actionInstanceId = uuidv4()
    
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
    
    const handleExecuteSQLCode = async () => {
        const newExecutedId = uuidv4()

        let obj = {
            email: executeActionContext.email,
            actionInstance: {
                    ActionType: "Profiling",
                    CreatedBy: "aayushi@data-facade.com",
                    DefinitionId: "bd2e3bd0-aa3b-42e5-bed6-a5f5553d1186",
                    DisplayName: "Aayushi Action",
                    Id: actionInstanceId,
                    ProviderInstanceId: dataSourceId,
                    // ProviderInstanceId:current,
                    RenderTemplate: false,
                    RenderedTemplate: code
                },
                actionExecutionToBeCreatedId: newExecutedId
            }
       
        createActionInstanceAsyncMutation.mutate(obj, {
                    onSuccess: () => {
                        const url = `/data/scratchpad?source=browser&name=ScratchPad&executionId=${newExecutedId}`
                        // fetch tables via executionId
                        // history.push(`/application/execute-action/bd2e3bd0-aa3b-42e5-bed6-a5f5553d1186?instanceId=${actionInstanceId}&executionId=${actionExecutionToBeCreated}`)
                        history.push(url)
                        setShowTables(true)
                    }
        })
    }

    const handleCodeChange = (code:any)=> {
        setCode(code)
    }

   return (
   <div>
        <div style={{width:'100%'}}>
            <Editor
                height={"200px"}
                width={'100%'}
                defaultLanguage={"sql"}
                onChange={handleCodeChange}
                value={"--Enter SQL Code"}
                theme={'light'}
            />
        </div>
        <br/>
        <div className='ScratchPadButtonWrapper'>
            <Button variant="contained" onClick={handleExecuteSQLCode} style={{margin: '0px 10px'}}>RUN</Button>
        </div>
        {showTables && <ActionExecutionDetails actionExecutionId={executionId || "NA"} showDescription={false} hideTabs={true} />}
       
    </div>
    )
}

export default ScratchPad

