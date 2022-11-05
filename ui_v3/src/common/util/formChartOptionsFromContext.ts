
import ChartGroups from "../../enums/ChartGroups";
import ChartType from "../../enums/ChartType";
import { Chart } from "../../generated/entities/Entities";
import { ChartWithData } from "../../generated/interfaces/Interfaces";
import { BaseChartsConfig, SeriesLine } from "../components/charts/BaseChartsConfig";
import { ChartModelConfig } from "../components/charts/SaveAndBuildChartsContext";
import { EChartUISpecificConfig } from "../components/charts/types/EChartUISpecificConfig";


export interface PieChartOptions {
    data: {
        result: {name: string, value: number}[],
        name: string
    }
}

export interface LineChartOptions {
    data: {
        x: (number|string)[],
        y: (number|string)[],
        x_name: string,
        y_name: string
    }
}

export interface ScatterChartOptions {
    data: {
        result: number[][],
        x_name: string,
        y_name: string
    }
}

export interface TwoDSegmentChartOptions {
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

export interface TimeSeriesChartData {
    data: {
        x: (number|string)[],
        series: {
            name: string,
            data: (number|string)[]
        }[],
        forecasted_rows: number
    }
}

export interface GaugeSingelValueData {
    data: {
        value: number,
        minimum: number,
        maximum: number,
        threshold_1: number,
        threshold_2: number
    }
}

export interface StackedHistogramData {
    data: {
        x_name: string,
        x_values: (string | number)[],
        series: {
            name: string,
            data: (string|number)[]
        }[]
    }
}

export interface HeatMapDataframeData {
    data: {
        y_values: (string | number)[],
        y_name: string,
        heat_map_data: ((string|number)[])[],
        x_labels: string[],
        min_value: number,
        max_value: number
    }
}

export interface MultipleSegmentsScatterChartData {
    data: {
        series: {
            y_name: string,
            result: number[][]
        }[],
        x_name: string
    }
}

export interface RadarChartData {
    data: {
        result: {
            name: string,
            value: (string|number)[]
        }[],
        indicators: string[]
    }
}

export interface SankeyChartData {
    data: {
        nodes: string[],
        links: {
            target: string,
            source: string,
            value: number
        }[]
    }
}

export const formChartOptionsSingleDimensionWithLables = (chartData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig}=> {
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
                config: chartDataOptions
            }
        default: {
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
                config: chartDataOptions
            }
        }
    }
}

export const formChartOptionsTwoDimenstion = (chartData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig} => {

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

            return {uiConfig: chartOptions, config: dataOptions}
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

            return {uiConfig: chartOptions, config: dataOptions}
        }


        default: {
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

            return {uiConfig: chartOptions, config: dataOptions}
        }
    }
}

export const formChartOptionsTwoDimenstionScatter = (chartData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig} => {
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
            }
        }
        default: {
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
            
            
            return {
                uiConfig: chartOptions,
                config: dataOptions,
            }
        }

    }
}

export const formChartOptionsTwoDimensionWithSegments = (chartData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig} => {
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
                }),
            }
            return {
                uiConfig: chartOptions,
                config: dataOptions,
            }
        }
        default: {
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
            }
        }
    }
}

export const formChartOptionsTimeSeries = (chartData: ChartWithData) : {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig} => {
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
            } 
        }

        default: {
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
            } 
        }
    }
}

export const formChartOptionsSingleValue = (chartData: ChartWithData) : {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig} => {
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
            } 
        }

        default: {
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
            }
        }
    }
}

export const formChartOptionsStackedHistogram = (chartData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig} => {
    const config = getChartConfig(chartData?.model || {})
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
                        label: {
                            show: config?.uiConfig?.showLables || false
                        },
                        emphasis: {
                            focus: 'series'
                        },
                    }
                })
            }
            console.log(dataOptions)
            return {
                uiConfig: chartOptions,
                config: dataOptions
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
                        label: {
                            show: config?.uiConfig?.showLables || false
                        },
                        emphasis: {
                            focus: 'series'
                        },
                    }
                })
            }
            console.log(dataOptions)
            return {
                uiConfig: chartOptions,
                config: dataOptions
            }
        }

        default: {
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
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                    }
                })
            }
            console.log(dataOptions)
            return {
                uiConfig: chartOptions,
                config: dataOptions
            }
        }
    }
}

export const formChartOptionsHeatMap = (chartWithData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig} => {

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
                title: {
                    text: chartWithData?.model?.Name
                }
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
            }
        }

        default: {
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
            }
        }
    }
}

export const formChartOptionsMultipleSeriesScatter = (chartWithData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig} => {
    switch(chartWithData?.model?.Type) {
        case ChartType.MULTIPLE_SERIES_SCATTER: {
            const chartOptions: EChartUISpecificConfig = {
                tooltip: {
                    trigger: 'axis',
                    showContent: true
                },
                title: {
                    show: true,
                    text: chartWithData.model?.Name
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                dataZoom:{
                    
                },
                legend: {

                }
            }
            const chartDataCasted = chartWithData.chartData as MultipleSegmentsScatterChartData
            const dataOptions: BaseChartsConfig = {
                series: chartDataCasted.data.series.map(series => ({
                    type: 'scatter',
                    symbolSize: 8,
                    data: series.result,
                    name: series.y_name
                })),
                xAxis: [{
                    name: chartDataCasted.data.x_name
                }],
                yAxis: [{
                    name: ''
                }]
            }
            console.log(dataOptions)
            
            return {
                uiConfig: chartOptions,
                config: dataOptions,
            }
        }
        default: {
            const chartOptions: EChartUISpecificConfig = {
                tooltip: {
                    trigger: 'axis',
                    showContent: true
                },
                title: {
                    show: true,
                    text: chartWithData.model?.Name
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                dataZoom:{
                    
                },
                legend: {

                }
            }
            const chartDataCasted = chartWithData.chartData as MultipleSegmentsScatterChartData
            const dataOptions: BaseChartsConfig = {
                series: chartDataCasted.data.series.map(series => ({
                    type: 'scatter',
                    symbolSize: 5,
                    data: series.result,
                    name: series.y_name
                }))
            }
            console.log(dataOptions)
            
            return {
                uiConfig: chartOptions,
                config: dataOptions,
            }
        }
    }
}

export const formChartOptionsRadarChart = (chartWithData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig} => {
    switch(chartWithData?.model?.Type) {
        case ChartType.RADAR_CHART: {
            const castedChartData: RadarChartData = chartWithData.chartData as RadarChartData
            const chartOptions: EChartUISpecificConfig = {
                title: {
                    text: chartWithData?.model?.Name
                  },
                  legend: {
                  },
                  tooltip: {
                    trigger: 'item'
                  },
                  radar: {
                    indicator: castedChartData.data.indicators.map(indicator => ({
                        name: indicator
                    }))
                  }
            }
            const dataOptions: BaseChartsConfig = {
                series: [{
                    type: 'radar',
                    data: castedChartData.data.result
                }]
            }

            return {
                uiConfig: chartOptions,
                config: dataOptions,   
            }
        }
        default: {
            const castedChartData: RadarChartData = chartWithData.chartData as RadarChartData
            const chartOptions: EChartUISpecificConfig = {
                title: {
                    text: chartWithData?.model?.Name
                  },
                  legend: {
                  },
                  tooltip: {
                    trigger: 'item'
                  },
                  radar: {
                    indicator: castedChartData.data.indicators.map(indicator => ({
                        name: indicator
                    }))
                  }
            }
            const dataOptions: BaseChartsConfig = {
                series: [{
                    type: 'radar',
                    data: castedChartData.data.result
                }]
            }

            return {
                uiConfig: chartOptions,
                config: dataOptions,   
            }
        }
    }
}

export const formChartOptionsSankey = (chartWithData: ChartWithData): {uiConfig: EChartUISpecificConfig, config: BaseChartsConfig} => {
    const castedChartData = chartWithData.chartData as SankeyChartData

    const chartOptions: EChartUISpecificConfig = {
        title: {
            text: chartWithData?.model?.Name
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
    }

    const dataOptions: BaseChartsConfig = {
        series: [{
            type: 'sankey',
            data: castedChartData.data.nodes.map(node => ({
                name: node
            })),
            links: castedChartData.data.links,
            emphasis: {
                focus: 'adjacency'
            },
            lineStyle: {
                color: 'gradient',
                curveness: 0.5
            }
        }]
    }
    console.log(dataOptions)
    return {
        uiConfig: chartOptions,
        config: dataOptions
    }
}

const getChartConfig = (chart: Chart) => {
    return JSON.parse(chart?.Config || "{}") as ChartModelConfig
}

const formChartOptions = (chartWithData: ChartWithData) => {
    switch (chartWithData?.model?.ChartGroup) {
        case ChartGroups.SINGLE_DIMENSION_WITH_LABELS:
            return formChartOptionsSingleDimensionWithLables(chartWithData)

        case ChartGroups.TWO_DIMENSION:
            return formChartOptionsTwoDimenstion(chartWithData)

        case ChartGroups.TWO_DIMENSIONAL_SCATTER:
            return formChartOptionsTwoDimenstionScatter(chartWithData)

        case ChartGroups.TWO_DIMENSION_WITH_SEGMENTS:
            return formChartOptionsTwoDimensionWithSegments(chartWithData)

        case ChartGroups.TIME_SERIES:
            return formChartOptionsTimeSeries(chartWithData)
        
        case ChartGroups.SINGLE_VALUE:
            return formChartOptionsSingleValue(chartWithData)
        
        case ChartGroups.STACKED_HISTOGRAM:
            return formChartOptionsStackedHistogram(chartWithData)
        
        case ChartGroups.HEAT_MAP:
            return formChartOptionsHeatMap(chartWithData)
        
        case ChartGroups.MULTIPLE_SERIES_SCATTER:
            return formChartOptionsMultipleSeriesScatter(chartWithData)
        
        case ChartGroups.RADAR_CHART:
            return formChartOptionsRadarChart(chartWithData)
        
        case ChartGroups.SANKEY_CHART:
            return formChartOptionsSankey(chartWithData)

        default: {
            // TODO: defaulting to single value
            return formChartOptionsSingleValue(chartWithData)
        }
    }

}

export default formChartOptions