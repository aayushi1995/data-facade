import ReactEcharts from "echarts-for-react"; 
const LineChart =(props: {  xaxis?: String; yaxis?: String; data?:any})=>{
    console.log(props.data)

    let LineChar = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        show:false,
      },
      xAxis: [
        {
          type: 'category',
          data: props.xaxis || [],
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '',
        },
        {
          type: 'value',
          name: '',
        }
      ],
      series: props.data || []
    };

    return(
        <div>
            <ReactEcharts option={LineChar} />
        </div>
    )
}

export default LineChart;