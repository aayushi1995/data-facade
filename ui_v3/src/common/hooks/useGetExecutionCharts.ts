import { useQuery } from "react-query"
import { Fetcher } from "../../generated/apis/api"
import { Chart } from "../../generated/entities/Entities"
import { ChartWithData } from "../../generated/interfaces/Interfaces"
import labels from "../../labels/labels"

interface GetExecutionChartProps {
    filter: Chart,
    handleSucess?: (data: ChartWithData[]) => void,
    enabled?: boolean
}

export const useGetExecutionCharts = (props: GetExecutionChartProps): [ChartWithData[], boolean, object] => {
    const {data, isLoading, error} = useQuery(["chartData", props.filter], 
        () => Fetcher.fetchData("GET", "/getChartData", props.filter),
        {
            onSuccess: (data: ChartWithData[]) => {
                props.handleSucess?.(data)
            },
            enabled: props.enabled
        }
    )

    return [data || [], isLoading, error as object]

}