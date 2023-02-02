import { Box } from "@mui/material";
import React from "react";
import LoadingIndicator from "../../../../../common/components/LoadingIndicator";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import { ActionDefinitionHeroActionContextWrapper } from "../shared-components/ActionDefinitionHero";
import ActionConfigComponent from "./ActionConfigComponent";

const  ActionDetailForm = () => {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)


    if(buildActionContext.loadingActionForEdit) {
        return (
            <LoadingIndicator/>
        )
    } else {
        return (
            <Box sx={{display: "flex", flexDirection: "column", gap: 3, minHeight: "100%", px: buildActionContext.testMode ? 1 : 4}}>
                {buildActionContext.testMode ? <></> : (
                    <Box>
                        <ActionDefinitionHeroActionContextWrapper/>
                    </Box>
                )}
                <Box sx={{flexGrow: 1, overflowX: 'auto'}}>
                     <ActionConfigComponent/>
                </Box>
            </Box>
        )
    }
}

export default ActionDetailForm;
