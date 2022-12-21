import React from 'react'
import {
    Line,
    XAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ComposedChart,
    YAxis,
    ReferenceArea,
  } from "recharts";

const ChartFilter = ({
    onMouseDown,
    onMouseMove,
    onMouseUp,
    data,
    xAxisDataKey,
    zoomOut,
    xAxisDomain,
    yAxisDomain,
    dataKey,
    colorKey,
    refAreaLeft,
    refAreaRight,
  }) => {
    console.log(data)
    return (
      <div>
        <button type="button" className="btn update" onClick={zoomOut}>
          Zoom Out
        </button>
        <ComposedChart
          width={1000}
          height={600}
          data={data}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          yAxisId="1"
        >
          <XAxis
            allowDataOverflow
            dataKey={xAxisDataKey}
            domain={xAxisDomain}
            type="number"
          />
          <YAxis
            allowDataOverflow
            domain={yAxisDomain}
            type="number"
            yAxisId="1"
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
  
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={colorKey}
            activeDot={{ r: 8 }}
            yAxisId="1"
          />
  
          {refAreaLeft && refAreaRight ? (
            <ReferenceArea
              yAxisId="1"
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
            />
          ) : null}
        </ComposedChart>
      </div>
    );
  };
  
  export default ChartFilter;