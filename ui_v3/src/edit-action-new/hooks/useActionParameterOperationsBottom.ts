/*
Business logic for ui_v3/src/edit-action-new/components/business/ActionParmaeterConfigurationStepper.tsx
*/

import useActionParmaeterConfigurationStepper from "./useActionParameterConfigurationStepper";

type UseActionParameterOperationsBottomParams = {
}

function useActionParameterOperationsBottom(params: UseActionParameterOperationsBottomParams) {
    const {steps, activeStepId, setActiveStepId } = useActionParmaeterConfigurationStepper()

    const totalSteps = steps?.length || 0
    const currentStepIndex = steps.findIndex(step => step?.stepId === activeStepId)

    const getStepText = () => {
        if(currentStepIndex!==undefined) {
            return `${currentStepIndex + 1} of ${totalSteps}`
        } 
        return ""
        
    }

    const nextParam = () => {
        if(currentStepIndex!==undefined && currentStepIndex !== totalSteps-1) {
            setActiveStepId(steps?.[currentStepIndex+1]?.stepId)
        }
    }

    const prevParam = () => {
        if(currentStepIndex!==undefined && currentStepIndex !==0) {
            setActiveStepId(steps?.[currentStepIndex-1]?.stepId)
        }
    }

    return {
        stepText: getStepText(),
        nextParam: (currentStepIndex !== undefined && currentStepIndex!==totalSteps-1) ? nextParam : undefined ,
        prevParam: (currentStepIndex !== undefined && currentStepIndex!==0) ? prevParam : undefined
    }
}

export default useActionParameterOperationsBottom;