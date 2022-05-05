
import { Grid, Box, Autocomplete, TextField, Button, IconButton, Popover, Dialog } from "@mui/material";
import { BaseChartsConfig } from "./BaseChartsConfig";
import { Chart, EChartUISpecificConfig } from "./Chart";
import { Chart as ChartModel } from "../../../generated/entities/Entities";
import OptionsIcon from "../../../../src/images/more-horizontal.svg"
import getChartTypeOptions from "../../util/getChartTypeOptions";
import React from "react"
import useUpdateChart from "./hooks/useUpdateChart";
import LoadingIndicator from "../LoadingIndicator";
import TableIcon from "../../../../src/images/Table.svg"
import ViewActionExecution from "../../../pages/view_action_execution/VIewActionExecution";
import useGetDashboardDetails from "../../../pages/insights/hooks/useGetDashboardDetails";
import LoadingWrapper from "../LoadingWrapper";

interface ChartWithMetadataProps {
    chart: {config: BaseChartsConfig, uiConfig: EChartUISpecificConfig, model: ChartModel},
    onChartTypeChange: (id: string, newType: string) => void
    onChartNameChange: (id: string, newName: string) => void,
    onChartDashboardChange?: (id: string, newDashboardId: string) => void
}

const ChartWithMetadata = (props: ChartWithMetadataProps) => {
    
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
    const [dialogState, setDialogState] = React.useState(false)
    const open = Boolean(menuAnchor)
    const updateChart = useUpdateChart()
    const [dashboardData, isDashboardLoading, dashboardDataError] = useGetDashboardDetails({filter: {}})

    const handlePopoverClose = () => {
        setMenuAnchor(null)
    }

    const handleMenuOpenClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(e.currentTarget)
    }

    const handleSaveChart = () => {
        updateChart.mutate({
            filter: {
                Id: props.chart.model.Id || "NA"
            }, 
            newProperties: {
                Name: props.chart.model.Name,
                Type: props.chart.model.Type,
                DashboardId: props.chart.model.DashboardId
            }
        })
    }

    const handleChartTableDialogOpen = () => {
        setDialogState(true)
    }

    return (
        <>
            <Dialog open={dialogState} onClose={() => setDialogState(false)} maxWidth="xl" fullWidth>
                <ViewActionExecution actionExecutionId={props.chart.model.ExecutionId}/>
            </Dialog>
            <Box sx={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: 1, p: 2}}>
                <IconButton onClick={handleMenuOpenClick}>
                    <img src={OptionsIcon} alt="options" style={{transform: 'scale(2)'}}/>
                </IconButton>
                <Chart {...props.chart}/>
                <Popover 
                    anchorEl={menuAnchor}
                    open={open} onClose={handlePopoverClose} keepMounted
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                    }}
                    PaperProps={{
                        sx: {minWidth: 400, minHeight: 300}
                    }}
                >

                    <IconButton sx={{display: 'flex', justifyContent: 'flex-start', ml: 3}} onClick={handleChartTableDialogOpen}>
                        <img src={TableIcon} alt="view table"/>
                    </IconButton>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3, p: 2}}>
                        <Autocomplete 
                            fullWidth
                            value={props.chart.model.Type || "NA"}
                            onChange={(event, value, reason, details) => {
                                if(!!value){
                                    props.onChartTypeChange(props.chart.model.Id || "id", value)
                                }
                            }}
                            options={getChartTypeOptions(props.chart.model.ChartGroup || "NA")}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Chart Type"
                                    placeholder=""
                                />
                            )}
                        />
                        <LoadingWrapper isLoading={isDashboardLoading} data={dashboardData} error={dashboardDataError}>
                            <Autocomplete
                                fullWidth
                                value={dashboardData.find(dashboard => dashboard?.model?.Id === props.chart.model.DashboardId)?.model || {}}
                                onChange={(event, value, reason, details) => {
                                    if(!!value){
                                        props.onChartDashboardChange?.(props.chart.model.Id || "id", value.Id || "NA")
                                    }
                                }}
                                getOptionLabel={(dashboardDataElement) => dashboardDataElement?.Name || "NA"}
                                options={dashboardData.map((dashboard) => {return dashboard.model})}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Assign To Dashboard"
                                        placeholder=""
                                    />
                                )}
                            />
                        </LoadingWrapper>
                       
                        <TextField sx={{mt: 2}}label="Chart Name" value={props.chart?.model?.Name} fullWidth onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onChartNameChange(props.chart.model.Id || "id", e.target.value)}/>
                        {updateChart.isLoading ? (
                            <LoadingIndicator/>
                        ) : (
                            <Button variant="contained" sx={{ background: "#56D280", borderRadius: "64px" }} onClick={handleSaveChart}>
                                Save
                            </Button>
                        )}
                    </Box>
                </Popover>
            </Box>
        </>
    )
}

export default ChartWithMetadata