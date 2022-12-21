import React, { useState } from "react";
import ChartConfig from "./ChartConfig/ChartConfig";
import Chart from "./Chart/Chart";
import { defaultConfig, debouncedMethod } from "../../Utils/utils";
import './ChartParent.style.css'

const ChartParent = ({ columns, chartData }) => {
  let cols=[...columns]
  cols.shift();

  let [chartConfiguration, setChartConfiguration] = useState({
    ...defaultConfig,
  });
  let [chartType, setChartType] = useState('');

  //chart Config Handlers
  const handleDataKeyChange = (value) => {
    setChartConfiguration({
      ...chartConfiguration,
      dataKey: value,
    });
  };

  const handleXAxisChange = (value) => {
    setChartConfiguration({
      ...chartConfiguration,
      xAxisDataKey: value,
    });
  };

  const handleColorChange = (event) => {
    setChartConfiguration({
      ...chartConfiguration,
      colorKey: event.target.value,
    });
  };

  const handleChartType = (value) => {
    setChartType(value);
  };

  const handleChartFilter = () => {
    setChartConfiguration({
      ...chartConfiguration,
      chartFilter: !chartConfiguration.chartFilter,
    });
  }

  // debounced Method not working fine. need to figure that out
  const deBouncedColorChanger = debouncedMethod(handleColorChange, 300);

  return (
    <div className="ChartContainer">
        <ChartConfig
          chartType={chartType}
          columns={cols}
          handleChartType={handleChartType}
          handleDataKeyChange={handleDataKeyChange}
          handleXAxisChange={handleXAxisChange}
          handleColorChange={handleColorChange}
          handleChartFilter={handleChartFilter}
          {...chartConfiguration}
        />
        <Chart chartData={chartData} chartType={chartType} {...chartConfiguration} />
    </div>
  );
};

export default ChartParent