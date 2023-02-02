import { useMutation, UseMutationOptions } from "react-query"
import dataManager from "../../../data_manager/data_manager"
import { Application } from "../../../generated/entities/Entities"


const useSyncApplicationToGit = (props: {mutationOptions?: UseMutationOptions<Application[], unknown, unknown, unknown>}) => {

    const fetchedDataManagerInstance = dataManager.getInstance as { retreiveData: Function }

    return useMutation(
        "SyncApplicationToGit",
        (options: {branchName: string, commitMessage: string, applicationId: string, providerInstanceId?: string}) => fetchedDataManagerInstance.retreiveData(
            "Application",
            {
                filter: {
                    Id: options.applicationId
                },
                "ExportApplicationToGit": true,
                "commitMessage": options.commitMessage,
                "withProviderInstanceId": options.providerInstanceId,
                "branch": options.branchName
            }
        ).then((response: any) => {
            if(response[0].ExportedToGit !== true) {
                throw "Not Synced"
            }
            return response
        }),
        {
            ...props.mutationOptions
        }
    )
}

export default useSyncApplicationToGit