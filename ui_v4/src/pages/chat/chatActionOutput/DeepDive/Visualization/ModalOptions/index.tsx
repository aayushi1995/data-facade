import ChartType from '@/helpers/enums/ChartType'
import { Button, Modal, Popover, Select, Switch, Typography } from 'antd'
import React, { useState } from 'react'
import { getData } from '../../../../utils'
import ChartOptions from './ChartOptions'
import { ChartConfigModalStyled, SelectWrapper, StyledOptionWrap, OptionWrapperStyled, SelectedValueStyled} from './ChartOptions.styles'
import { ReactComponent as LineIcon } from '@assets/icons/line.svg'
import { ReactComponent as LineAggregrateIcon } from '@assets/icons/line.svg'
import { ReactComponent as BarIcon } from '@assets/icons/bar.svg'
import { ReactComponent as AggregrateBarIcon } from '@assets/icons/aggregrateBar.svg'
import { ReactComponent as PieIcon } from '@assets/icons/pie.svg'
import { ReactComponent as AggregratePieIcon } from '@assets/icons/aggregratePie.svg'
import { ReactComponent as LineBarIcon } from '@assets/icons/line.svg'
import { ReactComponent as ScatterIcon } from '@assets/icons/scatter.svg'
import Input from 'antd/es/input/Input'
import { DownOutlined } from '@ant-design/icons'



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

                    <label>Chart Type</label>

                    <Select
                        style={{width:'100%'}}
                        onChange={handleChartType}
                        options={types}
                    />
                    {/* <SelectedValueStyled onClick={handleShowSelect}>
                        <Input type="text" value={chartType?.label || "Choose Chart Type"} width="300px" />
                        <DownOutlined />
                    </SelectedValueStyled>

                    {showSelect && 
                        <StyledOptionWrap>
                            {types?.map((chartType:any) => (
                                <Select.Option>
                                        <OptionWrapperStyled onClick={() => handleChartType(chartType?.value)}>
                                            <div>{getIcon(chartType?.value)}</div>
                                            <div>{chartType?.label}</div>
                                        </OptionWrapperStyled>
                                </Select.Option>
                            ))}
                        </StyledOptionWrap>
                    } */}


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
            return <LineIcon width="20" height="30"/>
        }
        case "aggregrateLine": {
            return <LineAggregrateIcon width="20" height="30"/>
        }
        case "bar": {
            return <BarIcon width="20" height="30"/>
        }
        case "aggregrateBar": {
            return <AggregrateBarIcon width="20" height="30"/>
        }
        case "pie": {
            return <PieIcon width="20" height="30"/>
        }
        case "aggregratePie": {
            return <AggregratePieIcon width="20" height="30"/>
        }
        case "linebar": {
            return <LineBarIcon width="20" height="30"/>
        }
        case "scatter": {
            return <ScatterIcon width="20" height="30"/>
        }
        default: {
            <LineAggregrateIcon width="20" height="30"/>
        }
    }
}