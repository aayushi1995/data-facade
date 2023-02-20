import ReactEcharts from "echarts-for-react"; 

const ScatterChartGraphWrapper =(props:{xaxis?:any, yaxis?:any, data?:any[]})=>{

    const Scatter = {
        
        dataset: [
            {
              source: props?.data || [
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
            name: props.xaxis
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            name: props.yaxis
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
        <div>
            <ReactEcharts option={Scatter} />
        </div>
    )
}

export default ScatterChartGraphWrapper;