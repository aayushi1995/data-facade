import ChartType from "../../enums/ChartType";
import { Chart } from "../../generated/entities/Entities";
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

interface ScatterChartOptions {
    data: {
        result: number[][],
        x_name: string,
        y_name: string
    }
}

interface TwoDSegmentChartOptions {
    data: {
        x: (number|string)[],
        series: {
            name: string,
            data: (number|string)[]
        }[],
        x_name: string
        y_name: string
    }
}

export const formChartOptionsSingleDimensionWithLables = (chartData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig, model: Chart} | undefined=> {
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
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
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
                model: chartData.model
            }
        default: 
            return undefined
    }
}

export const formChartOptionsTwoDimenstion = (chartData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig, model: Chart} | undefined => {

    switch(chartData.model?.Type) {
        case ChartType.LINE: {
            const chartOptions: EChartUISpecificConfig = {
                tooltip: {
                    trigger: 'axis'
                },
                universalTransition: true,
                title: {
                    show: true,
                    text: chartData.model?.Name
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
            }
            const dataOptions: BaseChartsConfig = {
                series: [{
                    type: 'line',
                    data: (chartData.chartData as LineChartOptions).data.y,
                    smooth: true
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

            return {uiConfig: chartOptions, config: dataOptions,  model: chartData.model}
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
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
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

            return {uiConfig: chartOptions, config: dataOptions,  model: chartData.model}
        }


        default: {
            return undefined;
        }
    }
}

export const formChartOptionsTwoDimenstionScatter = (chartData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig, model: Chart} | undefined => {
    switch(chartData.model?.Type) {
        case ChartType.SCATTER: {
            const chartOptions: EChartUISpecificConfig = {
                tooltip: {
                    trigger: 'item',
                    showContent: true
                },
                title: {
                    show: true,
                    text: chartData.model?.Name
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                dataZoom:{
                    
                }
            }
            const chartDataCasted = chartData.chartData as ScatterChartOptions
            const dataOptions: BaseChartsConfig = {
                series: [{
                    type: 'scatter',
                    symbolSize: 5,
                    data: chartDataCasted.data.result
                }],
                xAxis: [{
                    name: chartDataCasted.data.x_name
                }],
                yAxis: [{
                    name: chartDataCasted.data.y_name
                }]
            }

            console.log(dataOptions)

            return {
                uiConfig: chartOptions,
                config: dataOptions,
                model: chartData.model
            }
        }
    }
}

export const formChartOptionsTwoDimensionWithSegments = (chartData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig, model: Chart} | undefined => {
    switch(chartData.model?.Type) {
        case ChartType.SEGMENT: {
            const castedChartData = chartData.chartData as TwoDSegmentChartOptions
            const legends = castedChartData.data.series.map(legendWithData => legendWithData.name)
            const chartOptions: EChartUISpecificConfig = {
                tooltip: {
                    trigger: 'axis'
                },
                title: {
                    text: chartData.model?.Name,
                    show: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                legend: {
                    data: legends
                },
                grid: {
                    containLabel: true
                }
            }

            const dataOptions: BaseChartsConfig = {
                xAxis: [{
                    type: 'category',
                    data: castedChartData.data.x,
                    name: castedChartData.data.x_name
                }],
                yAxis: [{
                    type: 'value',
                    name: castedChartData.data.y_name
                }],
                series: castedChartData.data.series.map((series) => {
                    return {
                        data: series.data,
                        name: series.name,
                        type: 'line',
                        smooth: true
                    }
                })
            }
            return {
                uiConfig: chartOptions,
                config: dataOptions,
                 model: chartData.model
            }
        }
    }
}