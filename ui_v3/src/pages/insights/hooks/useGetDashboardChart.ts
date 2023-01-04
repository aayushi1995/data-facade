import { useQuery, UseQueryOptions } from "react-query"
import { Fetcher } from "../../../generated/apis/api"
import { Dashboard } from "../../../generated/entities/Entities"
import { DashboardChartWithData } from "../../../generated/interfaces/Interfaces"
import labels from "../../../labels/labels"


interface UseGetDashboardChartProps {
    filter: Dashboard,
    queryParams?: UseQueryOptions<unknown, unknown, DashboardChartWithData[], [string, string, Dashboard]>
}

const useGetDashboardChart = (params: UseGetDashboardChartProps) => {

    return useQuery([labels.entities.Dashboard, "Charts", params.filter],
     () => Fetcher.fetchData("GET", "/getChartsForDashboard", params.filter), {
        ...params.queryParams
     })

}

export default useGetDashboardChart