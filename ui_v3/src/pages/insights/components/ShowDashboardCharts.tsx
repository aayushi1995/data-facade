import {Card, Grid, TextField} from "@mui/material";
import React from "react";
import {lightShadows} from "../../../css/theme/shadows";
import { WidthProvider, Responsive } from "react-grid-layout";
import { useShowCharts } from "../../../common/components/charts/hooks/useShowCharts";
import ChartWithMetadata from "../../../common/components/charts/ChartWithMetadata";
import LoadingIndicator from "../../../common/components/LoadingIndicator";
import { ShowChartsProps } from "../../../common/components/charts/types/ShowChartsProps";
import '../presentation/react-grid.css'
import { DashboardTextBoxConfig } from "../SingleDashboardView";


const ResponsiveReactGridLayout = WidthProvider(Responsive);

const ShowDashboardCharts = (props: ShowChartsProps & {textBoxes?: DashboardTextBoxConfig[], onTextBoxValueChange?: (id: string, prop: string, value: string) => void}) => {
    const {chartDataOptions, onChartTypeChange, onChartNameChange, onChartDashboardChange, updateLayout, getUILayout, onTextBoxValueChange} = useShowCharts(props);

    if (chartDataOptions) {
        return (
            <ResponsiveReactGridLayout 
                rowHeight={2}
                useCSSTransforms={true}
                breakpoints={{ lg: 1200, md: 996, sm: 768 }}
                cols={{ lg: 14, md: 10, sm: 6 }}
                onDragStop={updateLayout}
                onResizeStop={updateLayout}
            >
                {chartDataOptions?.map((chart, index) => {
                    if(!!chart) {
                        console.log(getUILayout(chart.model, index))
                        return <div key={chart.model.Id} data-grid={{...getUILayout(chart.model, index), i: chart.model.Id}}>
                            <Card sx={{height: '100%', width: '100%', boxShadow: lightShadows[27]}}>
                                <ChartWithMetadata onChartTypeChange={onChartTypeChange} chart={chart}
                                                onChartNameChange={onChartNameChange}
                                                onChartDashboardChange={onChartDashboardChange}/>
                            </Card>
                        </div>
                    }
                })}
                {props.textBoxes?.map(textBox => {
                    console.log(textBox.layout)
                    return <div key={textBox.id} data-grid={JSON.parse(textBox.layout)}>
                        <Card sx={{borderRadius: '0px', height: '100%', width: '100%', display: 'flex', alignItems: 'center'}}> 
                            <TextField
                            fullWidth
                            
                            variant="outlined" 
                            InputProps={{
                                sx: {
                                    fontFamily: "SF Pro Display",
                                    fontStyle: "normal",
                                    borderColor: "transparent",
                                    height: '80%',
                                    borderRadius: '0px',
                                    fontWeight: 600
                                }
                            }}
                            onChange={(e) => onTextBoxValueChange(e.target.value, textBox.id)}
                            value={textBox.text}
                            />

                        </Card>
                    </div>
                                
                })}
            </ResponsiveReactGridLayout>
        )
    }

    return <LoadingIndicator/>


}

export default ShowDashboardCharts