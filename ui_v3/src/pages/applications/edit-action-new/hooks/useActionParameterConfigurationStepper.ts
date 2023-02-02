/*
Business logic for ui_v3/src/edit-action-new/components/business/ActionParmaeterConfigurationStepper.tsx
*/

import React from "react"
import { BuildActionContext, SetBuildActionContext } from "../../build_action_old/context/BuildActionContext"
import { StepperStep } from "../components/presentation/custom/stepper/Stepper"

function useActionParmaeterConfigurationStepper() {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    
    const activeTemplateWithParams = buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.activeTemplateId)

    const activeStepId = activeTemplateWithParams?.activeParameterId

    const setActiveStepId = (newActiveStepId?: string) => {
        console.log(newActiveStepId)
        setBuildActionContext({
            type: "SetActiveParameterId",
            payload: {
                newActiveParameterId: newActiveStepId
            }
        })
    }
    
    const steps: StepperStep[] = (activeTemplateWithParams?.parameterWithTags || [])?.map(paramWithTag => ({
        stepName: paramWithTag?.parameter?.ParameterName,
        stepStatus: "COMPLETED",
        stepId: paramWithTag?.parameter?.Id
    }))



    return { steps, activeStepId, setActiveStepId }
}

export default useActionParmaeterConfigurationStepper;