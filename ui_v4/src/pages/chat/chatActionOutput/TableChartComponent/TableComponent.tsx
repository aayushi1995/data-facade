import { Table } from 'antd'
import { OutputTableStyled } from '../successActionOutput.styles'


const TableComponent = ({dataGridColumns,dataGridRows, title}:any) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            <div>
                {title}
            </div>
            <OutputTableStyled>
                <Table
                    columns={dataGridColumns}
                    dataSource={dataGridRows}
                    size="small"
                    pagination={false}
                    bordered={true}
                />
            </OutputTableStyled>
        </div>
    )
}

export default TableComponent