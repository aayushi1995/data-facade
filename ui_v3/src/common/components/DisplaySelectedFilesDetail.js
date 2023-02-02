import {
    Box, Tab, Tabs, Typography
} from '@mui/material';
import { Link as RouterLink, Route, useLocation } from "react-router-dom";
import {
    DATA_CONNECTIONS_UPLOAD_COLUMNS_ROUTE, DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE, DATA_CONNECTIONS_UPLOAD_ROUTE
} from "./route_consts/data/DataRoutesConfig";
import { useAppBarProps } from "./route_consts/DataFacadeAppBar";
import { findCurrentSelectedTabIndex } from "./route_consts/ModuleSwitcher";

const DisplaySelectedFilesDetail = (props) => {
    const {appcontext} = useAppBarProps();
    const {pathname} = useLocation();
    if (props.selectedFile === undefined) {
        return (<>No file selected</>)
    }
    const tabs = [{
        id: 'Preview', label: 'Preview', href: DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE
    }, {
        id: 'Columns', label: 'Columns', href: DATA_CONNECTIONS_UPLOAD_COLUMNS_ROUTE
    }];
    const _activeTabIndex = findCurrentSelectedTabIndex({
        tabs, level: 3, pathname
    });
    const today = new Date();

    return (<Route path={DATA_CONNECTIONS_UPLOAD_ROUTE}>

            <Box sx={{
                display: "flex", flexDirection: "row", color: 'primary', justifyContent: "center", position: 'relative',
                flex: 1
            }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "background.default",
                        left: 0,
                        position: 'absolute'
                    }}>
                    <Typography fontWeight={600}>
                        {props.selectedFile.name}({(props.selectedFile.size/1024)?.toFixed(2)}kb)
                    </Typography>
                    <Typography fontSize={10}>
                        Manual uploaded by {appcontext.userName} on {today.toString()}
                    </Typography>
                </Box>
                <Tabs value={_activeTabIndex}>
                    {tabs && tabs?.map(({label, href}) => <Tab label={label} key={label} sx={{px: 10}}
                                                               component={RouterLink} to={href}/>)}
                </Tabs>
            </Box>
        </Route>)
}

export default DisplaySelectedFilesDetail;