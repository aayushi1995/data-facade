
import { CssBaseline, Drawer, List, ListItemButton, ListItemIcon, ListItem, Collapse, Typography, Divider } from '@mui/material';
import { withStyles } from "@material-ui/core";
import { Link, NavLink as RouterLink, useLocation } from 'react-router-dom';
import items from './menuItems'
import COLORS from '../assets/theme.color';
import React, { useState } from 'react';
import { ConnectWithoutContact, PersonAddAlt1Outlined } from '@mui/icons-material';
import { SLACK_URL, GENERATE_URL_PARAMS } from '../common/config/config';

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
    fontSize: 10,
}
const Sidebar = () => {
    const location = useLocation();
    const collapsibleItems: any = items.filter(item => item.subMenu);
    collapsibleItems.forEach((item: any) => { item['open'] = false })
    const checkActive = (key: string) => key !== '/' ? location.pathname.includes(key) : location.pathname === key;
    const [collapse, setCollapse] = useState<any>(collapsibleItems)
    const toggleOpen = (key: string) => {
        setCollapse(collapse.map((i: any) => i.key === key ? { ...i, open: !i.open } : { ...i, open: false }));
    }
    const closeCollapse = (key: string) => {
        setCollapse(collapse.map((i: any) => i.key !== key && { ...i, open: false }));

    }

    const collapsibleMenu = (item: any) => <React.Fragment>
        <StyledListItem
            selected={checkActive(item.key)}
            onClick={() => toggleOpen(item.key)}
            sx={listItemStyle}
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
                {item.subMenu.map((subData:any) => (
                    <RouterLink to={subData.url} style={routeStyle}>

                        <StyledListItem key={subData.key} sx={listItemStyle}>
                            <ListItemIcon
                                sx={listItemIconStyle}

                            >
                                {<subData.icon />}
                            </ListItemIcon>
                            <Typography sx={textStyle}> {subData.name}</Typography>
                        </StyledListItem>
                    </RouterLink>
                ))}
            </List>
            <Divider />
        </Collapse>
    </React.Fragment>

    return (
        <><CssBaseline /> <Drawer variant="permanent" open={true} style={{ zIndex: 0 }} PaperProps={{
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
                                <ListItem key={item.name} disablePadding sx={{ display: 'block' }}>
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
                                </ListItem>
                        }

                    </ListItem>)
                }

            </List>
            <List component="nav" sx={{
                position: 'absolute',
                bottom: 100
            }}>
                <RouterLink to="/users" style={routeStyle}>
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
                </RouterLink>

                <a target="_blank" href={`${SLACK_URL}?` + GENERATE_URL_PARAMS().toString()} style={routeStyle}>
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
                </a>
            </List>
        </Drawer></>
    );
}

export default Sidebar