import { Box, Divider, IconButton } from "@mui/material";
import React from "react";
import TestAction from "../pages/build_action/components/form-components/TestAction";
import { BuildActionContext} from "../pages/build_action/context/BuildActionContext";
import ActionHeader from "./components/business/ActionHeader";
import ActionMain from "./components/business/ActionMain";
import { CardBoxRoot } from "./components/presentation/styled_native/ActionMainBox";
import useEditActionForm from "./hooks/useEditActionForm";



function EditActionForm() {
    const buildActionContext = React.useContext(BuildActionContext)
    const [actionHeaderProps, actionMainProps] = useEditActionForm()

    return(
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 ,mt:2,pl:2}}>
            <CardBoxRoot sx={{width: buildActionContext.testMode ? "50%" : "100%"}}>
                <ActionHeader {...actionHeaderProps}/>
                <ActionMain/>
            </CardBoxRoot>
            { buildActionContext.testMode &&
                <CardBoxRoot sx={{width:'50%'}}>
                    <TestAction/>
                </CardBoxRoot>
            }
            <Box sx={{px:2,mt:5}}>
            </Box>
        </Box>
    )
}

export default EditActionForm;