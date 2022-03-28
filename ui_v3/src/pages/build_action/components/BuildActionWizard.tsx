import { Box, Button, IconButton } from "@mui/material";
import React from "react";
import SetActionName from "./wizard-steps-components/SetActionName";
import SelectActionTags from "./wizard-steps-components/SetActionTags";
import SetActionTypeAndLanguage from "./wizard-steps-components/SetActionTypeAndLanguage";
import SetActionParametersWizardWrapper from "./wizard-steps-components/SetActionParametersWizardWrapper"
import WelcomeComponent1 from "./wizard-steps-components/welcome-componenet/WelcomeComponent1";
import WelcomeComponent3 from "./wizard-steps-components/welcome-componenet/WelcomeComponent3";
import SetActionReturnType from "./wizard-steps-components/SetActionReturnType";
import Congratulations from "./wizard-steps-components/Congratulations";
import CloseIcon from '@mui/icons-material/Close';

export interface BuildActionWizardStepProps {
    nextStep: () => void,
    previousStep: () => void,
    closeDialog: () => void
}

type BuildActionWizardStepConfig = {
    component: (props: BuildActionWizardStepProps) => JSX.Element
}

const steps: BuildActionWizardStepConfig[] = [
    {
        component: (props) => <WelcomeComponent1 {...props}/>
    },
    {
        component: (props) => <WelcomeComponent3 {...props}/>
    },
    {
        component: (props) => <SetActionName {...props}/>
    },
    {
        component: (props) => <SetActionTypeAndLanguage {...props}/>
    },
    {
        component: (props) => <SelectActionTags {...props}/>
    },
    {
        component: (props) => <SetActionParametersWizardWrapper {...props}/>
    },
    {
        component: (props) => <SetActionReturnType {...props}/>
    },
    {
        component: (props) => <Congratulations {...props}/>
    }
]

export interface BuildActionWizardProps {
    handleClose: () => void
}

const BuildActionWizard = (props: BuildActionWizardProps) => {
    const [activeStep, setActiveStep] = React.useState(0)

    const nextStep = () => {
        setActiveStep(oldStep => {
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

    const closeDialog = () => {
        setActiveStep(steps.length)
    }
    
    const stepProps: BuildActionWizardStepProps = {
        nextStep: nextStep,
        previousStep: previousStep,
        closeDialog: closeDialog
    }

    React.useEffect(() => {
        if(activeStep===steps.length) {
            props.handleClose()
        }
    }, [activeStep])
    
    return(
        <Box sx={{display: "flex", flexDirection: "column", minHeight: "inherit", gap: 2}}>
            <Box sx={{ display: "flex", flexDirection: "row-reverse"}}>
                <IconButton onClick={closeDialog}>
                    <CloseIcon/>
                </IconButton>
            </Box>
            <Box sx={{display: "flex", flexGrow: 8}}>
                { (activeStep < steps.length) ? steps[activeStep].component(stepProps) : <></> }
            </Box>
        </Box>
    )
}

export default BuildActionWizard;