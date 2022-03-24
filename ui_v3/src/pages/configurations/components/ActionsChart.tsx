import React from 'react';
import ReactECharts from 'echarts-for-react';
import type {EChartsOption} from "echarts";

export const ActionsChart = ({
                                 dataX,
                                 dataY = [820, 932, 901, 934, 1290, 1330, 1320]
                             }) => {
    const options: EChartsOption = {
        grid: {top: 8, right: 8, bottom: 24, left: 36},
        xAxis: {
            type: 'category',
            data: dataX,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: dataY,
                type: 'bar',
                smooth: true,
            },
        ],
        tooltip: {
            trigger: 'axis',
        },
    };
    return <ReactECharts option={options}/>;
};