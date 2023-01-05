import * as React from 'react';
import { Box } from '@mui/material';
import Header from './header';
import Sidebar from './sidebar';

interface ChildrenProps {
    children: React.ReactChild | React.ReactChildren | React.ReactChildren[] | React.ReactElement<any, any>
}


const Layout = ({ children }: ChildrenProps) => {


    return (
        <Box sx={{ display: 'flex', flexDirection: "column" }}>
            <Header />
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Sidebar/>
                <Box sx={{ width: "100%", height: "100%", overflowX: "auto" }}>
                    {children}
                </Box>
            </Box>
        </Box>

    );
}

export default Layout