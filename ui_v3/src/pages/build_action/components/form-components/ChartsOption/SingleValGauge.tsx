import {Box} from "@mui/material"
import ReactEcharts from "echarts-for-react"; 
const SingleValChart =(props: {titleName: String;})=>{

    const single = {
      title: {
        text: props.titleName,
        left: 'center'
      },
        series: [
            {
              type: 'gauge',
              progress: {
                show: true,
                width: 18
              },
              axisLine: {
                lineStyle: {
                  width: 18
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                length: 15,
                lineStyle: {
                  width: 2,
                  color: '#999'
                }
              },
              axisLabel: {
                distance: 25,
                color: '#999',
                fontSize: 10
              },
              anchor: {
                show: true,
                showAbove: true,
                size: 25,
                itemStyle: {
                  borderWidth: 10
                }
              },
              title: {
                show: false
              },
              detail: {
                valueAnimation: true,
                fontSize: 50
                
                ,
                offsetCenter: [0, '70%']
              },
              data: [
                {
                  value: 70
                }
              ]
            }
          ]
    }; 



    return(
        <Box sx={{border:'1px solid black',p:5, m:3}}>
            <ReactEcharts option={single} />
        </Box>
    )
}

export default SingleValChart;