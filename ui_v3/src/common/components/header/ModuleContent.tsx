//different for different leaf tab according to current active tab
import {Route, Switch, useLocation} from "react-router-dom";
import {dataSubTabs, getTabByHref} from "./data/DataRoutesConfig";
import {Box} from "@material-ui/core";
import {Button, Typography} from "@mui/material";
import React, {ReactChildren} from "react";
import {ModuleHeaderPropType} from "./schema";
import AddIcon from "@mui/icons-material/Add";
import {useTabState} from "./data/useTabState";
import {CreateConnectionButton} from "./CreateConnectionButton";


export const ModuleSubHeader = () => <Switch>{dataSubTabs.map((tab) =>
    tab?.children?.map(({href}) => <Route exact
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
    </Route>))}
</Switch>;

//different for different leaf tab
export const ModuleHeader = ({tab}: ModuleHeaderPropType) => {
    const label = tab.label;
    const [title, subTitle] = [tab?.title || label, tab?.subTitle || label];
    return <Box
        sx={{display: 'flex', flexDirection: 'column'}}>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: "space-between", mb: 3}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography variant="h6" fontWeight={600}>
                    {title}
                </Typography>
                <Typography fontSize={12}>
                    {subTitle}
                </Typography>
            </Box>
            <Box sx={{display: 'flex', gap: 2}}>
                <CreateConnectionButton />
                <Button variant="contained" endIcon={<AddIcon sx={{fontSize: "small", backgroundColor: "secondary"}}/>}
                        title="Upload File">
                    Upload File
                </Button>
            </Box>
        </Box>
    </Box>
}
//different for different leaf tab
export const MainContent = () => {
    const {
        tabContent,
        setTabContent,
        currentTab
    } = useTabState();
    return <Box>
        <Typography>
            {JSON.stringify(currentTab)}
        </Typography>
    </Box>
}

export const ModuleContent = ({children}: {children: ReactChildren}) =>{
    return <>{children}</>
}

ModuleContent.ModuleHeader = ModuleHeader;
ModuleContent.ModuleSubHeader = ModuleSubHeader;
ModuleContent.MainContent = MainContent;