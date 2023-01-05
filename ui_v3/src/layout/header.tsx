import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box, CssBaseline, Divider } from '@mui/material';
import { useAppBarProps } from '../common/components/header/DataFacadeAppBar';
import { DataFacadeLogo } from '../common/components/sideBar/DataFacadeLogo';
import AccountPopover from '../common/components/header/AccountPopover';
import COLORS from '../assets/theme.color';




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
                        <Box sx={{ height: "100%", width: "auto" }}>
                            <RouterLink to="/">
                                <DataFacadeLogo />
                            </RouterLink>
                        </Box>
                        <Divider orientation="vertical" flexItem />
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