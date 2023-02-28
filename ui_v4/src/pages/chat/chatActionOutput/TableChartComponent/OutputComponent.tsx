import { ReactComponent as ChartIcon } from '@assets/icons/bar_chart.svg';
import { ReactComponent as TableIcon } from '@assets/icons/table.svg';
import { Tabs } from 'antd';
import Visualization from '../DeepDive/Visualization';
import { TabsWrapper } from './OutputComponent.styles';
import TableComponent from './TableComponent';

const items = (dataGridColumns:any, dataGridRows:any, tableName:string, label?: string) => {
    return [
        {
          key: '1',
          label: <div><TableIcon/></div>,
          children: <TableComponent dataGridColumns={dataGridColumns} dataGridRows={dataGridRows} title={label}/>,
        },
        {
          key: '2',
          label: <div><ChartIcon/></div>,
          children:  <Visualization tableName={tableName}/>,
        },
       
      ];
}
const OutputComponent = ({dataGridColumns, dataGridRows,title, tableName}:any) => {

    const onChange = (key: string) => {
        console.log(key);
      };

    return (
        <div style={{width: '100%',minWidth:'400px'}}>
                {/* <Typography.Text ellipsis={true} strong>{title}</Typography.Text> */}
                <TabsWrapper><Tabs type="card" defaultActiveKey="1" items={items(dataGridColumns,dataGridRows, tableName, title)} onChange={onChange} /></TabsWrapper>
        </div>
    )
}

export default OutputComponent