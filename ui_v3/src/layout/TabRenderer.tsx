import { TabContext, TabPanel } from '@mui/lab';
import { Tabs, Tab, IconButton } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from '@mui/styles';
import { CloseOutlined } from '@mui/icons-material';

interface ChildrenProps {
    children: React.ReactChild | React.ReactChildren | React.ReactChildren[] | React.ReactElement<any, any>
}

const useStyles = makeStyles({
    root: {
        background: '#fff',
        textDecoration: 'none'

    },

});



const TabRenderer = ({ children }: ChildrenProps) => {
    const classes = useStyles();
    const [routes, setRoutes] = useState<any>([]);
    const [activeTab, setActiveTab] = useState<string>('')
    const location = useLocation();
    let history = useHistory();

    const search = location.search;
    const source = new URLSearchParams(search).get('source');
    const name = new URLSearchParams(search).get('name');
    
    useEffect(() => {
        const route = routes.find((route: any) => route.path === location.pathname);
        console.log('route',route)

        if (!route && source === "browser") {
            setRoutes([...routes, { id: Date.now(), path: location.pathname, name: name }]);  
            setActiveTab(location.pathname)
        }

        if(route && source==="browser"){
            setActiveTab(location.pathname)
        }
    }, [location.pathname , source]);

    
    const handleChange = (event: React.SyntheticEvent, value: string) => {
        setActiveTab(value)
        history.push(value)
    };

    const removeTab = (event: any, path: string) => {
        event.stopPropagation();
        const index = routes.findIndex((route: any) => route.path == path);
        if (index > -1) {
            const updatedRoutes = [...routes.slice(0, index), ...routes.slice(index + 1)];
            setRoutes(updatedRoutes)
            history.push('/')
        }
    }


    const renderLabel = (path: string,name:string) => {
        const label = path === "/" ? 'home' : path.slice(1).replace("/", ' > ');
        return (
            <span style={{ fontSize: 12, textTransform: 'capitalize' }}>
                {" "}
                {name}
                {
                    label !== 'home' &&
                    <IconButton
                        component="div"
                        onClick={event => removeTab(event, path)}
                    >
                        <CloseOutlined style={{ fontSize: 10 }} />
                    </IconButton>
                }


            </span>
        )
    }



    return (

        <React.Fragment>
            {
                routes.length > 0 &&
                <Tabs value={activeTab} className={classes.root} aria-label="basic tabs example" onChange={handleChange} variant="scrollable"
                    scrollButtons>
                    {routes.map((route: any) => (
                        <Tab label={renderLabel(route.path,route.name)} key={route.path} value={route.path} />
                    ))}

                </Tabs>
            }

            {children}

        </React.Fragment>


    );
}

export default TabRenderer
