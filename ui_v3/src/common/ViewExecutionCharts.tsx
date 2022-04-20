import { Autocomplete } from "@mui/material"
import { Box, Grid, Typography, TextField } from "@mui/material"
import { getOptions } from "highcharts"
import React from "react"
import ChartGroups from "../enums/ChartGroups"
import { Chart as ChartModel } from "../generated/entities/Entities"
import { ChartWithData } from "../generated/interfaces/Interfaces"
import { BaseChartsConfig } from "./components/charts/BaseChartsConfig"
import { Chart, EChartUISpecificConfig } from "./components/charts/Chart"
import ShowCharts from "./components/charts/ShowCharts"
import LoadingWrapper from "./components/LoadingWrapper"
import NoData from "./components/NoData"
import { ReactQueryWrapper } from "./components/ReactQueryWrapper"
import { useGetExecutionCharts } from "./hooks/useGetExecutionCharts"
import { formChartOptionsSingleDimensionWithLables, formChartOptionsTwoDimenstion, formChartOptionsTwoDimenstionScatter, formChartOptionsTwoDimensionWithSegments } from "./util/formChartOptions"
import getChartTypeOptions from "./util/getChartTypeOptions"


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
