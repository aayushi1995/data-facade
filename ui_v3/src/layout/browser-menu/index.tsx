import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import { Tabs, Tab, Button, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import EntityBrowser from './entityBrowser';
import { NavLink } from 'react-router-dom';
import conIcon from '../../../src/images/creatcon.svg'
import appBuilderIcon from '../../../src/images/appbuilder.svg'
import DashboardIcon from '../../../src/images/Dashboardicon.svg'
import { DATA_CONNECTION_CHOOSE } from '../../common/components/header/data/DataRoutesConfig';
import { APPLICATION_CREATION_WIZARD_ROUTE } from '../../common/components/header/data/ApplicationRoutesConfig';

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

const BrowserHeadButton = (props: { image: string, name: string ,link:string }) => {

    return (
        <Box sx={{px:1}}>
            <Divider></Divider>
            <Button sx={{ justifyContent:'center',gap: 1, px: 3, borderRadius: '5px',  my: 1, backgroundColor: '#007DFA',minWidth:'100%' }} variant='contained' to={props.link} component={NavLink}>
                <img src={props.image} />  {props.name}
            </Button>
            <Divider></Divider>
        </Box>
    )
}

const BrowserMenu: React.FunctionComponent<BrowserMenuProps> = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Box sx={{ display: 'flex', width: "100%", height: "100%" }}>
            <CssBaseline />
            <Box sx={{ background: '#fff', width: "100%", height: "100%" }}>
                <Box sx={{ height: "50px", width: "auto" }}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Data" />
                        <Tab label="Apps" />
                        <Tab label="Dashboard" />
                    </Tabs>
                </Box>
                <Box sx={{ height: "calc(100% - 50px)", width: "100%", overflowY: "auto" }}>
                    <TabPanel value={value} index={0}>
                        <BrowserHeadButton image={conIcon} name="Create Connection" link={DATA_CONNECTION_CHOOSE}/>
                        <EntityBrowser type="data" />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                    <BrowserHeadButton image={appBuilderIcon} name="APP Builder" link={APPLICATION_CREATION_WIZARD_ROUTE}/>
                        <EntityBrowser type="packages" />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                    <BrowserHeadButton image={DashboardIcon} name="Create Dashboard" link='/insights'/>
                        <EntityBrowser type="dashboards" />
                    </TabPanel>
                </Box>
            </Box>
        </Box>
    );
}

export default BrowserMenu

