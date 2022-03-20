import {Link as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import {AppBar, Box, Toolbar, Tabs, Tab} from '@material-ui/core';
import {experimentalStyled} from '@material-ui/core/styles';
import AccountPopover from './AccountPopover';
import ContentSearch from './ContentSearch';
import {useAppBarProps} from "./DataFacadeAppBar";
import {DataFacadeLogo as Logo} from "../sideBar/DataFacadeLogo";

const DashboardNavbarRoot = experimentalStyled(AppBar)(({theme}) => ({
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
            <Toolbar sx={{minHeight: 64}}>
                <RouterLink to="/">
                    <Logo
                        sx={{
                            display: {
                                lg: 'inline',
                                xs: 'none'
                            },
                            height: 40,
                            width: 40
                        }}
                    />
                </RouterLink>
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
