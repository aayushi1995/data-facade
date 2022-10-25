import React, { ChangeEvent } from "react"
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext"
import { Autocomplete, Box, Divider, Grid, TextField, Typography, Card, FormGroup, FormControlLabel, Checkbox } from "@mui/material"
import ChartType from "../../../../enums/ChartType"
import GetChartTypeOptions from "./GetChartTypeOptions"
import { ChartKindsType } from "../../../../common/components/charts/types/ChartTypes"


interface ChartOptionConfiguratorProps {
    selectedChartIndex?: number
}

const ChartOptionConfigurator = (props: ChartOptionConfiguratorProps) => {

    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const selectedChart = props.selectedChartIndex !== undefined ? buildActionContext?.charts?.[props.selectedChartIndex] : undefined
    
    const handleChartNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setBuildActionContext({
            type: 'ChangeChartName',
            payload: {
                chartIndex: props.selectedChartIndex || 0,
                newName: event.target.value
            }
        })
    }

    const handleExposeDataChange = (event: React.SyntheticEvent, checked: boolean) => {
        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex || 0,
                chartConfig: {
                    ...selectedChart!,
                    expose_data: checked
                }
            }
        })
    }

    return (
        <>
            {selectedChart ? (
                <Box sx={{minHeight: '100%', minWidth: '100%', display: 'flex', flexDirection: 'column'}}>
                    <Grid container justifyContent="center" p={1} alignItems="center" mt={1}>
                        <Grid item xs={12} md={3}>
                            <Typography sx={{
                                fontFamily: "'SF Pro Display'",
                                fontStyle: "normal",
                                fontWeight: 600,
                                lineHeight: "160%",
                                letterSpacing: "0.103678px",
                                color: "#253858"
                            }}>
                                Name
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <TextField fullWidth value={selectedChart?.name} label="Chart Name" onChange={handleChartNameChange}/>
                        </Grid>
                    </Grid>
                    <Divider orientation="horizontal" sx={{minWidth: '100%'}}/>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                        <Grid container justifyContent="center" p={1} alignItems="center" mt={1}>
                            <Grid item xs={12} md={3}>
                                <Typography sx={{
                                    fontFamily: "'SF Pro Display'",
                                    fontStyle: "normal",
                                    fontWeight: 600,
                                    lineHeight: "160%",
                                    letterSpacing: "0.103678px",
                                    color: "#253858"
                                }}>
                                    Type
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={9}>
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
                                                chartIndex: props.selectedChartIndex || 0,
                                                chartKind: value as ChartKindsType
                                            }
                                        })
                                    }}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params}
                                            label="Chart Type"
                                        />
                                    )}/>
                            </Grid>
                        </Grid>
                        <Card sx={{
                            background: "#F8F8F8",
                            boxShadow:
                            "0px 0.691186px 1.38237px rgba(0, 0, 0, 0.12), 0px 0px 0px 0.691186px rgba(0, 0, 0, 0.05)",
                            borderRadius: "5px",
                            m: 2,
                            p: 3,
                        }}>
                            <FormGroup row={true} sx={{display: 'webkit', minWidth: '100%'}}>
                                <FormControlLabel control={<Checkbox checked={selectedChart.expose_data}/>} onChange={handleExposeDataChange} label="Expose Data (For more chart configurations)"/>
                            </FormGroup>
                        </Card>
                    </Box>
                    <Divider orientation="horizontal" sx={{minWidth: '100%'}}/>
                    <Box sx={{minWidth: '100%', minHeight: '100%'}}>
                        <GetChartTypeOptions selectedChart={selectedChart} selectedChartIndex={props.selectedChartIndex!}/>
                    </Box>
                </Box>
            ) : (
                <></>
            )}
        </>
    )
}

export default ChartOptionConfigurator