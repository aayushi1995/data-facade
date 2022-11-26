import { Box } from "@mui/material";
import CodeEditor from "../../../../common/components/CodeEditor";

export type ActionCodeProps = {
    code: string,
    onCodeChange: (newCode: string) => void,
    language: string,
    readOnly: boolean,
    hidden: boolean
}

function ActionCode(props: ActionCodeProps) {
    return !props.hidden ?
        <Box>
            <CodeEditor
                code={props?.code}
                onCodeChange={props?.onCodeChange}
                language={props?.language}
                readOnly={props?.readOnly}
            />
        </Box>
        :
        <></>
}

export default ActionCode;