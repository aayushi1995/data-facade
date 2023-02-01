import React,{useEffect, useState} from 'react';
import Select from '../Select';
import { getData } from '../../utils';
import PieChart from '../../../../../build_action/components/form-components/ChartsOption/pieChart';
import BarChart from '../../../../../build_action/components/form-components/ChartsOption/BarCharts';
import ScatterChart from '../../../../../build_action/components/form-components/ChartsOption/ScatterCharts';

const PieChartWrapper = ({rows, columns, pie, setPie}: any) => {
    const [x, setX] = useState(pie.x)
    const [y, setY] = useState(pie.y)

    const [data, setData]= useState<any>([])

    useEffect(() => {
        handleXTitle(pie.x)
        handleYTitle(pie.y)
    },[])

    const handleXTitle = (value:any) => {
       
        if(y) {
            let array:any[] = []
            rows?.map((obj:any) => {
                if(obj?.[value] || obj?.[y]){
                    array.push({
                        value: obj?.[y],
                        name:  obj?.[value]
                    })
                }
            })
            setData(array)
        }
        setX(value)
        setPie({
            x: value,
            y: pie.y
        })
    }
    const handleYTitle = (value:any) => {
        if(x) {
            let array:any[] = []
            rows?.map((obj:any) => {
                if(obj?.[x] || obj?.[value]){
                    array.push({
                        value:obj?.[value],
                        name:obj?.[x]
                    })
                }
            })
            setData(array)
        }
        setY(value)
        setPie({
            x: pie.x,
            y: value
        })
    }
  
    return (
        <div className='LineChartWrapper'>
            <hr/>
            <div className='scratchPadWrapper'>
                <Select title={"Name"} columns={columns} handleSelectChange={handleXTitle} defaultValue={pie?.x || ""}/>
                <Select title={"Value"} columns={columns} handleSelectChange={handleYTitle} defaultValue={pie?.y || ""}/>
            </div>
            <PieChart titleName={'Pie Chart'} data={data}/>
        </div>
        
    )
}

export default PieChartWrapper