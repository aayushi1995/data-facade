
export type DataAxis = (number|string)[];
type CategoryAxis = {
    data?: DataAxis,
    type?: 'category' ,
    name?: string, //Category axis, suitable for discrete category data, if data is there, assume its of type category
    splitArea?: {}
};
type NonCategoryAxis = {
    type: 'value'//Numerical axis, suitable for continuous data.
    | 'time' //Time axis, suitable for continuous time series data.
    // Name list of all categories
    //['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    | 'log', // Log axis, suitable for log data.
    name?: string
}

type SeriesBar = {
    type: 'bar' 
    data: DataAxis,
    stack?: string
}[];


type SeriesScatter = {
    type: 'scatter' 
    data: number[][],
    symbolSize: number
}[];

export type SeriesLine = {
    type: 'line' 
    data: DataAxis,
    lineStyle?: {
        type?: string
    }
    smooth?: boolean,
    name?: string,
    showSymbol?: boolean,
    tooltip?: {
        show?: boolean
    }
}[];

type SeriesPie = {
    type: 'pie',
    data: {value: number, name: string}[],
    name?: string,
    radius?: string[],
    avoidLabelOverlap?: boolean,
    itemStyle?: object,
    label?: object,
    emphasis?: object,
    labelLine?: object

}

type SeriesGaugeSingleValue = {
    type: 'gauge',
    min?: number,
    max?: number,
    axisLine: {

    },
    pointer: {

    },
    axisTick: {},
    axisLabel: {},
    splitLine: {},
    title: {},
    detail: {},
    data: {}[]
}[]

type SeriesHeatMap = {
    type: 'heatmap',
    data: ((number|string)[])[],
    label?: {},
    emphasis?: {}
}[]

type SeriesRadar = {
    type: 'radar',
    data: {
        name: string,
        value: (string|number)[]
    }[]
}[]


export type BaseChartsConfig = {
    xAxis?: (CategoryAxis|NonCategoryAxis)[],
    yAxis?: (CategoryAxis|NonCategoryAxis)[],
    series: SeriesLine | SeriesScatter | SeriesPie | SeriesBar | SeriesGaugeSingleValue | SeriesHeatMap | SeriesScatter[] | SeriesRadar
}