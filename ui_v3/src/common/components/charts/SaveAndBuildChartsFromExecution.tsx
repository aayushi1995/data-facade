import { Box, Grid, Button, Typography, Tabs, Tab, Dialog } from "@mui/material"
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


interface SaveAndBuildChartsFromExecutionProps {
    executionId: string;
    definitionName?: string;
    onChildExecutionCreated?: (childExecutionId: string) => void;
    definitionId?: string
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

const highLevelSxProps = { display: 'flex', flexDirection: 'column', gap: 2, mt: 2, mr: 2 }
const SaveAndBuildChartsFromExecution = (props: SaveAndBuildChartsFromExecutionProps) => {

    const saveAndBuildChartsState = React.useContext(SaveAndBuildChartContext)
    const setSaveAndBuildChartsState = React.useContext(SetSaveAndBuildChartContext)
    const chartQueriesState = React.useContext(ChartQueriesContext)
    const [activeTab, setActiveTab] = React.useState<number>(0)
    const [selectedDeepDiveActionId, setSelectedDeepDiveActionId] = React.useState<string | undefined>()

    const handleSaveCharts = () => {
        saveAndBuildChartsState.Charts.forEach(chart => {
            chartQueriesState.fetchPresignedUrlMutation?.mutate({
                expirationDurationInMinutes: 5,
                chart: chart?.data,
                uploadPath: (chart?.data?.model?.S3Path || "s3Path") + "/data.txt"
            })
            chartQueriesState.updateChart?.mutate({
                filter: {Id: chart.data.model?.Id},
                newProperties: {...chart.data.model},
                assignedDashboards: chart.assignedDasboards
            })
        })
        
    }

    React.useEffect(() => {
        setSaveAndBuildChartsState({type: 'SetExecutionId', payload: {executionId: props.executionId}})
    }, [props.executionId])

    const handleTabChange = (tabValue: number) => {
        setActiveTab(tabValue)
    }


    const [executionTerminal, setExecutionTerminal] = React.useState(true)

    const actionExecutionDetailQuery = FetchActionExecutionDetails({actionExecutionId: props.executionId, refetch: false, queryOptions: {
        enabled: !executionTerminal
    }})
    React.useEffect(() => {
        const actionStatus = actionExecutionDetailQuery.data?.ActionExecution?.Status
        if(actionStatus === ActionExecutionStatus.FAILED || actionStatus === ActionExecutionStatus.COMPLETED) {
            setExecutionTerminal(true)
        }
    }, [actionExecutionDetailQuery.data])

    React.useEffect(() => {
        console.log(props.executionId)
        setExecutionTerminal(false)
    }, [props.executionId])
    

    function postExecutionTasksButton(buttonLabel :String, onClick: React.MouseEventHandler<HTMLButtonElement> | undefined){
        return (
            <Button
            variant="outlined" 
            color="success" 
            sx={{ ml: 'auto', borderRadius: '5px' }} 
                onClick={onClick}
                >
                {buttonLabel}
            </Button>
        )
    }

    const getParentProviderInstanceId = () => {
        return saveAndBuildChartsState.ExecutionDetails?.ActionParameterInstances?.find(pi => !!pi.ProviderInstanceId)?.ProviderInstanceId || saveAndBuildChartsState.ExecutionDetails?.ActionInstance?.ProviderInstanceId
    }

    const getButtonSx = { width: '10vw', height: '100%', ml: 'auto' }
    const postExecutionTasks = 
    <>
        <Box sx={{getLargerButtonSx: getButtonSx}}>
            <ExportAsDashboard executionId={props.executionId} definitionName={props.definitionName || ""}/>
        </Box>
        <Box sx={{getLargerButtonSx: getButtonSx}}>
            <DeepDive 
                setSelectedActionId={setSelectedDeepDiveActionId}
                executionId={props.executionId} 
                definitionName={props.definitionName || ""}
                onChildExecutionCreated={props.onChildExecutionCreated}
                definitionId={props.definitionId || ""}
                selectedActionId={selectedDeepDiveActionId}
                parentProviderInstanceId={getParentProviderInstanceId()}
            />
        </Box>
        <Box sx={{getLargerButtonSx: getButtonSx}}>
            {postExecutionTasksButton("Save", handleSaveCharts)}
        </Box>
    </>

    const onDeepDiveActionSelected = (actionId: string) => {
        console.log(actionId)
        setSelectedDeepDiveActionId(actionId)
    }

    return (
        <Box sx={highLevelSxProps}>
            <Grid direction="column" ml={2}>
                <Grid item xs={12} >
                    <WrapInCollapsable summary={
                        <>
                        <ChartAndResultTabSummary activeTab={activeTab} onTabChange={handleTabChange}/>
                        <Box sx={{display:'flex',flexDirection:'row',ml:'auto',gap:1,mt:'20px'}}>
                            {chartQueriesState.fetchPresignedUrlMutation?.isLoading || chartQueriesState.uploadFileToS3Mutation?.isLoading || chartQueriesState.updateChart?.isLoading ? (
                                    <LoadingIndicator />
                                ) : postExecutionTasks
                                }
                        </Box>
                        </>
                    }
                        defaultExpanded={true}
                        expanded={
                            <Box sx={{mt: 2}}>
                                <TabPanel value={activeTab} index={0}>
                                    <ReactQueryWrapper isLoading={chartQueriesState.fetchExecution?.isLoading || chartQueriesState.fetchExecution?.isFetching} data={chartQueriesState.fetchExecution?.data} error={chartQueriesState.fetchExecution?.error}>
                                        {() => <>
                                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                                <ReactQueryWrapper isLoading={chartQueriesState.fetchCharts?.isLoading || chartQueriesState.fetchCharts?.isFetching} data={saveAndBuildChartsState.Charts} error={chartQueriesState.fetchCharts?.error}>
                                                    {() => <ShowChartsFromContext onDeepDiveActionSelected={onDeepDiveActionSelected}/>}
                                                </ReactQueryWrapper>
                                                {saveAndBuildChartsState.ExecutionDetails ? 
                                                    <ViewActionExecutionOutput 
                                                    onDeepDiveActionSelected={onDeepDiveActionSelected}
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
                            </Box>}
                    />
                </Grid>
                
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

const ChartAndResultTabSummary = (props: {activeTab: number, onTabChange: (value: number) => void}) => {
    return (
        <Box sx={{display: 'flex', gap: 0}}>
            <Tabs value={props.activeTab} onChange={(event, newValue) => {
                if(newValue !== props.activeTab && props.activeTab !== -1){
                    event.stopPropagation() 
                }
                props.onTabChange(newValue)   
            }}>
                <Tab value={0} icon={<img src={ResultIcon}/>} iconPosition="start" label="Results" sx={{
                    fontFamily: "'SF Pro Text'",
                    fontStyle: "normal",
                    fontWeight: 500,
                    fontSize: "17px",
                    lineHeight: "100%",
                    letterSpacing: "0.124808px",
                    color: "#353535"
                }}/>
                <Tab label="Parameters" value={1} sx={{
                    fontFamily: "'SF Pro Text'",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "157%",
                    letterSpacing: "0.124808px",
                    color: "#DB8C28",
                    fontSize: "17px",
                }}
                iconPosition="start" 
                icon={<img src={ParametersIcon} alt="" style={{height: 35, width: 60}}/>}/>
            </Tabs>
        </Box>
    )
}
export default SaveAndBuildChartsFromExecution

