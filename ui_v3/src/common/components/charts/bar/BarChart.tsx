import React from 'react';
import {Chart, EChartUISpecificConfig} from '../Chart';
import {BaseChartsConfig, DataAxis} from "../BaseChartsConfig";

export const BarChart = ({
                             dataX,
                             dataY
                         }:{
    dataX: DataAxis,
    dataY: DataAxis
}) => {
    const baseConfig: BaseChartsConfig = {
        xAxis: [{
            type: 'category',
            data: dataX,
        }],
        yAxis: [{
            type: 'value',
        }],
        series: [
            {
                data: dataY,
                type: 'bar'
            },
        ]
    };
    const uiConfig: EChartUISpecificConfig= {
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            top: 8, right: 8, bottom: 24, left: 36
        },
    };
    return <Chart
        config={baseConfig}
        uiConfig={uiConfig}
    />;
};