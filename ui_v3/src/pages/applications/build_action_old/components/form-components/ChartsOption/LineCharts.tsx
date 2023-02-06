import {Box} from "@mui/material"
import ReactEcharts from "echarts-for-react"; 
const LineChart =(props: { titleName: String; xTitle: String; yTitle: String; XData?: any[]; YData?:any[], isStack?:boolean,  areaStyle?: boolean})=>{

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
            data: props.XData||['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            name: props.xTitle
          },
          yAxis: {
            type: 'value',
            name: props.yTitle
          },
          series: props?.YData || [],
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
        <Box sx={{border:'1px solid black',p:5, m:3}}>
            <ReactEcharts option={LineChar} />
        </Box>
    )
}

export default LineChart;