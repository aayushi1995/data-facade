import { Box, Grid, Tabs, Typography } from "@mui/material"
import React from "react"
import ActionExecutionStatus from "../../../enums/ActionExecutionStatus"
import ViewConfiguredParameters from "../../../pages/applications/execute_action/components/ViewConfiguredParameters"
import ScratchPadChart from "../../../pages/data/components/ScratchPad/ScratchPadChart"
import { cleanData } from "../../../pages/data/components/ScratchPad/utils"
import JobsRowJobDetail from "../../../pages/jobs/components/JobsRowJobDetail"
import FetchActionExecutionDetails from "../action_execution/view_action_execution/hooks/FetchActionExecutionDetails"
import ViewActionExecutionOutput from "../action_execution/view_action_execution/ViewActionExecutionOutput"
import { ReactQueryWrapper } from "../error-boundary/ReactQueryWrapper"
import LoadingIndicator from "../LoadingIndicator"
import { tabsStyle } from "./CssProperties"
import DisplayLogs from "./DisplayLogs"
import { ChartQueriesContext, SaveAndBuildChartContext, SetSaveAndBuildChartContext } from "./SaveAndBuildChartsContext"
import ShowChartsFromContext from "./ShowChartsFromContext"
import { ActionExecutionResultTab } from "./styled_components/ResultsViewStyledTab"


interface SaveAndBuildChartsFromExecutionProps {
    executionId: string;
    definitionName?: string;
    onChildExecutionCreated?: (childExecutionId: string) => void;
    definitionId?: string
    showCharts?:boolean
    onDeepDiveActionSelected?: (actionId?: string) => void
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}


function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>);
}

const highLevelSxProps = { display: 'flex', flexDirection: 'column', gap: 2 }

const SaveAndBuildChartsFromExecution = (props: SaveAndBuildChartsFromExecutionProps) => {
    // constant Label
    const ChartAndResultTabSummaryLabel = props?.showCharts ? ["Results", "Charts", "Logs", "More Info"] : ["Results", "Parameters", "Logs", "More Info"]

    const showCharts = props?.showCharts
    const saveAndBuildChartsState = React.useContext(SaveAndBuildChartContext)
    const setSaveAndBuildChartsState = React.useContext(SetSaveAndBuildChartContext)
    const chartQueriesState = React.useContext(ChartQueriesContext)
    const [activeTab, setActiveTab] = React.useState<number>(0)

    const [tables, setTables] = React.useState({
        columns:undefined,
        rows:undefined
    })

    const getTableData = (data: any) => {
        if(data) {
            const {columns, rows} = cleanData(data)
            setTables({
                columns: columns,
                rows: rows
            })
            // chart ready
        }
    }

    React.useEffect(() => {
        saveAndBuildChartsState.Charts.forEach(chart => {
            chartQueriesState.fetchPresignedUrlMutation?.mutate({
                expirationDurationInMinutes: 5,
                chart: chart?.data,
                uploadPath: (chart?.data?.model?.S3Path || "s3Path") + "/data.txt"
            })
            chartQueriesState.updateChart?.mutate({
                filter: { Id: chart.data.model?.Id },
                newProperties: { ...chart.data.model },
                assignedDashboards: chart.assignedDasboards
            })
        })
    }, [saveAndBuildChartsState.Charts])

    React.useEffect(() => {
        setSaveAndBuildChartsState({ type: 'SetExecutionId', payload: { executionId: props.executionId } })
    }, [props.executionId])

    const handleTabChange = (tabValue: number) => {
        setActiveTab(tabValue)
    }
    const [executionTerminal, setExecutionTerminal] = React.useState(true)

    const actionExecutionDetailQuery = FetchActionExecutionDetails({
        actionExecutionId: props.executionId, refetch: false, queryOptions: {
            enabled: !executionTerminal
        }
    })
    React.useEffect(() => {
        const actionStatus = actionExecutionDetailQuery.data?.ActionExecution?.Status
        if (actionStatus === ActionExecutionStatus.FAILED || actionStatus === ActionExecutionStatus.COMPLETED) {
            setExecutionTerminal(true)
        }
    }, [actionExecutionDetailQuery.data])

    React.useEffect(() => {
        console.log(props.executionId)
        setExecutionTerminal(false)
    }, [props.executionId])

    const getParentProviderInstanceId = () => {
        return saveAndBuildChartsState.ExecutionDetails?.ActionParameterInstances?.find(pi => !!pi.ProviderInstanceId)?.ProviderInstanceId || saveAndBuildChartsState.ExecutionDetails?.ActionInstance?.ProviderInstanceId
    }

    const getTabBoxSx = () => {
        return {
            background: "#F0F2F5",
            boxShadow:
              "0px 0.970733px 0.970733px rgba(0, 0, 0, 0.1), 0px 0px 0.970733px rgba(0, 0, 0, 0.25)",
            borderRadius: "7.66801px"
        }
    }
    

    return (
        <Box sx={highLevelSxProps}>
            <Grid direction="column" ml={2}>
                <Grid item xs={12} >

                        <ChartAndResultTabSummary labels={ChartAndResultTabSummaryLabel} activeTab={activeTab} onTabChange={handleTabChange}/>
                        
                        <Box sx={{mt: 1, p: 2, ...getTabBoxSx()}}>
                            <TabPanel value={activeTab} index={0}>
                                <ReactQueryWrapper isLoading={chartQueriesState.fetchExecution?.isLoading || chartQueriesState.fetchExecution?.isFetching} data={chartQueriesState.fetchExecution?.data} error={chartQueriesState.fetchExecution?.error}>
                                    {() => <>
                                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                            <ReactQueryWrapper isLoading={chartQueriesState.fetchCharts?.isLoading || chartQueriesState.fetchCharts?.isFetching} data={saveAndBuildChartsState.Charts} error={chartQueriesState.fetchCharts?.error}>
                                                {() => <ShowChartsFromContext onDeepDiveActionSelected={props.onDeepDiveActionSelected}/>}
                                            </ReactQueryWrapper>
                                            {saveAndBuildChartsState.ExecutionDetails ? 
                                                <ViewActionExecutionOutput 
                                                onDeepDiveActionSelected={props.onDeepDiveActionSelected}
                                                ActionExecution={saveAndBuildChartsState?.ExecutionDetails?.ActionExecution!} 
                                                ActionDefinition={saveAndBuildChartsState?.ExecutionDetails?.ActionDefinition!} 
                                                ActionInstance={saveAndBuildChartsState?.ExecutionDetails?.ActionInstance!}
                                                getTableData={getTableData}
                                                showCharts={false}    /> : <LoadingIndicator />}
                                        </Box>
                                    
                                    </>}
                                </ReactQueryWrapper>
                            </TabPanel>
                            {!showCharts ? <TabPanel value={activeTab} index={1}>
                                <ReactQueryWrapper {...chartQueriesState.fetchExecution}>
                                    {() => <>
                                        {saveAndBuildChartsState.ExecutionDetails ? 
                                        <ViewConfiguredParameters 
                                            parameterDefinitions={saveAndBuildChartsState.ExecutionDetails.ActionParameterDefinitions || []} 
                                            parameterInstances={saveAndBuildChartsState.ExecutionDetails.ActionParameterInstances || []} /> : <LoadingIndicator />
                                        }
                                    </>}
                                </ReactQueryWrapper>
                            </TabPanel> : 
                            <TabPanel value={activeTab} index={1}>
                                  <ScratchPadChart {...tables}/>
                            </TabPanel>
                            }
                            <TabPanel value={activeTab} index={2}>
                                <DisplayLogs actionExecution={saveAndBuildChartsState.ExecutionDetails?.ActionExecution || {}} />
                            </TabPanel>
                            <TabPanel value={activeTab} index={3}>
                                <JobsRowJobDetail actionExecutionId={saveAndBuildChartsState.ExecutionDetails?.ActionExecution?.Id} />
                            </TabPanel>
                        </Box>
                </Grid>

            </Grid>
        </Box>
    )
}



const ChartAndResultTabSummary = (props: {labels:string[], activeTab: number, onTabChange: (value: number) => void}) => {
    return (
        <Box sx={{ display: 'flex', gap: 0 }}>
            <Tabs sx={{
                ...tabsStyle
            }} value={props.activeTab} onChange={(event, newValue) => {
                if (newValue !== props.activeTab && props.activeTab !== -1) {
                    event.stopPropagation()
                }
                props.onTabChange(newValue)
            }}>
                {props?.labels?.map((label:string, index:number) => {
                    return <ActionExecutionResultTab value={index} label={label}/>
                } )}

                
                {/* <ActionExecutionResultTab label="Parameters" value={1} />
                <ActionExecutionResultTab label="Logs" value={2}/>
                <ActionExecutionResultTab label="More Info" value={3} /> */}
            </Tabs>
        </Box>
    )
}


export default SaveAndBuildChartsFromExecution
