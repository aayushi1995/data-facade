import { Box, Button } from "@mui/material"
import React from "react"
import { BuildApplicationContext } from "./context/BuildApplicationContext"
import ConfigureAppDescriptionTags from "./wizard_components/ConfigureAppDescriptionTags"
import ConfigureAppNameGroup from "./wizard_components/ConfigureAppNameGroup"
import ConnectWithData from "./wizard_components/ConnectWithData"
import CreateAppActionFlow from "./wizard_components/CreateAppActionFlow"
import Welcome1 from "./wizard_components/Welcome1"
import Welcome2 from "./wizard_components/Welcome2"


export interface BuildApplicationWizardStepProps {
    nextStep: () => void,
    previousStep: () => void,
    onCreationComplete: () => void
}

type BuildActionWizardStepConfig = {
    component: (props: BuildApplicationWizardStepProps) => JSX.Element
}

const steps: BuildActionWizardStepConfig[] = [
    {
        component: (props) => <Welcome1 {...props}/>
    },
    {
        component: (props) => <Welcome2 {...props}/>
    },
    {
        component: (props) => <CreateAppActionFlow {...props}/>
    },
    {
        component: (props) => <ConfigureAppNameGroup {...props}/>
    },
    {
        component: (props) => <ConfigureAppDescriptionTags {...props}/>
    }
]

export interface ApplicationCreationWizardProps {
    onCreationComplete: () => void
}

const ApplicationCreationWizard = (props: ApplicationCreationWizardProps) => {
    const [activeStep, setActiveStep] = React.useState(0)
    const context = React.useContext(BuildApplicationContext)

    const nextStep = () => {
        setActiveStep(oldStep => {
            if(oldStep===steps.length-1){
                return oldStep
            }
            return oldStep+1
        })
    }
    const previousStep = () => {
        setActiveStep(oldStep => {
            if(oldStep===0){
                return oldStep
            }
            return oldStep-1
        })
    }
    
    const stepProps: BuildApplicationWizardStepProps = {
        nextStep: nextStep,
        previousStep: previousStep,
        onCreationComplete: props.onCreationComplete
    }
    
    if(context.isCreating){
        return <>Loading...</>
    } else {
        return(
            <Box sx={{display: "flex", flexDirection: "column", minHeight: "inherit", gap: 2}}>
                <Box sx={{display: "flex", flexGrow: 1}}>
                </Box>
                <Box sx={{display: "flex", flexGrow: 8}}>
                    {steps[activeStep].component(stepProps)}
                </Box>
                {/* <Box sx={{display: "flex", flexGrow: 1}}>
                    <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 3, width: "100%", backgroundColor: "#e1e1e1"}}>
                        <Box>
                            <Button variant="contained" onClick={previousStep}>Previous</Button>
                        </Box>
                        <Box>
                            <Button variant="contained" onClick={nextStep}>Next</Button>
                        </Box>
                    </Box>
                </Box> */}
            </Box>
        )
    }
}

export default ApplicationCreationWizard;