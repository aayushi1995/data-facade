import { Box } from "@mui/material";
import ViewActionParameters from "../../../../build_action_old/components/common-components/ViewActionParameters";
import useActionParameter from "../../../hooks/useActionParmeter";
import { ActionParameterCardBox } from "../styled_native/ActionParameterBox";
import ActionConfig from "./ActionConfig";
import ActionTag from "./ActionTag";

export type ActionParameterProps = {
    onParameterClick: (parameterId?: string) => void
}

function ActionParameter(props: ActionParameterProps) {
    const {
        viewActionParameterProps,
        actionConfigProps,
        actionTagProps
    } = useActionParameter({ onParameterClick: props?.onParameterClick })
    
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4}}>
            <Box>
                <ViewActionParameters
                    {...viewActionParameterProps}
                />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 3, justifyContent: "space-between" }}>
                <ActionParameterCardBox sx={{ flex: 1 }}>
                    <ActionConfig {...actionConfigProps}/>
                </ActionParameterCardBox> 
                <ActionParameterCardBox sx={{ flex: 1 }}>
                    <ActionTag {...actionTagProps}/>
                </ActionParameterCardBox>
            </Box>
        </Box>
        
    )
}

export default ActionParameter;