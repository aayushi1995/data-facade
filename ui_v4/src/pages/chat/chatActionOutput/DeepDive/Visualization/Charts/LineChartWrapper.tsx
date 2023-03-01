
import ReactEcharts from "echarts-for-react"; 

const LineChartWrapper =(props: { xaxis?:any[]; yaxis?:any[], data?: any[]})=>{

    const LineChar = {
        legend: {},
        title: {
            left: 'center',
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            position: function (pt: any[]) {
              return [pt[0], '10%'];
            }
          },
        xAxis: {
            type: 'category',
            title: 'yaxis',
            // data: props.XData ||['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: props.xaxis
          },
          yAxis: {
            type: 'value',
            title: 'xaxis'
          },
          series: [{
            data: props.data,
            type: 'line',
            smooth: true
          }],
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              start: 0,
              end: 100
            }
          ],
          toolbox: {
            show: false,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
            }
          },
    }; 

    return(
        <div>
            <ReactEcharts option={LineChar} />
        </div>
    )
}

export default LineChartWrapper;