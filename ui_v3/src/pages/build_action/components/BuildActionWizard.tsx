import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import LoadingIndicator from "../../../common/components/LoadingIndicator";
import { ActionDefinition } from "../../../generated/entities/Entities";
import { BuildActionContext, UseActionHooks } from "../context/BuildActionContext";
import WizardView1 from "./wizard-steps-components/WizardView1";
import WizardView2 from "./wizard-steps-components/WizardView2";

export interface BuildActionWizardStepProps {
    nextStep: () => void,
    previousStep: () => void,
    closeDialog: () => void
}

type BuildActionWizardStepConfig = {
    component: (props: BuildActionWizardStepProps) => JSX.Element,
    label: string
}

const steps: BuildActionWizardStepConfig[] = [
    {
        component: (props) => <WizardView1 {...props}/>,
        label: "Create Action Name"
    },
    {
        component: (props) => <WizardView2 {...props}/>,
        label: "Create Action"
    }
]

export interface CreateActionWizardProps {
    onSuccessfulCreation?: (actionDefinition: ActionDefinition) => void,
    onCancelCreation?: () => void
}

const CreateActionWizard = (props: CreateActionWizardProps) => {
    const history = useHistory()
    const [activeStep, setActiveStep] = React.useState(0)
    const actionContext = React.useContext(BuildActionContext)
    const useActionHooks = React.useContext(UseActionHooks)

    const closeDialog = () => {
        cancelFlow()
    }
    
    const successFlow = () => {
        const lastCreatedActionDefinition = actionContext?.lastSavedActionDefinition
        if(!!lastCreatedActionDefinition && !!(lastCreatedActionDefinition?.Id)) {
            props?.onSuccessfulCreation?.(lastCreatedActionDefinition)
        } else {
            console.log("Something went wrong. Action Definiton ID field is empty for most recent created")
        }
    }

    const cancelFlow = () => {
            props?.onCancelCreation?.()
    }

    const stepProps: BuildActionWizardStepProps = {
        nextStep: () => setActiveStep(oldStep => oldStep+1),
        previousStep: () => setActiveStep(oldStep => Math.max(0, oldStep-1)),
        closeDialog: closeDialog
    }

    React.useEffect(() => {
        if(activeStep===steps.length) {
            useActionHooks.useActionDefinitionFormSave?.mutate(actionContext)
        }
    }, [activeStep])

    React.useEffect(() => {
        const lastCreatedActionDefinitionId = actionContext?.lastSavedActionDefinition?.Id
        if(actionContext.savingAction===false && !!lastCreatedActionDefinitionId){
            successFlow()
        }
    }, [actionContext.savingAction])
    
    return(
        (activeStep < steps.length) ?
            <Box sx={{display: "flex", flexDirection: "column", minHeight: "inherit", gap: 2}}>
                <Box sx={{ display: "flex", flexDirection: "row"}}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IconButton onClick={stepProps.previousStep}>
                            <ArrowBackIosIcon/>
                        </IconButton>
                    </Box>  
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="wizardHeader">
                            {steps[activeStep].label}
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}/>
                    <Box>
                        <IconButton onClick={closeDialog}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{display: "flex", flexGrow: 8}}>
                    {steps[activeStep].component(stepProps)}
                </Box>
            </Box>
            : 
            <LoadingIndicator/>
    )
}

export default CreateActionWizard;