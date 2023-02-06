import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import ActionExecutionDetails from '../../../../common/components/action_execution/components/ActionExecutionDetails';
import { ExecuteActionContext } from '../../../applications/execute_action/context/ExecuteActionContext';
import useCreateActionInstance from '../../../applications/execute_action/hooks/useCreateActionInstance';
import ReactAceEditor from './CustomizedAceEditor';

import 'ace-builds/src-noconflict/ace';
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/ext-language_tools";
import './styles.css';

const ScratchPad = ({dataSourceId, executionId, autoCompleteionData}:any) => {
    // const [code, setCode] = useState("")
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
    
    const handleExecuteSQLCode = async (code:any) => {
        const newExecutedId = uuidv4()

        let obj = {
            email: executeActionContext.email,
            actionInstance: {
                    ActionType: "Profiling",
                    CreatedBy: "aayushi@data-facade.com",
                    DefinitionId: "0",
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

   return (
   <div>
        <div style={{width:'100%'}}>
            <ReactAceEditor handleRunQuery={handleExecuteSQLCode} autoCompleteionData={autoCompleteionData}/>
        </div>
        <br/>
        {showTables && <ActionExecutionDetails actionExecutionId={executionId || "NA"} showDescription={false} showChart autoCompleteionData={autoCompleteionData}/>}
       
    </div>
    )
}

export default ScratchPad




