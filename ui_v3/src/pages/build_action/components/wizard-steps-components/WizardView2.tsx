import { Box, Button, Grid, Typography } from "@mui/material"
import React from "react"
import VirtualTagHandler, { VirtualTagHandlerProps } from "../../../../common/components/tag-handler/VirtualTagHandler"
import getDefaultCode from "../../../../custom_enums/DefaultCode"
import { Tag } from "../../../../generated/entities/Entities"
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext"
import ActionSummary from "../common-components/ActionSummary"
import { BuildActionWizardStepProps } from "./../BuildActionWizard"

const WizardView2 = (props: BuildActionWizardStepProps) => {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const actionType = buildActionContext?.actionDefinitionWithTags?.actionDefinition?.ActionType
    const activeTemplate = (buildActionContext?.actionTemplateWithParams || []).find(at => at.template.Id===buildActionContext.activeTemplateId)?.template
   

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

    React.useEffect(() => {
        setBuildActionContext({
            type: "SetActionTemplateText",
            payload: {
                newText: getDefaultCode(actionType, activeTemplate?.SupportedRuntimeGroup)
            }
        })
    }, [actionType, activeTemplate?.SupportedRuntimeGroup])
    
    return (
        <Grid container>
            <Grid item xs={12} px={5} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                    <Typography variant="wizardText">
                        Type your Action Details
                    </Typography>
                </Box> 
                <ActionSummary/>
            </Grid>
            <Grid item xs={12} px={5} sx={{ display: "flex", flexDirection: "column", gap: 2}}>
                <Box>
                    <Typography variant="wizardText">
                        Select Tags for your action
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexGrow: 1}}>
                    <VirtualTagHandler {...tagHandlerProps}/>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
                    <Button variant="contained" onClick={onContinue}>Create</Button>
                </Box>
            </Grid>
        </Grid>
    )
}

export default WizardView2;