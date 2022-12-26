import {Box} from "@mui/material"
import ReactEcharts from "echarts-for-react"; 

const SankeyChart =(props: {titleName: String;})=>{

    const Sankey = {
      title: {
        text: props.titleName,
        left: 'center'
      },
        series: {
            type: 'sankey',
            layout: 'none',
            emphasis: {
              focus: 'adjacency'
            },
            data: [
              {
                name: 'a'
              },
              {
                name: 'b'
              },
              {
                name: 'a1'
              },
              {
                name: 'a2'
              },
              {
                name: 'b1'
              },
              {
                name: 'c'
              }
            ],
            links: [
              {
                source: 'a',
                target: 'a1',
                value: 5
              },
              {
                source: 'a',
                target: 'a2',
                value: 3
              },
              {
                source: 'b',
                target: 'b1',
                value: 8
              },
              {
                source: 'a',
                target: 'b1',
                value: 3
              },
              {
                source: 'b1',
                target: 'a1',
                value: 1
              },
              {
                source: 'b1',
                target: 'c',
                value: 2
              }
            ]
          }
    }; 



    return(
        <Box sx={{border:'1px solid black',p:5, m:3}}>
            <ReactEcharts option={Sankey} />
        </Box>
    )
}

export default SankeyChart;