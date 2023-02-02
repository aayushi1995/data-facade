import { Box, CssBaseline, Divider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link as RouterLink } from 'react-router-dom';
import COLORS from '../assets/theme.color';
import AccountPopover from '../common/components/route_consts/AccountPopover';
import { useAppBarProps } from '../common/components/route_consts/DataFacadeAppBar';
import { DataFacadeLogo } from '../common/components/sideBar/DataFacadeLogo';




const headerStyle = {
    background: COLORS.HEADER
}

const Header = () => {
    const { appcontext, setSearchQuery } = useAppBarProps();
    return (
        <>
            <CssBaseline/>
            <AppBar position="fixed" component="nav" sx={headerStyle}>
                <Toolbar>
                    <Box sx={{ display: "flex", flexDirection: "row", height: "100%", alignItems: "center", justifyContent: 'flex-start' }}>
                        <Box sx={{ height: "100%", width: "75px" }}>
                            <RouterLink to="/">
                                <DataFacadeLogo />
                            </RouterLink>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{borderColor:'#fff'}}/>
                    </Box>
                    <Box sx={{ml: 2}}>
                        <AccountPopover/>
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </>
    );
}

export default Header