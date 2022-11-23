import React from "react"
import ChartOptionType, { BarChartOptionType, ClubbedHistogramOptionsType, StackedHistogramOptionsType, LineChartOptionType, PieChartOptionType, RadialPolarChartOptionsType, ScatterChartOptionType, SegmentLineChartOptionsType, HeatMapDataframeOptionsType, MultipleSeriesScatterOptionsType, RadarChartOptionsType } from "../../../../common/components/charts/types/ChartTypes"
import { ActionContextActionParameterDefinitionWithTags, BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext"
import { Autocomplete, Box, createFilterOptions, Divider, Grid, TextField, Typography } from "@mui/material"
import ActionParameterDefinitionTag from "../../../../enums/ActionParameterDefinitionTag"
import { ActionParameterDefinition } from "../../../../generated/entities/Entities"


interface GetChartTypeOptionProps {
    selectedChart: ChartOptionType,
    selectedChartIndex: number
}

const GetChartTypeOptions = (props: GetChartTypeOptionProps) => {
    const buildActionContext = React.useContext(BuildActionContext)
    

    switch(props.selectedChart.kind) {
        case 'bar': return <XYChartOptions selectedChart={props.selectedChart} selectedChartIndex={props.selectedChartIndex}/>
        case 'line': return <XYChartOptions selectedChart={props.selectedChart} selectedChartIndex={props.selectedChartIndex}/>
        case 'scatter': return <XYChartOptions selectedChart={props.selectedChart} selectedChartIndex={props.selectedChartIndex}/>
        case 'pie': return <PieChartOptions selectedChart={props.selectedChart} selectedChartIndex={props.selectedChartIndex}/>
        case 'segment': return <XYSegmentOptions selectedChart={props.selectedChart} selectedChartIndex={props.selectedChartIndex}/>
        case 'radial_polar_chart': return <XYSegmentOptions selectedChart={props.selectedChart} selectedChartIndex={props.selectedChartIndex}/>
        case 'stacked_histogram': return <XYListOptions selectedChart={props.selectedChart} selectedChartIndex={props.selectedChartIndex}/>
        case 'clubbed_histogram': return <XYListOptions selectedChart={props.selectedChart} selectedChartIndex={props.selectedChartIndex}/>
        case 'heat_map_dataframe': return <XListYOptions selectedChart={props.selectedChart} selectedChartIndex={props.selectedChartIndex}/>
        case 'multiple_series_scatter': return <XYListOptions selectedChart={props.selectedChart} selectedChartIndex={props.selectedChartIndex}/>
        case 'radar_chart': return <DimensionAxisOptions  selectedChart={props.selectedChart} selectedChartIndex={props.selectedChartIndex}/>
        case 'time_series': return <></> // TODO: Forecast from sql?
        
    }

    return <></>
}

export const XYChartOptions = (props: {selectedChart: BarChartOptionType | LineChartOptionType | ScatterChartOptionType, selectedChartIndex: number}) => {
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const onXAxisValueChange = (value: string) => {
        const newChart = {
            ...props.selectedChart,
            options: {
                ...props.selectedChart.options,
                x: value
            }
        }

        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex,
                chartConfig: newChart
            }
        })
    }

    const onYAxisValueChange = (value: string) => {
        const newChart = {
            ...props.selectedChart,
            options: {
                ...props.selectedChart.options,
                y: value
            }
        }

        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex,
                chartConfig: newChart
            }
        })
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, p: 1}}>
            <LabelWithAutocomplete label="X Axis" value={props.selectedChart?.options?.x} onValueChange={onXAxisValueChange}/>
            <Divider orientation="horizontal" sx={{minWidth: '100%'}}/>
            <LabelWithAutocomplete label="Y Axis" value={props.selectedChart?.options?.y} onValueChange={onYAxisValueChange}/>
        </Box>
    )
}

export const PieChartOptions = (props: {selectedChart: PieChartOptionType, selectedChartIndex: number}) => {

    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const onValueColumnChange = (value: string) => {
        const newChart: PieChartOptionType = {
            ...props.selectedChart,
            options: {
                ...props.selectedChart.options,
                y: value
            }
        }

        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex,
                chartConfig: newChart
            }
        })
    } 

    const onDimensionColumnChange = (value: string) => {
        const newChart: PieChartOptionType = {
            ...props.selectedChart,
            options: {
                ...props.selectedChart.options,
                legends: value
            }
        }

        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex,
                chartConfig: newChart
            }
        })
    } 
    

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, p: 1}} >
            <LabelWithAutocomplete label="Value Column" value={props.selectedChart?.options?.y} onValueChange={onValueColumnChange}/>
            <Divider orientation="horizontal" sx={{minWidth: '100%'}}/>
            <LabelWithAutocomplete label="Legend Column" value={props.selectedChart?.options?.legends} onValueChange={onDimensionColumnChange}/>
        </Box>
    )
}

export const XYSegmentOptions = (props: {selectedChart: SegmentLineChartOptionsType | RadialPolarChartOptionsType, selectedChartIndex: number}) => {

    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const onXAxisValueChange = (value: string) => {
        const newChart: SegmentLineChartOptionsType | RadialPolarChartOptionsType = {
            ...props.selectedChart,
            options: {
                ...props.selectedChart.options,
                x: value
            }
        }

        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex,
                chartConfig: newChart
            }
        })
    }

    const onYAxisValueChange = (value: string) => {
        const newChart: SegmentLineChartOptionsType | RadialPolarChartOptionsType = {
            ...props.selectedChart,
            options: {
                ...props.selectedChart.options,
                y: value
            }
        }

        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex,
                chartConfig: newChart
            }
        })
    }

    const onSegmentColumnChange = (value: string) => {
        const newChart: SegmentLineChartOptionsType | RadialPolarChartOptionsType = {
            ...props.selectedChart,
            options: {
                ...props.selectedChart.options,
                segments: value
            }
        }

        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex,
                chartConfig: newChart
            }
        })
    }


    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
            <LabelWithAutocomplete label="X Axis" value={props.selectedChart?.options?.x} onValueChange={onXAxisValueChange}/>
            <Divider orientation="horizontal" sx={{minWidth: '100%'}}/>
            <LabelWithAutocomplete label="Y Axis" value={props.selectedChart?.options?.y} onValueChange={onYAxisValueChange}/>
            <Divider orientation="horizontal" sx={{minWidth: '100%'}} />
            <LabelWithAutocomplete label="Segment Column" value={props.selectedChart?.options?.segments} onValueChange={onSegmentColumnChange}/>
        </Box>
    )
}

export const XYListOptions = (props: {selectedChart: ClubbedHistogramOptionsType | StackedHistogramOptionsType | MultipleSeriesScatterOptionsType, selectedChartIndex: number}) => {

    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const onXAxisValueChange = (value: string) => {
        const newChart: ClubbedHistogramOptionsType | StackedHistogramOptionsType | MultipleSeriesScatterOptionsType= {
            ...props.selectedChart,
            options: {
                ...props.selectedChart.options,
                x: value
            }
        }

        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex,
                chartConfig: newChart
            }
        })
    }

    const onYAxisValuesChange = (value: string[]) => {
        const newChart: ClubbedHistogramOptionsType | StackedHistogramOptionsType | MultipleSeriesScatterOptionsType= {
            ...props.selectedChart,
            options: {
                ...props.selectedChart.options,
                y_columns: value
            }
        }

        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex,
                chartConfig: newChart
            }
        })
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, p: 1}}>
            <LabelWithAutocomplete label="X Axis" value={props.selectedChart?.options?.x} onValueChange={onXAxisValueChange}/>
            <Divider orientation="horizontal" sx={{minWidth: '100%'}}/>
            <LabelWithListAutocomplete label="Y-Axis Columns" value={props.selectedChart?.options?.y_columns || []} onValueChange={onYAxisValuesChange}/>
        </Box>
    )
}

export const XListYOptions = (props: {selectedChart: HeatMapDataframeOptionsType, selectedChartIndex: number}) => {
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const onXAxisValuesChange = (value: string[]) => {
        const newChart: HeatMapDataframeOptionsType = {
            ...props.selectedChart,
            options: {
                ...props.selectedChart.options,
                x_columns: value
            }
        }
        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex,
                chartConfig: newChart
            }
        })
    }

    const onYAxisValueChange = (value: string) => {
        const newChart: HeatMapDataframeOptionsType = {
            ...props.selectedChart,
            options: {
                ...props.selectedChart.options,
                y: value
            }
        }
        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex,
                chartConfig: newChart
            }
        })
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, p: 1}}>
            <LabelWithListAutocomplete label="X-Axis Columns" value={props?.selectedChart?.options?.x_columns || []} onValueChange={onXAxisValuesChange}/>
            <Divider orientation="horizontal" sx={{minWidth: '100%'}}/>
            <LabelWithAutocomplete label="Y-Axis" value={props?.selectedChart?.options?.y} onValueChange={onYAxisValueChange}/>
        </Box>
    )
}

export const DimensionAxisOptions = (props: {selectedChart: RadarChartOptionsType, selectedChartIndex: number}) => {
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const onDimensionColumnChange = (value: string) => {
        const newChart: RadarChartOptionsType = {
            ...props.selectedChart,
            options: {
                ...props.selectedChart.options,
                dimension_column: value
            }
        }
        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex,
                chartConfig: newChart
            }
        })
    }

    const onAxisColumnsValueChange = (value: string[]) => {
        const newChart: RadarChartOptionsType = {
            ...props.selectedChart,
            options: {
                ...props.selectedChart.options,
                axis_columns: value
            }
        }
        setBuildActionContext({
            type: 'SetChartConfigForIndex',
            payload: {
                chartIndex: props.selectedChartIndex,
                chartConfig: newChart
            }
        })
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, p: 1}}>
            <LabelWithAutocomplete label="Dimension Column" value={props?.selectedChart?.options?.dimension_column} onValueChange={onDimensionColumnChange}/>
            <Divider orientation="horizontal" sx={{minWidth: '100%'}}/>
            <LabelWithListAutocomplete label="Axis Columns" value={props?.selectedChart?.options?.axis_columns || []} onValueChange={onAxisColumnsValueChange}/>
        </Box>
    )
}


export const LabelWithAutocomplete = (props: {label: string, value?: string, onValueChange: (value: string) => void}) => {

    const filter = createFilterOptions<ActionParameterDefinition>()
    const buildActionContext = React.useContext(BuildActionContext)
    const parameters = buildActionContext.actionTemplateWithParams?.[0]?.parameterWithTags?.filter(apd => apd.parameter?.Tag === ActionParameterDefinitionTag.COLUMN_NAME)

    const getCurrentValue = () => {
        const selectedParameter = parameters?.find?.(apd => `{${apd.parameter?.ParameterName}}` === props.value)

        if(selectedParameter === undefined && !!props.value) {
            const virtualParameter: ActionContextActionParameterDefinitionWithTags = {parameter: {ParameterName: props.value, Id: "NA"}, tags: [], existsInDB: false}
            return {
                currentOptionValue: {ParameterName: props.value, Id: "NA"},
                allOptions: [...parameters, virtualParameter]
            }
        }

        return {currentOptionValue: selectedParameter?.parameter, allOptions: parameters}
    }


    const {currentOptionValue, allOptions} = getCurrentValue()

    return (
        <Grid container gap={1} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={2}>
                <Typography sx={{
                    minWidth: '100%',
                    fontFamily: "'SF Pro Display'",
                    fontStyle: "normal",
                    fontWeight: 600,
                    fontSize: "12.4413px",
                    lineHeight: "160%",
                    letterSpacing: "0.103678px",
                    color: "#253858",
                    textOverflow: 'ellipsis'
                }}>
                    {props.label}
                </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
                <Autocomplete 
                    options={allOptions.map(apd => apd.parameter)}
                    getOptionLabel={(option) => option.ParameterName || "NA"}
                    value={currentOptionValue}
                    fullWidth
                    filterSelectedOptions
                    selectOnFocus
                    clearOnBlur
                    filterOptions={(options, params) => {
                        console.log(options)
                        const filtered = filter(options, params);
                        console.log(filtered)
                        if (params.inputValue !== '') {
                            filtered.push({ ParameterName: `${params.inputValue} (Hard Coded)`, Id: "NA" });
                        }
                        return filtered;
                    }}
                    onChange={(event, value, reason, details) => {
                        const chartOptionValue = value?.Id === "NA" ? value?.ParameterName?.substring(0, value?.ParameterName?.length - 13) : `{${value?.ParameterName}}`
                        props.onValueChange(chartOptionValue || "")
                    }}
                    renderInput={(params) => {
                        return <TextField {...params} sx={{borderRadius: '0px'}} variant="outlined" label="Select Parameter"/>
                    }}
                />
            </Grid>
        </Grid>
    )
}

export const LabelWithListAutocomplete = (props: {label: string, value: string[], onValueChange: (value: string[]) => void}) => {
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const filter = createFilterOptions<ActionParameterDefinition>()
    const buildActionContext = React.useContext(BuildActionContext)
    const parameters = buildActionContext.actionTemplateWithParams?.[0]?.parameterWithTags?.filter(apd => apd.parameter?.Tag === ActionParameterDefinitionTag.COLUMN_NAME)

    const getCurrentValue = () => {
        const selectedParameters: ActionParameterDefinition[] = []
        const allOptions = parameters
        props.value?.forEach(value => {
            const currentParameter = parameters?.find(apd => `{${apd.parameter?.ParameterName}}` === value)
            if(currentParameter === undefined) {
                const virtualParameter: ActionContextActionParameterDefinitionWithTags = {parameter: {ParameterName: value, Id: "Already_added"}, tags: [], existsInDB: false}
                allOptions.push(virtualParameter)
                selectedParameters.push({ParameterName: value, Id: "Already_added"})
            } else {
                selectedParameters.push(currentParameter.parameter)
            }
        })

        return {
            currentOptionValues: selectedParameters,
            allOptions: allOptions
        }
    }


    const {currentOptionValues, allOptions} = getCurrentValue() 
    
    return (
        <Grid container gap={1} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={2}>
                <Typography sx={{
                    minWidth: '100%',
                    fontFamily: "'SF Pro Display'",
                    fontStyle: "normal",
                    fontWeight: 600,
                    fontSize: "12.4413px",
                    lineHeight: "160%",
                    letterSpacing: "0.103678px",
                    color: "#253858",
                    textOverflow: 'ellipsis'
                }}>
                    {props.label}
                </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
                <Autocomplete 
                    fullWidth
                    options={allOptions.map(option => option.parameter)}
                    getOptionLabel={parameter => parameter.ParameterName || "NA"}
                    multiple
                    value={currentOptionValues}
                    filterSelectedOptions={true}
                    disableCloseOnSelect
                    renderInput={(params) => <TextField {...params} label="Select Parameters"/>}
                    limitTags={2}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        console.log(filtered)
                        if (params.inputValue !== '') {
                            filtered.push({ ParameterName: `${params.inputValue} (Hard Coded)`, Id: "NA" });
                        }
                        return filtered;
                    }}
                    onChange={(event, value) => {
                        const newValue = value?.map(param => param?.Id === "NA" ? param?.ParameterName?.substring(0, param?.ParameterName?.length - 13) || "NA" : param?.Id === 'Already_added' ? param?.ParameterName || "NA" : `{${param?.ParameterName || "NA"}}`)
                        props.onValueChange(newValue)
                    }}
                />
            </Grid>
        </Grid>
    )
}

export default GetChartTypeOptions