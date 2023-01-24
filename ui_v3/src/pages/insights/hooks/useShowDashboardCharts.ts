import React, {useCallback} from "react";

import { Layout } from "react-grid-layout";
import { useShowCharts } from "../../../common/components/charts/hooks/useShowCharts";
import formChartOptions from "../../../common/util/formChartOptionsFromContext";
import { DashboardChartWithData } from "../../../generated/interfaces/Interfaces";
import { ShowDashboardChartProps } from "../components/ShowDashboardCharts";

export function useShowDashboardCharts(props: ShowDashboardChartProps) {
    
    const prepareProps = (charts: DashboardChartWithData[]) => {
        return charts.map?.(chartWithDataAndLayout => chartWithDataAndLayout.chartWithData!)
    }

    // const {formChartOptionsWrapper, onChartTypeChange, onChartNameChange, onChartDashboardChange, chartDataOptions} = useShowCharts({chartWithData: prepareProps(props.chartWithDataAndLayout ) || []})

    const onTextBoxValueChange = (value: string, id: string) => {
        props?.onTextBoxValueChange?.(id, 'text', value)
    }

    const getChartDataOptions = React.useCallback(() => {
        return props.chartWithDataAndLayout.map(chartDetails => ({...formChartOptions(chartDetails.chartWithData || {}), model: chartDetails.chartWithData?.model!}))
    }, [props.chartWithDataAndLayout])

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

    const getChartDataOptionsAndLayout = () => {
        return getChartDataOptions()?.map(chartWithData => {
            const layoutChart = props.chartWithDataAndLayout.find(chartWithLayout => chartWithData?.model?.Id === chartWithLayout.chartWithData?.model?.Id)?.layout
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

    const onChartPropChange = (prop: string)=>(chartId: string, propValue: string) => {
        const newCharts = props.chartWithDataAndLayout?.map(executionChart => {
            if (chartId === executionChart?.chartWithData?.model?.Id && executionChart !== undefined) {
                return {
                    ...executionChart,
                    chartWithData: {
                        ...executionChart.chartWithData,
                        model: {
                            ...executionChart.chartWithData.model,
                            [prop]: propValue
                        }
                    }
                }
            }
            return executionChart
        })
        props.onChartChange?.(newCharts)

    };
    const onChartNameChange = onChartPropChange('Name');
    const onChartDashboardChange = onChartPropChange('DashboardId');
    const onChartTypeChange = onChartPropChange('Type');

    const chartWithDataAndLayout = getChartDataOptionsAndLayout() || []

    return {updateLayout, onChartNameChange, onChartDashboardChange, onChartTypeChange, onTextBoxValueChange, chartWithDataAndLayout}
}