import { Box, Card, Divider, Grid } from "@mui/material";
import React from "react";
import VirtualTagHandler, {VirtualTagHandlerProps} from "../../../../common/components/tag-handler/VirtualTagHandler";
import { lightShadows } from "../../../../css/theme/shadows";
import { Tag } from "../../../../generated/entities/Entities";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import ActionConfigComponent from "./ActionConfigComponent";
import ActionHero, { ActionHeroProps } from "./ActionHero";
import ActionDescription from "./hero-componenets/ActionDescription";

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

    const virtualTagHandlerProps: VirtualTagHandlerProps = {
        selectedTags: buildActionContext.actionDefinitionWithTags.tags,
        onSelectedTagsChange: (newTags: Tag[]) => {
            setBuildActionContext({
                type: "ReAssignActionDefinitionTag",
                payload: {
                    newTags: newTags
                }
            })
        },
        tagFilter: {},
        allowAdd: true,
        allowDelete: true,
        orientation: "VERTICAL",
        direction: "REVERSE"
    }

    if(buildActionContext.isLoadingAction) {
        return (
            <>Loading...</>
        )
    } else {
        return (
            <Box sx={{display: "flex", flexDirection: "column", gap: 3, minHeight: "100%", px: 4}}>
                <Box>
                    <ActionHero {...actionHeroProps}/>
                </Box>
                <Box>
                    <Card
                        variant="outlined"
                        sx={{ 
                            boxShadow: lightShadows[27],
                            borderRadius: 1
                         }}
                    >
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <Box sx={{p: 2, width: "100%"}}>
                                    <VirtualTagHandler {...virtualTagHandlerProps}/>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {!!buildActionContext.sourcedFromActionDefiniton ? 
                                    <ActionDescription 
                                        Description={buildActionContext.sourcedFromActionDefiniton.Description}
                                        Name={buildActionContext.sourcedFromActionDefiniton.UniqueName}
                                        Author={buildActionContext.sourcedFromActionDefiniton.CreatedBy}
                                        readOnly={true}
                                    />
                                    :
                                    <></>
                                }
                            </Grid>
                        </Grid>
                    </Card>
                </Box>
                <Box sx={{flexGrow: 1}}>
                    <ActionConfigComponent/>
                </Box>
            </Box>
        )
    }
}

export default ActionDetailForm;
