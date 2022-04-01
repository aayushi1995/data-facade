import { Box } from "@mui/material";
import React from "react";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import ActionConfigComponent from "./ActionConfigComponent";
import ActionHero, { ActionHeroProps } from "./ActionHero";

const  ActionDetailForm = () => {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const actionHeroProps: ActionHeroProps = {
        Name: buildActionContext.actionDefinitionWithTags.actionDefinition.UniqueName,
        Description: buildActionContext.actionDefinitionWithTags.actionDefinition.Description,
        Author: "NA",
        onNameChange: (newName: string|undefined) => setBuildActionContext({
            type: "SetActionDefinitionName",
            payload: {
                newName: newName
            }
        }),
        onDescriptionChange: (newDescription: string|undefined) => setBuildActionContext({
            type: "SetActionDefinitionDescription",
            payload: {
                newDescription: newDescription
            }
        })
    }

    if(buildActionContext.loadingActionForEdit) {
        return (
            <>Loading...</>
        )
    } else {
        return (
            <Box sx={{display: "flex", flexDirection: "column", gap: 3, minHeight: "100%", px: 4}}>
                <Box>
                    <ActionHero {...actionHeroProps}/>
                </Box>
                <Box sx={{flexGrow: 1}}>
                    <ActionConfigComponent/>
                </Box>
            </Box>
        )
    }
}

export default ActionDetailForm;
