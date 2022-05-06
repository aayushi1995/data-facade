import React, {useCallback} from "react";
import {ChartWithData} from "../../../../generated/interfaces/Interfaces";
import ChartGroups from "../../../../enums/ChartGroups";
import {
    formChartOptionsSingleDimensionWithLables,
    formChartOptionsTimeSeries,
    formChartOptionsTwoDimensionWithSegments,
    formChartOptionsTwoDimenstion,
    formChartOptionsTwoDimenstionScatter
} from "../../../util/formChartOptions";
import {ShowChartsProps} from "../types/ShowChartsProps";
import {UseChartsStateType} from "../types/useChartsStateType";

export function useShowCharts(props: ShowChartsProps) {
    const [chartDataOptions, setChartDataOptions] = React.useState<UseChartsStateType>()
    const [rawData, setRawData] = React.useState(props.chartWithData)

    const formChartOptions = useCallback((data: ChartWithData[]) => {
        const options = data.map(chartData => {
            switch (chartData?.model?.ChartGroup) {
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
    }, []);

    React.useEffect(() => {
        formChartOptions(props.chartWithData)
    }, [formChartOptions, props.chartWithData])

    const onChartPropChange = useCallback((prop: string)=>(chartId: string, propValue: string) => {
        const newCharts = rawData?.map(executionChart => {
            if (chartId === executionChart?.model?.Id && executionChart !== undefined) {
                return {
                    ...executionChart,
                    model: {
                        ...executionChart?.model,
                        [prop]: propValue
                    }
                }
            }
            return executionChart
        })
        setRawData(newCharts)
        formChartOptions(newCharts || [])
    }, [formChartOptions, rawData]);
    const onChartNameChange = onChartPropChange('Name');
    const onChartDashboardChange = onChartPropChange('DashboardId');
    const onChartTypeChange = onChartPropChange('Type');
    return {chartDataOptions, onChartTypeChange, onChartNameChange, onChartDashboardChange};
}