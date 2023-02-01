import React,{useEffect, useState} from 'react';
import Select from '../Select';
import MultiSelect from '../MultiSelect';
import { getData } from '../../utils';
import BarChart from '../../../../../build_action/components/form-components/ChartsOption/BarCharts';

const LineChartWrapper = ({rows, columns, bar, setBar}: any) => {
    
    const [xData, setXData]= useState<any>([])
    const [yData, setYData]= useState<any>([])

    useEffect(() => {
        handleXTitle(bar.x)
        handleMultiSelectYData(bar.y)
    },[])

    const handleXTitle = (value:any) => {
        let results = getData(rows, value)
        setBar({
            x: value,
            y: bar.y
        })
        setXData(results)
    }
    const handleMultiSelectYData = (data:any) => {
       let config: any = []
       data?.forEach((name:any) => {
            let temp = {
                name: name,
                type:'bar',
                data: getData(rows, name)
            }
            config.push(temp)

       })
        setYData([...config])

        setBar({
            x: bar.x,
            y: data
        })
    }

    return (
        <div className='LineChartWrapper'>
            <hr/>
            <div className='scratchPadWrapper'>
                <Select title={"X Axis"} columns={columns} handleSelectChange={handleXTitle} defaultValue={bar.x || ""}/>
                <MultiSelect title={"Y Axis"} columns={columns} handleMultiSelectChange={handleMultiSelectYData} value={bar.y || []}/>
            </div>
            <BarChart titleName={'Bar Chart'} xTitle={bar.x} yTitle={bar.y.join(',')} XData={xData} YData={yData}/>
        </div>
        
    )
}

export default LineChartWrapper