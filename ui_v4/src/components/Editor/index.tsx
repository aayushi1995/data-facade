import { Button } from 'antd';
import React,{useEffect} from 'react'
import { acequire } from 'brace';
import AceEditor from 'react-ace';
import ReactAce from 'react-ace/lib/ace';
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-python";
require("ace-builds/webpack-resolver");



const ReactAceEditor = ({defaultCode, handleRunQuery, autoCompleteionData, language}:any) => {
    
    const code = React.useRef<ReactAce>(null) as any
    const handleCodeRun = () => {
        // If we dont find a value then check the outerText
        handleRunQuery && handleRunQuery(code?.current.editor.getValue() || code?.current?.refEditor?.outerText)
    }
    console.log(language)
    
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
            // mode="mysql"
            mode={language === "python" ? "python" : "mysql"}
            name="edit"
            setOptions={{
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 2
            }}
            />
            <Button type="primary" onClick={handleCodeRun} style={{margin: '10px'}}>RUN</Button>
            
        </>
       
    )
    
}

export default ReactAceEditor


