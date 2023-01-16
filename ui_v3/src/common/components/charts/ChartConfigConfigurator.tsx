import { Box, Typography, Tabs, Tab, Button, TextField, FormGroup, FormControlLabel, Checkbox, Autocomplete, List, ListItemButton } from "@mui/material";
import React from "react"
import ChartGroups from "../../../enums/ChartGroups";
import { Chart } from "../../../generated/entities/Entities";
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces";
import { ReactQueryWrapper } from "../ReactQueryWrapper";
import useFetchDeepDiveActions from "./hooks/useFetchDeepDiveActions";
import { ChartModelConfig, SaveAndBuildChartContext, SetSaveAndBuildChartContext } from "./SaveAndBuildChartsContext"


interface ChartConfigConfiguratorProps {
    chartId: string,
    onChartModelChange: (chartId: string, chartModel: Chart) => void,
    onDeepDiveActionSelected: (actionId: string) => void
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
        </div>
);
}

const ChartConfigConfigurator = (props: ChartConfigConfiguratorProps) => {
    const [tabValue, setTabValue] = React.useState(0)
    const saveAndBuildChartsState = React.useContext(SaveAndBuildChartContext)
    const setSaveAndBuildChartState = React.useContext(SetSaveAndBuildChartContext)

    const chartDataWithOptions = saveAndBuildChartsState.Charts.find(chart => chart.data.model?.Id === props.chartId)!

    const fetchDeepDiveActionsQuery = useFetchDeepDiveActions({filter: {Id: saveAndBuildChartsState.ExecutionDetails?.ActionDefinition?.Id}, options: {enabled: false}})

    React.useEffect(() => {
        if(!fetchDeepDiveActionsQuery.data) {
            fetchDeepDiveActionsQuery.refetch()
        }
    }, [])

    const handleSwitchAxes = () => {
        setSaveAndBuildChartState({
            type: 'SwitchAxes',
            payload: {
                chartId: props.chartId
            }
        })
    }

    const handleShowLableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSaveAndBuildChartState({
            type: 'ChangeLabel',
            payload: {
                chartId: props.chartId,
                showLables: event.target.checked
            }
        })
    }

    const getTabSxProps = () => {
        return {
            fontFamily: "SF Pro Text",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "10px",
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            opacity: 0.7
        }
    }

    const handleDeepDiveActionClick = (actionDefinition: ActionDefinitionDetail ) => {
        props.onDeepDiveActionSelected(actionDefinition.ActionDefinition?.model?.Id!)
    }

    return (
        <Box>
            <Tabs value={tabValue} onChange={((event, newValue) => setTabValue(newValue))}>
                <Tab label="Actions" value={0} sx={{
                    ...getTabSxProps()
                }}/>
                <Tab label="Axes" value={1} sx={{
                    ...getTabSxProps()
                }}/>
                <Tab label="Config" value={2} sx={{
                    ...getTabSxProps()
                }}/>
            </Tabs>
            <Box>
                <TabPanel value={tabValue} index={1}>
                    <Box m={1} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1}}>
                        <Button onClick={handleSwitchAxes} disabled={chartDataWithOptions?.data?.model?.ChartGroup !== ChartGroups.TWO_DIMENSIONAL_SCATTER && chartDataWithOptions?.data?.model?.ChartGroup !== ChartGroups.TWO_DIMENSION}>Switch Axes</Button>
                        <FormGroup row={true} sx={{display: 'webkit', minWidth: '400px'}}>
                            <FormControlLabel control={<Checkbox checked={(JSON.parse(chartDataWithOptions?.data?.model?.Config || "{}") as ChartModelConfig).uiConfig?.showLables || false} onChange={handleShowLableChange}/>} label="Show label"/>
                        </FormGroup>
                        {
                            chartDataWithOptions?.columns?.length ? (
                                <Autocomplete 
                                fullWidth
                                    options={chartDataWithOptions.columns.map(column => column.name)}
                                    value={chartDataWithOptions?.options?.config?.xAxis?.[0]?.name}
                                    onChange={(event, value, reason, details) => {
                                        if(!!value) {
                                            setSaveAndBuildChartState({
                                                type: 'AssignXAxisToChart',
                                                payload: {
                                                    chartId: props.chartId,
                                                    column_name: value
                                                }
                                            })
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="x axis"
                                            placeholder=""
                                        />
                                    )}
                                />
                            ) : (<></>)
                        }
                        {
                            chartDataWithOptions?.columns?.length ? (
                                <Autocomplete 
                                fullWidth
                                options={chartDataWithOptions.columns.map(column => column.name)}
                                value={chartDataWithOptions?.options?.config?.yAxis?.[0]?.name}
                                onChange={(event, value, reason, details) => {
                                    if(!!value) {
                                        setSaveAndBuildChartState({
                                            type: 'AssignYAxisToChart',
                                            payload: {
                                                chartId: props.chartId,
                                                column_name: value
                                            }
                                        })
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="y axis"
                                        placeholder=""
                                    />
                                )}
                            />
                            ) : (<></>)
                        }
                    </Box>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <Box m={1} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <TextField sx={{mt: 2}} label="Chart Name" value={chartDataWithOptions.data?.model?.Name} fullWidth onChange={(e: React.ChangeEvent<HTMLInputElement>) => {props.onChartModelChange(props.chartId, {...chartDataWithOptions.data.model, Name: e.target.value})}}/>
                    </Box>
                </TabPanel>
                <TabPanel value={tabValue} index={0}>
                    <ReactQueryWrapper isLoading={fetchDeepDiveActionsQuery.isLoading || fetchDeepDiveActionsQuery.isRefetching} data={fetchDeepDiveActionsQuery.data} error={fetchDeepDiveActionsQuery.error}>
                        {() => <List>
                            {fetchDeepDiveActionsQuery?.data?.map(actionDefinition => 
                                <ListItemButton onClick={() => handleDeepDiveActionClick(actionDefinition)}>{actionDefinition.ActionDefinition?.model?.DisplayName || actionDefinition?.ActionDefinition?.model?.UniqueName}</ListItemButton>)}
                        </List>}
                    </ReactQueryWrapper>
                </TabPanel>
            </Box>
        </Box>
    )
}

export default ChartConfigConfigurator
