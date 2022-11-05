import { useQuery } from "react-query"
import { Fetcher } from "../../../../generated/apis/api"
import { ActionInstanceDetails } from "../../../../generated/interfaces/Interfaces"
import labels from "../../../../labels/labels"



export const useGetInstanceDetails = (request: {instanceId: string, enabled: boolean, handleSuccess: (data: ActionInstanceDetails[]) => void}): [ActionInstanceDetails[] | undefined, boolean, object] => {
    
    
    const {data, isLoading, error} = useQuery([labels.entities.ActionInstance, request.instanceId],
        () => {
            return Fetcher.fetchData("GET", "/getActionInstancesDetail", {Id: request.instanceId})
        },
        {
            enabled: request.enabled,
            onSuccess: (data) => request.handleSuccess(data)
        }
    )

    return [data , isLoading, error as object]

}