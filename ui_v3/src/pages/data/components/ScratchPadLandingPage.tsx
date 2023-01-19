import React, { useState } from 'react'
import DataLandingPage from './DataLandingPage'
import { fetchEntityBrowser } from '../../../data_manager/data_manager';
import { Box } from '@mui/system';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button } from '@mui/material';
import LineChart from '../../build_action/components/form-components/ChartsOption/LineCharts';
import { BarChart } from '../../../common/components/charts/bar/BarChart';
import BarCharts from '../../build_action/components/form-components/ChartsOption/BarCharts';

export const ScratchPadLandingPage = () => {
    const [dataColumns, setDataColumns] = useState([])

    React.useEffect(() => {
        fetchEntityBrowser('data').then((res: any) => {
            if (res) {
                setDataColumns(res)
            }
        })

    }, [])


    const ChartOption = ['bar', 'line', 'heatMap']

    const [dataSource, setDataSource] = useState<string>()
    const [dataTable, setDataTable] = useState<string>()
    const [selectChart, setSelectChart] = useState<string>()
    const [xAxisData, setXAxisData] = useState<string>()
    const [yAxisData, setYAxisData] = useState<string>()

    const [DisableDataSource, setDisableDataSource] = useState<boolean>(false)
    const [DisableDataTable, setDisableDataTable] = useState<boolean>(false)
    const [DisableChart, setDisableChart] = useState<boolean>(false)
    const [DisableAxis, setDisableAxis] = useState<boolean>(false)

    const [plot, setPlot] = useState<boolean>()
    const DataSourceHandleChange = (event: SelectChangeEvent) => {
        setDataSource(event.target.value as string)
    }
    const DataTableHandleChange = (event: SelectChangeEvent) => {
        setDataTable(event.target.value as string)
        setDisableDataSource(true)
    }
    const ChartOptionHandleChange = (event: SelectChangeEvent) => {
        setSelectChart(event.target.value as string)
        setDisableDataTable(true)
    }
    const xAxisOptionHandleChange = (event: SelectChangeEvent) => {
        setXAxisData(event.target.value as string)
        setDisableChart(true)
    }
    const yAxisOptionHandleChange = (event: SelectChangeEvent) => {
        setYAxisData(event.target.value as string)
        setDisableChart(true)
    }
    const plotButtonHandle = () => {
        setPlot(true)
    }

    const handleReset = () => {
        setPlot(false)
        setYAxisData(undefined)
        setXAxisData(undefined)
        setSelectChart(undefined)
        setDataTable(undefined)
        setDataSource(undefined)
        setDisableAxis(false)
        setDisableChart(false)
        setDisableDataTable(false)
        setDisableDataSource(false)
    }

    const ChartPreview = (chartType: string) => {
        switch (chartType) {
            case 'line':
                return (<LineChart yTitle={"Y Axis Name"} xTitle={"X Axis Name"} titleName={"Its a New chart"} XData={["a","b","c","d","e","f","g"]} YData={[1,2,3,4,3,2,1]} />);
            case 'bar':
                return (<BarCharts yTitle={"Y Axis Name"} xTitle={"X Axis Name"} titleName={"Its a New chart"} />);
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ width: '50%' }}>
                {/* Dropdown 1 for  data source
             Dropdown 2 for  tables
            list of charts - for now go with line chart, bar graph and basic charts
            dropdown for x axis and y axis
            plot chart */}
                <Button onClick={handleReset}>Reset</Button>
                {dataColumns.length > 0 ?
                    <Box>
                        <FormControl fullWidth>
                            <InputLabel>Select Data Provider</InputLabel>
                            <Select
                                value={dataSource}
                                onChange={DataSourceHandleChange}
                                disabled={DisableDataSource}
                            >
                                {dataColumns.map(src => { return (<MenuItem value={src?.name}>{src?.name}</MenuItem>) })}
                            </Select>
                        </FormControl>
                        {dataSource &&
                            <Box>
                                <FormControl fullWidth>
                                    <Select
                                        label={'Select Table'}
                                        value={dataTable}
                                        onChange={DataTableHandleChange}
                                        disabled={DisableDataTable}
                                    >
                                        {dataColumns.map(src => { return (<MenuItem value={src?.name}>{src?.name}</MenuItem>) })}
                                    </Select>
                                </FormControl>
                                {dataTable &&
                                    <Box>
                                        <FormControl fullWidth>
                                            <Select
                                                placeholder='Select Table'
                                                value={selectChart}
                                                onChange={ChartOptionHandleChange}
                                                disabled={DisableChart}
                                            >
                                                {ChartOption.map(src => { return (<MenuItem value={src}>{src}</MenuItem>) })}
                                            </Select>
                                        </FormControl>
                                        {selectChart &&
                                            <Box>
                                                <FormControl fullWidth>
                                                    <Select
                                                        placeholder='Select Table'
                                                        value={xAxisData}
                                                        onChange={xAxisOptionHandleChange}
                                                        disabled={DisableAxis}
                                                    >
                                                        {ChartOption.map(src => { return (<MenuItem value={src}>{src}</MenuItem>) })}
                                                    </Select>
                                                    <Select
                                                        placeholder='Select Table'
                                                        value={yAxisData}
                                                        onChange={yAxisOptionHandleChange}
                                                        disabled={DisableAxis}
                                                    >
                                                        {ChartOption.map(src => { return (<MenuItem value={src}>{src}</MenuItem>) })}
                                                    </Select>
                                                </FormControl>
                                                {xAxisData && yAxisData &&
                                                    <Button variant='contained' onClick={plotButtonHandle}>Plot</Button>
                                                }
                                            </Box>
                                        }
                                    </Box>
                                }
                            </Box>
                        }
                    </Box> :
                    <></>
                }
            </Box>
            <Box sx={{ width: '50%' }}>
                {selectChart && plot &&
                ChartPreview(selectChart)
            }
            </Box>
        </Box>

    )
}

export default ScratchPadLandingPage