import React from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import more from 'highcharts/highcharts-more';


const options = {

    chart: {
        type: 'columnrange',
        inverted: true
    },

    title: {
        text: 'Column range for Integers'
    },

    xAxis: {
        categories: ['Age', 'Salary', 'House Rent', 'Savings']
    },

    yAxis: {
        title: {
            text: 'Values'
        }
    },

    plotOptions: {
        columnrange: {
            dataLabels: {
                enabled: true,
                format: '{y}'
            }
        }
    },

    legend: {
        enabled: false
    },

    series: [{
        name: 'Values',
        data: [
            [23, 60],
            [1000, 5000],
            [4000, 10000],
            [-100, 4000]
        ]
    }]

}


const ColumnRangeChartVisualizer = (props) => {

    more(Highcharts)

    return (
        <>
            {(props.options !== undefined) ? <HighchartsReact highCharts={Highcharts} options={props.options}/> :
                <HighchartsReact highCharts={Highcharts} options={options}/>}
        </>
    )
}

export default ColumnRangeChartVisualizer