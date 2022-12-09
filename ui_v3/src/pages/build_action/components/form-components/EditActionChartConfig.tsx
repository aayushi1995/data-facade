import { Card, Grid, Box, IconButton, Typography, Divider, Button } from "@mui/material"
import React from "react"
import AddChartIcon from "../../../../images/add_chart.svg"
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext"
import ChartOptionConfigurator from "./ChartOptionConfigurator"
import LineChart from "./ChartsOption/LineCharts"
import BarChart from "./ChartsOption/BarCharts"
import PieChart from "./ChartsOption/pieChart"
import ScatterChart from "./ChartsOption/ScatterCharts"
import GaugeChart from "./ChartsOption/GaugeCharts"
import HeatMapChart from "./ChartsOption/HeatMapCharts"
import SankeyChart from "./ChartsOption/SankeyCharts"
import RadarChart from "./ChartsOption/RadarChart"
import RadialPolarChart from "./ChartsOption/RadialPolarCharts"
import CalChart from "./ChartsOption/CalenderHeatMap"
import MultScatter from "./ChartsOption/MultScattersChart"
import StackedChart from "./ChartsOption/StackedChart"
import Single from "./ChartsOption/SingleValGauge"
import ClubbedHis from "./ChartsOption/ClubbedHis"
import Segment from "./ChartsOption/SegmentCharts"


// import ReactEcharts from "echarts-for-react"; 


const EditActionChartConfig = () => {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const [selectedChart, setSelectedChart] = React.useState<number>(0)

    const selectedMyChart = selectedChart !== undefined ? buildActionContext?.charts?.[selectedChart] : undefined


    const onChartCellClick = (index: number) => {
        setSelectedChart(index)
    }

    const handleAddChart = () => {
        setBuildActionContext({
            type: 'AddChartToConfig'
        })
    }

    return (
        <Card sx={{
            m: 1,
            minHeight: '100%', 
            width: '98%',
            borderRadius: '0px'}}
        >
            <Grid container sx={{minHeight: '100%', minWidth: '100%'}}>
                <Grid item xs={ 'auto' } sx={{minHeight: 'auto'}}>
                    <Box sx={{minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Typography sx={{
                            fontFamily: "'SF Pro Display'",
                            fontStyle: "normal",
                            fontWeight: 600,
                            lineHeight: "160%",
                            mt: 1
                        }}>
                            Options
                        </Typography>
                        <Divider orientation="horizontal" sx={{minWidth: '100%'}}/>
                        {buildActionContext.charts?.map?.((chartConfig, index) => {
                            return (
                                <Box sx={{display: 'flex', flexDirection: 'column', minWidth: '100%', minHeight: '100%'}}>
                                    <Button sx={{
                                        borderRadius: '0px',
                                        minWidth: '100%',
                                        minHeight: '50px',
                                        background: index === selectedChart ? '#c4c3d0' : 'white'
                                    }} onClick={() => onChartCellClick(index)}>
                                        <Typography sx={{
                                            fontFamily: "'SF Pro Display'",
                                            fontStyle: "normal",
                                            fontWeight: 300,
                                            lineHeight: "160%",
                                            letterSpacing: "0.103678px",
                                            color: "#253858",
                                            textTransform: 'uppercase',
                                            textOverflow: 'clip',
                                            minWidth: '100%',
                                            fontSize: '0.6vw'
                                        }}>
                                            {chartConfig.kind || "NA"}
                                        </Typography>
                                    </Button>
                                    <Divider orientation="horizontal" sx={{minWidth: '100%'}}/>
                                </Box>
                            )
                        })}
                        <IconButton sx={{my: 2}} onClick={handleAddChart}>
                            <img src={AddChartIcon} alt="Add Chart"/>
                        </IconButton>
                    </Box>
                </Grid>
                <Divider orientation="vertical" flexItem sx={{ mr: "-1px" }} />
                <Grid container xs={11}>
                <Grid item xs={buildActionContext.testMode?12:5} sx={{p: 1}}>
                    <Card sx={{minHeight: '100%', minWidth: '100%',   
                        boxShadow: "0px 0px 0px 0.691186px rgba(0, 0, 0, 0.05)",
                        filter: "drop-shadow(0px 0.691186px 1.38237px rgba(0, 0, 0, 0.12))",
                        borderRadius: "11.059px",
                        background: '#EDF0F4'
                    }}
                    >
                        <ChartOptionConfigurator selectedChartIndex={selectedChart} />
                    </Card>
                </Grid>
                
                <Grid item xs={buildActionContext.testMode?12:7}>
                    {buildActionContext.charts?.map?.((chartConfig, index) => {
                        if(selectedChart===index){
                            switch(chartConfig.kind){
                                case 'line':
                                    return(<LineChart yTitle={selectedMyChart?.options?.y || "Y Axis Name"} xTitle={selectedMyChart?.options?.x || "X Axis Name"} titleName={selectedMyChart?.name || "Its a New chart"}/>);
                                case 'bar':
                                    return(<BarChart yTitle={selectedMyChart?.options?.y || "Y Axis Name"} xTitle={selectedMyChart?.options?.x || "X Axis Name"} titleName={selectedMyChart?.name || "Its a New chart"}/>);    
                                case 'pie':
                                    return(<PieChart vaLueColumn="valueColumn" legendColumn="legendColumn" titleName={selectedMyChart?.name || "Its a New chart"}/>);    
                                case 'scatter':
                                    return(<ScatterChart yTitle={selectedMyChart?.options?.y || "Y Axis Name"} xTitle={selectedMyChart?.options?.x || "X Axis Name"} titleName={selectedMyChart?.name || "Its a New chart"}/>);
                                case 'single_value_gauge':
                                    return(<GaugeChart titleName={selectedMyChart?.name || "Its a New chart"}/>);        
                                case 'heat_map_dataframe':
                                    return(<HeatMapChart yTitle={selectedMyChart?.options?.y || "Y Axis Name"} xTitle={selectedMyChart?.options?.x || "X Axis Name"} titleName={selectedMyChart?.name || "Its a New chart"}/>);   
                                case 'sankey_chart':
                                    return(<SankeyChart titleName={selectedMyChart?.name || "Its a New chart"}/>);
                                case 'radar_chart':
                                    return(<RadarChart dimensionColumn="valueColumn" axisColumn="legendColumn" titleName={selectedMyChart?.name || "Its a New chart"}/>); 
                                case 'radial_polar_chart':
                                    return(<RadialPolarChart segmentCol="Segment column" yTitle={selectedMyChart?.options?.y || "Y Axis Name"} xTitle={selectedMyChart?.options?.x || "X Axis Name"} titleName={selectedMyChart?.name || "Its a New chart"}/>); 
                                case 'time_series':
                                    return(<CalChart titleName={selectedMyChart?.name || "Its a New chart"}/>);           
                                case 'multiple_series_scatter':
                                    return(<MultScatter yTitle={selectedMyChart?.options?.y || "Y"} xTitle={selectedMyChart?.options?.x || "X"} titleName={selectedMyChart?.name || "Its a New chart"} />);  
                                case 'stacked_histogram':
                                    return(<StackedChart yTitle={selectedMyChart?.options?.y || "Y axis"} xTitle={selectedMyChart?.options?.x || "X axis"} titleName={selectedMyChart?.name || "Its a New chart"} />)   
                                case 'single_value':
                                    return(<Single titleName={selectedMyChart?.name || "Its a New chart"}/>)       
                                case 'clubbed_histogram':
                                    return(<ClubbedHis yTitle={selectedMyChart?.options?.y || "Y Axis Name"} xTitle={selectedMyChart?.options?.x || "X Axis Name"} titleName={selectedMyChart?.name || "Its a New chart"}/>) 
                                case 'segment':
                                    return(<Segment segmentCol="Segment column" yTitle={selectedMyChart?.options?.y || "Y Axis Name"} xTitle={selectedMyChart?.options?.x || "X Axis Name"} titleName={selectedMyChart?.name || "Its a New chart"}/>);               
                            }
                            


                            
                        }
                    })}
                </Grid>
                </Grid>
            </Grid>

        </Card>
    )
}

export default EditActionChartConfig