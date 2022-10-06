import { Chart as ChartModel, Dashboard} from "../../../generated/entities/Entities"
import { ChartWithDataAndOptions } from "./SaveAndBuildChartsContext"
import { Box, IconButton, Grid, Autocomplete, TextField, Tooltip, Popover, createFilterOptions } from "@mui/material"
import { Chart } from "./Chart"
import getChartTypeOptions from "../../util/getChartTypeOptions"
import LoadingWrapper from "../LoadingWrapper"
import useGetDashboardDetails from "../../../pages/insights/hooks/useGetDashboardDetails"
import OptionsIcon from "../../../../src/images/more-horizontal.svg"
import LoadingIndicator from "../LoadingIndicator"
import React from "react"
import ChartConfigConfigurator from "./ChartConfigConfigurator"
import ChartGroups from "../../../enums/ChartGroups"
import { userSettingsSingleton } from "../../../data_manager/userSettingsSingleton"
import { v4 as uuidv4 } from 'uuid'
import useCreateDashboard from "./hooks/useCreateDashboard"


interface ChartFromContextProps {
    chart: ChartWithDataAndOptions,
    onChartModelChange: (chartId: string, chartModel: ChartModel) => void
}

const ChartFromContext = (props: ChartFromContextProps) => {
    const [changed, setChanged] = React.useState(false)
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
    const open = Boolean(menuAnchor)
    const filter = createFilterOptions<Dashboard>()
    
    React.useEffect(() => {
        console.log("HERE")
        setChanged(false)
    }, [props.chart.options])

    const [dashboardData, isDashboardLoading, dashboardDataError, refetchDashboards] = useGetDashboardDetails({filter: {}})
    console.log(props.chart)

    const handleMenuOpenClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(e.currentTarget)
    }

    const handlePopoverClose = () => {
        setMenuAnchor(null)
    }
    const saveDashboard = useCreateDashboard({})

    const handleDashboardChange = (newDashboard: Dashboard) => {
        const isNewDashboard = newDashboard.Name?.includes("New Dashboard: ")
        if(isNewDashboard) {
            const newDashboardModel: Dashboard = {
                Name: newDashboard.Name?.substring(15),
                CreatedOn: Date.now(),
                CreatedBy: userSettingsSingleton.userEmail,
                Id: uuidv4()
            }

            saveDashboard.mutate(newDashboardModel, {
                onSuccess: () => {
                    props.onChartModelChange(props.chart?.data?.model?.Id || "ID", {...props.chart.data.model, DashboardId: newDashboardModel.Id})
                    refetchDashboards()
                }
            })
        } else {
            props.onChartModelChange(props.chart?.data?.model?.Id || "ID", {...props.chart.data.model, DashboardId: newDashboard.Id})
        }
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: 4, p: 2}}>
            <Popover
                anchorEl={menuAnchor}
                open={open} onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                PaperProps={{
                    sx: {minWidth: 400, minHeight: 300, mt: '50px'}
                }}
            >
                <ChartConfigConfigurator chartId={props.chart?.data?.model?.Id || "ID"} onChartModelChange={props.onChartModelChange}/>
            </Popover>
            <Grid container direction="row-reverse" spacing={1}>
                <Grid item xs={1} sx={{display: 'flex', justifyContent: 'center'}}>
                    <Tooltip title="configure">
                        <IconButton onClick={handleMenuOpenClick}>
                            <img src={OptionsIcon} alt="More" style={{transform: 'scale(1.5)'}}/>
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={2}>
                    <LoadingWrapper isLoading={isDashboardLoading} data={dashboardData} error={dashboardDataError}>
                        <Autocomplete
                            fullWidth
                            value={dashboardData.find(dashboard => dashboard?.model?.Id === props.chart.data.model?.DashboardId)?.model}
                            onChange={(event, value, reason, details) => {
                                if(!!value){
                                    handleDashboardChange(value)
                                    // props.onChartModelChange(props.chart?.data?.model?.Id || "ID", {...props.chart.data.model, DashboardId: value.Id})
                                }
                            }}
                            getOptionLabel={(dashboardDataElement) => dashboardDataElement?.Name || "NA"}
                            options={dashboardData.map((dashboard) => {return dashboard.model || {}})}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                console.log(filtered)
                                if (params.inputValue !== '') {
                                    filtered.push({Name: `New Dashboard: ${params.inputValue}`});
                                }
                                return filtered;
                            }}
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
                </Grid>
                <Grid item xs={2}>
                    <Autocomplete 
                        fullWidth
                        value={props.chart.data.model?.Type || "NA"}
                        onChange={(event, value, reason, details) => {
                            if(!!value){
                                if(props.chart.data.model?.ChartGroup !== ChartGroups.TWO_DIMENSION){
                                    setChanged(true)
                                }
                                props.onChartModelChange(props.chart?.data?.model?.Id || "ID", {...props.chart.data.model, Type: value})
                                // props.onChartTypeChange(props.chart.model.Id || "id", value)
                            }
                        }}
                        options={getChartTypeOptions(props.chart.data?.model?.ChartGroup || "NA")}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Chart Type"
                                placeholder=""
                            />
                        )}
                    />
                </Grid>
            </Grid>
            {/* <Chart {...props.chart.options}/> */}
            {changed ? <></> : <Chart {...props.chart.options}/>}
            
        </Box>
    )
}

export default ChartFromContext