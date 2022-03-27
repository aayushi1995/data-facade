import dataManager from '../data_manager'
import Highcharts from 'highcharts';

export const getActionExecutionParsedOutput = (actionExecutionFilter) => {
    const response = dataManager.getInstance.retreiveData(
        "ActionExecution",
        {
            filter: {Id: actionExecutionFilter.Id},
            "getExecutionParsedOutput": true
        }
    ).then((response) => {
        const actionExecution = response[0]
        if(actionExecution?.Status === 'Failed') {
            return actionExecution
        }
        const actionExecutionOutput = JSON.parse(actionExecution.Output)
        const preview = JSON.parse(actionExecutionOutput.preview)
        preview.schema = preview.schema.fields.map(f => {return {...f, field: f.name, headerName: f.name}}).filter(col => col.field!=='datafacadeindex')
        actionExecution.Output = preview
        return actionExecution
    })
    return response
}


export const getActionExecutionParsedOutputForTimeSeries = (actionExecutionFilter) => {
    const response = dataManager.getInstance.retreiveData(
        "ActionExecution",
        {
            filter: {Id: actionExecutionFilter.Id},
            "getExecutionParsedOutput": true
        }
    ).then((response) => {
        const actionExecution = response[0]
        if(actionExecution?.Status === 'Failed') {
            return actionExecution
        }
        const actionExecutionOutput = JSON.parse(actionExecution.Output)
        console.log(actionExecutionOutput)
        const preview = actionExecutionOutput.preview
        
        return {
                'defaultOptions': {
                    chart: {
                        zoomType: 'x'
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                }
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ],
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle'
                    },
                    series: preview.series,
            
                    xAxis: {
                        type: 'datetime',
                        categories: preview.timestamps
                    }
                },
                'actionExecution': actionExecution
            }
    })

    return response
}


export const getActionExecutionParsedOutputNew = (actionExecutionFilter) => {
    const response = dataManager.getInstance.retreiveData(
        "ActionExecution",
        {
            filter: {Id: actionExecutionFilter.Id},
            "getExecutionParsedOutput": true
        }
    ).then((response) => {
        const actionExecution = response[0]
        if(actionExecution?.Status === 'Failed') {
            return actionExecution
        }
        const actionExecutionOutput = JSON.parse(actionExecution.Output)
        actionExecution.Output = actionExecutionOutput
        return actionExecution
    })
    return response
}
