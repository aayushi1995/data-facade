//different for different leaf tab according to current active tab
import {Link as ReactRouter, Route, Switch} from "react-router-dom";
import {
    DATA_CONNECTIONS_ROUTE,
    DATA_RAW_ROUTE,
    dataSubTabs
} from "./header/data/DataRoutesConfig";
import {Box} from "@material-ui/core";
import {Button, Typography} from "@mui/material";
import React, {ReactChildren} from "react";
import {ModuleHeaderPropType} from "./header/schema";
import AddIcon from "@mui/icons-material/Add";
import {CreateConnectionButton} from "../../pages/data/components/connections/CreateConnectionButton";
import ConfiguredDataSource from "../../pages/configurations/components/ConfiguredDataSource";
import {TableBrowser} from "../../pages/table_browser/TableBrowser";
import TableDetails from "../../pages/table_details/TableDetails";


export const ModuleSubHeader = () => <Switch>{
    dataSubTabs.map((tab) =>
        tab?.children?.map(({href}) => <Route
            path={href}>
            <Box sx={{display: 'flex', flexDirection: 'column', position: 'absolute'}}>
                <Typography fontWeight={600}>
                    Annual Ticket Sales
                </Typography>
                <Typography fontSize={10}>
                    Manual uploaded by user
                </Typography>
            </Box>
            <div/>
        </Route>))
}
</Switch>;

//different for different leaf tab
export const ModuleHeader = ({tab}: ModuleHeaderPropType) => {
    const label = tab.label;
    const [title, subTitle] = [tab?.title || label, tab?.subTitle || label];
    return <Box
        sx={{display: 'flex', flexDirection: 'column'}}>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: "space-between", mb: 3}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography variant="h5" fontWeight={600}>
                    {title}
                </Typography>
                <Typography fontSize={12}>
                    {subTitle}
                </Typography>
            </Box>
            <Box sx={{display: 'flex', gap: 2}}>
                <CreateConnectionButton/>
                <Button variant="contained" to="/upload-file" component={ReactRouter}
                        title="Upload File"
                        endIcon={<AddIcon sx={{fontSize: "small", backgroundColor: "secondary"}}/>}
                >
                    Upload File
                </Button>
            </Box>
        </Box>
    </Box>
}
//different for different leaf tab
export const MainContent = () => {
    return <Box>
        <Route path={DATA_RAW_ROUTE} component={TableBrowser}/>
        <Route path={`${DATA_RAW_ROUTE}/:tableUniqueName`} component={TableDetails}/>
        <Route exact path={DATA_CONNECTIONS_ROUTE} component={ConfiguredDataSource}/>
    </Box>
}

export const ModuleContent = ({children}: { children: ReactChildren }) => {
    return <>{children}</>
}

ModuleContent.ModuleHeader = ModuleHeader;
ModuleContent.ModuleSubHeader = ModuleSubHeader;
ModuleContent.MainContent = MainContent;