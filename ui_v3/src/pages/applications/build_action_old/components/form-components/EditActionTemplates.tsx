import { Box } from "@mui/material";
import { useContext } from "react";
import CodeEditor from "../../../../../common/components/CodeEditor";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";

const EditActionTemplates = () => {
    const buildActionContext = useContext(BuildActionContext)
    const setBuildActionContext = useContext(SetBuildActionContext)

    const activeTemplateWithParams = buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.activeTemplateId)

    if(!!activeTemplateWithParams){
        const codeEditorProps = {
            readOnly: false,
            code: activeTemplateWithParams.template.Text,
            onCodeChange: (newCode: string) => setBuildActionContext({
                type: "SetActionTemplateText",
                payload: {
                    newText: newCode
                }
            }),
            language: activeTemplateWithParams.template.Language
        }
        return (
            <Box>
                <CodeEditor {...codeEditorProps}/>
            </Box>
        )
    } else{
        return <>NO TEMPLATE SELECTED</>
    }
}

export default EditActionTemplates;