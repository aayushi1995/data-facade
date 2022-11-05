import TemplateSupportedRuntimeGroup from "../../../enums/TemplateSupportedRuntimeGroup"
import { MutationContext } from "./useCreateActionInstance"


interface UseValidateActionInstanceProps {
    onSuccess: () => void
    onError: (errorMessage?: string) => void
} 

const useValidateActionInstance = () => {

    return {
        validate: (actionInstanceRequest: MutationContext, templateLanguage: string, options: UseValidateActionInstanceProps) => {
            if(templateLanguage === TemplateSupportedRuntimeGroup.PYTHON) {
                options.onSuccess()
            } else {
                const allProviderInstanceIds: (string | undefined)[] = []
                actionInstanceRequest.actionParameterInstances.forEach(pi => {
                    if(!!pi.ProviderInstanceId) {
                        allProviderInstanceIds.push(pi.ProviderInstanceId)
                    }
                })
                const uniqueProviderInstances = [...new Set(allProviderInstanceIds)]
                console.log(uniqueProviderInstances)
                if(uniqueProviderInstances.length <= 1) {
                    options.onSuccess()
                } else {
                    options.onError("SQL Action can't have tables from different providers")
                }
            }
        } 
    }
}

export default useValidateActionInstance