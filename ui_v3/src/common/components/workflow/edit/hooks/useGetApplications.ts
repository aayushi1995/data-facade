import { useQuery, UseQueryOptions } from "react-query"
import { Fetcher } from "../../../../../generated/apis/api"
import { Application } from "../../../../../generated/entities/Entities"

export interface UseGetApplicationsParams {
    options?: UseQueryOptions<Application[], unknown>,
    filter: Application
}

const useGetApplications = (params: UseGetApplicationsParams) => {
    const query = useQuery(["Application", "get"],
        () => Fetcher.fetchData('GET', '/getApplications', params.filter),
        {
            ...params?.options
        }
    )

    return query
}

export default useGetApplications