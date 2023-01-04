import React, {useCallback} from "react";
import {ChartWithData} from "../../../../generated/interfaces/Interfaces";
import ChartGroups from "../../../../enums/ChartGroups";
import {ShowChartsProps} from "../types/ShowChartsProps";
import {UseChartsStateType} from "../types/useChartsStateType";
import { Layout } from "react-grid-layout";
import { Chart } from "../../../../generated/entities/Entities";
import { DashboardTextBoxConfig } from "../../../../pages/insights/SingleDashboardView";
import formChartOptions from "../../../util/formChartOptionsFromContext";

export function useShowCharts(props: ShowChartsProps & {onTextBoxValueChange?: (id: string, prop: string, value: string) => void, textBoxes?: DashboardTextBoxConfig[]}) {
    const [chartDataOptions, setChartDataOptions] = React.useState<UseChartsStateType>()
    const [rawData, setRawData] = React.useState(props.chartWithData)
    console.log(props)
    const formChartOptionsWrapper = useCallback((data: ChartWithData[]) => {
        console.log(data)
        const options = data.map(chartData => {
            return {
                ...formChartOptions(chartData)!,
                model: chartData.model || {}
            }
        })

        setChartDataOptions(options)
    }, []);

    React.useEffect(() => {
        console.log('here')
        formChartOptionsWrapper(rawData)
    }, [])
    

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
        formChartOptionsWrapper(newCharts || [])
    }, [formChartOptions, rawData]);
    const onChartNameChange = onChartPropChange('Name');
    const onChartDashboardChange = onChartPropChange('DashboardId');
    const onChartTypeChange = onChartPropChange('Type');
    return {chartDataOptions, onChartTypeChange, onChartNameChange, onChartDashboardChange, formChartOptionsWrapper};
}