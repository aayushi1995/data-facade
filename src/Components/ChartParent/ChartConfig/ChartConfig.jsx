import React, { useState } from "react";
import {
  discardOptionFromArray,
  chartType,
  chartTypeIcons,
} from "../../../Utils/utils";
import "./ChartConfig.style.css";

const ChartConfigOptionComponent = ({
  array,
  handleChange,
  value,
  labelId,
  label,
}) => {
  return (
    <div className="ChartConfigOption">
      <label HTMLFor={labelId}>{label}</label>
      <select name={labelId} id={labelId} onChange={handleChange}>
        {array.map((optionValue) => {
          return (
            <option
              key={optionValue}
              value={optionValue}
              selected={optionValue === value}
            >
              {optionValue}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const ChartConfig = ({
  columns,
  handleDataKeyChange,
  handleXAxisChange,
  handleColorChange,
  handleChartFilter,
  handleChartType,
  colorKey,
  xAxisDataKey,
  dataKey,
  chartFilter,
}) => {
  let [columnsDataKey, setColummnsDataKey] = useState([...columns]);
  let [columnsXAxis, setColumnsXAxis] = useState([...columns]);

  const handleDataKeyChangeClick = (event) => {
    setColumnsXAxis(discardOptionFromArray(columns, event.target.value));
    handleDataKeyChange(event.target.value);
  };

  const handleXAxisChangeClick = (event) => {
    setColummnsDataKey(discardOptionFromArray(columns, event.target.value));
    handleXAxisChange(event.target.value);
  };

  return (
    <div className="ChartConfiguration">
      <div className="ChartConfigOption">
        <label HTMLFor="chartType">Chart Type</label>
        <div className="chartOptionModal">
          {Object.values(chartType).map((optionValue, index) => {
            return (
              <button
                className="square"
                key={optionValue}
                value={optionValue}
                onClick={() => handleChartType(optionValue)}
              >
                <img
                  alt={chartTypeIcons}
                  src={`../img/${chartTypeIcons[index]}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <ChartConfigOptionComponent
        labelId="Xkey"
        label="X Axis"
        handleChange={handleXAxisChangeClick}
        value={xAxisDataKey}
        array={columnsXAxis}
      />

      <ChartConfigOptionComponent
        labelId="Ykey"
        label="Y Axis"
        handleChange={handleDataKeyChangeClick}
        value={dataKey}
        array={columnsDataKey}
      />

      <div className="ChartConfigOption">
        <label HTMLFor="colorKey">Color</label>
        <input
          className="colorContainer"
          type="color"
          id="colorKey"
          name="colorKey"
          onChange={handleColorChange}
          value={colorKey}
        />
      </div>

      <div className="ChartConfigOption">
        <label HTMLFor="chartFilter">Enable Chart Filtering</label>
        <input
          type="checkbox"
          id="chartFilter"
          name="chartFilter"
          value={chartFilter}
          onChange={handleChartFilter}
        />
      </div>
    </div>
  );
};

export default ChartConfig;
