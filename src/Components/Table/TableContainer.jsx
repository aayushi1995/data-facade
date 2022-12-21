import React from 'react'
import './tableContainer.style.css'
import TableHeader from './TableHeader/TableHeader'
import Table from './Table/Table'
import FileUpload from '../FileUpload/FileUpload'

const TableContainer = (props) =>  {
    return (
      <div className="tableContainer">
        <TableHeader allowGenerateChart={props.rows.length > 1} generateChart={props.generateChart} showChart={props.showChart}/>
        <FileUpload handleUpload={props.handleUpload}/>
        {!props.showChart && <Table {...props}/>}
      </div>
      
    )
  }

  export default TableContainer