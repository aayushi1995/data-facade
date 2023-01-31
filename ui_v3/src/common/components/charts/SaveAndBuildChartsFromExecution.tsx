import { Box, Grid, Button, Typography, Tabs, Tab, Dialog, Tooltip } from "@mui/material"
import WrapInCollapsable from "../collapsable/WrapInCollapsable"
import ChartIcon from "../../../../src/images/ChartIcon.svg"
import ResultIcon from "../../../../src/images/Results.png"
import React from "react"
import { SetSaveAndBuildChartContext, SaveAndBuildChartContext, ChartQueriesContext } from "./SaveAndBuildChartsContext"
import ViewActionExecutionOutput from "../../../pages/view_action_execution/ViewActionExecutionOutput"
import { ReactQueryWrapper } from "../ReactQueryWrapper"
import LoadingIndicator from "../LoadingIndicator"
import ShowChartsFromContext from "./ShowChartsFromContext"
import ExportAsDashboard from "../workflow/execute/ExportAsDashboard"
import { borderRadius } from "@mui/system"
import FetchActionExecutionDetails from "../../../pages/view_action_execution/hooks/FetchActionExecutionDetails"
import ActionExecutionStatus from "../../../enums/ActionExecutionStatus"
import ParametersIcon from "../../../../src/images/Parameters.svg";
import ViewConfiguredParameters from "../../../pages/execute_action/components/ViewConfiguredParameters"
import DeepDive from "./DeepDive"
import SaveBtn from "../../../images/save1.svg"
import { ActionExecutionOutputContainer, collapseSummaryBox, collapseSummaryTypo, PostTaskBTNContainer, TabHeaderContainer, tabsStyle, tabStyle } from "./CssProperties"
import { ActionExecutionResultTab } from "./styled_components/ResultsViewStyledTab"
import DisplayLogs from "./DisplayLogs"
import JobsRowJobDetail from "../../../pages/jobs/components/JobsRowJobDetail"


interface SaveAndBuildChartsFromExecutionProps {
    executionId: string;
    definitionName?: string;
    onChildExecutionCreated?: (childExecutionId: string) => void;
    definitionId?: string,
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

const highLevelSxProps = { display: 'flex', flexDirection: 'column', gap: 2, }
const SaveAndBuildChartsFromExecution = (props: SaveAndBuildChartsFromExecutionProps) => {

    const saveAndBuildChartsState = React.useContext(SaveAndBuildChartContext)
    const setSaveAndBuildChartsState = React.useContext(SetSaveAndBuildChartContext)
    const chartQueriesState = React.useContext(ChartQueriesContext)
    const [activeTab, setActiveTab] = React.useState<number>(0)

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
                        <ChartAndResultTabSummary activeTab={activeTab} onTabChange={handleTabChange}/>
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
                                                showCharts={false}    /> : <LoadingIndicator />}
                                        </Box>
                                    
                                    </>}
                                </ReactQueryWrapper>
                            </TabPanel>
                            <TabPanel value={activeTab} index={1}>
                                <ReactQueryWrapper {...chartQueriesState.fetchExecution}>
                                    {() => <>
                                        {saveAndBuildChartsState.ExecutionDetails ? 
                                        <ViewConfiguredParameters 
                                            parameterDefinitions={saveAndBuildChartsState.ExecutionDetails.ActionParameterDefinitions || []} 
                                            parameterInstances={saveAndBuildChartsState.ExecutionDetails.ActionParameterInstances || []} /> : <LoadingIndicator />
                                        }
                                    </>}
                                </ReactQueryWrapper>
                            </TabPanel>
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


export const CollapsibleSummary = (props: { icon: string, label: string }) => {

    return (
        <Box sx={{...collapseSummaryBox}}>
            <img src={props.icon} alt="Filter" />
            <Typography sx={{
                ...collapseSummaryTypo
            }}>
                {props.label}
            </Typography>
        </Box>
    )
}


const ChartAndResultTabSummary = (props: {activeTab: number, onTabChange: (value: number) => void}) => {
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
                <ActionExecutionResultTab value={0}iconPosition="start" label="Results" />
                <ActionExecutionResultTab label="Parameters" value={1} />
                <ActionExecutionResultTab label="Logs" value={2}/>
                <ActionExecutionResultTab label="More Info" value={3} />
            </Tabs>
        </Box>
    )
}


export default SaveAndBuildChartsFromExecution

