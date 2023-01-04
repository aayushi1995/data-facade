import React, {useCallback} from "react";

import { Layout } from "react-grid-layout";
import { useShowCharts } from "../../../common/components/charts/hooks/useShowCharts";
import { DashboardChartWithData } from "../../../generated/interfaces/Interfaces";
import { ShowDashboardChartProps } from "../components/ShowDashboardCharts";

export function useShowDashboardCharts(props: ShowDashboardChartProps) {
    
    const prepareProps = (charts: DashboardChartWithData[]) => {
        return charts.map?.(chartWithDataAndLayout => chartWithDataAndLayout.chartWithData!)
    }

    const {formChartOptionsWrapper, onChartTypeChange, onChartNameChange, onChartDashboardChange, chartDataOptions} = useShowCharts({chartWithData: prepareProps(props.chartWithDataAndLayout ) || []})

    const onTextBoxValueChange = (value: string, id: string) => {
        props?.onTextBoxValueChange?.(id, 'text', value)
    }

    const updateLayout = (layout: Layout[]) => {
        const newCharts = props.chartWithDataAndLayout.map(chartData => {
            const newChartLayout = layout.find(item => item.i === chartData?.chartWithData?.model?.Id)
            if(!!newChartLayout){
                return {
                    ...chartData,
                    layout: JSON.stringify(newChartLayout)
                }
            }
            return chartData
            
        })
        props.textBoxes?.forEach(textBox => {
            const newTextBoxLayout = layout.find(item => item.i === textBox.id)
            if(!!newTextBoxLayout) {
                props.onTextBoxValueChange?.(textBox.id, 'layout', JSON.stringify(newTextBoxLayout))
            }
        })
        props.onChartChange?.(newCharts)
    }

    const formCharts = () => {
        formChartOptionsWrapper(prepareProps(props.chartWithDataAndLayout))
    }

    const getChartDataOptionsAndLayout = () => {
        return chartDataOptions?.map(chartWithData => {
            const layoutChart = props.chartWithDataAndLayout.find(chartWithLayout => chartWithData?.model.Id === chartWithLayout.chartWithData?.model?.Id)?.layout
            if(!!layoutChart){
                return {
                    ...chartWithData!,
                    layout: JSON.parse(layoutChart) as Layout
                }
            }
            return {
                ...chartWithData!,
                layout: undefined
            }
        })
    }

    const chartWithDataAndLayout = getChartDataOptionsAndLayout() || []

    return {updateLayout, onChartNameChange, onChartDashboardChange, onChartTypeChange, onTextBoxValueChange, chartWithDataAndLayout, formCharts}
}