import { Box } from "@mui/material"
import React from "react"
import { RouteComponentProps } from "react-router"
import ShowCharts from "../../common/components/charts/ShowCharts"
import LoadingWrapper from "../../common/components/LoadingWrapper"
import { TabPanel } from "../../common/components/workflow/create/SelectAction/SelectAction"
import { useGetExecutionCharts } from "../../common/hooks/useGetExecutionCharts"
import DashboardHero from "./components/DashboardHero"
import useGetDashboardDetails from "./hooks/useGetDashboardDetails"
import ShowDashboardMetadata from "./ShowDashboardMetadata"


const SingleDashboardView = ({match}: RouteComponentProps<{dashboardId: string}>) => {
    const dashboardId = match.params.dashboardId
    const [chartFetched, setChartFetched] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState(0)

    const [dashboardData, isDashboardLoading, dashboardError, refetch] = useGetDashboardDetails({filter: {Id: dashboardId}})

    const handleChartFetched = () => {
        setChartFetched(true)
    }

    React.useEffect(() => {
        refetch()
    }, []) 

    const [chartData, isChartDataLoading, isChartError] = useGetExecutionCharts({filter: {DashboardId: dashboardId}, handleSucess: handleChartFetched, enabled: dashboardData !== undefined && !chartFetched})

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
                <Box sx={{pt: 2, minHeight: "100%"}}>
                    <TabPanel value={activeTab} index={0}>
                        <LoadingWrapper data={chartData} isLoading={isChartDataLoading} error={isChartError}>
                            <ShowCharts chartWithData={chartData}/>
                        </LoadingWrapper>
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <LoadingWrapper
                            data={dashboardData}
                            isLoading={isDashboardLoading && isChartDataLoading}
                            error={dashboardError}
                        >
                            <ShowDashboardMetadata dashboardData={dashboardData?.[0]?.model || {}} chartData={chartData}/>
                        </LoadingWrapper>
                    </TabPanel>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default SingleDashboardView
