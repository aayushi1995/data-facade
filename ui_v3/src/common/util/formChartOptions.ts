import ChartType from "../../enums/ChartType";
import { ChartWithData } from "../../generated/interfaces/Interfaces";
import { BaseChartsConfig } from "../components/charts/BaseChartsConfig";
import { EChartUISpecificConfig } from "../components/charts/Chart";


interface PieChartOptions {
    data: {
        result: {name: string, value: number}[],
        name: string
    }
}

interface LineChartOptions {
    data: {
        x: (number|string)[],
        y: (number|string)[],
        x_name: string,
        y_name: string
    }
}

export const formChartOptionsSingleDimensionWithLables = (chartData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig, name: string} => {
    switch(chartData.model?.Type) {
        case ChartType.PIE:
            const chartOptions: EChartUISpecificConfig = {
                title: {
                    show: true,
                    text: chartData.model?.Name
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                }
            }
            const chartDataOptions: BaseChartsConfig = {
                series: {
                    name: (chartData.chartData as PieChartOptions).data.name,
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: (chartData.chartData as PieChartOptions).data.result
                }
            }
            console.log("here")
            return {
                uiConfig: chartOptions,
                config: chartDataOptions,
                name: chartData.model?.Name || "Name NA"
            }
    }


    // HARD CODING HERE. REMOVE BEFORE MERGE
    return {
        uiConfig: {},
        config: {
            series: {
                type: 'pie',
                data: [{name: 'hello', value: 100}]
            }
        },
        name: "test"
    }
}

export const formChartOptionsTwoDimenstion = (chartData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig, name: string} => {

    switch(chartData.model?.Type) {
        case ChartType.LINE: {
            const chartOptions: EChartUISpecificConfig = {
                tooltip: {
                    trigger: 'axis'
                },
                title: {
                    show: true,
                    text: chartData.model?.Name
                },
            }
            const dataOptions: BaseChartsConfig = {
                series: {
                    type: 'line',
                    data: (chartData.chartData as LineChartOptions).data.y,
                    smooth: true
                },
                xAxis: [{
                    type: 'category',
                    data: (chartData.chartData as LineChartOptions).data.x,
                    name: (chartData.chartData as LineChartOptions).data.x_name
                }],
                yAxis: [{
                    type: 'value',
                    name: (chartData.chartData as LineChartOptions).data.y_name
                }]
            }

            return {uiConfig: chartOptions, config: dataOptions, name: chartData.model.Name || "NAME NA"}
        }

        case ChartType.BAR: {
            const chartOptions: EChartUISpecificConfig = {
                tooltip: {
                    trigger: 'axis'
                },
                title: {
                    show: true,
                    text: chartData.model?.Name
                },
            }
            const dataOptions: BaseChartsConfig = {
                series: [{
                    type: 'bar',
                    data: (chartData.chartData as LineChartOptions).data.y
                }],
                xAxis: [{
                    type: 'category',
                    data: (chartData.chartData as LineChartOptions).data.x,
                    name: (chartData.chartData as LineChartOptions).data.x_name
                }],
                yAxis: [{
                    type: 'value',
                    name: (chartData.chartData as LineChartOptions).data.y_name
                }]
            }

            return {uiConfig: chartOptions, config: dataOptions, name: chartData.model.Name || "NAME NA"}
        }


        default: {
            // HARD CODING HERE. REMOVE BEFORE MERGE
            return {
                uiConfig: {},
                config: {
                    series: {
                        type: 'pie',
                        data: [{name: 'hello', value: 100}]
                    }
                },
                name: "test"
            }
        }
    }
}