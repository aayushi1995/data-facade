import { Box } from "@mui/material";
import React from "react";
import { ActionDefinition } from "../../../../../generated/entities/Entities";
import { SetBuildActionContext } from "../../../../../pages/build_action/context/BuildActionContext";

interface BuildActionFromWorkflow {
    handleAddActionToWorkflow: (actionDefinition: ActionDefinition) => void,
    handleDialogClose: () => void,
    applicationId?: string
}

const BuildActionFromWorkflow = (props: BuildActionFromWorkflow) => {
    const setBuildActionState = React.useContext(SetBuildActionContext)
    const [createdActionId, setCreatedActionId] = React.useState<string|undefined>()

    const onSuccessfulCreation = (actionDefinition: ActionDefinition) => {
        props.handleAddActionToWorkflow(actionDefinition)
        setCreatedActionId(actionDefinition.Id)
    }

    return (  
        <Box>
           
        </Box>
    )
}


export default BuildActionFromWorkflow