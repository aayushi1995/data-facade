


type BaseChartOptions = {
    name: string,
    expose_data: boolean
}

export type ChartKindsType = 'bar' | 'scatter' | 'pie' | 'line' | 'segment' | 'time_series' | 'radial_polar_chart' | 'stacked_histogram' | 'clubbed_histogram'

export type BarChartOptionType = BaseChartOptions & {
    kind: 'bar',
    options?: {
        x?: string,
        y?: string
    }
}

export type ScatterChartOptionType = BaseChartOptions & {
    kind: 'scatter',
    options?: {
        x?: string,
        y?: string
    }
}

export type PieChartOptionType = BaseChartOptions & {
    kind: 'pie',
    options?: {
        y?: string,
        legends?: string
    }
}

export type LineChartOptionType = BaseChartOptions & {
    kind: 'line',
    options?: {
        x?: string,
        y?: string
    }
}

export type SegmentLineChartOptionsType = BaseChartOptions & {
    kind: 'segment',
    options?: {
        x?: string,
        y?: string,
        segments?: string
    }
}

export type TimeSeriesForecastOptionsType = BaseChartOptions & {
    kind: 'time_series'
    options?: {
        forecasted_rows?: number
    }
}

export type RadialPolarChartOptionsType = BaseChartOptions & {
    kind: 'radial_polar_chart',
    options?: {
        x?: string,
        y?: string,
        segments?: string
    }
}

export type StackedHistogramOptionsType = BaseChartOptions & {
    kind: 'stacked_histogram',
    options?: {
        x?: string,
        y_columns?: string[]
    }
}

export type ClubbedHistogramOptionsType = BaseChartOptions & {
    kind: 'clubbed_histogram',
    options?: {
        x?: string,
        y_columns?: string[]
    }
}

export type HeatMapDataframeOptionsType = BaseChartOptions & {
    kind: 'heat_map_dataframe',
    options?: {
        x_columns?: string[],
        y?: string
    }
}

export type MultipleSeriesScatterOptionsType = BaseChartOptions & {
    kind: 'multiple_series_scatter',
    options?: {
        x?: string,
        y_columns?: string[]
    }
}

export type RadarChartOptionsType = BaseChartOptions & {
    kind: 'radar_chart',
    options?: {
        dimension_column?: string,
        axis_columns?: string[] 
    }
}

type ChartOptionType = BarChartOptionType 
| ScatterChartOptionType 
| PieChartOptionType 
| LineChartOptionType 
| SegmentLineChartOptionsType 
| TimeSeriesForecastOptionsType 
| RadialPolarChartOptionsType 
| StackedHistogramOptionsType
| ClubbedHistogramOptionsType
| HeatMapDataframeOptionsType
| MultipleSeriesScatterOptionsType
| RadarChartOptionsType


export default ChartOptionType