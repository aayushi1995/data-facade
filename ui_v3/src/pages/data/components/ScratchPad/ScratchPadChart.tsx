import React, { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './styles.css'
import {ReactComponent as LineIcon} from './Assests/LineIcon.svg'
import {ReactComponent as BarIcon} from './Assests/BarIcon.svg'
import {ReactComponent as PieIcon} from './Assests/PieIcon.svg'
import {ReactComponent as LineBar} from './Assests/LineBar.svg'
import {ReactComponent as ScatterIcon } from './Assests/ScatterIcon.svg'

import ScatterChart from "../../../build_action/components/form-components/ChartsOption/ScatterCharts";
import LineChartWrapper from './Component/GraphComponents/LineGraphWrapper';
import BarGraphWrapper from './Component/GraphComponents/BarGraphWrapper';
import PieChartWrapper from './Component/GraphComponents/PieChartWrapper';
import LineBarGraphWrapper from './Component/GraphComponents/LineBarGraphWrapper';
import ScatterGraphWrapper from './Component/GraphComponents/ScatterGraphWrapper';
import { getData } from './utils';
import { Pie } from 'recharts';

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }


const chartOptions = {
    'line': {
        xTitle: 'inputText',
        yTitle: 'inputText',
        xData: 'select',
        yData: 'select'

    }
}
const ScratchPadChart = ({rows, columns}:any) => {

    const [value, setValue] = React.useState(0);
    
    const [bar, setBar] = useState({
      x: undefined,
      y: []
    })
    const [line, setLine] = useState({
      x: undefined,
      y: []
    })

    const [lineBar, setLineBar] = useState({
      x: undefined,
      ySelect: undefined,
      yMultiSelect: []
    })

    const [pie, setPie] = useState({
      x: '',
      y: 'undefined'
    })
    const [scatter, setScatter] = useState({
      x: '',
      y: ''
    })

    
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };



    return (
        <div style={{margin:'20px 0px'}}>
            <hr/>
             <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
                <Tab icon={<LineIcon width="50px" height="50px"/>} label="Line Chart" />
                <Tab icon={<BarIcon  width="50px" height="50px"/>} label="Bar Chart" />
                <Tab icon={<LineBar  width="50px" height="50px"/>} label="Line Bar Chart" />
                <Tab icon={<PieIcon  width="50px" height="50px"/>} label="Pie Chart" />
                <Tab icon={<ScatterIcon  width="50px" height="50px"/>} label="Scatter Chart" />
                </Tabs>
             
                <TabPanel value={value} index={0}>
                    <LineChartWrapper rows={rows} columns={columns} line={line} setLine={setLine}/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                   <BarGraphWrapper rows={rows} columns={columns} bar={bar} setBar={setBar}/>
                </TabPanel>
                <TabPanel value={value} index={2}>
                   <LineBarGraphWrapper rows={rows} columns={columns} lineBar={lineBar} setLineBar={setLineBar}/>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <PieChartWrapper rows={rows} columns={columns} pie={pie} setPie={setPie}/>
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <ScatterGraphWrapper rows={rows} columns={columns} scatter={scatter} setScatter={setScatter}/>
                </TabPanel>
                
            
        </div>
    )

}

export default ScratchPadChart

