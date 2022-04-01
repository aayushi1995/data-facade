import { Box, Button, TextField, Typography } from "@mui/material"
import React from "react"
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext"
import { BuildActionWizardStepProps } from "../BuildActionWizard"

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

    const onContinue = () => {
        props.nextStep()
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "space-around", py: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{display: "flex", justifyContent: "center"}}>
                    <Typography variant="wizardText">
                        Welcome to Data Facade Action-Creation widget.
                    </Typography>
                </Box>
                <Box sx={{display: "flex", justifyContent: "center"}}>
                    <Typography variant="wizardText">
                        Experience a new way in how you write actions 
                    </Typography>
                </Box>
            </Box>
            <Box sx={{display: "flex", alignItems: "center", flexDirection: "column", gap: 4}}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1}}>
                    <Box>
                        <Typography variant="wizardText">
                            Type your Action Name
                        </Typography>  
                    </Box>
                    <Box>
                        <TextField 
                            onBlur={saveActionName} 
                            variant="outlined" 
                            label="Action Name" 
                            value={actionName} 
                            onChange={(event => setActionName(event.target.value))}
                        />
                    </Box>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: 1}}>
                    <Box>
                        <Button variant="contained" onClick={onContinue} fullWidth>Continue</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default WizardView1;