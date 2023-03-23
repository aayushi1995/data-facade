import { ChatContext } from '@/contexts/ChatContext'
import { FlexBox } from '@/pages/chat/ChatFooter/ChatFooter.styles'
import { Button, Select } from 'antd'
import React, { useContext, useMemo, useState } from 'react'
import { getData } from '../../../../utils'
import { SelectWrapper } from './ChartOptions.styles'


const ChartOptions = ({type, tableName, ...props}:any) => {
    const chatContext = useContext(ChatContext)
    const tableData = chatContext?.tableData?.[tableName]

    switch (type){
        case 'line': {
            return <LineChartOptions tableData={tableData} {...props}/>
        }
        case 'bar': {
            return <BarChartOptions  tableData={tableData} {...props}/>
        }
        case 'linebar': {
            return <LineBarOptions  tableData={tableData} {...props}/>
        }
        case 'pie': {
            return <PieChartOptions  tableData={tableData} {...props}/>
        }
        case 'scatter': {
            return <ScatterChartOptions  tableData={tableData} {...props}/>
        }
        case 'aggregrateLine': {
            return <AggregationLineChartOptions tableData={tableData} {...props}/>
        }
        case 'aggregrateBar': {
            return <AggregationBarChartOptions  tableData={tableData} {...props}/>
        }
        case 'aggregratePie': {
            return <AggregationPieChartOptions  tableData={tableData} {...props}/>
        }
        default: {
            return <div>Something went wrong</div>
        }
            
    }   
}

export default ChartOptions


const LineChartOptions = ({handleChartData,tableData }:any) => {

    let [axis, setaxis] = useState<any>()

    const handleXaxis = (value:any) => {
        const data = getData(tableData?.dataGridRows, value)
        setaxis({
            xaxis: data,
            yaxis: axis?.yaxis,
            data:  axis?.data
        })
    }

    const handleYaxis = (value:any) => {
        // set yaxis
        // set ydata
        const data = getData(tableData?.dataGridRows, value)
        setaxis({
            xaxis: axis?.xaxis || '',
            yaxis: data,
            data: data
        })
    }

    const handleOk = () => {
        // call handleChartData
        handleChartData({...axis, chartType: 'line'})

    }

    // TODO : add memoization
    const columns = tableData?.dataGridColumns?.map((obj:any) => {return {label: obj.title, value: obj.dataIndex}})


    return (
        <>
            <CommonSelectOptions label={LABEL_CONSTANTS.xAxis} options={columns} onChange={handleXaxis}/>
            <CommonSelectOptions label={LABEL_CONSTANTS.yAXis} options={columns} onChange={handleYaxis}/>
            <CommonButtonComponent handleOk={handleOk}/>
        </>
    )
}

const BarChartOptions = ({handleChartData, tableData}:any) => {
   
    
    let [axis, setaxis] = useState<any>()

    const handleXaxis = (value:any) => {
        const data = getData(tableData?.dataGridRows, value)
        setaxis({
            xaxis: data,
            yaxis: axis?.yaxis,
            data:  axis?.data
        })
    }

    const handleYaxis = (value:any) => {
        // set yaxis
        // set ydata
        const data = getData(tableData?.dataGridRows, value)
        setaxis({
            xaxis: axis?.xaxis || '',
            yaxis: value,
            data: data
        })
    }

    const handleOk = () => {
        // call handleChartData
        handleChartData({...axis, chartType: 'bar'})

    }

    // TODO : add memoization
    const columns = tableData?.dataGridColumns?.map((obj:any) => {return {label: obj.title, value: obj.dataIndex}})


    return (
        <>
            <CommonSelectOptions label={LABEL_CONSTANTS.xAxis} options={columns} onChange={handleXaxis}/>
            <CommonSelectOptions label={LABEL_CONSTANTS.yAXis} options={columns} onChange={handleYaxis}/>
            <CommonButtonComponent handleOk={handleOk}/>
        </>
    )
}

const LineBarOptions = ({handleChartData, tableData}:any) => {
    
    
    let [axis, setaxis] = useState<any>()

    const handleXaxis = (value:any) => {
        const data = getData(tableData?.dataGridRows, value)
        setaxis({
            xaxis: data,
            yaxis: axis?.yaxis,
            data:  axis?.data
        })
    }

    const handleYaxis = (type:any,value:any) => {
        // set yaxis
        // set ydata
        const data = getData(tableData?.dataGridRows, value)
        const actualData = axis?.data ? [...axis.data, {
                name: value,
                type: type,
                data: data,
        }] : [{
            name: value,
            type: type,
            data: data,
        }]

        setaxis((axis:any) => {return {
            xaxis: axis?.xaxis || [],
            yaxis: value,
            data: actualData
        }})
    }



    const handleOk = () => {
        // call handleChartData
        handleChartData({...axis, chartType: 'linebar'})

    }

    // TODO : add memoization
    const columns = tableData?.dataGridColumns?.map((obj:any) => {return {label: obj.title, value: obj.dataIndex}})


    return (
        <>
            <CommonSelectOptions label={LABEL_CONSTANTS.xAxis} options={columns} onChange={handleXaxis}/>
            <CommonSelectOptions label={LABEL_CONSTANTS.yAXis+'-Line'} options={columns} onChange={(value:any) => handleYaxis('line',value)}/>
            <CommonSelectOptions label={LABEL_CONSTANTS.yAXis+'-Bar'} options={columns} onChange={(value:any) => handleYaxis('bar',value)}/>
            <CommonButtonComponent handleOk={handleOk}/>
        </>
    )
}

const PieChartOptions = ({handleChartData, tableData}:any) => {
    
    
    let [axis, setaxis] = useState<any>()

    
    const handleXaxis = (value:any) => {
        const data = getData(tableData?.dataGridRows, value)
        setaxis({
            xaxis: value,
            yaxis: axis?.yaxis,
            data:  axis?.data
        })
    }

    const handleYaxis = (value:any) => {
        // set yaxis
        // set ydata
        let data:any[] = []
        
        if(axis.xaxis) {
                tableData?.dataGridRows?.map((obj:any) => {
                    if(obj?.[value] || obj?.[axis.xaxis]){
                        data.push({
                            value: obj?.[value],
                            name:  obj?.[axis.xaxis]
                        })
                    }
                })
        }
        setaxis({
            xaxis: axis?.xaxis,
            yaxis: value,
            data: data
        })
    }

    const handleOk = () => {
        // call handleChartData
        handleChartData({...axis, chartType: 'pie'})

    }

    // TODO : add memoization
    const columns = tableData?.dataGridColumns?.map((obj:any) => {return {label: obj.title, value: obj.dataIndex}})


    return (
        <>
            <CommonSelectOptions label={LABEL_CONSTANTS.xAxis} options={columns} onChange={handleXaxis}/>
            <CommonSelectOptions label={LABEL_CONSTANTS.yAXis} options={columns} onChange={handleYaxis}/>
            <CommonButtonComponent handleOk={handleOk}/>
        </>
    )
}


const ScatterChartOptions = ({handleChartData, tableData}:any) => {
        
        let [axis, setaxis] = useState<any>()
    
        const handleXaxis = (value:any) => {
            let data:any[] = []
            if(axis?.yaxis) {
                    tableData?.dataGridRows?.map((obj:any) => {
                        if(obj?.[value] || obj?.[axis.yaxis]){
                            data.push({
                                value: obj?.[value],
                                name:  obj?.[axis.yaxis]
                            })
                        }
                    })
            }
            setaxis({
                xaxis: value,
                yaxis: axis?.yaxis,
                data: data
            })
        }
    
        const handleYaxis = (value:any) => {
            let data:any[] = []
            
            if(axis?.xaxis) {
                    tableData?.dataGridRows?.map((obj:any) => {
                        if(obj?.[value] || obj?.[axis.xaxis]){
                            data.push({
                                value: obj?.[value],
                                name:  obj?.[axis.xaxis]
                            })
                        }
                    })
            }
            setaxis({
                xaxis: axis?.xaxis,
                yaxis: value,
                data: data
            })
        }
    
        const handleOk = () => {
            // call handleChartData
            handleChartData({...axis, chartType: 'scatter'})
    
        }
    
        // TODO : add memoization
        const columns = tableData?.dataGridColumns?.map((obj:any) => {return {label: obj.title, value: obj.dataIndex}})
    
    
        return (
            <>
               <CommonSelectOptions label={LABEL_CONSTANTS.xAxis} options={columns} onChange={handleXaxis}/>
               <CommonSelectOptions label={LABEL_CONSTANTS.yAXis} options={columns} onChange={handleYaxis}/>
               <CommonButtonComponent handleOk={handleOk}/>
            </>
        )
}


const CommonButtonComponent = ({handleOk}:any) => {
    return (
        <FlexBox style={{minWidth:'300px',justifyContent:'center'}}>
            <Button type='primary' onClick={handleOk} style={{justifyContent: 'center', marginTop:'0px'}}>Show Charts</Button>
       </FlexBox>
    )
}

const CommonSelectOptions = ({label, options, onChange}:any) => {
    console.log(options)
    return (
        <SelectWrapper>
                <label>{label}</label>
                    <Select
                        style={{ width: '100%' }}
                        onChange={onChange}
                        options={options}
                    />
        </SelectWrapper>
    )
}

const LABEL_CONSTANTS = {
    'xAxis': 'X Axis',
    'yAXis': 'Y Axis',
    'groupBy': "Group By",
    'aggregrateMethod': 'Aggregrate Function',
    'onColumns': 'Column on which you want to perform the aggregration'
}

// Aggregrate Components migrated

const AggregationLineChartOptions = ({handleChartData,tableData }:any) => {


    const columns = React.useMemo(() => {
       return tableData?.dataGridColumns?.map((obj:any) => {return {label: obj.title, value: obj.dataIndex}})
    },[tableData])

    // Agrregrate functionality starts from here

    const [groupByRows, setGroupByRows] = useState<any>()
    const [aggregrationType, setAggregrationType] = useState<string | undefined>()
    const [opColumns, setOpColumns]= useState<string | undefined>()
    const [results, setResults]= useState<any>()

    const handleGroupBy = (value: string) => {
        let records = constructAGroupByRecord(tableData?.dataGridRows, value)
        setGroupByRows(records)
    }

    const handleAggregationType = (value:string) => {
        setAggregrationType(value)
    }

    const handleColumnToPerformOperations = (value:string) => {
        setOpColumns(value)
        // create xaxis and yaxis data and 
        const results = aggregrationType && performOperations(groupByRows, aggregrationType, value)
        setResults(results)
    }

    const handleOK = () => {
        // const data = getData(tableData?.dataGridRows, value)
        
        const xData = results?.map((obj:any) => {
            return obj?.xAxis
        })
        const yData = results?.map((obj:any) => {
            return obj?.yAxis
        })

        const axisObj = {
            xaxis: xData,
            yaxis: yData,
            data:  yData
        }

        handleChartData({...axisObj, chartType: 'line'})
    }

    return (
        <>
            <CommonSelectOptions label={LABEL_CONSTANTS.groupBy} options={columns} onChange={handleGroupBy}/>
            {groupByRows && Object.keys(groupByRows)?.length > 0 && <CommonSelectOptions label={LABEL_CONSTANTS.aggregrateMethod} options={AggregationOptions} onChange={handleAggregationType}/>}
            {aggregrationType && <CommonSelectOptions label={LABEL_CONSTANTS.onColumns} options={columns} onChange={handleColumnToPerformOperations}/>}
            {/* <CommonSelectOptions label={LABEL_CONSTANTS.xAxis} options={columns} onChange={handleXaxis}/>
            <CommonSelectOptions label={LABEL_CONSTANTS.yAXis} options={columns} onChange={handleYaxis}/> */}
            <CommonButtonComponent handleOk={handleOK}/>
        </>
    )
}

const AggregationBarChartOptions = ({handleChartData, tableData}:any) => {

    const columns = React.useMemo(() => {
        return tableData?.dataGridColumns?.map((obj:any) => {return {label: obj.title, value: obj.dataIndex}})
     },[tableData])
 
     // Agrregrate functionality starts from here
 
     const [groupByRows, setGroupByRows] = useState<any>()
     const [aggregrationType, setAggregrationType] = useState<string | undefined>()
     const [opColumns, setOpColumns]= useState<string | undefined>()
     const [results, setResults]= useState<any>()
 
     const handleGroupBy = (value: string) => {
         let records = constructAGroupByRecord(tableData?.dataGridRows, value)
         setGroupByRows(records)
     }
 
     const handleAggregationType = (value:string) => {
         setAggregrationType(value)
     }
 
     const handleColumnToPerformOperations = (value:string) => {
         setOpColumns(value)
         // create xaxis and yaxis data and 
         const results = aggregrationType && performOperations(groupByRows, aggregrationType, value)
         setResults(results)
     }
 
     const handleOK = () => {
         // const data = getData(tableData?.dataGridRows, value)
         
         const xData = results?.map((obj:any) => {
             return obj?.xAxis
         })
         const yData = results?.map((obj:any) => {
             return obj?.yAxis
         })
 
         const axisObj = {
             xaxis: xData,
             yaxis: yData,
             data:  yData
         }
 
         handleChartData({...axisObj, chartType: 'bar'})
 
 
     }
 
     return (
         <>
             <CommonSelectOptions label={LABEL_CONSTANTS.groupBy} options={columns} onChange={handleGroupBy}/>
             {groupByRows && Object.keys(groupByRows)?.length > 0 && <CommonSelectOptions label={LABEL_CONSTANTS.aggregrateMethod} options={AggregationOptions} onChange={handleAggregationType}/>}
             {aggregrationType && <CommonSelectOptions label={LABEL_CONSTANTS.onColumns} options={columns} onChange={handleColumnToPerformOperations}/>}
             {/* <CommonSelectOptions label={LABEL_CONSTANTS.xAxis} options={columns} onChange={handleXaxis}/>
             <CommonSelectOptions label={LABEL_CONSTANTS.yAXis} options={columns} onChange={handleYaxis}/> */}
             <CommonButtonComponent handleOk={handleOK}/>
         </>
     )
}


const AggregationPieChartOptions = ({handleChartData, tableData}:any) => {
    
    const columns = React.useMemo(() => {
        return tableData?.dataGridColumns?.map((obj:any) => {return {label: obj.title, value: obj.dataIndex}})
     },[tableData])
 
     // Agrregrate functionality starts from here
     const [groupByRows, setGroupByRows] = useState<any>()
     const [aggregrationType, setAggregrationType] = useState<string | undefined>()
     const [xAxis, setxAxis] = useState('')
     const [opColumns, setOpColumns]= useState<string | undefined>()
     const [results, setResults]= useState<any>()
 
     const handleGroupBy = (value: string) => {
         let records = constructAGroupByRecord(tableData?.dataGridRows, value)
         setGroupByRows(records)
         setxAxis(value)
     }
 
     const handleAggregationType = (value:string) => {
         setAggregrationType(value)
     }
 
    const handleColumnToPerformOperations = (value:string) => {
         setOpColumns(value)
         // create xaxis and yaxis data and 
         const results = aggregrationType && performOperations(groupByRows, aggregrationType, value)
         setResults(results)
    }
 
     const handleOK = () => {
        // const data = getData(tableData?.dataGridRows, value)
        const data = results?.map((obj:any) => {
            return {
                name: obj?.xAxis,
                value: obj?.yAxis
            }
        })
        const yData = results?.map((obj:any) => {
            return obj?.yAxis
        })
 
        const axisObj = {
             xaxis: xAxis,
             yaxis: opColumns,
             data:  data
        }
 
         handleChartData({...axisObj, chartType: 'pie'})
     }


    return (
        <>
        <CommonSelectOptions label={LABEL_CONSTANTS.groupBy} options={columns} onChange={handleGroupBy}/>
        {groupByRows && Object.keys(groupByRows)?.length > 0 && <CommonSelectOptions label={LABEL_CONSTANTS.aggregrateMethod} options={AggregationOptions} onChange={handleAggregationType}/>}
        {aggregrationType && <CommonSelectOptions label={LABEL_CONSTANTS.onColumns} options={columns} onChange={handleColumnToPerformOperations}/>}
        <CommonButtonComponent handleOk={handleOK}/>
        </>
    )
}






const constructAGroupByRecord = (array:any[], groupByCol:string) => {
    let mainObj:any = {}
    array?.forEach((obj:any) => {
        let keyTobeSearched = obj?.[groupByCol] as string
        let keysArray = Object.keys(mainObj)?.indexOf(keyTobeSearched)
        if(keysArray !== -1) {
            mainObj = {
                ...mainObj,
                [keyTobeSearched]: [...mainObj?.[keyTobeSearched], {...obj}]
            }
        } else {
            mainObj = {
                ...mainObj,
                [keyTobeSearched]: [{...obj}]
            }
        }
    })
    return mainObj
}



const AggregationOptions = [
    {label: 'COUNT', value:'count'},
    {label: 'SUM', value:'sum'},
    {label: 'AVERAGE', value:'average'},
    {label: 'MIN', value:'min'},
    {label: 'MAX', value:'max'}
]

const performOperations = (groupByRows:any, aggregrationType:string, columnName:string) => {
    let mainArray:any[] = []
    Object.keys(groupByRows)?.forEach((key:any) => {
       
        let tempArray:any[] = []
        groupByRows?.[key]?.forEach((record:any) => {
            tempArray.push(record?.[columnName])
        })
        const getResults = performOperation(tempArray,aggregrationType)
        let record = {xAxis: key, yAxis: getResults}
        mainArray.push(record)
    })
    return mainArray
}

const performOperation = (array:any[], opType:string) => {
    switch (opType) {
        case 'sum': {
            const results =  array?.reduce((sum:any, current:any) => sum + current)
            return results
        }
        case 'average': {
            const totalSum = array?.reduce((sum:any, current:any) => sum + current)
            const average = totalSum / array?.length
            return average
        }
        case 'count': {
            return array.length
        }
        case 'min': {
            return Math.min(...array)
        }
        case 'max': {
            return Math.max(...array)
        }
        default: {
            return array.length
        }
    }
}