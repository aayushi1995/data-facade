import ChartType from '@/helpers/enums/ChartType'
import { Button, Modal, Popover, Select, Switch, Typography } from 'antd'
import React, { useState } from 'react'
import { getData } from '../../../../utils'
import ChartOptions from './ChartOptions'
import { ChartConfigModalStyled, SelectWrapper, StyledLabel, ChartTypeSelectWrapper, ChartTypeSelect, ChartTypeBlock} from './ChartOptions.styles'
import { ReactComponent as LineIcon } from '@assets/icons/line.svg'
import { ReactComponent as LineAggregrateIcon } from '@assets/icons/line.svg'
import { ReactComponent as BarIcon } from '@assets/icons/bar.svg'
import { ReactComponent as AggregrateBarIcon } from '@assets/icons/aggregrateBar.svg'
import { ReactComponent as PieIcon } from '@assets/icons/pie.svg'
import { ReactComponent as AggregratePieIcon } from '@assets/icons/aggregratePie.svg'
import { ReactComponent as LineBarIcon } from '@assets/icons/line.svg'
import { ReactComponent as ScatterIcon } from '@assets/icons/scatter.svg'
import './styles.css'



const ModalOptions = ({ handleChartData, tableName }:any) => {
    const [chartType, setChartType] = useState<any | undefined>()
    const handleChartType = (type:any) => {
        setChartType(type)
    } 
    const [showSelect, setShowSelect] = useState(false)

    const handleShowSelect = () => {
        setShowSelect(true)
    }

    return (
        <>
            <ChartConfigModalStyled>
                <SelectWrapper>
                    <ChartTypeSelectWrapper>
                        <StyledLabel>Chart Type *</StyledLabel>
                        <ChartTypeSelect
                            
                            style={{width:'100%'}}
                            onChange={handleChartType}
                            value={chartType}
                        >
                        
                            {types?.map((obj:any) => {
                                return (
                                    <Select.Option key={obj?.value} className="ChartTypeOptions">
                                        <ChartTypeBlock>
                                            <div className='charticon'>{getIcon(obj?.value)}</div>
                                            <div>{obj?.label}</div>
                                        </ChartTypeBlock>
                                    </Select.Option>
                                )
                            })}
                       
                        

                        </ChartTypeSelect>
                    </ChartTypeSelectWrapper>
                </SelectWrapper>
                {chartType && <ChartOptions type={chartType} handleChartData={handleChartData} tableName={tableName}/>}
                
            </ChartConfigModalStyled>
        </>
    )
}
export default ModalOptions



const types = [{
    label: 'Line',
    value: 'line'
},
{
    label: 'Aggregrate Line',
    value: 'aggregrateLine'
},
{
    label: 'Bar',
    value: 'bar'
},
{
    label: 'Aggregrate Bar',
    value: 'aggregrateBar'
},
{
    label: 'Pie',
    value: 'pie'
},
{
    label: 'Pie',
    value: 'aggregratePie'
},
{
    label: 'Line Bar',
    value: 'linebar'
},
{
    label: 'Scatter',
    value: 'scatter'
}
]


const getIcon = (id:string) => {
    switch (id) {
        case "line": {
            return <LineIcon width="50" height="50"/>
        }
        case "aggregrateLine": {
            return <LineAggregrateIcon width="50" height="50"/>
        }
        case "bar": {
            return <BarIcon width="50" height="50"/>
        }
        case "aggregrateBar": {
            return <AggregrateBarIcon width="50" height="50"/>
        }
        case "pie": {
            return <PieIcon width="50" height="50"/>
        }
        case "aggregratePie": {
            return <AggregratePieIcon width="50" height="50"/>
        }
        case "linebar": {
            return <LineBarIcon width="50" height="50"/>
        }
        case "scatter": {
            return <ScatterIcon width="50" height="50"/>
        }
        default: {
            <LineAggregrateIcon width="50" height="50"/>
        }
    }
}