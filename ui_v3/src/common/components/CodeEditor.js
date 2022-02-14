import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core"

import TemplateLanguage from "../../enums/TemplateLanguage.js";

import './../../css/customizations/CodeEditor.css'
import "prismjs/components/prism-clike";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-python"
import "prismjs/themes/prism.css";
import { Box } from "@material-ui/core";
import { useState } from "react";


const CodeEditor = (props) => {
    const readOnly = props.readOnly || false
    const languageToSyntaxMap = {
        [TemplateLanguage.PYTHON]: languages.python,
        [TemplateLanguage.SQL]: languages.sql,
        [TemplateLanguage.TEXT]: languages.text
    }
    const [code, setCode] = useState(props.code)

    return (
        <main className="container">
            <Box className="container__content"
                sx={{ backgroundColor: "background.default", color: 'text.secondary' }}
            >
                <div className="container_editor_area">
                    <Editor
                        value={props.code}
                        onValueChange={props.onCodeChange || (() => {
                        })}
                        highlight={(code) => highlight(code, languageToSyntaxMap[props.language || TemplateLanguage.SQL])
                            .split("\n")
                            .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
                            .join("\n")
                        }
                        textareaId="codeArea"
                        tabSize={4}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 14,
                            outline: 0,
                            background: "primary"
                        }}
                        className="container__editor"
                    />
                </div>
            </Box>
        </main>
    );
}

export default CodeEditor;