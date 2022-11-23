import { useQuery } from "react-query";
import { Fetcher } from "../../../generated/apis/api";
import { Dashboard } from "../../../generated/entities/Entities";
import labels from "../../../labels/labels";


const useGetDashboard = (props: {filter: Dashboard}): [data: Dashboard[], isLoading: boolean, error: object, refetch: Function]  => {

    const {data, error, isLoading, refetch} = useQuery([labels.entities.Dashboard, props.filter], 
        () => Fetcher.fetchData('GET', '/getDashboards', props.filter),
        {
            enabled: false
        }
    )
    
    return [data || [], isLoading, error as object, refetch]
}

export default useGetDashboard
