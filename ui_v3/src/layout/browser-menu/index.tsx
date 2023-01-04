import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import { Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import EntityBrowser from './entityBrowser';



const drawerWidth = 300;

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

const BrowserMenu: React.FunctionComponent<BrowserMenuProps> = ({ toggle, toggleBrowser }) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    left: 103,
                    zIndex: 1,
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: toggle ? drawerWidth : 0,
                        boxSizing: 'border-box',
                        left: 103
                    },
                }}
                variant="permanent"
                open={false}

            >
                <Box sx={{ width: '100%', marginTop: 8 }}>
                    <Box sx={{ borderBottom: 1 }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered sx={{position:'absolute',zIndex:1,background:'#fff'}}>
                            <Tab label="Data" />
                            <Tab label="Apps" />
                            <Tab label="Dashboard" />
                        </Tabs>
                    </Box>

                    <div style={{marginTop:30}}>
                        <TabPanel value={value} index={0}>
                            <EntityBrowser type="data" />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <EntityBrowser type="packages" />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <EntityBrowser type="dashboards" />
                        </TabPanel>
                    </div>
                </Box>
            </Drawer>
        </Box>
    );
}

export default BrowserMenu

