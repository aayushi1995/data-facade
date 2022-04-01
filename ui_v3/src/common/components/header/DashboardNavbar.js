import {Link as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import {AppBar, Box, Toolbar, Tabs, Tab} from '@mui/material';
import { styled } from '@mui/styles';
import AccountPopover from './AccountPopover';
import ContentSearch from './ContentSearch';
import DfLogoText from './../../../common/components/logos/DfLogoText'
import {useAppBarProps} from "./DataFacadeAppBar";
import {DataFacadeLogo as Logo} from "../sideBar/DataFacadeLogo";

const DashboardNavbarRoot = styled(AppBar)(({theme}) => ({
    ...(theme.palette.mode === 'light' && {
        backgroundColor: theme.palette.primary.main,
        boxShadow: 'none',
        color: theme.palette.primary.contrastText
    }),
    ...(theme.palette.mode === 'dark' && {
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none'
    }),
    zIndex: theme.zIndex.drawer + 100
}));

const DashboardNavbar = (props) => {
    const {appcontext, setSearchQuery} = useAppBarProps();
    const {onSidebarMobileOpen, ...other} = props;

    return (
        <DashboardNavbarRoot {...other}>
            <Toolbar sx={{minHeight: 100, pl: 0, pr: 2, background: '#A6CEE3'}} disableGutters={true}>
                <Box sx={{ display: "flex", flexDirection: "row", height: "100%", alignItems: "center", justifyContent: 'flex-start' }}>
                    <Box sx={{ height: "100%", width: "auto" }}>
                        <RouterLink to="/">
                            <Logo/>
                        </RouterLink>
                    </Box>
                    <Box sx={{ height: "55%", ml: 7 }}>
                        <DfLogoText fill='#ff0000'/>
                    </Box>
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        ml: 2
                    }}
                />
                <div/>
                <Box sx={{ml: 1}}>
                    <ContentSearch/>
                </Box>
                <Box sx={{ml: 2}}>
                    <AccountPopover/>
                </Box>
                <Box sx={{ml: 2}}>
                    {appcontext.workspaceName}
                </Box>
            </Toolbar>
        </DashboardNavbarRoot>
    );
};

DashboardNavbar.propTypes = {
    onSidebarMobileOpen: PropTypes.func
};

export default DashboardNavbar;
