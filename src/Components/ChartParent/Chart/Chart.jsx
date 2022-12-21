import React from "react";
import {
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  YAxis,
  ReferenceArea
} from "recharts";
import ChartType from "./ChartType";
import './Chart.style.css'

import { initialState, getAxisYDomain } from "../../../Utils/utils";

const Chart = ({ chartData, chartType, ...rest }) => {
  let [state, setState] = React.useState({ ...initialState, data: chartData });

  const props = {
    chartType: chartType,
    ...rest,
  };

  //filter functions

  const zoom = () => {
    let { refAreaLeft, refAreaRight } = state;

    const data = state.data;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setState(() => ({
        ...state,
        refAreaLeft: "",
        refAreaRight: "",
      }));
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight) {
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
    }

    // yAxis domain
    const [bottom, top] = getAxisYDomain(
      refAreaLeft,
      refAreaRight,
      rest.dataKey,
      1,
      data
    );

    setState(() => ({
      refAreaLeft: "",
      refAreaRight: "",
      data: data,
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top,
    }));
  };

  const zoomOut = () => {
    setState(() => ({
      data: state.data,
      refAreaLeft: "",
      refAreaRight: "",
      left: "dataMin",
      right: "dataMax",
      top: "dataMax+1",
      bottom: "dataMin",
    }));
  };

  const { data, refAreaLeft, refAreaRight} = state;

  return rest.chartFilter ? (
    <div>
      <button className="zoomOutButton" type="button" onClick={zoomOut}>
        Zoom Out
      </button>
      <ComposedChart
        width={1000}
        height={600}
        data={data}
        onMouseDown={(e) => {
          setState({ ...state, refAreaLeft: e.activeLabel });
        }}
        onMouseMove={(e) =>
          state.refAreaLeft &&
          setState({ ...state, refAreaRight: e.activeLabel })
        }
        onMouseUp={zoom}
      >
        <XAxis
          allowDataOverflow
          dataKey={rest.xAxisDataKey}
          domain={[state.left, state.right]}
          type="number"
        />
        <YAxis
          allowDataOverflow
          domain={[state.bottom, state.top]}
          type="number"
          yAxisId="1"
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />

        <Line
          type="monotone"
          dataKey={rest.dataKey}
          stroke={rest.colorKey}
          activeDot={{ r: 8 }}
          yAxisId="1"
        />

        {state.refAreaLeft && state.refAreaRight ? (
          <ReferenceArea
            yAxisId="1"
            x1={refAreaLeft}
            x2={refAreaRight}
            strokeOpacity={0.3}
          />
        ) : null}
      </ComposedChart>
    </div>
  ) : (
    <div>
      <ComposedChart width={1000} height={600} data={state.data}>
        <XAxis dataKey={rest.xAxisDataKey} />
        <YAxis dataKey={rest.yAxisDataKey} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        {ChartType({ ...props })}
      </ComposedChart>
    </div>
  );
};

export default Chart;
