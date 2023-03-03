import { Pagination, Table } from 'antd'
import { useState } from 'react';
import { OutputTableStyled } from '../successActionOutput.styles'

let pageSize = 6;

const getData = (current:number, pageSize:number, data:any) => {
    // Normally you should get the data from the server
    return data.slice((current - 1) * pageSize, current * pageSize);
  };

  // Custom pagination component
const MyPagination = ({ total, onChange, current }:any) => {
    return (
    <div style={{marginTop:'10px', width:'100%', textAlign:'center'}}>
      <Pagination
        onChange={onChange}
        total={total}
        current={current}
        pageSize={6}
      />
      </div>
    );
  };
  

const TableComponent = ({dataGridColumns,dataGridRows, title}:any) => {

    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            <div>
                {title}
            </div>
            <OutputTableStyled>
                <Table
                    columns={dataGridColumns}
                    dataSource={getData(currentPage, pageSize, dataGridRows)}
                    size="small"
                    pagination={false}
                    bordered={true}
                />
                <MyPagination
                    total={dataGridRows.length}
                    current={currentPage}
                    onChange={setCurrentPage}
                />
            </OutputTableStyled>
        </div>
    )
}

export default TableComponent