import { useQuery } from "react-query"
import { Fetcher } from "../../../generated/apis/api"
import { ApplicationDetails } from "../../../generated/interfaces/Interfaces"
import labels from "../../../labels/labels"



const useGetApplicationDetails = (applicationId: string): [ApplicationDetails[] | undefined, any, boolean] => {
    const {data: applicationDetailData, error: applicationDetailError, isLoading: applicationDetailsLoading} = useQuery([labels.entities.APPLICATION, "details", applicationId], 
        () => {
            return Fetcher.fetchData('GET', '/getApplicationDetails', {Id: applicationId})
        }
    )

    return [applicationDetailData, applicationDetailError, applicationDetailsLoading]
}

export default useGetApplicationDetails