export const cleanData = (data:any) => {
    const preview: any = JSON.parse(data?.preview)
    const dataGridColumns = (preview?.schema?.fields || []).map(f => {return {...f, field: f.name, headerName: f.name, flex: 1, minWidth: 200}}).filter(col => col.field!=='datafacadeindex')
    const dataGridRows = (preview?.data || []).map((row, index) => ({...row, id: row?.Id||index}))
    return {
        columns: dataGridColumns,
        rows: dataGridRows
    }
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

export const debouncedFunction = function (func:any, delay:number) {
    let timer:any; 
    return (arg:any) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                func(arg)
            }, delay)
    }
    
}