import React, {useContext} from 'react'
import {Card, Grid} from '@mui/material'
import LineChartVisualizer from './../../../common/components/LineChartVisualizer'
import {useQuery} from 'react-query'
import NoData from './../../../common/components/NoData'
import LoadingIndicator from './../../../common/components/LoadingIndicator'
import AppContext from "../../../utils/AppContext";

const endPoint = require("../../../common/config/config").FDSEndpoint

const nullCountOptions = {

    title: {
        text: ''
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


const NullCountStat = (props) => {

    console.log(props.action)

    const myNullCountOptions = JSON.parse(JSON.stringify(nullCountOptions))
    myNullCountOptions["series"] = [{
        name: props.action.ActionInstance.Name,
        data: []
    }]
    myNullCountOptions["xAxis"]["categories"] = []
    myNullCountOptions["title"]["text"] = props.action.ActionInstance.Name
    myNullCountOptions["subtitle"]["text"] = props.action.ActionInstance.RenderedTemplate

    if (props.action.ActionExecution.length === 0) return (<></>)
    props.action.ActionExecution.forEach((execution) => {
        if (execution.Status === 'Completed') {
            myNullCountOptions["series"][0].data.push([new Date(execution.ExecutionStartedOn * 1000).toDateString(), parseInt(JSON.parse(execution.Output).Value)])
            myNullCountOptions["xAxis"]["categories"].push(new Date(execution.ExecutionStartedOn * 1000).toDateString())
        }
    })
    return (
        <Card variant="outlined" elevation={0} style={{padding: 20}}>
            <LineChartVisualizer options={myNullCountOptions}/>
        </Card>
    )

}

const QuickStatsNew = (props) => {
    const appcontext = useContext(AppContext);
    const email = appcontext.userEmail
    const token = appcontext.token

    console.log(props)
    const columnLevelQuickStatsConfig = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "entityName": "ColumnProperties",
            "actionProperties": {
                "filter": {
                    "Id": props.columnId
                },
                "withProfilingActions": true
            }
        })
    }

    const {isLoading, error, data} = useQuery(`ColumnLevelQuickStats${props.columnId}`, () =>
        fetch(endPoint + '/entity/getproxy?email=' + email, columnLevelQuickStatsConfig).then(res => res.json()))

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
                        <NullCountStat action={action} index={index}/>
                    </Grid>
                ))}
            </Grid>
        )
    }
}
export default QuickStatsNew;