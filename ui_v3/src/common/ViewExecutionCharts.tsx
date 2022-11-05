
import React from "react"
import ShowCharts from "./components/charts/ShowCharts"
import LoadingWrapper from "./components/LoadingWrapper"
import { useGetExecutionCharts } from "./hooks/useGetExecutionCharts"


interface ViewExecutionChartsProps {
    executionId: string
}

const ViewExecutionCharts = (props: ViewExecutionChartsProps) => {

    const [dataFetched, setDataFetched] = React.useState(false)

    const handleSuccess = () => {
        setDataFetched(true)
    }
    
    const [data, isLoading, error] = useGetExecutionCharts({
        filter: {ExecutionId: props.executionId},
        handleSucess: handleSuccess,
        enabled: !dataFetched
    })

    return (
        <LoadingWrapper
            isLoading={isLoading}
            error={error}
            data={data}
        >
            <ShowCharts chartWithData={data}/>
        </LoadingWrapper>
    )

}

export default ViewExecutionCharts
