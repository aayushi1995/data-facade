import { useEffect, useState } from 'react';
import LineChart from '../../../../../applications/build_action_old/components/form-components/ChartsOption/LineCharts';
import { getData } from '../../utils';
import MultiSelect from '../MultiSelect';
import Select from '../Select';

const LineBarChartWrapper = ({rows, columns, lineBar, setLineBar}: any) => {
    // const [xTitle, setXTitle]= useState('')
    const [xData, setXData]= useState<any>([])
    const [yLine, setYLine]= useState<any>([])
    const [yBar, setYBar] = useState<any>([])

    useEffect(() => {
        handleXTitle(lineBar.x)
        handleYLineData(lineBar.ySelect)
        handleYBarData(lineBar.yMultiSelect)
    },[])
    
    useEffect

    const handleXTitle = (value:any) => {
        let results = getData(rows, value)
        setXData(results)
      
        setLineBar({
            x: value,
            ySelect: lineBar.ySelect,
            yMultiSelect: lineBar.yMultiSelect
        })
    }

    const handleYLineData = (value:any) => {
        setYLine([{
                name: value,
                type:'line',
                data: getData(rows, value)   
        }])
        setLineBar({
            x: lineBar.x,
            ySelect: value,
            yMultiSelect: lineBar.yMultiSelect
        })
    }

    const handleYBarData = (data:any) => {
       let config: any = []
       data?.forEach((name:any) => {
            let temp = {
                name: name,
                type:'bar',
                data: getData(rows, name)
            }
            config.push(temp)

       })
       setYBar([...config])

       setLineBar({
        x: lineBar.x,
        ySelect: lineBar.ySelect,
        yMultiSelect: data
    })
    }

    return (
        <div className='LineChartWrapper'>
            <hr/>
            <div className='scratchPadWrapper'>
                <Select title={"X Axis"} columns={columns} handleSelectChange={handleXTitle} value={lineBar.x || ""}/>
                <Select title={"Y - Line Chart"} columns={columns} handleSelectChange={handleYLineData} value={lineBar.ySelect || ""}/>
                <MultiSelect title={"Y - Bar Chart"} columns={columns} handleMultiSelectChange={handleYBarData} defaultValue={lineBar.yMultiSelect || []}/>
            </div>
            <LineChart titleName={'Line Chart'} xTitle={lineBar.x} yTitle={""} XData={xData} YData={[...yBar, ...yLine]}/>
        </div>
        
    )
}

export default LineBarChartWrapper