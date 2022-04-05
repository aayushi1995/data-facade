//different for different leaf tab according to current active tab
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";
import React, { ReactChildren } from "react";
import { Link as RouterLink, Route, Switch } from "react-router-dom";
import ConfiguredDataSource from "../../pages/configurations/components/ConfiguredDataSource";
import { CreateConnectionButton } from "../../pages/data/components/connections/CreateConnectionButton";
import { TableBrowser } from "../../pages/table_browser/TableBrowser";
import {
    DATA_CONNECTIONS_ROUTE, DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE, DATA_RAW_ROUTE,
    DATA_SUB_TABS
} from "./header/data/DataRoutesConfig";
import { ModuleHeaderPropType } from "./header/schema";


export const ModuleSubHeader = () => <Switch>{
    DATA_SUB_TABS.map((tab) =>
        tab?.children?.map(({href}) => <Route
            path={href}>
        </Route>))
}
</Switch>;

//different for different leaf tab
export const ModuleHeader = ({tab}: ModuleHeaderPropType) => {
    const label = tab.label;
    const [title, subTitle] = [tab?.title || label, tab?.subTitle || label];

    // TODO: hack here to remove headers
    if (title === "APPLICATION") {
        return <></>
    }
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
                <Button variant="contained" to={DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE} component={RouterLink}
                        title="Upload File"
                        endIcon={<AddIcon sx={{fontSize: "small", backgroundColor: "secondary"}}/>}
                        sx={{flex: 1, borderRadius: '10px', bgcolor: 'lightBlueDF.main'}}
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
        <Route path={DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE} component={UploadTableDialogContent}/>
        <Route path={DATA_CONNECTIONS_ROUTE} component={ConfiguredDataSource}/>
        <Route path={DATA_RAW_ROUTE} component={TableBrowser}/>
    </Box>
}

export const ModuleContent = ({children}: { children: ReactChildren }) => {
    return <>{children}</>
}

ModuleContent.ModuleHeader = ModuleHeader;
ModuleContent.ModuleSubHeader = ModuleSubHeader;
ModuleContent.MainContent = MainContent;