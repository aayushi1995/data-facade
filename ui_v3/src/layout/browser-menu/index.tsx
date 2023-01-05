import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import { Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import EntityBrowser from './entityBrowser';


interface BrowserMenuProps {
    toggle?: boolean,
    toggleBrowser?: () => void
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}


const DrawerHeader = styled('div')(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    width: 300,
    padding: 8,
    background: '#EAEBEF',
    display: 'flex',
    justifyContent: "center",
    cursor: 'pointer'
}));

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (


                children


            )}
        </div>
    );
}

const BrowserMenu: React.FunctionComponent<BrowserMenuProps> = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Box sx={{ display: 'flex', width: "100%", height: "100%"}}>
            <CssBaseline />
            <Box sx={{background:'#fff', width: "100%", height: "100%" }}>
                <Box sx={{ height: "50px", width: "auto"}}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Data" />
                        <Tab label="Apps" />
                        <Tab label="Dashboard" />
                    </Tabs>
                </Box>
                <Box sx={{ height: "calc(100% - 50px)", width: "100%", overflowY: "auto" }}>
                    <TabPanel value={value} index={0}>
                        <EntityBrowser type="data" />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <EntityBrowser type="packages" />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <EntityBrowser type="dashboards" />
                    </TabPanel>
                </Box>
            </Box>
        </Box>
    );
}

export default BrowserMenu

