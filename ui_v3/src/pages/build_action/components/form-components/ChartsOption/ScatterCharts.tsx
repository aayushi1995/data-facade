import {Box} from "@mui/material"
import ReactEcharts from "echarts-for-react"; 
const ScatterChart =(props:{titleName: String; xTitle: String; yTitle: String;})=>{

    const Scatter = {
        
        dataset: [
            {
              source: [
                [1, 4862.4],
                [2, 5294.7],
                [3, 5934.5],
                [4, 7171.0],
                [5, 8964.4],
                [6, 10202.2],
                [7, 11962.5],
                [8, 14928.3],
                [9, 16909.2],
                [10, 18547.9],
                [11, 21617.8],
                [12, 26638.1],
                [13, 34634.4],
                [14, 46759.4],
                [15, 58478.1],
                [16, 67884.6],
                [17, 74462.6],
                [18, 79395.7]
              ]
            },
            {
              transform: {
                type: 'ecStat:regression',
                config: {
                  method: 'exponential'
                  // 'end' by default
                  // formulaOn: 'start'
                }
              }
            }
          ],
          title: {
            text: props.titleName,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          xAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            name: props.xTitle
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            name: props.yTitle
          },
          series: [
            {
              name: 'scatter',
              type: 'scatter',
              datasetIndex: 0
            },
          ]
    }; 



    return(
        <Box sx={{border:'1px solid black',p:5, m:3}}>
            <ReactEcharts option={Scatter} />
        </Box>
    )
}

export default ScatterChart;