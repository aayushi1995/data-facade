import ChartType from '@/helpers/enums/ChartType'
import { Button, Modal, Popover, Select, Switch } from 'antd'
import React, { useState } from 'react'
import { getData } from '../../../utils'
import ChartOptions from './ChartOptions'
import { ChartConfigModalStyled, SelectWrapper } from './ChartOptions.styles'

const type = ['line', 'bar', 'linebar', 'pie', 'scatter']

const ModalOptions = ({showChartModal, setShowChartModal, handleChartData, tableName }:any) => {

    const [chartType, setChartType] = useState<any | undefined>()


    const handleChartType = (type:string) => {
        setChartType(type)
    } 

    const handleModalOK = () => {
        // setShowChart(true)
        setShowChartModal(false)
    }

    return (
        // <Modal centered title="Chart Settings" open={showChartModal} onOk={handleModalOK} onCancel={() => setShowChartModal(false)} footer={null}>
            <ChartConfigModalStyled>
                <SelectWrapper>
                    <label>Chart Type</label>
                    
                    <Select
                        style={{ width: "100%" }}
                        onChange={handleChartType}
                        options={type.map((chart:any) => {return {label: chart, value: chart}})}
                    />
                </SelectWrapper>
               
                 {chartType && <ChartOptions type={chartType} handleChartData={handleChartData} tableName={tableName}/>}
            </ChartConfigModalStyled>
           
        // </Modal>
    )
}
export default ModalOptions

