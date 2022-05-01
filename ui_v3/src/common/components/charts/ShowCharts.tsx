import { Grid, Box, Autocomplete, TextField, Card, IconButton, Popover } from "@mui/material";
import React from "react";
import { lightShadows } from "../../../css/theme/shadows";
import ChartGroups from "../../../enums/ChartGroups";
import { Chart as ChartModel } from "../../../generated/entities/Entities";
import { ChartWithData } from "../../../generated/interfaces/Interfaces";
import { formChartOptionsSingleDimensionWithLables, formChartOptionsTimeSeries, formChartOptionsTwoDimensionWithSegments, formChartOptionsTwoDimenstion, formChartOptionsTwoDimenstionScatter } from "../../util/formChartOptions";
import LoadingIndicator from "../LoadingIndicator";
import NoData from "../NoData";
import { BaseChartsConfig } from "./BaseChartsConfig";
import { Chart, EChartUISpecificConfig } from "./Chart";
import ChartWithMetadata from "./ChartWithMetadata";



interface ShowChartsProps {
    chartWithData: ChartWithData[]
}

const ShowCharts = (props: ShowChartsProps) => {

    const [chartDataOptions, setChartDataOptions] = React.useState<({config: BaseChartsConfig, uiConfig: EChartUISpecificConfig, model: ChartModel} | undefined)[]>()
    const [rawData, setRawData] = React.useState(props.chartWithData)

    const formChartOptions = (data: ChartWithData[]) => {
        console.log(data)
        const options = data.map(chartData => {
            switch(chartData?.model?.ChartGroup) {
                case ChartGroups.SINGLE_DIMENSION_WITH_LABELS:
                    return formChartOptionsSingleDimensionWithLables(chartData)
                
                case ChartGroups.TWO_DIMENSION:
                    return formChartOptionsTwoDimenstion(chartData)
                
                case ChartGroups.TWO_DIMENSIONAL_SCATTER:
                    return formChartOptionsTwoDimenstionScatter(chartData)
                
                case ChartGroups.TWO_DIMENSION_WITH_SEGMENTS:
                    return formChartOptionsTwoDimensionWithSegments(chartData)
                
                case ChartGroups.TIME_SERIES:
                    return formChartOptionsTimeSeries(chartData)

                default: {
                    return undefined
                }
            }
            
        })

        setChartDataOptions(options)
    }

    React.useEffect(() => {
        formChartOptions(props.chartWithData)
    }, [props])

    const onChartTypeChange = (chartId: string, newType: string) => {
        const newCharts = rawData?.map(executionChart => {
            if(chartId === executionChart?.model?.Id && executionChart !== undefined) {
                return {
                    ...executionChart,
                    model: {
                        ...executionChart?.model,
                        Type: newType
                    }
                }
            }
            return executionChart
        })
        setRawData(newCharts)
        formChartOptions(newCharts || [])
    }

    const onChartNameChange = (chartId: string, newName: string) => {
        const newCharts = rawData?.map(executionChart => {
            if(chartId === executionChart?.model?.Id && executionChart !== undefined) {
                return {
                    ...executionChart,
                    model: {
                        ...executionChart?.model,
                        Name: newName
                    }
                }
            }
            return executionChart
        })
        setRawData(newCharts)
        formChartOptions(newCharts || [])
    }

    const onChartDashboardChange = (chartId: string, dashboardId: string) => {
        const newCharts = rawData?.map(executionChart => {
            if(chartId === executionChart?.model?.Id && executionChart !== undefined) {
                return {
                    ...executionChart,
                    model: {
                        ...executionChart?.model,
                        DashboardId: dashboardId
                    }
                }
            }
            return executionChart
        })
        setRawData(newCharts)
        formChartOptions(newCharts || [])
    }

    if(chartDataOptions) {
        return (
            <Grid container spacing={1} sx={{padding: 2}}>
                {chartDataOptions?.map(chart => {
                    if(!!chart) {
                        return (
                            <Grid item xs={6} sx={{minHeight: '400px'}}>
                                <Card sx={{height: '100%', width: '100%', boxShadow: lightShadows[27]}}>
                                    <ChartWithMetadata onChartTypeChange={onChartTypeChange} chart={chart} onChartNameChange={onChartNameChange} onChartDashboardChange={onChartDashboardChange}/>
                                </Card>
                            </Grid>
                        )
                    } else {
                        return <NoData/>
                    }
                })}
            </Grid>
        )
    }

    return <LoadingIndicator/>
    

}

export default ShowCharts