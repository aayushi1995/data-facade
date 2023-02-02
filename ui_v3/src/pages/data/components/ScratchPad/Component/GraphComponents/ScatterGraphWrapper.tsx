import { useEffect, useState } from 'react';
import ScatterChart from '../../../../../applications/build_action_old/components/form-components/ChartsOption/ScatterCharts';
import Select from '../Select';

const ScatterGraphWrapper = ({rows, columns, scatter, setScatter}: any) => {
    const [x, setX] = useState(scatter.x)
    const [y, setY] = useState(scatter.y)

    const [data, setData]= useState<any>([])

    useEffect(()=> {
        handleXTitle(scatter.x)
        handleYTitle(scatter.y)
    },[])

    const handleXTitle = (value:any) => {
            if(y) {
                let array:any[] = []
                rows?.map((obj:any) => {
                    if(obj?.[value] || obj?.[y]){
                        array.push([obj?.[y],obj?.[value]])
                    }
                })
                setData(array)
            }
           
            setX(value)
        // }
        setScatter({
            x: value,
            y: scatter.y
        })
        
       
        // get x axis value
    }
    const handleYTitle = (value:any) => {
        

        if(x) {
            let array:any[] = []
            rows?.map((obj:any) => {
                if(obj?.[x] || obj?.[value]){
                    array.push([obj?.[value],obj?.[x]])
                }
            })
            setData(array)
        }
        setY(value)
        setScatter({
            y: value,
            x: scatter.x
        })
    }

    return (
        <div className='LineChartWrapper'>
            <hr/>
            <div className='scratchPadWrapper'>
                <Select title={"X Axis"} columns={columns} handleSelectChange={handleXTitle} defaultValue={scatter?.x || ''}/>
                <Select title={"Y Axis"} columns={columns} handleSelectChange={handleYTitle} defaultValue={scatter?.y || ''}/>
            </div>
            <ScatterChart titleName="" xTitle={scatter.x} yTitle={scatter.y} data={data}/>
        </div>
        
    )
}

export default ScatterGraphWrapper