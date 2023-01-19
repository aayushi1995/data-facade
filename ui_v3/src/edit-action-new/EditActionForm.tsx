import { Box, Divider, Drawer, IconButton } from "@mui/material";
import React from "react";
import TestAction from "../pages/build_action/components/form-components/TestAction";
import { BuildActionContext} from "../pages/build_action/context/BuildActionContext";
import ActionHeader from "./components/business/ActionHeader";
import ActionMain from "./components/business/ActionMain";
import DeepDiveSideMenu from "./components/business/DeepDiveSideMenu";
import EditActionSideView from "./components/presentation/custom/EditActionSideView";
import EditActionMenu from "./components/presentation/EditActionMenu";
import { CardBoxRoot } from "./components/presentation/styled_native/ActionMainBox";
import useEditActionForm from "./hooks/useEditActionForm";



function EditActionForm() {
    const buildActionContext = React.useContext(BuildActionContext)
    const [actionHeaderProps, actionMainProps] = useEditActionForm()

    const rootBoxWidth = buildActionContext.testMode ? "50%" : (buildActionContext.sideSettingsOpen || buildActionContext.pastRunsOpen) ? "60%" : "100%"

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