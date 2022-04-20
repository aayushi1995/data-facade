
import ChartType from "../../enums/ChartType";
import ChartGroups from "../../enums/ChartGroups";


export const chartGroupToChartType = {
    [ChartGroups.SINGLE_DIMENSION_WITH_LABELS]: [ChartType.PIE],
    [ChartGroups.TWO_DIMENSION]: [ChartType.BAR, ChartType.LINE],
    [ChartGroups.TWO_DIMENSIONAL_SCATTER]: [ChartType.SCATTER],
    [ChartGroups.TWO_DIMENSION_WITH_SEGMENTS]: [ChartType.SEGMENT]
    
}

const getChartTypeOptions = (chartGroup: string): string[] => {
    return chartGroupToChartType[chartGroup] || []
}

export default getChartTypeOptions