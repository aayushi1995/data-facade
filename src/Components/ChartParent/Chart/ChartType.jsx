import React from 'react'
import { chartType } from '../../../Utils/utils';
import {
    Bar,
    Area,
    Line,
    Scatter,
  } from "recharts";


const ChartType = ({ chartType, dataKey, colorKey }) => {
    switch (chartType) {
      case "Line Chart":
        return (
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={colorKey}
            activeDot={{ r: 8 }}
          
          />
        );
  
      case "Area Chart":
        return (
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={colorKey}
            fill={colorKey}
            
          />
        );
  
      case "Bar Chart":
        return <Bar dataKey={dataKey} fill={colorKey} />;
  
      case "Scatter Chart":
        return (
          <Scatter
            type="monotone"
            dataKey={dataKey}
            stroke="#000000"
            fill={colorKey}
           
          />
        );
  
      case "Composed Line Bar Chart":
        return (
          <React.Fragment>
            <Bar dataKey={dataKey} barSize={20} fill={colorKey}  />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={colorKey}
              
            />
          </React.Fragment>
        );
  
      default:
        return (
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={colorKey}
            activeDot={{ r: 8 }}
            
          />
        );
    }
  };

  export default ChartType