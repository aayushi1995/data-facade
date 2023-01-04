
import { CssBaseline, Drawer, List, ListItemButton, ListItemIcon, ListItem, Collapse, Typography, Divider, Fade, Paper, Popper, PopperPlacementType, Menu, MenuItem, ListItemText, Box, Tooltip, IconButton } from '@mui/material';
import { withStyles } from "@material-ui/core";
import { Link, NavLink as RouterLink, useLocation } from 'react-router-dom';
import items from './menuItems'
import COLORS from '../assets/theme.color';
import React, { useState } from 'react';
import { ConnectWithoutContact, PersonAddAlt1Outlined } from '@mui/icons-material';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { SLACK_URL, GENERATE_URL_PARAMS } from '../common/config/config';
import { fontSize } from '@mui/system';

const StyledListItem = withStyles({
    root: {
        "&.Mui-selected": {
            backgroundColor: COLORS.ACTIVE + "!important"
        }
    }
})(ListItemButton);



const listItemStyle = {
    minHeight: 48,
    justifyContent: 'center',
    display: 'block',
    textAlign: 'center'
}
const listItemIconStyle = {
    minWidth: 0,
    mr: 'auto',
    justifyContent: 'center',
}

const routeStyle = {
    textDecoration: 'none',
    color: '#253858'
}

const textStyle = {
    fontSize: 12,
}

const floatStyle = {
    borderRadius: 0,
    height: 10,
    top: 64,
    left: 45,
    padding: 0,
    minHeight: 20,
    width: 25,
    background: '#000',
    color: '#fff'
}

interface SidebarProps {
    toggle?: boolean,
    toggleBrowser?: () => void | undefined
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({ toggle, toggleBrowser }) => {
    const location = useLocation();
    const collapsibleItems: any = items.filter(item => item.subMenu);
    collapsibleItems.forEach((item: any) => { item['open'] = false })
    const checkActive = (key: string) => key !== '/' ? location.pathname.includes(key) : location.pathname === key;
    const [collapse, setCollapse] = useState<any>(collapsibleItems)
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = React.useState(false);
    const [subMenu, setSubMenu] = React.useState([])
    const [placement, setPlacement] = React.useState<PopperPlacementType>();
    const toggleOpen = (key: string) => {
        setCollapse(collapse.map((i: any) => i.key === key ? { ...i, open: !i.open } : { ...i, open: false }));
    }
    const closeCollapse = (key: string) => {
        setCollapse(collapse.map((i: any) => i.key !== key && { ...i, open: false }));

    }

    const toggleButton =  <Tooltip title={toggle ? `Close  Browser` : 'Open Browser'}>
        <IconButton sx={{ position: 'absolute', bottom: 0, right: 30, color: '#fff' }} onClick={() => toggleBrowser()}>
            {!toggle ? <ArrowForwardIosOutlinedIcon /> : <ArrowBackIosNewOutlinedIcon />}
        </IconButton>
    </Tooltip>
    const handleClick =
        (newPlacement: PopperPlacementType, subMenu: any) =>
            (event: React.MouseEvent<HTMLButtonElement>) => {

                setAnchorEl(event.currentTarget);
                setOpen((prev) => placement !== newPlacement || !prev);
                setSubMenu(subMenu)
                setPlacement(newPlacement);
            };

    const collapsibleMenu = (item: any) => <React.Fragment>

        <StyledListItem
            selected={checkActive(item.key)}
            onClick={() => toggleOpen(item.key)}
            sx={listItemStyle}
            onMouseEnter={handleClick('right-end', item.subMenu)}
            onMouseLeave={() => {
                setOpen(false)
            }}
        >
            <ListItemIcon
                sx={listItemIconStyle}
            >
                {<item.icon />}
            </ListItemIcon>
            <Typography sx={textStyle}> {item.name}</Typography>
        </StyledListItem>
        <Collapse
            in={collapse.find((x: any) => x.key === item.key).open || checkActive(item.key)}
            timeout="auto"
            unmountOnExit
        >
            <List component="div" disablePadding>
                {item.subMenu.map((subData: any) => (
                    <RouterLink to={subData.url} style={routeStyle}>

                        <StyledListItem key={subData.key} sx={listItemStyle}>
                            <ListItemIcon
                                sx={listItemIconStyle}

                            >
                                {<subData.icon sx={{fontSize:18}}/>}
                            </ListItemIcon>
                            <Typography sx={textStyle}> {subData.name}</Typography>
                        </StyledListItem>
                    </RouterLink>
                ))}
            </List>
            <Divider />
        </Collapse>
    </React.Fragment>


    const slackConnect = <a target="_blank" href={`${SLACK_URL}?` + GENERATE_URL_PARAMS().toString()} style={routeStyle}>
        <StyledListItem
            sx={listItemStyle}
        >
            <ListItemIcon
                sx={listItemIconStyle}
            >
                {<ConnectWithoutContact />}
            </ListItemIcon>
            <Typography sx={textStyle}> Connect Slack</Typography>
        </StyledListItem>
    </a>;

    const users = <RouterLink to="/users" style={routeStyle}>
        <StyledListItem
            sx={listItemStyle}
            onClick={() => closeCollapse('users')}
        >
            <ListItemIcon
                sx={listItemIconStyle}
            >
                {<PersonAddAlt1Outlined />}
            </ListItemIcon>
            <Typography sx={textStyle}> Users</Typography>
        </StyledListItem>
    </RouterLink>;

    const HoverMenu = <Popper open={open} onMouseOver={() => setOpen(true)} onMouseLeave={() => setOpen(false)} anchorEl={anchorEl} placement="right" transition sx={{ zIndex: 1200 }}>
        {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        marginTop: 20,

                        '& > :not(style)': {
                            m: 0,
                            width: 250,
                            height: 'auto',
                        },

                    }}
                >
                    <Paper square elevation={1}>
                        <List>
                            {
                                subMenu.map((menu: any, index: number) => <RouterLink key={index} to={menu.url} style={routeStyle}>

                                    <ListItemButton>
                                        <ListItemIcon sx={{ fontSize: 10 }}>
                                            {<menu.icon sx={{ fontSize: 16 }} />}
                                        </ListItemIcon>
                                        <ListItemText secondary={menu.name} style={{ fontSize: 10 }} />
                                    </ListItemButton>
                                </RouterLink>)
                            }
                        </List>
                    </Paper>
                </Box>


            </Fade>
        )}
    </Popper>

    return (
        <><CssBaseline />
            {HoverMenu}
            <Drawer variant="permanent" open={true} style={{ zIndex: 0 }} PaperProps={{
                sx: {
                    background: COLORS.SIDEBAR,
                }
            }}>
                <List sx={{ mt: 7 }} component="nav">
                    {
                        items.map((item) => <ListItem key={item.key} disablePadding sx={{ display: 'block' }}>
                            {
                                item.subMenu ?
                                    collapsibleMenu(item)
                                    :
                                    mainMenuItems(item)
                            }

                        </ListItem>)
                    }

                </List>
                <List component="nav" sx={{
                    position: 'absolute',
                    bottom: 80
                }}>
                    {users}
                    {slackConnect}
                   
                </List>
                {toggleButton}
            </Drawer></>
    );

    function mainMenuItems(item: any): React.ReactNode {
        return <ListItem key={item.name} disablePadding sx={{ display: 'block' }}>
            <Link to={item.url} style={routeStyle}>

                <StyledListItem selected={checkActive(item.key)}
                    sx={listItemStyle}
                    onClick={() => closeCollapse(item.key)}
                >
                    <ListItemIcon
                        sx={listItemIconStyle}

                    >
                        {<item.icon />}
                    </ListItemIcon>
                    <Typography sx={textStyle}> {item.name}</Typography>
                </StyledListItem>
            </Link>
        </ListItem>;
    }
}

export default Sidebar