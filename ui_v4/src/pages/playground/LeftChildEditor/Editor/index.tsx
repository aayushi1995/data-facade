import { Button } from 'antd';
import React,{useEffect, useState} from 'react'
import { acequire } from 'brace';
import AceEditor from 'react-ace';
import ReactAce from 'react-ace/lib/ace';
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/mode-python";

import "ace-builds/src-noconflict/ext-language_tools";
require("ace-builds/webpack-resolver");



const ReactAceEditor = React.forwardRef(({languageType, codeRef, defaultCode, autoCompleteionData}:any) => {
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
    
        codeRef?.current?.editor?.completers?.push(staticWordCompleter)
            
        var sqlTables = autoCompleteionData || [
            { name: 'table', description: 'Table' }
        ];
   

    return (
        <>
         <AceEditor
            width="100%"
            height="250px"
            ref={codeRef}
            defaultValue={defaultCode || ''}
            focus
            fontSize={14}
            placeholder={languageType === "mysql" ? "--Enter SQL Code" :  "--Enter Python Code"}
            mode={languageType}
            highlightActiveLine={false}
            name="edit"
            setOptions={{
                enableLiveAutocompletion: true,
                showLineNumbers: false,
                tabSize: 2
            }}
            style={{border: '1px solid #D1D5DB'}}
            />
            
        </>
       
    )
});

export default ReactAceEditor


