import { ChatContext } from '@/contexts/ChatContext'
import { FlexBox } from '@/pages/chat/ChatFooter/ChatFooter.styles'
import { Button, Select } from 'antd'
import React, { useContext, useMemo, useState } from 'react'
import { getData } from '../../../utils'
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
    'yAXis': 'Y Axis'
}