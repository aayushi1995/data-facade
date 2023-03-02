import { Button } from 'antd';
import React,{useEffect} from 'react'
import { acequire } from 'brace';
import AceEditor from 'react-ace';
import ReactAce from 'react-ace/lib/ace';
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/ext-language_tools";
require("ace-builds/webpack-resolver");



const ReactAceEditor = ({defaultCode, handleRunQuery, autoCompleteionData}:any) => {
    
    const code = React.useRef<ReactAce>(null)

    const handleCodeRun = () => {
        handleRunQuery && handleRunQuery(code?.current?.refEditor?.outerText)
    }
    
    useEffect(() => {
        var staticWordCompleter = {
            getCompletions: function(editor:any, session:any, pos:any, prefix:any, callback:any) {
                
                callback(null, sqlTables.map(function(word:any) {
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
    },[autoCompleteionData])

   

    return (
        <>
         <AceEditor
            width="100%"
            height="200px"
            ref={code}
            defaultValue={defaultCode || ''}
            focus
            fontSize={14}
            placeholder={"--Enter SQL Code"}
            mode="mysql"
            name="edit"
            setOptions={{
                enableLiveAutocompletion: true,
                showLineNumbers: false,
                tabSize: 2
            }}
            editorProps={{ $blockScrolling: true }}
            />
            
                <Button type="primary" onClick={handleCodeRun} style={{margin: '10px'}}>RUN</Button>
            
        </>
       
    )
    
}

export default ReactAceEditor


