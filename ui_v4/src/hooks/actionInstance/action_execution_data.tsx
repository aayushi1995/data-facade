import dataManager from '../../api/dataManager'

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



