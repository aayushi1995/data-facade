import { ChatContext } from '@/contexts/ChatContext'
import {  SettingOutlined } from '@ant-design/icons'
import { Button, Empty } from 'antd'
import { useContext, useState } from 'react'
import { getData } from '../../utils'
import ChartWrapper from './ChartWrapper'
import ModalOptions from './ModalOptions'



const Visualization = ({tableName}:any) => {
    const chatContext = useContext(ChatContext)
    const tableData = chatContext?.tableData?.[tableName]

    const [showChart, setShowChart] = useState(false)
    const [showChartModal, setShowChartModal] = useState(false)

    const [chartData, setChartData] = useState<any>(null)

    const handleChartData = (data:any) => {
        setShowChart(true)
        setShowChartModal(false)
        setChartData(data)
    }


    const columns = tableData?.dataGridColumns?.map((obj:any) => {return {label: obj.title, value: obj.dataIndex}})
    
    return (
        <div>
             {!chartData ? 
                <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{ height: 60 }}
                    description={
                    <span>
                        Customize Visualizations
                    </span>
                    }
                >
                <Button type="primary" onClick={() => setShowChartModal(true)}>Create a Chart</Button>
                </Empty> : showChart && (
                    <div>
                        <SettingOutlined onClick={() => setShowChartModal(true)} style={{display:'flex', margin: '0px 30px', justifyContent:'flex-end'}}/>
                        {ChartWrapper({...chartData})}
                    </div>
                )}
                <ModalOptions columns={columns} showChartModal={showChartModal} setShowChartModal={setShowChartModal} handleChartData={handleChartData} tableName={tableName}/>
        </div>
    )
}

export default Visualization