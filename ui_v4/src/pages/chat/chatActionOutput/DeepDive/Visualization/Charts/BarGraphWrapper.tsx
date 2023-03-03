import ReactEcharts from "echarts-for-react"; 
const BarGraphWrapper =(props: { xaxis?: any, yaxis?:any, data?:any})=>{
    
    const Bar = {
        legend: {},
        title: {
            left: 'center',
            text:""
          },
          tooltip: {
            trigger: 'axis',
            position: function (pt:any) {
              return [pt[0], '10%'];
            }
          },
        xAxis: {
            type: 'category',
            data: props.xaxis || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: props?.data || [],
              type: 'bar'
            }
          ],
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
            <ReactEcharts option={Bar} />
        </div>
    )
}

export default BarGraphWrapper;