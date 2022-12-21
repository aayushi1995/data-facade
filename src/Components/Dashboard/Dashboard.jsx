import React, { useState, useRef } from "react";
import "./dashboard.style.css";
import Papa from "papaparse";
import HeaderText from "../Header/Header";
import Pagination from "../Pagination/Pagination";
import {
  preparePaginatedData,
  prepareChartData,
  
} from "../../Utils/utils";
import TableContainer from "../Table/TableContainer";
import ChartParent from '../ChartParent/ChartParent';

const Dashboard = () => {
  
  let totalRows = useRef([]);
  let [columns, setColumns] = useState([]);
  let [rows, setRows] = useState([]);
  

  // need improve chart states
  let [showChart, setShowChart] = useState(false);
  let [chartData, setChartData] = useState([]);

  let handleUpload = async (event) => {
    const file = event.target.files[0];
    await Papa.parse(file, {
      complete: (results, file) => {
        //initialize cols and rows and total rows

        let col = [...results.data[0]];
        let rows = [...results.data];
        rows.shift();
        setColumns(col);
        totalRows.current = [...preparePaginatedData(rows)];
        setRows(totalRows.current[0]);

        //chart data
        setChartData([...prepareChartData(totalRows.current[0], col)]);
      },
    });
  };

  const generateChart = (value) => {
    setShowChart(value);
  };
  
  return (
    <div className="container">
      <div className="tealNavigation"></div>
      <div className="mainContainer">
        <HeaderText />
        <TableContainer
          columns={columns}
          rows={rows}
          handleUpload={handleUpload}
          generateChart={generateChart}
          showChart={showChart}
        />
        <Pagination />
        {showChart && <ChartParent columns={columns} chartData={chartData}/>}
      </div>
    </div>
  );
};

export default Dashboard;
