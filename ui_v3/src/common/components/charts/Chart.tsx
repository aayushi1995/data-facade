import {BaseChartsConfig} from "./BaseChartsConfig";
import React from 'react';
import ReactECharts from 'echarts-for-react';
import {EChartsOption} from "echarts";

export type EChartUISpecificConfig = Omit<EChartsOption, 'xAxis'|'yAxis'|'series'>;
export const Chart = ({config, uiConfig}: {
    config: BaseChartsConfig,
    uiConfig: EChartUISpecificConfig
}) =>{
    const eChartOptions: EChartsOption = {
        ...config,
        ...uiConfig
    };
    return <ReactECharts option={eChartOptions} style={{height: '100%', width: '100%'}}/>;
}