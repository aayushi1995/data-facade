import { Box, Grid, Typography } from "@mui/material"
import React from "react"
import ChartGroups from "../enums/ChartGroups"
import { ChartWithData } from "../generated/interfaces/Interfaces"
import { BaseChartsConfig } from "./components/charts/BaseChartsConfig"
import { Chart, EChartUISpecificConfig } from "./components/charts/Chart"
import LoadingWrapper from "./components/LoadingWrapper"
import { ReactQueryWrapper } from "./components/ReactQueryWrapper"
import { useGetExecutionCharts } from "./hooks/useGetExecutionCharts"
import { formChartOptionsSingleDimensionWithLables, formChartOptionsTwoDimenstion } from "./util/formChartOptions"


interface ViewExecutionChartsProps {
    executionId: string
}

const ViewExecutionCharts = (props: ViewExecutionChartsProps) => {
    const executionId = props.executionId
    const [chartDataOptions, setChartDataOptions] = React.useState<{config: BaseChartsConfig, uiConfig: EChartUISpecificConfig}[]>([])

    const formChartOptions = (data: ChartWithData[]) => {
        console.log(data)
        const options = data.map(chartData => {
            switch(chartData.model?.ChartGroup) {
                case ChartGroups.SINGLE_DIMENSION_WITH_LABELS:
                    return formChartOptionsSingleDimensionWithLables(chartData)
                
                case ChartGroups.TWO_DIMENSION:
                    return formChartOptionsTwoDimenstion(chartData)

                default: {
                    // HARD CODING. REMOVE BEFORE MERGE
                    return {
                        uiConfig: {} as EChartUISpecificConfig,
                        config: {
                            series: {
                                type: 'pie',
                                data: [{name: 'hello', value: 100}]
                            }
                        } as BaseChartsConfig
                    }
                }
            }
            
        })

        setChartDataOptions(options || [])
    }
    const [data, isLoading, error] = useGetExecutionCharts({
        executionId: props.executionId,
        handleSucess: formChartOptions
    })

    return (
        <LoadingWrapper
            isLoading={isLoading}
            error={error}
            data={chartDataOptions}
        >
            <Grid container spacing={1} sx={{padding: 2}}>
                {chartDataOptions.map(chart => {
                    return (
                        <Grid item xs={6}>
                                {/* <Typography variant="heroMeta">
                                    
                                </Typography> */}
                                <Chart {...chart}/>
                            {/* </Box> */}
                        </Grid>
                    )
                })}
            </Grid>
        </LoadingWrapper>
    )

}

export default ViewExecutionCharts