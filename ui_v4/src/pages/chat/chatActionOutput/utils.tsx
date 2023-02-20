// finding an element that might appear more than once in an array
export const findAll = (inputArray:any[], key:string) => {
    let output:any[]= []
    inputArray?.forEach((obj:any) => {
        if(obj?.ProviderDefinitionId === key) {
            output.push({
                label: obj?.Name, 
                value: obj?.Id
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
