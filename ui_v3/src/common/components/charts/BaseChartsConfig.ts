
export type DataAxis = (number|string)[];
type CategoryAxis = {
    data: DataAxis,
    type: 'category' //Category axis, suitable for discrete category data, if data is there, assume its of type category
};
type NonCategoryAxis = {
    type: 'value'//Numerical axis, suitable for continuous data.
    | 'time' //Time axis, suitable for continuous time series data.
    // Name list of all categories
    //['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    | 'log' // Log axis, suitable for log data.
}

type Series = {
    type: 'bar',
    data: DataAxis
}[];

export type BaseChartsConfig = {
    xAxis: (CategoryAxis|NonCategoryAxis)[],
    yAxis: (CategoryAxis|NonCategoryAxis)[],
    series: Series
}