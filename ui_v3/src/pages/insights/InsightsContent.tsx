
import { useContext, useEffect } from "react";
import { Route, Switch, withRouter } from "react-router";
import { findTab } from "../../common/components/header/data/DataRoutesConfig";
import { SINGLE_DASHBOARD_VIEW } from "../../common/components/header/data/InsightsRoutesConfig";
import { INSIGHTS_ROUTE, TOP_TAB_ROUTES } from "../../common/components/header/data/RoutesConfig";
import { SetModuleContextState } from "../../common/components/ModuleContext";
import AllDashboardView from "./AllDashboardView";
import SingleDashboardView from "./SingleDashboardView";


export const InsightsContent = withRouter(function InsightRoutes() {
    const setModuleContext = useContext(SetModuleContextState)
    useEffect(() => {
        const tab = findTab(TOP_TAB_ROUTES, INSIGHTS_ROUTE)
        setModuleContext({
            type: "SetHeader",
            payload: {
                newHeader: {
                    Title: tab?.title,
                    SubTitle: tab?.subTitle
                }
            }
        })
    }, [])
    
    return (
        <Switch>
            <Route path={SINGLE_DASHBOARD_VIEW} component={SingleDashboardView}/>
            <Route path={INSIGHTS_ROUTE} component={AllDashboardView}/>
        </Switch>
    )
});