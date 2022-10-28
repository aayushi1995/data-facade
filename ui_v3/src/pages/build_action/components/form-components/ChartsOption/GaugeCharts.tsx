import {Box} from "@mui/material"
import ReactEcharts from "echarts-for-react"; 
const GaugeChart =()=>{

    const Gauge = {
        
          series: [
            {
              name: 'Pressure',
              type: 'gauge',
              progress: {
                show: true
              },
              detail: {
                valueAnimation: true,
                formatter: '{value}'
              },
              data: [
                {
                  value: 50,
                  name: 'SCORE'
                }
              ]
            }
          ]
    }; 



    return(
        <Box sx={{border:'1px solid black',p:5, m:3}}>
            <ReactEcharts option={Gauge} />
        </Box>
    )
}

export default GaugeChart;