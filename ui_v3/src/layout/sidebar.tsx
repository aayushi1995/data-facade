
import { withStyles } from "@material-ui/core";
import { ConnectWithoutContact, PersonAddAlt1Outlined } from '@mui/icons-material';
import SchoolIcon from '@mui/icons-material/School';
import { Box, Collapse, CssBaseline, Divider, Drawer, Fade, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Popper, PopperPlacementType, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, NavLink as RouterLink, useLocation } from 'react-router-dom';
import CollaseMenu from "../../src/assets/images/collapse_menu.svg";
import ExpandMenu from "../../src/assets/images/expand_menu.svg";
import COLORS from '../assets/theme.color';
import { GENERATE_URL_PARAMS, SLACK_URL } from '../common/config/config';
import BrowserMenu from './browser-menu';
import items from './menuItems';


const navBarWidth = 100
const fileBrowserWidth = 300

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




interface SidebarProps {
    toggle?: boolean,
    toggleBrowser?: () => void | undefined
}

const Sidebar: React.FunctionComponent<SidebarProps> = () => {
    const sideBarLocalStorage = localStorage.getItem("sideBarState")
    const [toggle, setToggle] = React.useState<boolean>(sideBarLocalStorage !== null ? (sideBarLocalStorage === "true" ? true: false) : true )
    const toggleBrowser = () => {
        localStorage.setItem("sideBarState", toggle ? "false" : "true")
        setToggle(toggle => !toggle)
        
    }
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
        <IconButton sx={{ color: '#fff' }} onClick={() => toggleBrowser?.()}>
            {!toggle ? <img src={ExpandMenu} /> : <img src={CollaseMenu} />}
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
        <RouterLink to={item.url} style={routeStyle}>
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
        </RouterLink>
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
                                {<subData.icon sx={{ fontSize: 18 }} />}
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

    const learn = <RouterLink to="/learn" style={routeStyle}>
        <StyledListItem
            sx={listItemStyle}
            onClick={() => closeCollapse('users')}
        >
            <ListItemIcon
                sx={listItemIconStyle}
            >
                <SchoolIcon/>
            </ListItemIcon>
            <Typography sx={textStyle}> Learn</Typography>
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

    const drawerWidth = toggle ? navBarWidth + fileBrowserWidth : navBarWidth
    return (
        <>
            <CssBaseline />
            {HoverMenu}
            <Drawer
                variant="permanent"
                anchor="left"
                PaperProps={{
                    sx: {
                        pt: 8,
                        width: drawerWidth,
                        display: "flex",
                        flexDirection: "row"
                    }
                }}
                sx={{ 
                    zIndex: 0,
                    width: drawerWidth
                }}
            >
                <Box sx={{
                        background: COLORS.SIDEBAR,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                        overflowY: "auto",
                        width: navBarWidth}}>
                    <Box>
                        <List component="nav" disablePadding>
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
                    </Box>
                    <Box>
                        <List component="nav">
                            {learn}
                            {users}
                            {slackConnect}
                        
                        </List>
                        <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            {toggleButton}
                        </Box>
                    </Box>
                </Box>
                {toggle && <Box sx={{ width: fileBrowserWidth, height: "100%" }}>
                    <BrowserMenu toggle={toggle} toggleBrowser={toggleBrowser}/>
                </Box>}
            </Drawer>
        </>
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