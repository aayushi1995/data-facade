import { Box } from "@mui/material"
import useActionParameterConfigurationStepper from "../../hooks/useActionParameterConfigurationStepper"
import Stepper from "../presentation/custom/stepper/Stepper"

export type ActionParameterConfigurationStepperProps = {
    parameterNames?: (string | undefined)[],
    parameterIds?: (string | undefined)[]
}

function ActionParameterConfigurationStepper(props: ActionParameterConfigurationStepperProps) {
    const { steps, activeStepId, setActiveStepId } = useActionParameterConfigurationStepper()
    return (
        <Box p={2}>
            <Stepper steps={steps} activeStepId={activeStepId} onStepSelect={setActiveStepId}/>
        </Box>
    )
}

export default ActionParameterConfigurationStepper;