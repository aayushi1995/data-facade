import { useQuery, UseQueryOptions } from "react-query"
import { Fetcher } from "../../../../generated/apis/api"
import { Chart, Dashboard } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"


interface UseGetDashboardChartProps {
    filter: Chart,
    queryParams?: UseQueryOptions<unknown, unknown, Dashboard[], [string, string, Chart]>
}

const useGetDashboardsForChart = (params: UseGetDashboardChartProps) => {

    return useQuery(["Chart", "Dashboards", params.filter], 
        () => Fetcher.fetchData("GET", "/getDashboardForChart", params.filter), {
            ...params.queryParams
        }
    )
}

export default useGetDashboardsForChart