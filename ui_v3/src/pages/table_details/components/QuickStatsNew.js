import React, {useContext} from 'react'
import {Card, Grid} from '@material-ui/core'
import {useQuery} from 'react-query'
import NoData from './../../../common/components/NoData'
import LoadingIndicator from './../../../common/components/LoadingIndicator'
import LineChartVisualizer from './../../../common/components/LineChartVisualizer'
import ColumnRangeChartVisualizer from '../../../common/components/ColumnRangeChartVisualizer';
import AppContext from "../../../utils/AppContext";

const endPoint = require("../../../common/config/config").FDSEndpoint


const quickStatsColumnRangeData = [
    {
        "name": "Marks",
        "valueRange": [-10, 100]
    },
    {
        "name": "Age",
        "valueRange": [15, 30]
    },
    {
        "name": "Class",
        "valueRange": [1, 12]
    }
]


let RowCountOptions = {

    title: {
        text: 'Table Row Count'
    },
    subtitle: {
        text: ""
    },

    yAxis: {
        title: {
            text: ''
        }
    },

    xAxis: {
        title: {
            text: "Run Date"
        }
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

const ColumnRangeOptions = {
    chart: {
        type: 'columnrange',
        inverted: true
    },

    title: {
        text: 'Value range for Integer columns'
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
        name: 'Values',
        data: []
    }]
}

const RowCountStat = (props) => {

    const myRowCountOption = JSON.parse(JSON.stringify(RowCountOptions))
    myRowCountOption["series"] = [{
        name: props.action.ActionInstance.Name,
        data: []
    }]
    myRowCountOption["xAxis"]["categories"] = []
    myRowCountOption["title"]["text"] = props.action.ActionInstance.Name
    myRowCountOption["subtitle"]["text"] = props.action.ActionInstance.RenderedTemplate


    if (props.action.ActionExecution.length === 0) return (<></>)
    props.action.ActionExecution.forEach((execution) => {
        if (execution.Status === 'Completed') {
            myRowCountOption["series"][0].data.push([new Date(execution.ExecutionStartedOn * 1000).toDateString(), parseInt(JSON.parse(execution.Output).Value)])
            myRowCountOption["xAxis"]["categories"].push(new Date(execution.ExecutionStartedOn * 1000).toDateString())
        }
    })
    return (
        <Card variant="outlined" elevation={0} style={{padding: 20}}>
            <LineChartVisualizer options={myRowCountOption}/>
        </Card>
    )
}

const RangeOfValuesStat = (props) => {

    if (props.data === undefined) return <></>
    ColumnRangeOptions.xAxis.categories = []
    ColumnRangeOptions.series[0].data = []
    props.data.forEach((elem, index) => {
        ColumnRangeOptions.xAxis.categories.push(elem.name)
        ColumnRangeOptions.series[0].data.push(elem.valueRange)
    })

    return (

        <Card variant="outlined" elevation={0} style={{padding: 20}}>
            <ColumnRangeChartVisualizer options={ColumnRangeOptions}/>
        </Card>
    )

}

const QuickStatsNew = (props) => {
    const appcontext = useContext(AppContext);
    const email = appcontext.userEmail
    const token = appcontext.token

    const tableLevelQuickStatsConfig = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "entityName": "TableProperties",
            "actionProperties": {
                "filter": {
                    "Id": props.tableId
                },
                "withProfilingActions": true
            }
        })
    }

    const {isLoading, error, data} = useQuery(`TableLevelQuickStats${props.tableId}`, () =>
        fetch(endPoint + '/entity/getproxy?email=' + email, tableLevelQuickStatsConfig).then(res => res.json()))


    if (isLoading) {
        return (
            <LoadingIndicator/>
        )
    } else if (error) {
        return (
            <NoData/>
        )
    } else {
        if (data.length === 0) return (<NoData/>)


        return (
            <Grid container spacing={0}>
                {data[0].ProfilingActions.map((action, index) => (
                    <Grid item xs={6} style={{padding: 20}}>
                        <RowCountStat action={action} index={index}/>
                    </Grid>
                ))}
            </Grid>

        )
    }
}

export default QuickStatsNew;