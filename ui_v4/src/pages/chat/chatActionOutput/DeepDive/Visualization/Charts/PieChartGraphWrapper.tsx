import ReactEcharts from "echarts-for-react"; 
const PieChartWrapper =(props:{xaxis?: String; data?:any})=>{

    const Pie = {
        title: {
            text:'',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: props?.xaxis,
              type: 'pie',
              radius: '50%',
              data: props.data || [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
    }; 



    return(
        <div>
            <ReactEcharts option={Pie} />
        </div>
    )
}

export default PieChartWrapper;