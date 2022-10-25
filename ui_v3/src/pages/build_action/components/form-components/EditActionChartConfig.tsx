import { Card, Grid, Box, IconButton, Typography, Divider, Button } from "@mui/material"
import React from "react"
import AddChartIcon from "../../../../images/add_chart.svg"
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext"
import ChartOptionConfigurator from "./ChartOptionConfigurator"

const EditActionChartConfig = () => {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const [selectedChart, setSelectedChart] = React.useState<number | undefined>()

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
                <Grid item xs={1} sx={{minHeight: '100%'}}>
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
                <Grid item xs={4} sx={{p: 1}}>
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
                <Divider orientation="vertical" flexItem sx={{ mr: "-1px" }} />
                <Grid item xs={7}>
                    
                </Grid>
            </Grid>

        </Card>
    )
}

export default EditActionChartConfig