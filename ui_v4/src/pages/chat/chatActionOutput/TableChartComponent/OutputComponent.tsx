import { ReactComponent as ChartIcon } from '@assets/icons/bar_chart.svg';
import { ReactComponent as TableIcon } from '@assets/icons/table.svg';
import { Tabs, Typography } from 'antd';
import Visualization from '../DeepDive/Visualization';
import { TabsWrapper, TitleHeader } from './OutputComponent.styles';
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
                <TitleHeader ellipsis={true} strong style={{}}>{title}</TitleHeader>
                <TabsWrapper><Tabs type="card" defaultActiveKey="1" items={items(dataGridColumns,dataGridRows, tableName)} onChange={onChange} /></TabsWrapper>
        </div>
    )
}

export default OutputComponent