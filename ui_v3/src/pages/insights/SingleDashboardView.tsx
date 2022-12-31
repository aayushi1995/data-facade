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
import { ChartWithData, DashboardDetails } from "../../generated/interfaces/Interfaces"
import DashboardHero from "./components/DashboardHero"
import ShowDashboardCharts from "./components/ShowDashboardCharts"
import useGetDashboardDetails from "./hooks/useGetDashboardDetails"
import {v4 as uuidv4} from "uuid"
import useSaveDashboard from "./hooks/useSaveDashboard"

export interface DashboardTextBoxConfig {
    layout: string,
    text: string,
    id: string
}
export interface DashboardConfig {
    textBoxes?: DashboardTextBoxConfig[]
}

const SingleDashboardView = ({match}: RouteComponentProps<{dashboardId: string}>) => {
    const dashboardId = match.params.dashboardId
    const [chartFetched, setChartFetched] = React.useState(false)
    const [chartWithData, setChartWithData] = React.useState<ChartWithData[] | undefined>()
    const [dashboardDetails, setDashboardDetails] = React.useState<DashboardDetails | undefined>()
    const updateDashboard = useSaveDashboard()

    const [dashboardData, isDashboardLoading, dashboardError, refetch] = useGetDashboardDetails({filter: {Id: dashboardId}, enabled: false})

    const handleChartFetched = () => {
        setChartFetched(true)
    }

    React.useEffect(() => {
        refetch()
    }, [dashboardId]) 

    const [chartData, isChartDataLoading, isChartError] = useGetExecutionCharts({filter: {DashboardId: dashboardId}, handleSucess: handleChartFetched, enabled: dashboardData !== undefined && !chartFetched})

    const updateChart = useUpdateChart()

    React.useEffect(() => {
        if(!!chartData) {
            console.log(chartData)
            setChartWithData(chartData)
        }
    }, [chartData])

    React.useEffect(() => {
        if(!!dashboardData && dashboardData.length) {
            setDashboardDetails(dashboardData?.[0])
        }
    }, [dashboardData])

    const onChartChange = (chartData: ChartWithData[]) => {
        setChartWithData(chartData)
    }

    const handleSaveDashboard = () => {
        chartWithData?.forEach(chart => {
            updateChart.mutate({
                filter: {
                    Id: chart?.model?.Id || "NA"
                }, 
                newProperties: {
                    Name: chart?.model?.Name,
                    Type: chart?.model?.Type,
                    DashboardId: chart?.model?.DashboardId,
                    Layout: chart?.model?.Layout
                }
            })
        })

        updateDashboard.mutate({
            filter: {Id: dashboardDetails?.model?.Id},
            newProperties: dashboardDetails?.model || {}
        })
    }

    const getTextBoxes = () => {
        return (JSON.parse(dashboardDetails?.model?.Config || "{}") as DashboardConfig).textBoxes
    }

    const handleAddTextBox = () => {
        const id = uuidv4()
        const items = chartData?.length || 0 + (getTextBoxes()?.length || 0)
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
        assignNewConfig(finalTextBoxes)
    }

    const onTextBoxValueChange = (id: string, prop: string, value: string) => {
        const newTextBoxes = getTextBoxes()?.map(textBox => textBox.id === id ? {
            ...textBox,
            [prop]: value
        } : textBox)
        assignNewConfig(newTextBoxes)
    }

    const assignNewConfig = (newTextBoxes: DashboardTextBoxConfig[] | undefined) => {
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

    return (
        <React.Fragment>
            <Box sx={{display: 'flex', gap: 2, flexDirection: 'column'}}>
                <LoadingWrapper isLoading={isDashboardLoading} error={dashboardError} data={dashboardData}>
                    <Box mt={3}>
                        <DashboardHero 
                            mode="EDIT" 
                            name={dashboardData?.[0]?.model?.Name} 
                            createdBy={dashboardData?.[0]?.model?.CreatedBy} 
                            description={dashboardData?.[0]?.model?.Description} 
                            lastUpdatedOn={dashboardData?.[0]?.model?.CreatedOn}
                            numberOfCharts={dashboardData?.[0]?.numberOfCharts}
                            flowExecutionId={dashboardData?.[0]?.model?.FlowId}    
                        />
                    </Box>
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
                    <LoadingWrapper data={chartData} isLoading={isChartDataLoading} error={isChartError}>
                        <ShowDashboardCharts chartWithData={chartData || []} onChartChange={onChartChange} textBoxes={getTextBoxes()} onTextBoxValueChange={onTextBoxValueChange}/>
                    </LoadingWrapper>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default SingleDashboardView
