
import { WorkflowContextType } from "../../../../../pages/applications/workflow/WorkflowContext";


const useValidateWorkflow = (workflowContext: WorkflowContextType, enabled: boolean) => {

    var errorMessage: string[] = []
    var isError = false
    const validateParameter = () => {
        workflowContext.stages.forEach(stage => {
            stage.Actions.forEach(action => {
                action.Parameters.forEach(parameter => {
                    if(parameter.userInputRequired === "No") {
                        if(parameter.ParameterValue === undefined && parameter.SourceExecutionId === undefined) {
                            errorMessage = [...errorMessage, `${parameter.ParameterName} in Action ${action.DisplayName} of Stage ${stage.Name} does not have default value`]
                            isError = true
                        }
                    } else if(parameter.userInputRequired === "Yes") {
                        if(parameter.GlobalParameterId === undefined) {
                            errorMessage = [...errorMessage, `${parameter.ParameterName} in Action ${action.DisplayName} of Stage ${stage.Name} does not have associated Global Parameter`]
                            isError = true
                        }
                    }
                })
            })
        })

        if(isError === false && !!errorMessage) {
            errorMessage = []
        }
    }
    if(enabled) {
        validateParameter()
    }

    return {
        isError,
        errorMessage
    }
}

export default useValidateWorkflow