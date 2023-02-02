import { Box } from "@mui/material";
import React from "react";
import { BuildActionContext } from "../build_action_old/context/BuildActionContext";
import ActionHeader from "./components/business/ActionHeader";
import ActionMain from "./components/business/ActionMain";
import EditActionSideView from "./components/presentation/custom/EditActionSideView";
import EditActionMenu from "./components/presentation/EditActionMenu";
import { CardBoxRoot } from "./components/presentation/styled_native/ActionMainBox";
import useEditActionForm from "./hooks/useEditActionForm";



function EditActionForm() {
    const buildActionContext = React.useContext(BuildActionContext)
    const [actionHeaderProps, actionMainProps] = useEditActionForm()

    const rootBoxWidth = buildActionContext.splitView ? "50%" : "100%"

    return(
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 ,mt:2,pl:2}}>
            <CardBoxRoot sx={{width: rootBoxWidth}}>
                <ActionHeader {...actionHeaderProps}/>
                <ActionMain/>
            </CardBoxRoot>
            <EditActionSideView />
            <EditActionMenu />
        </Box>
    )
}

export default EditActionForm;