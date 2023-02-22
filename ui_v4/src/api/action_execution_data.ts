import dataManager from './dataManager'

export const getActionExecutionParsedOutput = (actionExecutionFilter:any) => {
    const response = dataManager.getInstance.retreiveData(
        "ActionExecution",
        {
            filter: {Id: actionExecutionFilter.Id},
            "getExecutionParsedOutput": true
        }
    ).then((response:any) => {
        const actionExecution = response[0]
        if(actionExecution?.Status === 'Failed') {
            return actionExecution
        }
        const actionExecutionOutput = JSON.parse(actionExecution.Output)
        const preview = JSON.parse(actionExecutionOutput.preview)
        preview.schema = preview.schema.fields.map((f:any) => {return {...f, field: f.name, headerName: f.name}}).filter((col:any) => col.field!=='datafacadeindex')
        actionExecution.Output = preview
        return actionExecution
    })
    return response
}


export const getActionExecutionParsedOutputForTimeSeries = (actionExecutionFilter:any) => {
    const response = dataManager.getInstance.retreiveData(
        "ActionExecution",
        {
            filter: {Id: actionExecutionFilter.Id},
            "getExecutionParsedOutput": true
        }
    ).then((response:any) => {
        const actionExecution = response[0]
        if(actionExecution?.Status === 'Failed') {
            return actionExecution
        }
        const actionExecutionOutput = JSON.parse(actionExecution.Output)
        const preview = actionExecutionOutput.preview    
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
                    series: preview.series.map((wholeData:any) => {
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


export async function getActionExecutionParsedOutputNew(actionExecutionFilter:any) {
    const actionExecutions = await dataManager.getInstance.retreiveData(
        "ActionExecution",
        {
            filter: {Id: actionExecutionFilter.Id},
            "getExecutionParsedOutput": true,
            "S3PathIfPresent": true
        }
    )
    
    const actionExecution = actionExecutions?.[0]
    if(actionExecution?.Status !== 'Failed') {
        const actionExecutionOutput = JSON.parse(actionExecution.Output)
        if("S3Path" in actionExecutionOutput) {
            const s3Key = actionExecutionOutput.S3Path
            const preSignedDownloadUrlInfo = await dataManager.getInstance.s3PresignedDownloadUrlRequest(s3Key, 5, "FormattedOutput", undefined, false)
            const requestUrl = preSignedDownloadUrlInfo.requestUrl
            const headers = preSignedDownloadUrlInfo.headers
            const formattedOutputBlob = await dataManager.getInstance.s3DownloadRequest(requestUrl, headers)
            const formattedOutput = await formattedOutputBlob.text()
            actionExecution.Output = JSON.parse(formattedOutput)
        } else {
            actionExecution.Output = actionExecutionOutput
        }
    }
    return actionExecution
}
