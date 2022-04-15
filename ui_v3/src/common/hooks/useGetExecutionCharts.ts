import { useQuery } from "react-query"
import { Fetcher } from "../../generated/apis/api"
import { ChartWithData } from "../../generated/interfaces/Interfaces"
import labels from "../../labels/labels"

interface GetExecutionChartProps {
    executionId: string,
    handleSucess: (data: ChartWithData[]) => void
}

export const useGetExecutionCharts = (props: GetExecutionChartProps): [ChartWithData[], boolean, object] => {
    const {data, isLoading, error} = useQuery([labels.entities.ActionExecution, "chartData", props.executionId], 
        () => Fetcher.fetchData("GET", "/getExecutionCharts", {Id: props.executionId}),
        {
            onSuccess: (data: ChartWithData[]) => {
                props.handleSucess(data)
            }
        }
    )

    return [data || [], isLoading, error as object]

}