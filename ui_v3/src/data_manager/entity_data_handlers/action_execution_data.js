import dataManager from '../data_manager'

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
        console.log(preview)
        
        return {
                'defaultOptions': {
                    chart: {
                        zoomType: 'x'
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: false
                            }
                        },
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                }
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },
                    series: preview.series.map(wholeData => {
                        return {
                            ...wholeData,
                            zoneAxis: 'x',
                            zones: [
                                {
                                    value: preview.historical
                                },{
                                    dashStyle: 'dash'
                                }
                            ],
                        }
                    }),
            
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
