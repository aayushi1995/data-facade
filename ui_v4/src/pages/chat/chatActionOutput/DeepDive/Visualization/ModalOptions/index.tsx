import ChartType from '@/helpers/enums/ChartType'
import { Button, Modal, Popover, Select, Switch, Typography } from 'antd'
import React, { useState } from 'react'
import { getData } from '../../../../utils'
import ChartOptions from './ChartOptions'
import { ChartConfigModalStyled, SelectWrapper } from './ChartOptions.styles'
import AggregationChartOptions from './AggregationChartOptions'
import { FlexBox } from '@/pages/chat/ChatFooter/ChatFooter.styles'
import Title from 'antd/es/skeleton/Title'

const type = (aggregration?:boolean) => {
    return !aggregration ? ['line', 'bar', 'linebar', 'pie', 'scatter'] : ['line', 'bar', 'pie']
}

const ModalOptions = ({ handleChartData, tableName }:any) => {

    const [chartType, setChartType] = useState<any | undefined>()
    const [showAdvancedAggregation, setShowAdvancedAggregation] = useState(false)

    const handleChartType = (type:string) => {
        setChartType(type)
    } 

    const handleShowAggregationOptions = () => {
        setShowAdvancedAggregation(!showAdvancedAggregation)
    }

    return (
        <>
            <FlexBox> 
                <Switch defaultChecked={false} onChange={handleShowAggregationOptions} /><Typography.Title style={{marginLeft:'20px'}} level={5}>{!showAdvancedAggregation ? "Perform Aggregations" : "Perform Basic Chart Visualizations"}</Typography.Title>
            </FlexBox>
            <ChartConfigModalStyled>
                
                <SelectWrapper>
                    <label>Chart Type</label>
                    <Select
                        style={{ width: "100%" }}
                        onChange={handleChartType}
                        options={type(showAdvancedAggregation).map((chart:any) => {return {label: chart, value: chart}})}
                    />
                </SelectWrapper>
               
                 {!showAdvancedAggregation && chartType && <ChartOptions type={chartType} handleChartData={handleChartData} tableName={tableName}/>}
                 
                 <FlexBox>
                 {showAdvancedAggregation && <AggregationChartOptions type={chartType} handleChartData={handleChartData} tableName={tableName}/>}

                 </FlexBox>
                
            </ChartConfigModalStyled>
        </>
    )
}
export default ModalOptions

