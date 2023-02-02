import DeleteIcon from '@mui/icons-material/Delete'
import { Autocomplete, Box, Checkbox, Divider, FormControlLabel, FormGroup, Grid, IconButton, TextField, Tooltip, Typography } from "@mui/material"
import React, { ChangeEvent } from "react"
import { getIconSxProperties } from "../../../../../common/components/application/compomentCssProperties"
import ChartOptionType, { ChartKindsType } from "../../../../../common/components/charts/types/ChartTypes"
import ConfirmationDialog from "../../../../../common/components/ConfirmationDialog"
import ChartType from "../../../../../enums/ChartType"
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext"
import GetChartTypeOptions from "./GetChartTypeOptions"


interface ChartOptionConfiguratorProps {
    selectedChartIndex?: number
}

const ChartOptionConfigurator = (props: ChartOptionConfiguratorProps) => {

    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const charts = buildActionContext?.charts
    const selectedChartIndex = props.selectedChartIndex !== undefined ? props.selectedChartIndex : 0
    const selectedChart = charts !== undefined && charts.length > 0 ? charts[selectedChartIndex]: undefined
    
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const handleDialogClose = () => setDialogOpen(false)
    const handleDialogOpen = () => setDialogOpen(true)

    const handleChartNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setBuildActionContext({
            type: 'ChangeChartName',
            payload: {
                chartIndex: selectedChartIndex,
                newName: event.target.value
            }
        })
    }

    const handleExposeDataChange = (event: React.SyntheticEvent, checked: boolean) => {
        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: selectedChartIndex,
                chartConfig: {
                    ...selectedChart!,
                    expose_data: checked
                }
            }
        })
    }

    const deleteChart = () => {
        handleDialogClose()
        buildActionContext?.charts?.splice(selectedChartIndex, 1)
    }

    const promptDeleteChart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation() 
        handleDialogOpen()
    }

    return (
        <>
            <ConfirmationDialog
                messageHeader={'Delete Chart'}
                messageToDisplay={`Chart '${selectedChart?.name}' will be deleted permanently. Proceed with deletion ?`}
                acceptString={'Delete'}
                declineString={'Cancel'}
                dialogOpen={dialogOpen}
                onDialogClose={handleDialogClose}
                onAccept={deleteChart}
                onDecline={handleDialogClose}
            />
            {selectedChart ? (
                <Grid>
                    <Box sx={{minHeight: '100%', minWidth: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Grid container justifyContent="center" p={1} alignItems="center" mt={1}>
                                    {getFormFieldName("Chart Name")}
                                    <Grid item xs={12} md={9}>
                                        <TextField fullWidth value={selectedChart?.name} label="Chart Name" onChange={handleChartNameChange}/>
                                    </Grid>
                                </Grid>
                                <Divider orientation="horizontal" sx={{minWidth: '100%'}}/>
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                    <Grid container justifyContent="center" p={1} alignItems="center" mt={1}>
                                        {getFormFieldName("Chart Type")}
                                        {getChartSelectionBox(selectedChart, setBuildActionContext, selectedChartIndex)}
                                    </Grid>
                                </Box>
                                <Divider orientation="horizontal" sx={{minWidth: '100%'}}/>
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <FormGroup row={true} sx={{display: 'webkit', minWidth: '100%'}}>
                                                <FormControlLabel control={
                                                                    <Checkbox sx={{ m:2, p:1 }} checked={selectedChart.expose_data}/>
                                                                } 
                                                                onChange={handleExposeDataChange} 
                                                                label="Expose Data (For more chart configurations)"
                                                    />
                                            </FormGroup>
                                        </Grid>    
                                    </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{minWidth: '100%', minHeight: '100%'}}>
                                    <GetChartTypeOptions selectedChart={selectedChart} selectedChartIndex={selectedChartIndex!}/>
                                </Box>
                            </Grid>
                            <Grid item xs={2}>
                                <Box>
                                    <Tooltip arrow placement='top' title="Delete">
                                        <IconButton sx={getIconSxProperties()} onClick={promptDeleteChart}> 
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid> 
                        </Grid>
                    </Box>
                </Grid>
            ) : (
                <></>
            )}
        </>
    )
}

export default ChartOptionConfigurator

function getChartSelectionBox(selectedChart: ChartOptionType, setBuildActionContext: SetBuldActionContext, selectedChartIndex: number) {
    return <Grid item xs={12} md={9}>
        <Autocomplete
            disableClearable={true}
            fullWidth
            filterSelectedOptions
            clearOnEscape
            value={selectedChart?.kind}
            options={Object.entries(ChartType).map(([key, value]) => value)}
            onChange={(event, value, reason) => {
                setBuildActionContext({
                    type: 'ChangeChartKind',
                    payload: {
                        chartIndex: selectedChartIndex,
                        chartKind: value as ChartKindsType
                    }
                })
            } }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Chart Type" />
            )} />
    </Grid>
}

function getFormFieldName(title: string) {
    return <Grid item xs={12} md={3}>
        <Typography sx={{
            fontFamily: "'SF Pro Display'",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "160%",
            letterSpacing: "0.103678px",
            color: "#253858"
        }}>
            {title}
        </Typography>
    </Grid>
}
