import { Tabs, Tab, IconButton, Button, Box, MenuItem, MenuList, Tooltip, styled, tooltipClasses, TooltipProps, Typography, ListItemIcon, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { withStyles } from '@mui/styles';
import { CloseOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import Plus from '../icons/Plus';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface ChildrenProps {
    children: React.ReactChild | React.ReactChildren | React.ReactChildren[] | React.ReactElement<any, any>
}


const BrowserTab = withStyles({
    root: {
        "&.MuiTab-root": {
            boxSizing: "border-box",
            width: "300px",
            background: "#EAEBEF",
            borderWidth: "0.3px 1.3px 1.3px 0.3px",
            borderStyle: "solid",
            borderColor: "rgba(146, 146, 146, 0.5)",
            borderRadius: "0px 0px 10px 2px",
            textAlign: 'right',
            alignItems: "flex-start",
            minHeight: 36,
            maxHeight: 36
        }

    },
    selected: {
        "&.Mui-selected": {
            backgroundColor: '#fff',
            color: '#000000',
        }
    }
})(Tab);


const tabHeaderStyle = {
    background: '#fff',
    textDecoration: 'none',
    minHeight: 37
}
const closeButtonStyle = {
    position: 'absolute',
    right: 0,
    bottom: "5px"
}

const actionButtonStyle = {
    background: '#EAEBEF',
    borderWidth: "0.3px 1.3px 1.3px 0.3px",
    borderStyle: "solid",
    borderColor: "rgba(146, 146, 146, 0.5)",
    borderRadius: "0px 0px 10px 2px",
    padding: 0,
    minWidth: 40
}
const linkStyle = {
    textDecoration: 'none',
    color: '#444444'

}


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        width: 300,
        background: '#C9E6FC',
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.15)",
        borderRadius: 4,
        color: "#444444",
    },
}));

const TabRenderer = ({ children }: ChildrenProps) => {
    const [routes, setRoutes] = useState<any>([]);
    const [activeTab, setActiveTab] = useState<string>('')
    const location = useLocation();
    let history = useHistory();
    const search = location.search;
    const source = new URLSearchParams(search).get('source');
    const name = new URLSearchParams(search).get('name');

    useEffect(() => {
        const route = routes.find((route: any) => route.path === location.pathname);
        if (!route && source === "browser") {
            const permanentRoutes = routes.filter((route: any) => route.isPermanent === true);

            setRoutes([...permanentRoutes, { id: Date.now(), path: location.pathname, name: name, isPermanent: false }]);
            setActiveTab(location.pathname)
        }

        if (route && source === "browser") {
            setActiveTab(location.pathname)
        }
    }, [location.pathname, source]);


    const handleChange = (event: React.SyntheticEvent, value: string) => {
        setActiveTab(value)
        history.push(value)
    };

    const removeTab = (event: any, path: string) => {
        event.stopPropagation();
        const index = routes.findIndex((route: any) => route.path == path);
        if (index > -1) {
            const updatedRoutes = [...routes.slice(0, index), ...routes.slice(index + 1)];
            const permanentRoutes = updatedRoutes.filter((route: any) => route.isPermanent === true);
            setRoutes(updatedRoutes)
            if (permanentRoutes.length > 0) {
                const lastIndex = permanentRoutes.length - 1
                setActiveTab(permanentRoutes[lastIndex].path)
                history.push(permanentRoutes[lastIndex].path)
            }
            else {
                history.push('/')
            }

        }
    }


    const renderLabel = (path: string, name: string, isPermanent: boolean) => {
        const label = path === "/" ? 'home' : path.slice(1).replace("/", ' > ');
        return (
            <span style={{ fontSize: 12, textTransform: 'capitalize', fontStyle: isPermanent ? 'normal' : 'italic' }}>
                {" "}
                {name}
                {
                    label !== 'home' &&
                    <IconButton
                        component="div"
                        onClick={event => removeTab(event, path)}
                        sx={closeButtonStyle}
                    >
                        <CloseOutlined style={{ fontSize: 12 }} />
                    </IconButton>
                }


            </span>
        )
    }

    const makeParmanent = (path: string) => {
        setRoutes((oldRoutes: any) => oldRoutes.map((route: any) => route.path === path ? { ...route, isPermanent: true } : route))
    }

    const renderMenu = () => {
        return (
            <MenuList>
                <NavLink to="/application/edit-action/Add" style={linkStyle}>
                    <MenuItem>
                        <ListItemIcon>
                            <Plus fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Add action</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                            <KeyboardArrowRightIcon />
                        </Typography>
                    </MenuItem>
                </NavLink>

                <NavLink to="/application/build-workflow" style={linkStyle}>
                    <MenuItem>
                        <ListItemIcon>
                            <Plus fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Add flow</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                            <KeyboardArrowRightIcon />
                        </Typography>
                    </MenuItem>

                </NavLink>

                <NavLink to="/application/build-web-app" style={linkStyle}>
                    <MenuItem>
                        <ListItemIcon>
                            <Plus fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Add dashboard</ListItemText>
                        <Typography variant="body2" color="text.secondary">
                            <KeyboardArrowRightIcon />
                        </Typography>
                    </MenuItem>
                </NavLink>

            </MenuList>
        )
    }


    const ButtonInTabs = ({ children }: any) => {
        return <HtmlTooltip

            arrow
            title={
                <Box>
                    {renderMenu()}
                </Box>
            }
        >
            <Button style={actionButtonStyle} children={children} type="button"></Button>
        </HtmlTooltip>;
    };

    return (

        <React.Fragment>
            {
                routes.length > 0 && <>
                    <Tabs TabIndicatorProps={{
                        style: {
                            background: 'none'
                        }
                    }} value={activeTab} sx={tabHeaderStyle} aria-label="basic tabs example" onChange={handleChange}
                        scrollButtons>
                        {routes.map((route: any) => (
                            <BrowserTab onDoubleClick={() => makeParmanent(route.path)} label={renderLabel(route.path, route.name, route.isPermanent)} key={route.path} value={route.path} />
                        ))}

                        <ButtonInTabs>
                            <AddIcon color="disabled" />
                        </ButtonInTabs>

                    </Tabs>



                </>


            }

            {children}

        </React.Fragment>


    );
}

export default TabRenderer
