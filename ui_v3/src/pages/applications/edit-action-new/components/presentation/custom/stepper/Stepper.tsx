/*
Custom Stepper implementation to match design requirements
*/
import { Box, Button } from "@mui/material";
import StepperConnectorBox, { StepperNonSelectedConnectorBox } from "../../styled_native/StepperConnectorBox";

export type StepStatus = "COMPLETED" | "NOT COMPLETED"
export type StepperStep = {
    stepId?: string,
    stepName?: string,
    stepStatus: StepStatus
}

export type StepperProps = {
    steps: StepperStep[],
    activeStepId?: string, 
    onStepSelect?: (stepId?: string) => void
}

function Stepper(props: StepperProps) {
    const { steps, activeStepId, onStepSelect } = props
    const components = (steps || [])?.reduce(
        (prevComponents: JSX.Element[], currentStep: StepperStep) => {
            return [
                ...prevComponents,
                <Box sx={{ width: "100%", pl: 1}}>
                    {currentStep.stepId === activeStepId ? (
                        <StepperConnectorBox/>    
                    ) : (
                        <StepperNonSelectedConnectorBox />
                    )}
                    
                    <Button onClick={() => onStepSelect?.(currentStep?.stepId)}>{currentStep?.stepName || ""}</Button>
                </Box>,
                
            ]
        },
        []
    )
    return <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start"}}>{components}</Box>
}

export default Stepper;