import { Typography } from "@mui/material";
import { Box, Button, Grid, TextField } from "@mui/material";
import React from "react";
import VirtualTagHandler, { VirtualTagHandlerProps } from "../../../../common/components/tag-handler/VirtualTagHandler";
import { Tag } from "../../../../generated/entities/Entities";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import { BuildActionWizardStepProps } from "../BuildActionWizard";

const SelectActionTags = (props: BuildActionWizardStepProps) => {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const getDefaultName = () => {
        return buildActionContext.actionDefinitionWithTags.actionDefinition.DisplayName||""
    }

    const onContinue = () => {
        
        props.nextStep()
    }

    const tagHandlerProps: VirtualTagHandlerProps = {
        selectedTags: buildActionContext.actionDefinitionWithTags.tags,
        tagFilter: {
            
        },
        allowAdd: true,
        allowDelete: true,
        onSelectedTagsChange: (newTags: Tag[]) => {
            setBuildActionContext({
                type: "ReAssignActionDefinitionTag",
                payload: {
                    newTags: newTags
                }
            })
        },
        orientation: "VERTICAL",
        direction: "DEFAULT"
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
                <Box sx={{display: "flex", flexDirection: "column", gap: 4, alignItems: "center", justifyContent: "space-around", minHeight: "100%"}}>
                    <Box sx={{width: "100%"}}>
                        <Typography sx={{
                            fontFamily: "SF Compact Display",
                            fontStyle: "normal",
                            fontWeight: 300,
                            fontSize: "25px",
                            lineHeight: "45px",
                            display: "flex",
                            alignItems: "center",
                            color: "#A7A9AC"
                        }}>
                            Tags defines your action .........
                        </Typography>
                    </Box>
                    <Box sx={{width: "100%"}}>
                        <Typography sx={{
                            fontFamily: "SF Compact Display",
                            fontStyle: "normal",
                            fontWeight: 300,
                            fontSize: "25px",
                            lineHeight: "33px",
                            display: "flex",
                            alignItems: "center",
                            color: "#A7A9AC"
                        }}>
                            Tags can help you choose appropiate actions to run on your data
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 3, minHeight: "100%"}}>
                    <Box sx={{width: "100%"}}>
                        <VirtualTagHandler {...tagHandlerProps}/>
                    </Box>
                    <Box sx={{display: "flex", width: "100%", justifyContent: "center", alignItems: "center"}}>
                        <Button onClick={onContinue} variant="contained">
                            Continue
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
        
    )
}

export default SelectActionTags;