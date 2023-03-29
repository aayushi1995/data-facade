import { ChatContext } from '@/contexts/ChatContext'
import {  SettingOutlined } from '@ant-design/icons'
import { useContext, useState } from 'react'
import ChartWrapper from './ChartWrapper'
import ModalOptions from './ModalOptions'



const Visualization = ({tableName}:any) => {
    const chatContext = useContext(ChatContext)
    const tableData = chatContext?.tableData?.[tableName]

    const [showChart, setShowChart] = useState(false)
    const [showOptions, setOptions] = useState(true)

    const [chartData, setChartData] = useState<any>(null)

    const handleChartData = (data:any) => {
        console.log(data, 'handleChartData')
        setShowChart(true)
        setOptions(false)
        setChartData(data)
    }

    const columns = tableData?.dataGridColumns?.map((obj:any) => {return {label: obj.title, value: obj.dataIndex}})

    
    return (
        <div>
            <div>Create a custom chart from table data using our styling options and select X and Y axes for a clear visual representation of your data:</div>
            {showOptions && <ModalOptions columns={columns} showChartModal={showOptions} setShowChartModal={setOptions} handleChartData={handleChartData} tableName={tableName}/>}
            {showChart && (
                <div>
                    <SettingOutlined onClick={() => setOptions(!showOptions)} style={{display:'flex', margin: '0px 30px', justifyContent:'flex-end'}}/>
                    {ChartWrapper({...chartData})}
                </div>
            )}
        </div>
    )
}

export default Visualization