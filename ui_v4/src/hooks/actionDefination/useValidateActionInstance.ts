
import TemplateSupportedRuntimeGroup from "@/helpers/enums/TemplateSupportedRuntimeGroup"
import { MutationContext } from "../actionOutput/useCreateActionInstance"



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
                const allProviderInstanceIds: (string | undefined|any)[] = []
                actionInstanceRequest.actionParameterInstances.forEach(pi => {
                    if(!!pi.ProviderInstanceId) {
                        allProviderInstanceIds.push(pi.ProviderInstanceId)
                    }
                })
                const uniqueProviderInstances = [new Set(allProviderInstanceIds)]
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