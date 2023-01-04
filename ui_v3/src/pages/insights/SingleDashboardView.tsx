import { Box, Button } from "@mui/material"
import React from "react"
import { Layout } from "react-grid-layout"
import { RouteComponentProps } from "react-router"
import useUpdateChart from "../../common/components/charts/hooks/useUpdateChart"
import ShowCharts from "../../common/components/charts/ShowCharts"
import LoadingIndicator from "../../common/components/LoadingIndicator"
import LoadingWrapper from "../../common/components/LoadingWrapper"
import { TabPanel } from "../../common/components/workflow/create/SelectAction/SelectAction"
import { useGetExecutionCharts } from "../../common/hooks/useGetExecutionCharts"
import { ChartWithData, DashboardChartWithData, DashboardDetails } from "../../generated/interfaces/Interfaces"
import DashboardHero from "./components/DashboardHero"
import ShowDashboardCharts from "./components/ShowDashboardCharts"
import useGetDashboardDetails from "./hooks/useGetDashboardDetails"
import {v4 as uuidv4} from "uuid"
import useSaveDashboard from "./hooks/useSaveDashboard"
import useGetDashboardChart from "./hooks/useGetDashboardChart"
import { ReactQueryWrapper } from "../../common/components/ReactQueryWrapper"

export interface DashboardTextBoxConfig {
    layout: string,
    text: string,
    id: string
}

export interface ChartsConfig {
    layout?: string,
    Id: string
}
export interface DashboardConfig {
    textBoxes?: DashboardTextBoxConfig[],
    charts?: ChartsConfig[]
}

const SingleDashboardView = ({match}: RouteComponentProps<{dashboardId: string}>) => {
    const dashboardId = match.params.dashboardId
    const [chartFetched, setChartFetched] = React.useState(false)
    const [chartWithData, setChartWithData] = React.useState<DashboardChartWithData[] | undefined>()
    const [dashboardDetails, setDashboardDetails] = React.useState<DashboardDetails | undefined>()
    const updateDashboard = useSaveDashboard()

    const [dashboardData, isDashboardLoading, dashboardError, refetch] = useGetDashboardDetails({filter: {Id: dashboardId}, enabled: false})

    const handleChartFetched = () => {
        setChartFetched(true)
    }

    const fetchDashboardChartQuery = useGetDashboardChart({filter: {Id: dashboardId}, queryParams: {enabled: dashboardData !== undefined && !chartFetched, onSuccess: handleChartFetched}})

    React.useEffect(() => {
        refetch()
    }, [dashboardId]) 

    const updateChart = useUpdateChart()

    React.useEffect(() => {
        if(!!fetchDashboardChartQuery.data) {
            setChartWithData(fetchDashboardChartQuery.data)
        }
    }, [fetchDashboardChartQuery.data])

    React.useEffect(() => {
        if(!!dashboardData && dashboardData.length) {
            setDashboardDetails(dashboardData?.[0])
        }
    }, [dashboardData])

    const onChartChange = (chartData: DashboardChartWithData[]) => {
        setChartWithData(chartData)
    }

    const handleSaveDashboard = () => {
        chartWithData?.forEach(chart => {
            updateChart.mutate({
                filter: {
                    Id: chart?.chartWithData?.model?.Id || "NA"
                }, 
                newProperties: {
                    Name: chart?.chartWithData?.model?.Name,
                    Type: chart?.chartWithData?.model?.Type,
                    DashboardId: chart?.chartWithData?.model?.DashboardId
                }
            })
        })
        const finalConfig = JSON.stringify({
            ...JSON.parse(dashboardDetails?.model?.Config || "{}") as DashboardConfig,
            charts: chartWithData?.map(chart => ({Id: chart.chartWithData?.model?.Id, layout: chart.layout}))
        })

        updateDashboard.mutate({
            filter: {Id: dashboardDetails?.model?.Id},
            newProperties: {...dashboardDetails?.model, Config: finalConfig} || {}
        })
    }

    const getTextBoxes = () => {
        return (JSON.parse(dashboardDetails?.model?.Config || "{}") as DashboardConfig).textBoxes
    }

    const handleAddTextBox = () => {
        const id = uuidv4()
        const items = chartWithData?.length || 0 + (getTextBoxes()?.length || 0)
        const newTextBox: DashboardTextBoxConfig = {
            text: "",
            id: id,
            layout: JSON.stringify({
                i: id,
                x: items % 2 === 0 ? 0 : 7,
                y: (items/2)*40,
                h: 10,
                w: 10
            })
        }
        const finalTextBoxes = [...getTextBoxes() || [], newTextBox]
        assignNewConfigTextBoxes(finalTextBoxes)
    }

    const onTextBoxValueChange = (id: string, prop: string, value: string) => {
        const newTextBoxes = getTextBoxes()?.map(textBox => textBox.id === id ? {
            ...textBox,
            [prop]: value
        } : textBox)
        assignNewConfigTextBoxes(newTextBoxes)
    }

    const assignNewConfigTextBoxes = (newTextBoxes: DashboardTextBoxConfig[] | undefined) => {
        const config = JSON.stringify({
            ...JSON.parse(dashboardDetails?.model?.Config || "{}") as DashboardConfig,
            textBoxes: newTextBoxes
        })
        setDashboardDetails(dashboard => ({
            ...dashboard,
            model: {
                Config: config
            }
        }))
    }

    const handleUpdateChartLayout = (chartId: string, layout: string) => {
        const newCharts = chartWithData?.map(chartWithDataAndLayout => chartWithDataAndLayout.chartWithData?.model?.Id === chartId ? {
            Id: chartWithDataAndLayout?.chartWithData?.model?.Id!,
            layout: layout
        } : {
            Id: chartWithDataAndLayout?.chartWithData?.model?.Id!,
            layout: chartWithDataAndLayout?.layout
        })
        assignNewConfigCharts(newCharts)

    }

    const assignNewConfigCharts = (newCharts: ChartsConfig[] | undefined) => {
        const config = JSON.stringify({
            ...JSON.parse(dashboardDetails?.model?.Config || "{}") as DashboardConfig,
            charts: newCharts
        })
        setDashboardDetails(dashboard => ({
            ...dashboard,
            model: {
                Config: config
            }
        }))
    }

    return (
        <React.Fragment>
            <Box sx={{p:7}}>
                <LoadingWrapper isLoading={isDashboardLoading} error={dashboardError} data={dashboardData}>
                   
                       
                        <DashboardHero 
                            mode="EDIT" 
                            name={dashboardData?.[0]?.model?.Name} 
                            createdBy={dashboardData?.[0]?.model?.CreatedBy} 
                            description={dashboardData?.[0]?.model?.Description} 
                            lastUpdatedOn={dashboardData?.[0]?.model?.CreatedOn}
                            numberOfCharts={dashboardData?.[0]?.numberOfCharts}
                            flowExecutionId={dashboardData?.[0]?.model?.FlowId}    
                        />
                  
                </LoadingWrapper>
                <Box sx={{display: 'flex', flexDirection: 'row-reverse', width: '100%', px: 2, gap: 2}}>
                    {updateChart.isLoading ? <LoadingIndicator/> : (
                        <Button variant="outlined" size="large" onClick={handleSaveDashboard}>
                            Save
                        </Button>
                        
                    )}
                    <Button variant="text" onClick={handleAddTextBox}>
                        Add Text Box
                    </Button>
                    
                </Box>
                <Box sx={{pt: 2, minHeight: "100%"}}>
                    <ReactQueryWrapper {...fetchDashboardChartQuery}>
                        {() => <ShowDashboardCharts chartWithDataAndLayout={chartWithData || []} onChartChange={onChartChange} textBoxes={getTextBoxes()} onTextBoxValueChange={onTextBoxValueChange} handleUpdateChartLayout={handleUpdateChartLayout}/>}
                    </ReactQueryWrapper>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default SingleDashboardView
