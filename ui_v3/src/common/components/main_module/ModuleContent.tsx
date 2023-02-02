//different for different leaf tab according to current active tab
import { Box } from "@mui/material";
import React, { ReactChildren } from "react";
import { Route, Switch } from "react-router-dom";
import ApplicationContent from "../../../pages/applications/ApplicationContent";
import DataContent from "../../../pages/data/DataContent";
import DataHeader from "../../../pages/data/DataHeader";
import DataLandingPage from "../../../pages/data/landing/DataLandingPage";
import { HomePage } from "../../../pages/home_page/HomePage";
import { InsightsContent } from "../../../pages/insights/InsightsContent";
import { Users } from "../../../pages/users/Users";
import {
    DATA_CONNECTIONS_ROUTE,
    DATA_ROUTE,
    DATA_SUB_TABS
} from "../route_consts/data/DataRoutesConfig";
import { APPLICATION_ROUTE, HOME_ROUTE, INSIGHTS_ROUTE, LEARN_ROUTE, USER_ROUTE } from "../route_consts/data/RoutesConfig";
import { ModuleHeaderPropType } from "../route_consts/schema";
import { ModuleContextState } from "./context/ModuleContext";


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