import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import dataManager from "../../../../data_manager/data_manager"
import { Application } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"

interface UseInstallApplicationParams {
    mutationOptions: UseMutationOptions<Application[], unknown, InstallApplicationVariables, unknown>
}

type InstallApplicationVariables = {
    ArtifactLocation: string
}

const useInstallApplication = (params: UseInstallApplicationParams) => {
    const queryClient = useQueryClient()
    const fetchedDataManagerInstance = dataManager.getInstance as { saveData: Function }

    const InstallApplicationMutation = useMutation<Application[], unknown, InstallApplicationVariables>("InstallApplication", 
        (varibles: InstallApplicationVariables) => {
            return fetchedDataManagerInstance.saveData(labels.entities.APPLICATION,
                {
                    entityProperties: {
                        ArtifactLocation: varibles.ArtifactLocation
                    },
                    LoadFromExternalSource: true,
                    Marketplace: true
                }
            )
        },
        {
            ...params.mutationOptions
        }
    )

    return InstallApplicationMutation
}

export default useInstallApplication;