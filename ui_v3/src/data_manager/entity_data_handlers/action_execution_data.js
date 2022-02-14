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
        const actionExecutionOutput = JSON.parse(actionExecution.Output)
        const preview = JSON.parse(actionExecutionOutput.preview)
        preview.schema = preview.schema.fields.map(f => {return {...f, field: f.name, headerName: f.name}}).filter(col => col.field!=='datafacadeindex')
        actionExecution.Output = preview
        return actionExecution
    })
    return response
}
