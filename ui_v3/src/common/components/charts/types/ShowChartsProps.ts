import {ChartWithData} from "../../../../generated/interfaces/Interfaces";

export interface ShowChartsProps {
    chartWithData: ChartWithData[],
    onChartChange?: (chartWithData: ChartWithData[]) => void 
}