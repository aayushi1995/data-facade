import { highlight, languages } from "prismjs/components/prism-core"

import TemplateLanguage from "../../enums/TemplateLanguage.js";

import './../../css/customizations/CodeEditor.css'
import "prismjs/components/prism-clike";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-python"
import "prismjs/themes/prism.css";
import { Box, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";


const CodeEditor = (props) => {
    const readOnly = props.readOnly || false
    const theme = React.useState("light")
    const languageToSyntaxMap = {
        [TemplateLanguage.PYTHON]: "python",
        [TemplateLanguage.SQL]: "sql",
    }
    const [editorTheme, setEditorThere] = useState("light")
    return (
        <main >
            <Box 
                sx={{ backgroundColor: "background.default", display: 'flex', flexDirection: 'column', gap: 1, color: 'text.secondary', border:'1px solid #E9E9E9 ', overflow:'scroll', height:'610px' }}
            >
                <Box sx={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                <Select value={editorTheme} onChange={(e) => {console.log(e); setEditorThere(e.target.value)}} sx={{p: 1}} variant="standard">
                    <MenuItem value="light">light</MenuItem>
                    <MenuItem value="vs-dark">vs-dark</MenuItem>
                </Select>
                </Box>
                <Editor
                    height={"100%"}
                    defaultLanguage={languageToSyntaxMap[props.language || TemplateLanguage.SQL]}
                    onChange={props.onCodeChange || (() => {})}
                    defaultValue={props.code}
                    theme={editorTheme}
                    highlight={true}
                    path={props?.actionDefinitionId || ""}
                    width={"100%"}
                />
            </Box>
        </main>
    );
}

export default CodeEditor;