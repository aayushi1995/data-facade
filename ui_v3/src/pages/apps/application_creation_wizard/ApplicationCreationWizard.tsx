import { Box } from "@mui/material"
import React from "react"
import { BuildApplicationContext } from "./context/BuildApplicationContext"
import ConfigureAppDescriptionTags from "./wizard_components/ConfigureAppDescriptionTags"
import ConfigureAppNameGroup from "./wizard_components/ConfigureAppNameGroup"
import CreateAppActionFlow from "./wizard_components/CreateAppActionFlow"


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
            </Box>
        )
    }
}

export default ApplicationCreationWizard;