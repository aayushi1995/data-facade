import { highlight, languages } from "prismjs/components/prism-core"

import TemplateLanguage from "../../enums/TemplateLanguage.js";

import './../../css/customizations/CodeEditor.css'
import "prismjs/components/prism-clike";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-python"
import "prismjs/themes/prism.css";
import { Box, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";


const CodeEditor = (props) => {
    const readOnly = props.readOnly || false
    const [fontSize, setFontSize] = React.useState(12)
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
                <Box sx={{width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 2, alignItems: 'flex-end'}}>
                    <Select value={editorTheme} onChange={(e) => {console.log(e); setEditorThere(e.target.value)}} sx={{p: 1}} variant="standard">
                        <MenuItem value="light">light</MenuItem>
                        <MenuItem value="vs-dark">vs-dark</MenuItem>
                    </Select>
                    <TextField type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} size="small" variant="standard" label="fontSize" />
                </Box>
                <Editor
                    height={"100%"}
                    defaultLanguage={languageToSyntaxMap[props.language || TemplateLanguage.SQL]}
                    onChange={props.onCodeChange || (() => {})}
                    value={props.code}
                    theme={editorTheme}
                    highlight={true}
                    path={props?.actionDefinitionId || "" + fontSize.toString()}
                    width={"100%"}
                    options={{
                        fontSize: fontSize
                    }}
                />
            </Box>
        </main>
    );
}
export default CodeEditor;
