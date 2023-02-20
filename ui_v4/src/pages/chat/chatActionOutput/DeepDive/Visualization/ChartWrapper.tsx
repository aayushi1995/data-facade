import React from 'react'
import LineChartWrapper from './Charts/LineChartWrapper'
import BarGraphWrapper from './Charts/BarGraphWrapper'
import LineBarGraphWrapper from './Charts/LineBarGraphWrapper'
import PieChartWrapper from './Charts/PieChartGraphWrapper'
import ScatterChartWrapper from './Charts/ScatterChartGraphWrapper'

const ChartWrapper = ({chartType, ...props}:any):JSX.Element => {
    switch (chartType){
        case 'line': {
            return <LineChartWrapper {...props}/>
        }
        case 'bar': {
            return <BarGraphWrapper {...props}/>
        }
        case 'linebar': {
            return <LineBarGraphWrapper {...props}/>
        }
        case 'pie': {
            return <PieChartWrapper {...props}/>
        }
        case 'scatter': {
            return <ScatterChartWrapper {...props}/>
        }
        default: {
            return <div>Something went wrong</div>
        }
            
    }   
}

export default ChartWrapper