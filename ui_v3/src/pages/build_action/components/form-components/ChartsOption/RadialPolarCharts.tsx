import {Box} from "@mui/material"
import ReactEcharts from "echarts-for-react"; 
const RadialPolarChart =(props: {
  titleName: String;
  xTitle: String;
  yTitle: String;
  segmentCol: String})=>{

    const RadialPolar = {
      title: {
        text: props.titleName,
        left: 'left'
      },
        angleAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          radiusAxis: {},
          polar: {},
          series: [
            {
              type: 'bar',
              data: [1, 2, 3, 4, 3, 5, 1],
              coordinateSystem: 'polar',
              name: 'A',
              stack: 'a',
              emphasis: {
                focus: 'series'
              }
            },
            {
              type: 'bar',
              data: [2, 4, 6, 1, 3, 2, 1],
              coordinateSystem: 'polar',
              name: 'B',
              stack: 'a',
              emphasis: {
                focus: 'series'
              }
            },
            {
              type: 'bar',
              data: [1, 2, 3, 4, 1, 2, 5],
              coordinateSystem: 'polar',
              name: 'C',
              stack: 'a',
              emphasis: {
                focus: 'series'
              }
            }
          ],
          legend: {
            show: true,
            data: ['A', 'B', 'C']
          }
    }; 



    return(
        <Box sx={{border:'1px solid black',p:5, m:3}}>
            <ReactEcharts option={RadialPolar} />
        </Box>
    )
}

export default RadialPolarChart;