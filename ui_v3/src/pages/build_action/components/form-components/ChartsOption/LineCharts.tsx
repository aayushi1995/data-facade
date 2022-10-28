import {Box} from "@mui/material"
import ReactEcharts from "echarts-for-react"; 
const LineChart =()=>{

    const LineChar = {
        title: {
            left: 'center',
            text: 'Large Ara Chart'
          },
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [150, 230, 224, 218, 135, 147, 260],
              type: 'line'
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