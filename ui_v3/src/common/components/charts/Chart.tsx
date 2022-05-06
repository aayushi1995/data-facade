import {BaseChartsConfig} from "./BaseChartsConfig";
import React from 'react';
import ReactECharts from 'echarts-for-react';
import {EChartsOption} from "echarts";
import {EChartUISpecificConfig} from "./types/EChartUISpecificConfig";

export const Chart = ({config, uiConfig}: {
    config: BaseChartsConfig,
    uiConfig: EChartUISpecificConfig
}) =>{
    const eChartOptions: EChartsOption = {
        ...config,
        ...uiConfig
    };
    return <ReactECharts option={eChartOptions} style={{minHeight: '500px', minWidth: '500px'}}/>;
}