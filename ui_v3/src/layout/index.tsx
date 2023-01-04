import * as React from 'react';
import { Box } from '@mui/material';
import Header from './header';
import Sidebar from './sidebar';
import BrowserMenu from './browser-menu';





interface ChildrenProps {
    children: React.ReactChild | React.ReactChildren | React.ReactChildren[] | React.ReactElement<any, any>
}


const Layout = ({ children }: ChildrenProps) => {
    const [toggle, setToggle] = React.useState<boolean>(true)
    const toggleBrowser = () => setToggle(!toggle)

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Sidebar toggle={toggle} toggleBrowser={toggleBrowser} />
            <Box component="main" sx={{ flexGrow: 1, pt: 10, pl: toggle ? 40 : 2 }}>
                <BrowserMenu toggle={toggle} toggleBrowser={toggleBrowser}/>
                {children}

            </Box>
        </Box>

    );
}

export default Layout