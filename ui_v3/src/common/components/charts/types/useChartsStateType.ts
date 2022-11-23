import {BaseChartsConfig} from "../BaseChartsConfig";
import {EChartUISpecificConfig} from "./EChartUISpecificConfig";
import {Chart as ChartModel} from "../../../../generated/entities/Entities";

export type UseChartsStateType = ({ config: BaseChartsConfig, uiConfig: EChartUISpecificConfig, model: ChartModel } | undefined)[];