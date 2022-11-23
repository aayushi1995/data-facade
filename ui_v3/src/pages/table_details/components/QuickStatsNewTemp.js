import React, { useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button, Card, Grid, Menu, MenuItem, Select, Table, TableCell, TableHead, TableRow, Link } from '@mui/material'
import ColumnChartVisualizer from './../../../common/components/ColumnChartVisualizer'
import ColumnRangeChartVisualizer from './../../../common/components/ColumnRangeChartVisualizer'
import { makeStyles } from '@mui/styles'
import NoData from '../../../common/components/NoData';
import LoadingIndicator from './../../../common/components/LoadingIndicator'
import { useMutation } from 'react-query'
import ElementFrequencyTable from './ElementFrequencyTable'
import SelectOption from './../../../common/components/SelectOption'
import Search from './../../../common/components/Search'
import AppContext from "../../../utils/AppContext";
import { useRetreiveData } from "../../../data_manager/data_manager";
import { DataGrid } from "@mui/x-data-grid";
import { v4 as uuidv4 } from 'uuid'
import {getActionExecutionParsedOutput} from '../../../data_manager/entity_data_handlers/action_execution_data'
import { CustomToolbar } from "../../../common/components/CustomToolbar";
const endPoint = require("./../../../common/config/config").FDSEndpoint

const useStyles = makeStyles(() => ({
    link: {
        textDecoration: 'none'
    }
}));


const filterOptionItems = [
    {
        "value": "Instance Name",
        "display": "Instance Name"
    },
    {
        "value": "Definition Name",
        "display": "Definition Name"
    }
]



const RenderSingleValueChart = (props) => {

    const defaultOptions = {

        title: {
            text: ''
        },
        yAxis: {
            title: {
                text: 'Value'
            }
        },

        xAxis: {
            categories: []

        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },

        series: [{
            name: 'Value',
            data: []
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    }

    const myOptions = JSON.parse(JSON.stringify(defaultOptions))

    let actionInstance = props.actionInstances

    const completedActionExecutions = actionInstance.ActionExecutions.filter((execution) => execution.Status === 'Completed')
    completedActionExecutions.sort((a, b) => {
        return a.ExecutionCompletedOn - b.ExecutionCompletedOn
    })
    if (completedActionExecutions.length > 1) {
        completedActionExecutions.forEach((execution) => {
            const output = parseFloat(JSON.parse(execution.Output).Value)
            myOptions.series[0].data.push(output)
            myOptions.xAxis.categories.push((new Date(execution.ExecutionCompletedOn)).toUTCString())
        })

        return (
            <ColumnChartVisualizer options={myOptions} />
        )
    } else if (completedActionExecutions.length === 1) {
        const output = parseFloat(JSON.parse(completedActionExecutions[0].Output).Value)
        const executedOn = new Date(completedActionExecutions[0].ExecutionCompletedOn).toUTCString()
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Executed On</TableCell>
                        <TableCell>Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableRow>
                    <TableCell>{executedOn}</TableCell>
                    <TableCell>{output}</TableCell>
                </TableRow>
            </Table>
        )
    } else {
        return (<>No visualization found</>)
    }

}

const RenderLineChart = (props) => {
    console.log(props)
    const actionExecutions = props?.actionInstances?.ActionExecutions?.filter(actionExecution => actionExecution?.Status === 'Completed')
    console.log(actionExecutions)

    const defaultOptions = {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Cohort Retention Table'
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        series: [],
        yAxis: {
            title: {
                text: 'Cohort Retention'
            }
        },

        xAxis: {
            title: {
                text: 'Quarter'
            },
            categories: []
        }
    }

    var myOptions = defaultOptions
    actionExecutions.forEach(actionExecution => {
        const output = JSON.parse(actionExecution?.Output)
        myOptions.title.text = actionExecution?.ActionInstanceName
        console.log(output)
        const data = output?.Value?.data
        const schema = output?.Value?.schema
        data?.forEach(column => {
            myOptions.xAxis.categories.push(column?.QuarterName)
            let seriesData = []
            data?.forEach(quarter => {
                seriesData.push(column[quarter?.QuarterName])
            })
            myOptions.series.push({
                name: column?.QuarterName,
                data: seriesData
            })
        })
    })
    console.log(myOptions)
    return (
        <ColumnRangeChartVisualizer options={myOptions} />
    )
}

const RenderHistogramChart = (props) => {

    const defaultOptions = {
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: [],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Values'
            }
        },
        tooltip: {
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: []
    }

    const myOptions = JSON.parse(JSON.stringify(defaultOptions))
    let actionInstance = props.actionInstances

    const completedActionExecutions = actionInstance.ActionExecutions.filter((execution) => execution?.Status === 'Completed')
    completedActionExecutions?.sort((a, b) => {
        return a.ExecutionCompletedOn - b.ExecutionCompletedOn
    })
    const myData = []
    completedActionExecutions?.forEach((execution) => {
        const output = parseFloat(JSON.parse(execution.Output).Value)
        myData.push(output)
        myOptions.xAxis.categories.push((new Date(execution.ExecutionCompletedOn)).toUTCString())
    })
    myOptions.series.push({ name: 'value', data: myData })

    return (
        <ColumnChartVisualizer options={myOptions} />
    )


}

const RenderMinMaxChart = (props) => {

    const defaultOptions = {

        chart: {
            type: 'columnrange',
            inverted: true
        },

        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },

        xAxis: {
            categories: []
        },

        yAxis: {
            title: {
                text: 'Values'
            }
        },

        plotOptions: {
            series: {
                colorByPoint: true,
                pointWidth: 35
            },
            columnrange: {
                dataLabels: {
                    enabled: true,
                    format: '{y}'
                }
            }
        },

        legend: {
            enabled: false
        },

        series: [{
            name: '',
            data: []
        }]

    }

    const myOptions = JSON.parse(JSON.stringify(defaultOptions))
    myOptions.series[0].name = props.actionDefinition.ActionTemplate
    const actionInstance = props.actionInstances

    let latestExecution

    const completedActionExecutions = actionInstance.ActionExecutions.filter((execution) => execution.Status === 'Completed')
    if (completedActionExecutions.length > 0) {
        latestExecution = JSON.parse(JSON.stringify(completedActionExecutions[0]))
        completedActionExecutions.forEach((execution) => {
            if (execution.ExecutionStartedOn > latestExecution.ExecutionStartedOn) latestExecution = JSON.parse(JSON.stringify(execution))
        })
        myOptions.xAxis.categories.push(`${actionInstance.ActionInstance.RenderedTemplate} ${new Date(latestExecution.ExecutionStartedOn * 1000).toDateString()}`)
        const output = JSON.parse(latestExecution.Output)
        console.log("output ", output)
        myOptions.series[0].data.push([parseInt(output.Value.MIN), parseInt(output.Value.MAX)])
    }


    return (
        <ColumnRangeChartVisualizer options={myOptions} />
    )
}

const RenderElementFrequencyTable = (props) => {

    let frequencyData = []
    const actionInstance = props.actionInstances


    let latestExecution;
    const completedActionExecutions = actionInstance.ActionExecutions.filter((execution) => execution.Status === 'Completed')
    if (completedActionExecutions.length > 0) {
        latestExecution = JSON.parse(JSON.stringify(completedActionExecutions[0]))
        completedActionExecutions.forEach((execution) => {
            if (execution.ExecutionStartedOn > latestExecution.ExecutionStartedOn) latestExecution = JSON.parse(JSON.stringify(execution))
        })
        const output = JSON.parse(latestExecution.Output)
        frequencyData = []
        Object.keys(output.Value).forEach((key) => {
            frequencyData.push({
                "stat": key,
                "value": output.Value[key]
            })
        })
    }

    return (
        <ElementFrequencyTable statsData={frequencyData} />
    )

}

const RenderHistogramChartElementFreq = (props) => {

    const defaultOptions = {
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: [],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Values'
            }
        },
        tooltip: {
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: []
    }

    const myOptions = JSON.parse(JSON.stringify(defaultOptions))
    let actionInstance = props.actionInstances

    const completedActionExecutions = actionInstance.ActionExecutions.filter((execution) => execution.Status === 'Completed')
    completedActionExecutions.sort((a, b) => {
        return a.ExecutionCompletedOn - b.ExecutionCompletedOn
    })

    const allCategories = new Set()
    completedActionExecutions.forEach((execution) => {
        const op = JSON.parse(execution.Output)
        Object.keys(op.Value).forEach((key) => {
            allCategories.add(key)
        })
    })
    allCategories.forEach((category) => {
        myOptions.xAxis.categories.push(category)
    })

    completedActionExecutions.forEach((execution) => {
        const op = JSON.parse(execution.Output)
        const keys = Object.keys(op.Value)
        const dataarray = []
        allCategories.forEach((category) => {
            if (keys.indexOf(category) >= 0) {
                dataarray.push(op.Value[category])
            } else dataarray.push(null)
        })
        myOptions.series.push({ "name": new Date(execution.ExecutionCompletedOn).toUTCString(), "data": dataarray })
    })

    return (<ColumnChartVisualizer options={myOptions} />)

}

const RenderCharts = (props) => {
    if (props.action.ActionDefinition.PresentationFormat === 'single_value') {
        if (props.visualizationState === 'line_chart') {
            return (
                <RenderSingleValueChart actionInstances={props.instance} actionDefinition={props.actionDefinition} />
            )
        } else if (props.visualizationState === 'histogram') {
            return (
                <RenderHistogramChart actionInstances={props.instance} actionDefinition={props.actionDefinition} />
            )
        } else {
            return (
                <RenderHistogramChart actionInstances={props.instance} actionDefinition={props.actionDefinition} />
            )
        }

    } else if (props.action.ActionDefinition.PresentationFormat === 'min_max') {
        if (props.visualizationState === 'column_range_chart') {
            return (
                <RenderMinMaxChart actionInstances={props.instance} actionDefinition={props.actionDefinition} />
            )
        } else {
            return (<RenderMinMaxChart actionInstances={props.instance} actionDefinition={props.actionDefinition} />)
        }

    } else if (props.action.ActionDefinition.PresentationFormat === 'element_frequency') {
        if (props.visualizationState === 'frequency_table') {
            return (
                <RenderElementFrequencyTable actionInstances={props.instance}
                    actionDefinition={props.actionDefinition} />
            )
        } else if (props.visualizationState === 'histogram') {
            return (
                <RenderHistogramChartElementFreq actionInstances={props.instance}
                    actionDefinition={props.actionDefinition} />
            )
        } else {
            return (<div>No visualization found</div>)
        }
    } else if (props.action.ActionDefinition.PresentationFormat === 'table_value') {
        return (
            <Grid container>
                {props?.visualizationState === 'table' ? (
                    <Grid item xs={12}>
                        <RenderDataGrid actionInstances={props.instance}
                            actionDefinition={props.actionDefinition} />
                    </Grid>) :
                    (
                        <Grid item xs={12}>
                            <RenderLineChart actionInstances={props.instance}
                                actionDefinition={props.actionDefinition} />
                        </Grid>)
                }
            </Grid>
        )
    } else {
        return (<></>)
    }
}

const RenderDataGrid = (props) => {
    const [options, setOptions] = React.useState([])
    const fetchActionExecutionWithOutputMutation = useMutation(getActionExecutionParsedOutput)
    
    React.useEffect(() => {
        const actionInstance = props?.actionInstances
        const completedActionExecutions = actionInstance?.ActionExecutions?.filter(actionExecution => actionExecution.Status === 'Completed')
        completedActionExecutions.forEach(actionExecution => {
            fetchActionExecutionWithOutputMutation.mutate(actionExecution, {
                onSuccess: (data, variable, context) => {
                    const columns = data.Output.schema.map(col => { return {...col, resizable: true, minWidth: 150, flex: 1}})
                    const rows = data.Output.data.map((row, index) => {return {...row, id: index}})
                    console.log(rows, columns)
                    setOptions(oldOptions => {
                        return [...oldOptions, {columns: columns, rows: rows}]
                    })
                }
            })
        })
    }, [])

    console.log(options)

    if (options?.length > 0) {
        const components = options.map(option => {
            return (
                <DataGrid
                    rows={option?.rows}
                    columns={option?.columns}
                    autoHeight
                    disableSelectionOnClick
                    autoPageSize
                    pageSize={10}
                    components={{ Toolbar: CustomToolbar([]) }}
                    rowsPerPageOptions={[10]}
                ></DataGrid>
            )
        })
        if (components !== undefined) {
            console.log(components)
            return components
        }
        else {
            return <></>
        }
    }
    else {
        return <></>
    }
}





export const ActionInstanceCard = (props) => {
    const appcontext = useContext(AppContext);
    const email = appcontext.userEmail
    const token = appcontext.token
    const classes = useStyles()
    const names = [];
    props.action.ActionInstances.forEach((instance) => names.push(instance.ActionInstance.Name))
    const actionInstancesToShow = []
    for (let i = 0; i < Math.min(names.length, 5); i++) {
        actionInstancesToShow.push(names[i])
    }
    // hard-coding for demo
    const [visualizationState, setVisulationState] = React.useState('table')

    const saveVisualizationMutation = useMutation((instance) => {
        const config = {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "entityName": instance.entityName,
                "actionProperties": {
                    "newProperties": instance.newProperties,
                    "filter": instance.filter
                }
            })
        }
        let response = fetch(endPoint + "/entity?email=" + email, config).then(res => res.json())
        return response
    })


    const handleVisualizationState = (event) => {
        setVisulationState(event.target.value)
    }

    const handleSaveVisualization = () => {

        saveVisualizationMutation.mutate({
            "entityName": "ActionInstance",
            "filter": {
                "Id": props.instance.ActionInstance.Id
            },
            "newProperties": {
                "Id": props.instance.ActionInstance.Id,
                "VisualizationFormat": visualizationState
            }
        })

    }


    return (
        <Card variant="outlined" elevation={0} style={{ padding: 20 }}>
            <Grid container spacing={2} style={{ display: 'flex', alignContent: 'center' }}>
                <Grid item xs={12}>
                    <Grid container spacing={2} style={{
                        display: 'flex',
                        alignContent: 'center',
                        justifySelf: 'flex-end',
                        justifyContent: 'flex-end'
                    }}>
                        <Grid item xs={2} style={{ display: 'flex' }}>
                            <Select
                                fullWidth
                                variant="outlined"
                                onChange={handleVisualizationState}
                                value={visualizationState}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="table">Table</MenuItem>
                                <MenuItem value="chart">Chart</MenuItem>
                                {/* {(PresentationFormatCollection[props.action.ActionDefinition.PresentationFormat] !== undefined) ? (PresentationFormatCollection[props.action.ActionDefinition.PresentationFormat].map((val) => (
                                    <MenuItem value={val}>{val}</MenuItem>
                                ))) : (<></>)} */}
                            </Select>
                        </Grid>
                        <Grid item xs={9} style={{
                            display: 'flex',
                            alignContent: 'center',
                            alignSelf: 'center',
                            justifyContent: 'center'
                        }}>
                            <Link to={{
                                pathname: '/customizations',
                                state: {
                                    "search": props.instance.ActionInstance.Id,
                                    "from": "table_level_quick_stats",
                                    "filter": "Action Instance Id",
                                    "tabIndex": 3
                                }
                            }}
                                component={RouterLink}
                                className={classes.link}
                            >
                                {props?.instance?.ActionInstance?.DisplayName}
                            </Link>


                        </Grid>
                        <Grid item xs={1} style={{
                            display: 'flex',
                            alignContent: 'center',
                            alignSelf: 'center',
                            justifyContent: 'flex-end'
                        }}>
                            <Button variant="outlined" style={{ backgroundColor: 'green', color: 'white' }}
                                onClick={handleSaveVisualization}>
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <RenderCharts action={props.action} instance={props.instance}
                        actionDefinition={props.action.ActionDefinition}
                        visualizationState={visualizationState} />
                </Grid>
            </Grid>
        </Card>
    )

}
export const useTablePropertiesWithProfilingActionsQuery = (tableId) => useRetreiveData('TableProperties',
    {
        "filter": {
            "Id": tableId
        },
        "withProfilingActions": true
    },
    { enabled: !!tableId });

const QuickStatsNewTemp = (props) => {

    const {
        isLoading: actionDefinitionLoading,
        error: actionDefinitionError,
        data: actionDefinitionData
    } = useTablePropertiesWithProfilingActionsQuery(props.tableId);

    if (actionDefinitionLoading) {
        return <LoadingIndicator />
    } else if (actionDefinitionError) {
        return <NoData />
    } else {
        if (actionDefinitionData === undefined || actionDefinitionData.length === 0) {
            return (<NoData />)
        } else {
            return (
                <QuickStatsNewTempWrapper actionDefinitionData={actionDefinitionData} />
            )
        }
    }
}
export const QuickStatsNewTempWrapper = (props) => {
    const data = []
    if (props.actionResultList) {
        data.push(...props.actionResultList);
    } else {
        props.actionDefinitionData[0]?.Profiling?.ActionEntities?.forEach((actions) => {
            console.log(actions)
            actions?.ActionInstances?.forEach((instance) => {
                data.push({ action: actions, instance: instance })
            })
        })
    }

    const searchValue = (props.location !== undefined && props.location.state !== undefined) ? props.location.state.search : ""
    const [searchQuery, setSearchQuery] = React.useState("")
    const [filterOption, setFilterOption] = React.useState("Instance Name")
    const [searchedData, setSearchedData] = React.useState({ data: data })


    const searchQueryHandler = (event) => {
        setSearchQuery(event.target.value)
    }

    const filterOptionHandler = (event) => {
        setFilterOption(event.target.value)
    }

    const searchResults = (myData, searchVal) => {
        console.log(searchVal)
        return myData?.filter(elem => {
            switch (filterOption) {
                case "Instance Name":
                    return (elem.instance.ActionInstance.DisplayName || "").toLowerCase().search(searchVal.toLowerCase()) >= 0 || searchVal === ""
                case "Definition Name":
                    return (elem.action.ActionDefinition.UniqueName || "").toLowerCase().search(searchVal.toLowerCase()) >= 0 || searchVal === ""

            }
        }
        )
    }

    React.useEffect(() => {
        const toScroll = document.getElementById('tableDetailsQuickStats-container')
        toScroll.style.overflow = 'auto';
        toScroll.style.maxHeight = `${window.innerHeight - toScroll.offsetTop - 50}px`;
    }, [])

    const pageReducer = (state, action) => {
        switch (action.type) {
            case 'ADVANCE_PAGE':
                if (state.page !== (state.lastPage - 1))
                    return { ...state, page: state.page + 1 }
                else
                    return state
                break
            case 'RESET_PAGE':
                return { ...state, page: 0, offset: 10 }
                break
            default:
                return state;
        }
    }

    const imgReducer = (state, action) => {
        switch (action.type) {
            case 'STACK_IMAGES':
                return {
                    ...state,
                    images: state.images.concat(action.data.slice(pager.page * pager.offset, (pager.page + 1) * pager.offset))
                }
            case 'REPLACE_IMAGES':
                return { ...state, images: action.data.slice(pager.page * pager.offset, (pager.page + 1) * pager.offset) }
            default:
                return state;
        }
    }

    const lastPage = parseInt(Math.ceil(data.length / 10))
    console.log(data.length, lastPage)
    const [pager, pagerDispatch] = React.useReducer(pageReducer, { page: 0, offset: 10, lastPage: lastPage })
    const [imgData, imgDispatch] = React.useReducer(imgReducer, { images: [], fetching: false })

    // implement infinite scrolling with intersection observer
    let bottomBoundaryRef = React.useRef(null);
    const scrollObserver = React.useCallback(
        node => {
            new IntersectionObserver(entries => {
                entries.forEach(en => {
                    if (en.intersectionRatio > 0) {
                        pagerDispatch({ type: 'ADVANCE_PAGE' });
                    }
                });
            }).observe(node);
        },
        [pagerDispatch]
    );
    React.useEffect(() => {
        if (bottomBoundaryRef.current) {
            scrollObserver(bottomBoundaryRef.current)
        }
    }, [scrollObserver, bottomBoundaryRef])

    React.useEffect(() => {
        const dataToSend = searchedData.data
        var dataToSendSorted = []
        const elem_freq = dataToSend.filter((data) => data.action.ActionDefinition.PresentationFormat === 'element_frequency')
        const min_max = dataToSend.filter((data) => data.action.ActionDefinition.PresentationFormat === 'min_max')
        const others = dataToSend.filter((data) => ((data.action.ActionDefinition.PresentationFormat !== 'min_max') && (data.action.ActionDefinition.PresentationFormat !== 'element_frequency')))
        dataToSendSorted = dataToSendSorted.concat(elem_freq)
        dataToSendSorted = dataToSendSorted.concat(min_max)
        dataToSendSorted = dataToSendSorted.concat(others)

        // filtering all except tables
        dataToSendSorted = dataToSendSorted.filter((data) => data.action.ActionDefinition.UniqueName !== 'Table-1000-Rows')
        // dataToSendSorted = dataToSendSorted.filter((data)
        imgDispatch({ type: 'STACK_IMAGES', data: dataToSendSorted })

    }, [imgDispatch, pager.page])

    React.useEffect(() => {
        const searchedData = searchResults(data, searchQuery)
        var dataToSendSorted = []
        const elem_freq = searchedData.filter((data) => data.action.ActionDefinition.PresentationFormat === 'element_frequency')
        const min_max = searchedData.filter((data) => data.action.ActionDefinition.PresentationFormat === 'min_max')
        const others = searchedData.filter((data) => ((data.action.ActionDefinition.PresentationFormat !== 'min_max') && (data.action.ActionDefinition.PresentationFormat !== 'element_frequency')))
        dataToSendSorted = dataToSendSorted.concat(elem_freq)
        dataToSendSorted = dataToSendSorted.concat(min_max)
        dataToSendSorted = dataToSendSorted.concat(others)

        // filtering all except tables
        dataToSendSorted = dataToSendSorted.filter((data) => data.action.ActionDefinition.UniqueName !== 'Table-1000-Rows')
        console.log(dataToSendSorted)
        setSearchedData({ data: dataToSendSorted })
        pagerDispatch({ type: 'RESET_PAGE' })
        imgDispatch({ type: 'REPLACE_IMAGES', data: dataToSendSorted })

    }, [searchQuery])


    return (
        <>
            <Grid container spacing={2} style={{ marginLeft: 40, marginRight: 40 }}>
                <Grid item xs={2}>
                    <SelectOption filterOptionHandler={filterOptionHandler} menuItems={filterOptionItems}
                        filterOption={filterOption} />
                </Grid>
                <Grid item xs={4}>
                    <Search searchQueryHandler={searchQueryHandler} searchValue={searchValue} />
                </Grid>
            </Grid>

            <div id="tableDetailsQuickStats-container">
                <Grid container spacing={0}>
                    {
                        imgData.images.map((val, index) => (
                            <Grid item xs={12} style={{ padding: 20 }}
                                key={`ActionInstanceCard${val.instance.ActionInstance.Id}${index}`}>
                                <ActionInstanceCard action={val.action} instance={val.instance} />
                            </Grid>
                        ))
                    }
                </Grid>
                {
                    ((data?.length) === 0) ? (
                        <center>
                            <div id='page-bottom-boundary' ref={bottomBoundaryRef}><LoadingIndicator /></div>
                        </center>
                    ) : <div id='page-bottom-boundary'></div>
                }

            </div>
        </>
    )
}

export default QuickStatsNewTemp;