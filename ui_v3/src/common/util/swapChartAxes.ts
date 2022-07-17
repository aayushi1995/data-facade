import ChartGroups from "../../enums/ChartGroups";
import ChartType from "../../enums/ChartType";
import { Chart } from "../../generated/entities/Entities";
import { ChartWithData } from "../../generated/interfaces/Interfaces";
import { BaseChartsConfig, SeriesLine } from "../components/charts/BaseChartsConfig";
import { EChartUISpecificConfig } from "../components/charts/types/EChartUISpecificConfig";
import { GaugeSingelValueData, HeatMapDataframeData, LineChartOptions, PieChartOptions, ScatterChartOptions, StackedHistogramData, TimeSeriesChartData, TwoDSegmentChartOptions } from "./formChartOptionsFromContext";


export const swapAxesChartOptionsTwoDimenstion = (chartData: ChartWithData): ChartWithData => {


    const data = (chartData.chartData as LineChartOptions).data
    const swappedData: LineChartOptions = {
        data: {
            x_name: data.y_name,
            x: data.y,
            y_name: data.x_name,
            y: data.x
        }
    }
    console.log(swappedData, data)

    return {
        ...chartData,
        chartData: swappedData
    }
}

export const swapAxesChartOptionsTwoDimenstionScatter = (chartData: ChartWithData): ChartWithData => {
    const data = (chartData.chartData as ScatterChartOptions).data

    const swappedData: ScatterChartOptions = {
        data: {
            x_name: data.y_name,
            y_name: data.x_name,
            result: data.result.map(scatterPoint => [scatterPoint[1], scatterPoint[0]])
        }
    }
    console.log(data, swappedData)
    return {
        ...chartData,
        chartData: swappedData
    }
}


const swapChartAxes = (chartWithData: ChartWithData) => {
    switch (chartWithData?.model?.ChartGroup) {

        case ChartGroups.TWO_DIMENSION:
            return swapAxesChartOptionsTwoDimenstion(chartWithData)

        case ChartGroups.TWO_DIMENSIONAL_SCATTER:
            return swapAxesChartOptionsTwoDimenstionScatter(chartWithData)


        default: {
            // TODO: defaulting to single value
            return chartWithData
        }
    }

}

export default swapChartAxes