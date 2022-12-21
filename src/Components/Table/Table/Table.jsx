import React from 'react'
import './table.style.css'

const Table = ({columns, rows}) => {
    return (
        <table className="customTable">
          <tr className="columnContainer">
            {columns.map((col, index) => <th className="col" key={index}>{col}</th>)}
          </tr>
            {rows.map((row,index1) => {
              return <tr className="rows">{row.map((element, index2) => <td key={`${index1}${index2}`}>{element}</td>)}</tr>
            }
            )}
        </table>
    )
}

export default Table