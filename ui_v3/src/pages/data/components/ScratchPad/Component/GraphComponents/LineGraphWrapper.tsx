import React,{useEffect, useState} from 'react';
import Select from '../Select';
import MultiSelect from '../MultiSelect';
import { getData } from '../../utils';
import LineChart from "../../../../../build_action/components/form-components/ChartsOption/LineCharts";


const LineChartWrapper = ({rows, columns, line, setLine}: any) => {
 
    const [xData, setXData]= useState<any>([])
    const [yData, setYData]= useState<any>([])

    useEffect(() => {
        handleXTitle(line.x)
        handleMultiSelectYData(line.y)
    },[])
    
    

    const handleXTitle = (value:any) => {
        let results = getData(rows, value)
        setLine({
            x: value,
            y: line.y
        })
        setXData(results)
       
    }

    const handleMultiSelectYData = (data:any) => {
        setLine({
            x: line.x,
            y: data
        })

        let config: any = []
        data?.forEach((name:any) => {
            let temp = {
                name: name,
                type:'line',
                data: getData(rows, name)
            }
            config.push(temp)

       })
        setYData([...config])
    }

    return (
        <div className='LineChartWrapper'>
            <hr/>
            <div className='scratchPadWrapper'>
                <Select title={"X Axis"} columns={columns} handleSelectChange={handleXTitle}  defaultValue={line.x || ''}/>
                <MultiSelect title={"Y Axis"} columns={columns} handleMultiSelectChange={handleMultiSelectYData} value={line.y || []}/>
            </div>
            <LineChart titleName={'Line Chart'} xTitle={line.x || ""} yTitle={line.y.join(',') || ""} XData={xData} YData={yData} isStack={true}/>
        </div>
        
    )
}

export default LineChartWrapper