import { Grid, Card } from "@mui/material"
import React from "react"
import { lightShadows } from "../../../css/theme/shadows"
import { Chart as ChartModel, Dashboard } from "../../../generated/entities/Entities"
import NoData from "../NoData"
import ChartFromContext from "./ChartFromContext"
import { ChartQueriesContext, SaveAndBuildChartContext, SetSaveAndBuildChartContext } from "./SaveAndBuildChartsContext"


interface ShowChartsFromContextProps {
    onDeepDiveActionSelected?: (actionId: string) => void
}

const ShowChartsFromContext = (props: ShowChartsFromContextProps) => {
    const saveAndBuildChartsState = React.useContext(SaveAndBuildChartContext)
    const setAndBuildChartsState = React.useContext(SetSaveAndBuildChartContext)

    const onChartModelChange = (chartId: string, chartModel: ChartModel) => {
        setAndBuildChartsState({
            type: 'ChangeChartModel',
            payload: {
                chartId: chartId,
                chartModel: chartModel
            }
        })
    }

    const onAssignedDashboardsChange = (chartId: string, dashboards: Dashboard[]) => {
        setAndBuildChartsState({
            type: "ChangeAssignedDashboard",
            payload: {
                chartId: chartId,
                dashboards: dashboards
            }
        })
    }

    const getSxPropsForCard = () => {
        return {
            height: '100%', width: '100%',   background: "#EBF1FA", boxShadow: "0px 1.01276px 1.01276px rgba(0, 0, 0, 0.1), 0px 0px 1.01276px rgba(0, 0, 0, 0.25)", borderRadius: "8px"
        }
    }

    return (
        <Grid container spacing={2} sx={{px: 2}}>
            {saveAndBuildChartsState.Charts?.map(chart => {
                if (!!chart) {
                    return (
                        <Grid item xs={12} sx={{minHeight: '400px'}}>
                            <Card sx={{...getSxPropsForCard()}}>
                                <ChartFromContext chart={chart} onChartModelChange={onChartModelChange} onAssignedDashboardsChange={onAssignedDashboardsChange} onDeepDiveActionSelected={props.onDeepDiveActionSelected}/>
                            </Card>
                        </Grid>
                    )
                } else {
                    return <NoData/>
                }
            })}
        </Grid>
    )
}

export default ShowChartsFromContext