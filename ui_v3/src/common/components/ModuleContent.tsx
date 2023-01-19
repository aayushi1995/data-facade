//different for different leaf tab according to current active tab
import { Box, Typography } from "@mui/material";
import React, { ReactChildren } from "react";
import { Route, Switch } from "react-router-dom";
import ApplicationContent from "../../pages/apps/ApplicationContent";
import ApplicationHeader from "../../pages/apps/ApplicationHeader";
import DataContent from "../../pages/data/DataContent";
import DataHeader from "../../pages/data/DataHeader";
import { InsightsContent } from "../../pages/insights/InsightsContent";
import { HomePage } from "../../pages/home_page/HomePage"
import {
    DATA_CONNECTIONS_ROUTE,
    DATA_ROUTE,
    DATA_SUB_TABS,
} from "./header/data/DataRoutesConfig";
import { APPLICATION_ROUTE, INSIGHTS_ROUTE , APPLICATION_DETAIL_ROUTE, USER_ROUTE, LEARN_ROUTE, HOME_ROUTE } from "./header/data/RoutesConfig";
import { ModuleHeaderPropType } from "./header/schema";
import { ModuleContextState } from "./ModuleContext";
import { Users } from "../../pages/users/Users";
import DataLandingPage from "../../pages/data/components/DataLandingPage";


export const SubHeader = () => <Switch>{
    DATA_SUB_TABS.map((tab) =>
        tab?.children?.map(({href}) => <Route
            path={href}>
        </Route>))
}
</Switch>;

//different for different leaf tab
export const Header = ({tab}: ModuleHeaderPropType) => {
    const moduleState = React.useContext(ModuleContextState)

    const title = moduleState?.Header?.Title || ""
    const subTitle = moduleState?.Header?.SubTitle || ""

    return (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: "space-between", mb: 3}}>
                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                        <Typography variant="h5" fontWeight={600}>
                            {title}
                        </Typography>
                        <Typography fontSize={12}>
                            {subTitle}
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', gap: 2}}>
                        
                    </Box>
                </Box> */}
            </Box>
            <Switch>
                <Route path={DATA_CONNECTIONS_ROUTE} component={DataHeader}/>
                {/* <Route exact path={APPLICATION_ROUTE} component={ApplicationHeader}/>
                <Route path={APPLICATION_DETAIL_ROUTE} component={ApplicationHeader}/> */}
            </Switch>
        </Box>
        
    )
    
}
//different for different leaf tab
export const MainContent = () => {
    return (
        <Box >
            <Switch>
                <Route path={DATA_ROUTE} component={DataContent}/>
                <Route path={APPLICATION_ROUTE} component={ApplicationContent}/>
                <Route path={INSIGHTS_ROUTE} component={InsightsContent}/>
                <Route path={USER_ROUTE} component={Users}/>
                <Route exact path={LEARN_ROUTE} component={HomePage}/>
                <Route exact path={HOME_ROUTE} component={DataLandingPage}/>
            </Switch>
        </Box>
    )
}

export const ModuleContent = ({children}: { children: ReactChildren }) => {
    return <>{children}</>
}

ModuleContent.Header = Header;
ModuleContent.SubHeader = SubHeader;
ModuleContent.MainContent = MainContent;