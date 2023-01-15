import { Box, Button, Grid, TextField, Typography } from "@mui/material"
import React from "react"
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext"
import { BuildActionWizardStepProps } from "../BuildActionWizard"
import BuildActionForm from "../common-components/BuildActionForm"


const WizardView1 = (props: BuildActionWizardStepProps) => {
    const {nextStep, previousStep} = props
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const getDefaultName = () => buildActionContext.actionDefinitionWithTags.actionDefinition.DisplayName||""
    const [actionName, setActionName] = React.useState(getDefaultName())
    const HOW_TO_BUILD = ["Use Template", "Build New"]
    const [howToBuild, setHowToBuild] = React.useState(HOW_TO_BUILD[0])


    const saveActionName = () => {
        setBuildActionContext({
            type: "SetActionDefinitionName",
            payload: {
                newName: actionName
            }
        })
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
        inputFieldLocation: "BOTTOM"
    }

    const onContinue = () => {
        props.nextStep()
    }

    return (
        <Grid container>
            
            <Grid item xs={12} px={5} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <BuildActionForm/>
            </Grid>
            <Grid item xs={12} px={5} sx={{ display: "flex", flexDirection: "column", gap: 4}}>
                {/* <Box>
                    <Typography variant="wizardText">
                        Select Tags for your action
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexGrow: 1}}>
                    <VirtualTagHandler {...tagHandlerProps}/>
                </Box> */}
                
                <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
                    <Button variant="PackageActionButton1" onClick={onContinue}>Create</Button>
                </Box>
            </Grid>
        </Grid>
    )
}

export default WizardView1;