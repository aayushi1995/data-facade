import ChartType from "../../enums/ChartType";
import { Chart } from "../../generated/entities/Entities";
import { ChartWithData } from "../../generated/interfaces/Interfaces";
import { BaseChartsConfig, SeriesLine } from "../components/charts/BaseChartsConfig";
import { EChartUISpecificConfig } from "../components/charts/types/EChartUISpecificConfig";


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

interface TimeSeriesChartData {
    data: {
        x: (number|string)[],
        series: {
            name: string,
            data: (number|string)[]
        }[],
        forecasted_rows: number
    }
}

interface GaugeSingelValueData {
    data: {
        value: number,
        minimum: number,
        maximum: number,
        threshold_1: number,
        threshold_2: number
    }
}

interface StackedHistogramData {
    data: {
        x_name: string,
        x_values: (string | number)[],
        series: {
            name: string,
            data: (string|number)[]
        }[]
    }
}

interface HeatMapDataframeData {
    data: {
        y_values: (string | number)[],
        y_name: string,
        heat_map_data: ((string|number)[])[],
        x_labels: string[],
        min_value: number,
        max_value: number
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
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    data: (chartData.chartData as PieChartOptions).data.result
                }
            }

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
                    trigger: 'axis',
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

            console.log(dataOptions)
            return {
                uiConfig: chartOptions,
                config: dataOptions,
                 model: chartData.model
            }
        }
        case ChartType.RADIAL_POLAR_CHART: {
            const castedChartData = chartData.chartData as TwoDSegmentChartOptions
            const legends = castedChartData.data.series.map(legendWithData => legendWithData.name)
            const chartOptions: EChartUISpecificConfig = {
                tooltip: {
                    trigger: 'axis'
                },
                radiusAxis: {},
                polar: {},
                legend: {
                    show: true,
                    data: legends
                },
                title: {
                    text: chartData.model?.Name,
                    show: true
                },
                angleAxis: {
                    type: 'category',
                    data: castedChartData.data.x,   
                },
                toolbox: {
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                }
            }
            const dataOptions: BaseChartsConfig = {
                series: castedChartData.data.series.map((series) => {
                    return {
                        data: series.data,
                        name: series.name,
                        type: 'line',
                        smooth: true,
                        coordinateSystem: 'polar'
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

export const formChartOptionsTimeSeries = (chartData: ChartWithData) : {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig, model: Chart} | undefined => {
    switch(chartData?.model?.Type) {
        case ChartType.TIME_SERIES: {
            const castedChartData = chartData.chartData as TimeSeriesChartData

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
            const series: SeriesLine = []
            castedChartData.data.series.map(timeSeriesData => {
                series.push({
                    data: timeSeriesData.data.slice(0, castedChartData.data.x.length - castedChartData.data.forecasted_rows),
                    name: timeSeriesData.name,
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                    tooltip: {
                        show: false
                    }
                })
                series.push({
                    data: timeSeriesData.data,
                    name: timeSeriesData.name,
                    type: 'line',
                    lineStyle: {
                        type: 'dashed'
                    },
                    smooth: true,
                    showSymbol: false,
                })
            })
            const dataOptions: BaseChartsConfig = {
                xAxis: [{
                    type: 'category',
                    data: castedChartData.data.x,
                    name: "Timestamps"
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: series
            }
            
            return {
                uiConfig: chartOptions,
                config: dataOptions,
                model: chartData.model
            } 
        }
    }
}

export const formChartOptionsSingleValue = (chartData: ChartWithData) : {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig, model: Chart} | undefined => {
    switch(chartData?.model?.Type) {
        case ChartType.SINGLE_VALUE_GAUGE: {
            const castedChartData = chartData.chartData as GaugeSingelValueData

            const chartOptions: EChartUISpecificConfig = {
                title: {
                    text: chartData?.model?.Name,
                    show: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
            }
            const dataOptions: BaseChartsConfig = {
                series: [{
                    type: 'gauge',
                    min: castedChartData?.data?.minimum,
                    max: castedChartData?.data?.maximum,
                    axisLine: {
                        lineStyle: {
                            width: 18,
                            color: [
                                [castedChartData?.data?.threshold_1, '#67e0e3'],
                                [castedChartData?.data?.threshold_2, '#37a2da'],
                                [1, '#fd666d']
                            ]
                        },
                        
                    },

                    pointer: {
                        itemStyle: {
                          color: 'auto'
                        }
                      },
                      axisTick: {
                        show: false
                      },
                      splitLine: {
                        length: 15,
                        lineStyle: {
                          width: 2,
                          color: '#999'
                        }
                      },
                      axisLabel: {
                        distance: 25,
                        color: 'auto',
                        fontSize: 20
                      },
                      title: {
                        show: false
                      },
                      detail: {
                        valueAnimation: true,
                        fontSize: 80,
                        offsetCenter: [0, '70%'],
                        color: 'auto'
                      },
                      data: [
                        {
                          value: castedChartData?.data?.value
                        }
                      ]
                }]
            }

            return {
                uiConfig: chartOptions,
                config: dataOptions,
                model: chartData.model
            } 
        }
    }
}

export const formChartOptionsStackedHistogram = (chartData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig, model: Chart} | undefined => {
    switch(chartData?.model?.Type) {
        case ChartType.STACKED_HISTOGRAM: {
            const castedChartData = chartData?.chartData as StackedHistogramData

            const chartOptions: EChartUISpecificConfig = {
                title: {
                    text: chartData?.model?.Name,
                    show: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      // Use axis to trigger tooltip
                      type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                    }
                },
                legend: {},
                grid: {
                    containLabel: true
                }
            }

            const dataOptions: BaseChartsConfig = {
                xAxis: [{
                    type: 'category',
                    name: chartData?.model?.Name,
                    data: castedChartData.data.x_values
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: castedChartData.data.series.map(barConfig => {
                    return {
                        name: barConfig.name,
                        type: 'bar',
                        stack: 'total',
                        data: barConfig.data,
                        emphasis: {
                            focus: 'series'
                        },
                    }
                })
            }
            console.log(dataOptions)
            return {
                uiConfig: chartOptions,
                config: dataOptions,
                model: chartData?.model
            }
        }

        case ChartType.CLUBBED_HISTOGRAM: {
            const castedChartData = chartData?.chartData as StackedHistogramData

            const chartOptions: EChartUISpecificConfig = {
                title: {
                    text: chartData?.model?.Name,
                    show: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      // Use axis to trigger tooltip
                      type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                    }
                },
                legend: {},
                grid: {
                    containLabel: true
                }
            }

            const dataOptions: BaseChartsConfig = {
                xAxis: [{
                    type: 'category',
                    name: chartData?.model?.Name,
                    data: castedChartData.data.x_values
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: castedChartData.data.series.map(barConfig => {
                    return {
                        name: barConfig.name,
                        type: 'bar',
                        barGap: 0,
                        stack: undefined,
                        data: barConfig.data,
                        emphasis: {
                            focus: 'series'
                        },
                    }
                })
            }
            console.log(dataOptions)
            return {
                uiConfig: chartOptions,
                config: dataOptions,
                model: chartData?.model
            }
        }
    }
}

export const formChartOptionsHeatMap = (chartWithData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig, model: Chart} | undefined => {

    switch(chartWithData?.model?.Type) {
        case ChartType.HEAT_MAP_DATAFRAME: {
            const castedChartData = chartWithData?.chartData as HeatMapDataframeData

            const chartOptions: EChartUISpecificConfig = {
                tooltip: {
                    position: 'top'
                },
                visualMap: {
                    min: castedChartData.data.min_value,
                    max: castedChartData.data.max_value,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: '15%'
                },
                grid: {
                    height: '50%',
                    top: '10%'
                  },
            }

            const dataOptions: BaseChartsConfig = {
                xAxis: [{
                    type: 'category',
                    data: castedChartData.data.x_labels,
                    splitArea: {
                        show: true
                    }
                }],
                yAxis: [{
                    type: 'category',
                    data: castedChartData.data.y_values,
                    name: castedChartData.data.y_name,
                    splitArea: {
                        show: true
                    }
                }],
                series: [{
                    type: 'heatmap',
                    data: castedChartData.data.heat_map_data,
                    label: {
                        show: true
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            }

            return {
                uiConfig: chartOptions,
                config: dataOptions,
                model: chartWithData?.model
            }
        }
    }
}