import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Typography,DialogTitle, Grid ,DialogContent} from "@mui/material";
// import CloseIcon from "../../../../src/images/close.svg"
import React from "react";
import { useHistory } from "react-router-dom";
import LoadingIndicator from "../../../common/components/LoadingIndicator";
import { ActionDefinition } from "../../../generated/entities/Entities";
import { BuildActionContext, UseActionHooks } from "../context/BuildActionContext";
import WizardView1 from "./wizard-steps-components/WizardView1";

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
            <Box sx={{display: "flex", flexDirection: "column"}}>
                    <DialogTitle sx={{width:'100%' , display: 'flex', justifyContent: 'center',backgroundColor: "ActionConfigDialogBgColor.main", boxShadow: "inset 0px 15px 25px rgba(54, 48, 116, 0.3)"}}>
                    <Grid item xs={6} sx={{display: 'flex', alignItems: 'center'}}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <IconButton onClick={stepProps.previousStep} sx={{color:"cardIconBtn1HoverColor.main"}}>
                                <ArrowBackIosIcon/>
                            </IconButton>
                        </Box>
                        <Typography variant="wizardHeader" sx={{
                            fontFamily: "'SF Pro Text'",
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "18px",
                            lineHeight: "160%",
                            letterSpacing: "0.15px",
                            color: "ActionCardBgColor.main"}}
                        >
                            {steps[activeStep].label}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{display: 'flex', justifyContent: 'flex-end'}} >
                        <IconButton onClick={closeDialog} sx={{color:"cardIconBtn1HoverColor.main"}}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                    </DialogTitle>

                <DialogContent sx={{minHeight: "400px" , flexDirection: "column"}}>
                    <Box sx={{display: "flex", flexGrow: 8 , flexDirection: "column"}}>
                        {steps[activeStep].component(stepProps)}
                    </Box>
                </DialogContent>
            </Box>
            : 
            <LoadingIndicator/>
    )
}

export default CreateActionWizard;
