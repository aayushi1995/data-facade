import { EChartsOption } from "echarts";
import ReactECharts from 'echarts-for-react';
import React from 'react';
import { BaseChartsConfig } from "./BaseChartsConfig";
import { EChartUISpecificConfig } from "./types/EChartUISpecificConfig";

export const Chart = ({config, uiConfig}: {
    config: BaseChartsConfig,
    uiConfig: EChartUISpecificConfig
}) =>{
    const eChartOptions: EChartsOption = {
        ...config,
        ...uiConfig
    };
    
    return <ReactECharts style={{minHeight: '500px', minWidth: '500px'}} option={eChartOptions}/>;
}