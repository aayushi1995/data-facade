import {EChartsOption} from "echarts";

export type EChartUISpecificConfig = Omit<EChartsOption, 'xAxis' | 'yAxis' | 'series'>;