import { Button } from '@mui/material';
import { acequire } from 'brace';
import React from 'react'
import AceEditor from 'react-ace';
import ReactAce from 'react-ace/lib/ace';

const ReactAceEditor = ({handleRunQuery, autoCompleteionData}:any) => {

    const code = React.useRef<ReactAce>(null)
    const handleCodeRun = () => {
            console.log(code?.current?.refEditor?.outerText)
            handleRunQuery(code?.current?.refEditor?.outerText)
    }
    var staticWordCompleter = {
        getCompletions: function(editor:any, session:any, pos:any, prefix:any, callback:any) {
            
            callback(null, sqlTables.map(function(word) {
                return {
                    caption: word.description,
                    value: word.name,
                    meta: "tables"
                };
            }));
    
        }
    }

    code?.current?.editor?.completers?.push(staticWordCompleter)
        
    var sqlTables = autoCompleteionData || [
        { name: 'table', description: 'Table' }
    ];

    return (
        <>
         <AceEditor
            width="100%"
            height="200px"
            ref={code}
            focus
            fontSize={14}
            placeholder={"--Enter SQL Code"}
            mode="mysql"
            name="edit"
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                showLineNumbers: false,
                tabSize: 2
            }}
            editorProps={{ $blockScrolling: true }}
            />
            <div className='ScratchPadButtonWrapper'>
            <Button variant="contained" onClick={handleCodeRun} style={{margin: '0px 10px'}}>RUN</Button>
        </div>
        </>
       
    )
    
}

export default ReactAceEditor


