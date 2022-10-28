import {Box} from "@mui/material"
import ReactEcharts from "echarts-for-react"; 
const BarChart =()=>{
    
    const Bar = {
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
              data: [120, 200, 150, 80, 70, 110, 130],
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
            <ReactEcharts option={Bar} />;
        </Box>
    )
}

export default BarChart;