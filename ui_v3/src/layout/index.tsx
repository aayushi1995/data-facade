import * as React from 'react';
import { Box } from '@mui/material';
import Header from './header';
import Sidebar from './sidebar';





interface ChildrenProps {
    children: React.ReactChild | React.ReactChildren | React.ReactChildren[] | React.ReactElement<any, any>
}


const Layout = ({ children }: ChildrenProps) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, pt: 10, pl:5 }}>

                {children}

            </Box>
        </Box>

    );
}

export default Layout