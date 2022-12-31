import React, {useCallback} from "react";
import {ChartWithData} from "../../../../generated/interfaces/Interfaces";
import ChartGroups from "../../../../enums/ChartGroups";
import {
    formChartOptionsHeatMap,
    formChartOptionsSingleDimensionWithLables,
    formChartOptionsSingleValue,
    formChartOptionsStackedHistogram,
    formChartOptionsTimeSeries,
    formChartOptionsTwoDimensionWithSegments,
    formChartOptionsTwoDimenstion,
    formChartOptionsTwoDimenstionScatter
} from "../../../util/formChartOptions";
import {ShowChartsProps} from "../types/ShowChartsProps";
import {UseChartsStateType} from "../types/useChartsStateType";
import { Layout } from "react-grid-layout";
import { Chart } from "../../../../generated/entities/Entities";
import { DashboardTextBoxConfig } from "../../../../pages/insights/SingleDashboardView";

export function useShowCharts(props: ShowChartsProps & {onTextBoxValueChange?: (id: string, prop: string, value: string) => void, textBoxes?: DashboardTextBoxConfig[]}) {
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
                
                case ChartGroups.SINGLE_VALUE:
                    return formChartOptionsSingleValue(chartData)
                
                case ChartGroups.STACKED_HISTOGRAM:
                    return formChartOptionsStackedHistogram(chartData)
                
                case ChartGroups.HEAT_MAP:
                    return formChartOptionsHeatMap(chartData)

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

    const updateLayout = (layout: Layout[]) => {
        const newCharts = rawData.map(chartData => {
            const newChartLayout = layout.find(item => item.i === chartData?.model?.Id)
            if(!!newChartLayout){
                return {
                    ...chartData!,
                    model: {
                        ...chartData?.model,
                        Layout: JSON.stringify(newChartLayout)
                    }
                }
            }
            return chartData
            
        })
        props.textBoxes?.forEach(textBox => {
            const newTextBoxLayout = layout.find(item => item.i === textBox.id)
            if(!!newTextBoxLayout) {
                props.onTextBoxValueChange?.(textBox.id, 'layout', JSON.stringify(newTextBoxLayout))
            }
            return textBox
        })
        setRawData(newCharts)
        formChartOptions(newCharts)
        props.onChartChange?.(newCharts)
    }

    const getUILayout = (chart: Chart, index: number) => {
        return chart.Layout ? JSON.parse(chart.Layout) : {x: index % 2 === 0 ? 0 : 7, y: (index/2)*40, w: 7, h: 40}
    }

    const onTextBoxValueChange = (value: string, id: string) => {
        props?.onTextBoxValueChange?.(id, 'text', value)
    }

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
    return {chartDataOptions, onChartTypeChange, onChartNameChange, onChartDashboardChange, updateLayout, getUILayout, onTextBoxValueChange};
}