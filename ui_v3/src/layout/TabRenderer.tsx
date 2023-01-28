import { Tabs, Tab, IconButton, Button, Box, MenuItem, MenuList, Tooltip, styled, tooltipClasses, TooltipProps, Typography, ListItemIcon, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { withStyles } from '@mui/styles';
import { CloseOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import Plus from '../icons/Plus';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Home from '@mui/icons-material/Home';

interface ChildrenProps {
    children: React.ReactChild | React.ReactChildren | React.ReactChildren[] | React.ReactElement<any, any>
}

export const RouteContext = React.createContext(null);

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
            color: '#444444!important',
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
const elipsisText = {
    display: "inline-block",
    width: 200,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: 'left'
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
    const name = new URLSearchParams(search).get('name')


    useEffect(() => {
        const route = routes.find((route: any) => route.path === location.pathname);
        setActiveTab(location.pathname)
        if (!route && location.pathname !== '/' && name) {
            const permanentRoutes = routes.filter((route: any) => route.isPermanent === true);
            setRoutes([...permanentRoutes, { id: Date.now(), path: location.pathname, name: name, params: location.search, isPermanent: false }]);
        }
        else {

        }
    }, [location.pathname, name]);

    useEffect(() => {
        const index = routes.findIndex((route: any) => route.path == location.pathname);
        if (index > -1) {
            setRoutes((oldRoutes: any) => oldRoutes.map((route: any) => route.path === location.pathname ? { ...route, params: location.search } : route))
        }

    }, [location.search])




    const handleChange = (event: React.SyntheticEvent, value: string) => {
        const path: any = event.currentTarget.getAttribute("data-path")
        setActiveTab(value)
        path ? history.push(`${value}${path}`) : history.push(value)
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
            <Tooltip placement="bottom" title={name ? name : label}>
                <span style={{ fontSize: 12, textTransform: 'capitalize', fontStyle: isPermanent ? 'normal' : 'italic' }}>
                    {" "}
                    <span style={elipsisText}>{name || label}</span>
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
            </Tooltip>
        )
    }

    const makeParmanent = (path: string) => {
        setRoutes((oldRoutes: any) => oldRoutes.map((route: any) => route.path === path ? { ...route, isPermanent: true } : route))
    }

    const navigate = (url: string) => {
        history.push(url)
    }

    const renderMenu = () => {
        return (
            <MenuList>

                <MenuItem onClick={() => navigate("/application/edit-action/Add?name=Add")}>
                    <ListItemIcon>
                        <Plus fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add action</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        <KeyboardArrowRightIcon />
                    </Typography>
                </MenuItem>



                <MenuItem onClick={() => navigate("/application/build-workflow")}>
                    <ListItemIcon>
                        <Plus fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add flow</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        <KeyboardArrowRightIcon />
                    </Typography>
                </MenuItem>




                <MenuItem onClick={() => navigate("/application/build-web-app")}>
                    <ListItemIcon>
                        <Plus fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add dashboard</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        <KeyboardArrowRightIcon />
                    </Typography>
                </MenuItem>


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
                    <Tabs variant="scrollable"
                        scrollButtons={false} TabIndicatorProps={{
                            style: {
                                background: 'none'
                            }
                        }} value={activeTab} sx={tabHeaderStyle} aria-label="basic tabs example" onChange={handleChange}
                    >
                        <BrowserTab style={{ width: 10, minWidth: 50 }} icon={<Home style={{ fontSize: 16 }} />} aria-label="Home" key="/" value="/" />
                        {routes.map((route: any) => (
                            <BrowserTab onDoubleClick={() => makeParmanent(route.path)} data-path={route.params} label={renderLabel(route.path, route.name, route.isPermanent)} key={route.path} value={route.path} />
                        ))}

                        <ButtonInTabs>
                            <AddIcon color="disabled" />
                        </ButtonInTabs>

                    </Tabs>



                </>


            }

            <RouteContext.Provider value={routes}>
                <div onClick={() => makeParmanent(location.pathname)}>
                    {children}
                </div>
            </RouteContext.Provider>



        </React.Fragment>


    );
}

export default TabRenderer
