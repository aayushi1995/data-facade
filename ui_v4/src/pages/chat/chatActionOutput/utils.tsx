// finding an element that might appear more than once in an array
export const findAll = (inputArray:any[], key:string) => {
    let output:any[]= []
    inputArray?.forEach((obj:any) => {
        if(obj?.ProviderDefinitionId === key) {
            output.push({
                label: obj?.Name, 
                value: obj?.Id,
                ...obj
            })
        }
    })
    return output
}

export const createProviderInstanceSelectData = (parentNodes:any, childNodes:any) => {
    let newArray:any[] = []
    parentNodes?.forEach((obj:any) => {
        let objs = findAll(childNodes,obj?.Id)
        objs.length > 0 && newArray?.push({
                label: obj?.UniqueName,
                options: [...objs]
        })
    })
    return newArray
}

export const getData = (rows:any, value:any) => {
    const newArray:any = []
    rows?.forEach((obj:any) => {
        if(obj?.[value]){
            newArray.push(obj[value])
        }
    })
    return newArray
}

export const postProcessingFetchingMessage = (messages:any) => {
    let executionId = {}
    let table_input = {}
    let actionDefinition = {}

    let messagesArray =  messages?.map((obj:any, index:number) => {

        let retreiveMessage:string = ''

        if(obj?.MessageType === 'text') {
            retreiveMessage = JSON.parse(obj?.MessageContent)?.text

        } else if (obj?.MessageType === 'action_output') {
            executionId =  {
                ...executionId,
                [obj?.Id]: JSON.parse(obj?.MessageContent)?.['executionId']
            }
        } else if (obj?.MessageType === "action_instance"){
            actionDefinition = {
                ...actionDefinition,
                [obj?.Id]: JSON.parse(obj?.MessageContent)
            }
        } else if (obj?.MessageType === "table_input"){
            table_input = {
                ...table_input,
                [obj?.Id]: JSON.parse(obj?.MessageContent)
            }
        }

        return {
            id: obj?.Id,
            message: retreiveMessage,
            // if we dont get a sentBy then add previoous message time
            time: obj?.SentOn ? parseInt(obj?.SentOn) : index > 1 ? parseInt(messages?.[index-1]?.sentOn): new Date().getTime(),
            from: obj?.MessageType === "table_input" || obj?.SentBy === "Bot" ? "system" : 'user',
            username: obj?.SentBy === "Bot" ? "Data Facade" : obj?.SentBy,
            type: obj?.MessageType
        }
    })
    return { messagesArray, executionId, table_input, actionDefinition}
}