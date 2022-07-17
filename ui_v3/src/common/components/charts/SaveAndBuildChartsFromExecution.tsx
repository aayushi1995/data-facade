import { Box, Grid, Button, Typography } from "@mui/material"
import WrapInCollapsable from "../collapsable/WrapInCollapsable"
import FilterIcon from "../../../../src/images/filter.svg"
import ChartIcon from "../../../../src/images/ChartIcon.svg"
import ResultIcon from "../../../../src/images/Results.png"
import { GridToolbarFilterButton } from "@mui/x-data-grid"
import React from "react"
import { SetSaveAndBuildChartContext, SaveAndBuildChartContext, ChartQueriesContext } from "./SaveAndBuildChartsContext"
import ViewActionExecutionOutput from "../../../pages/view_action_execution/ViewActionExecutionOutput"
import { ReactQueryWrapper } from "../ReactQueryWrapper"
import LoadingIndicator from "../LoadingIndicator"
import ShowCharts from "./ShowCharts"
import { ChartWithData } from "../../../generated/interfaces/Interfaces"
import ShowChartsFromContext from "./ShowChartsFromContext"


interface SaveAndBuildChartsFromExecutionProps {
    executionId: string
}

const SaveAndBuildChartsFromExecution = (props: SaveAndBuildChartsFromExecutionProps) => {

    const saveAndBuildChartsState = React.useContext(SaveAndBuildChartContext)
    const setSaveAndBuildChartsState = React.useContext(SetSaveAndBuildChartContext)
    const chartQueriesState = React.useContext(ChartQueriesContext)

    const handleSaveCharts = () => {
        saveAndBuildChartsState.Charts.forEach(chart => {
            chartQueriesState.fetchPresignedUrlMutation?.mutate({
                expirationDurationInMinutes: 5,
                chart: chart?.data,
                uploadPath: (chart?.data?.model?.S3Path || "s3Path") + "/data.txt"
            })
            chartQueriesState.updateChart?.mutate({
                filter: {Id: chart.data.model?.Id},
                newProperties: {...chart.data.model}
            })
            // {
            //     onSuccess: (data) => {
            //         const expectedData = data as {requestUrl: string, headers: any}
            //         chartQueriesState.uploadFileToS3Mutation?.mutate({
            //             requestUrl: expectedData.requestUrl,
            //             chart: chart.data,
            //             headers: expectedData.headers
            //         },{
            //             onSuccess: (data) => {
            //                 chartQueriesState.updateChart?.mutate({
            //                     filter: {Id: chart.data.model?.Id},
            //                     newProperties: {...chart.data.model}
            //                 }, {
            //                     onSuccess: (data) => {
            //                         chartQueriesState.fetchCharts?.refetch()
            //                     }
            //                 })
            //             }
            //         })
            //     }}
        })
        
    }

    React.useEffect(() => {
        setSaveAndBuildChartsState({type: 'SetExecutionId', payload: {executionId: props.executionId}})
    }, [props.executionId])

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 2, mr: 2}}>
            <Grid container>
                <Grid item xs={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    {chartQueriesState.fetchPresignedUrlMutation?.isLoading || chartQueriesState.uploadFileToS3Mutation?.isLoading || chartQueriesState.updateChart?.isLoading ? (
                        <LoadingIndicator />
                    ) : (
                        <Button
                            onClick={handleSaveCharts}
                            sx={{
                                border: "1px solid #56D280",
                                boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
                                filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15))",
                                borderRadius: "64px"
                            }} variant="outlined">
                            <Typography sx={{
                                fontFamily: "SF Pro Text",
                                fontStyle: "normal",
                                fontWeight: 600,
                                fontSize: "13px",
                                lineHeight: "170%",
                                color: "#353535"
                            }}>
                                Save Chart
                            </Typography>
                        </Button>)
                    }
                </Grid>
            </Grid>
            <Grid container spacing={2} direction="column" ml={2}>
                {/* <Grid item xs={12}>
                    <WrapInCollapsable summary={
                        <CollapsibleSummary label="Filters" icon={FilterIcon} />
                    } 
                        expanded={
                            <Box>
                                
                            </Box>
                        }
                        borderLeft='7px solid #A6ABBD'
                    />
                </Grid> */}
                <Grid item xs={12}>
                    <WrapInCollapsable summary={
                        <CollapsibleSummary label="Charts" icon={ChartIcon} />
                    }
                        expanded={
                            <ReactQueryWrapper isLoading={chartQueriesState.fetchCharts?.isLoading || chartQueriesState.fetchCharts?.isFetching} data={saveAndBuildChartsState.Charts} error={chartQueriesState.fetchCharts?.error}>
                                {() => 
                                <Box>
                                    <ShowChartsFromContext/>
                                </Box>}
                            </ReactQueryWrapper>
                        }
                    />
                </Grid>
                <Grid item xs={12}>
                    <WrapInCollapsable summary={
                        <CollapsibleSummary label="Results" icon={ResultIcon} />
                    }
                        expanded={
                            <ReactQueryWrapper isLoading={chartQueriesState.fetchExecution?.isLoading || chartQueriesState.fetchExecution?.isFetching} data={chartQueriesState.fetchExecution?.data} error={chartQueriesState.fetchExecution?.error}>
                                {() => <>{saveAndBuildChartsState.ExecutionDetails ? 
                                    <ViewActionExecutionOutput 
                                        ActionExecution={saveAndBuildChartsState?.ExecutionDetails?.ActionExecution!} 
                                        ActionDefinition={saveAndBuildChartsState?.ExecutionDetails?.ActionDefinition!} 
                                        ActionInstance={saveAndBuildChartsState?.ExecutionDetails?.ActionInstance!}
                                        showCharts={false}    /> : <LoadingIndicator />
                                }
                                </>}
                            </ReactQueryWrapper>
                        } 
                        borderLeft='7px solid #A6ABBD'
                    />
                </Grid>
                {/* <WrapInCollapsable summary={} */}
                
            </Grid>
        </Box>
    )    
}


export const CollapsibleSummary = (props: {icon: string, label: string}) => {

    return (
        <Box sx={{display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center'}}>
            <img src={props.icon} alt="Filter" />
            <Typography sx={{
                fontFamily: "'SF Pro Text'",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "157%",
                letterSpacing: "0.1px",
                color: "#353535"
            }}>
                {props.label}
            </Typography>
        </Box>
    )
}
export default SaveAndBuildChartsFromExecution
