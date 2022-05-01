
export type DataAxis = (number|string)[];
type CategoryAxis = {
    data?: DataAxis,
    type?: 'category' ,
    name?: string//Category axis, suitable for discrete category data, if data is there, assume its of type category
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
}[];


type SeriesScatter = {
    type: 'scatter' 
    data: number[][],
    symbolSize: number
}[];

type SeriesLine = {
    type: 'line' 
    data: DataAxis,
    lineStyle?: {
        color?: string,
        type?: "dashed"
    }
    smooth?: boolean
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


export type BaseChartsConfig = {
    xAxis?: (CategoryAxis|NonCategoryAxis)[],
    yAxis?: (CategoryAxis|NonCategoryAxis)[],
    series: SeriesLine | SeriesScatter | SeriesPie | SeriesBar 
}