import {Box} from "@mui/material"
import ReactEcharts from "echarts-for-react"; 
const PieChart =(props:{titleName: String; data?:any})=>{

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
              name: 'Access From',
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
        <Box sx={{border:'1px solid black',p:5, m:3}}>
            <ReactEcharts option={Pie} />
        </Box>
    )
}

export default PieChart;