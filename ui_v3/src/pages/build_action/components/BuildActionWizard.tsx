import { Box, Button } from "@mui/material";
import React from "react";
import SetActionName from "./wizard-steps-components/SetActionName";
import SelectActionTags from "./wizard-steps-components/SetActionTags";
import SetActionTypeAndLanguage from "./wizard-steps-components/SetActionTypeAndLanguage";
import SetActionParametersWizardWrapper from "./wizard-steps-components/SetActionParametersWizardWrapper"
import WelcomeComponent1 from "./wizard-steps-components/welcome-componenet/WelcomeComponent1";
import WelcomeComponent2 from "./wizard-steps-components/welcome-componenet/WelcomeComponent2";
import WelcomeComponent3 from "./wizard-steps-components/welcome-componenet/WelcomeComponent3";
import SetActionReturnType from "./wizard-steps-components/SetActionReturnType";
import Congratulations from "./wizard-steps-components/Congratulations";

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
        component: (props) => <WelcomeComponent2 {...props}/>
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
            {/* <Box sx={{display: "flex", flexGrow: 1}}></Box> */}
            <Box sx={{display: "flex", flexGrow: 8}}>
                { (activeStep < steps.length) ? steps[activeStep].component(stepProps) : <></> }
            </Box>
            {/* <Box sx={{display: "flex", flexGrow: 1}}>
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 3, width: "100%"}}>
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

export default BuildActionWizard;