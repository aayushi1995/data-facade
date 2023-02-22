import { Table } from 'antd'
import { OutputTableStyled } from '../successActionOutput.styles'


const TableComponent = ({dataGridColumns,dataGridRows}:any) => {
    return (
        <OutputTableStyled>
            <Table
                columns={dataGridColumns}
                dataSource={dataGridRows}
                size="small"
                pagination={false}
                bordered={true}
            />
        </OutputTableStyled>
    )
}

export default TableComponent