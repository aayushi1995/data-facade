import { useQuery } from "react-query"
import { Fetcher } from "../../../generated/apis/api"
import { Dashboard } from "../../../generated/entities/Entities"
import { DashboardDetails } from "../../../generated/interfaces/Interfaces"
import labels from "../../../labels/labels"


const useGetDashboardDetails = (props: {filter: Dashboard}): [DashboardDetails[], boolean, object, Function] => {

    const {data, isLoading, error, refetch} = useQuery([labels.entities.Dashboard, "details", props.filter], 
        () => Fetcher.fetchData("GET", "/getDashboardDetails", props.filter)
    )

    return [data || [], isLoading, error as object, refetch]
}

export default useGetDashboardDetails