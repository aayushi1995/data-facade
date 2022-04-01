import { useQuery } from "react-query"
import { Fetcher } from "../../../../../generated/apis/api"
import { Application } from "../../../../../generated/entities/Entities"

const useGetApplications = (options: {filter: Application}): [Application[], boolean, object] => {
    const {data, isLoading, error} = useQuery(["Application", "get"],
        () => Fetcher.fetchData('GET', '/getApplications', options.filter)
    )

    return [data || [], isLoading, error as object]
}

export default useGetApplications