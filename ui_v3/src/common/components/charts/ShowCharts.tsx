import {Card, Grid} from "@mui/material";
import React from "react";
import {lightShadows} from "../../../css/theme/shadows";
import LoadingIndicator from "../LoadingIndicator";
import NoData from "../NoData";
import ChartWithMetadata from "./ChartWithMetadata";
import {useShowCharts} from "./hooks/useShowCharts";
import {ShowChartsProps} from "./types/ShowChartsProps";


const ShowCharts = (props: ShowChartsProps) => {
    const {chartDataOptions, onChartTypeChange, onChartNameChange, onChartDashboardChange} = useShowCharts(props);
    if (chartDataOptions) {
        return (
            <Grid container spacing={1} sx={{padding: 2}}>
                {chartDataOptions?.map(chart => {
                    if (!!chart) {
                        return (
                            <Grid item xs={12} sx={{minHeight: '400px'}}>
                                <Card sx={{height: '100%', width: '100%', boxShadow: lightShadows[27]}}>
                                    <ChartWithMetadata onChartTypeChange={onChartTypeChange} chart={chart}
                                                       onChartNameChange={onChartNameChange}
                                                       onChartDashboardChange={onChartDashboardChange}/>
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

    return <LoadingIndicator/>


}

export default ShowCharts