import { Grid, Card } from "@mui/material"
import React from "react"
import { lightShadows } from "../../../css/theme/shadows"
import { Chart as ChartModel } from "../../../generated/entities/Entities"
import NoData from "../NoData"
import ChartFromContext from "./ChartFromContext"
import { ChartQueriesContext, ChartWithDataAndOptions, SaveAndBuildChartContext, SetSaveAndBuildChartContext } from "./SaveAndBuildChartsContext"



const ShowChartsFromContext = () => {
    const saveAndBuildChartsState = React.useContext(SaveAndBuildChartContext)
    const setAndBuildChartsState = React.useContext(SetSaveAndBuildChartContext)
    const chartQueriesState = React.useContext(ChartQueriesContext)

    const onChartModelChange = (chartId: string, chartModel: ChartModel) => {
        setAndBuildChartsState({
            type: 'ChangeChartModel',
            payload: {
                chartId: chartId,
                chartModel: chartModel
            }
        })
    }

    return (
        <Grid container spacing={1} sx={{padding: 2}}>
            {saveAndBuildChartsState.Charts?.map(chart => {
                if (!!chart) {
                    return (
                        <Grid item xs={12} sx={{minHeight: '400px'}}>
                            <Card sx={{height: '100%', width: '100%', boxShadow: lightShadows[27]}}>
                                <ChartFromContext chart={chart} onChartModelChange={onChartModelChange}/>
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