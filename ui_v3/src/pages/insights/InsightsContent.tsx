
import { useContext, useEffect } from "react";
import { Route, Switch, withRouter } from "react-router";
import { SetModuleContextState } from "../../common/components/main_module/context/ModuleContext";
import { findTab } from "../../common/components/route_consts/data/DataRoutesConfig";
import { SINGLE_DASHBOARD_VIEW } from "../../common/components/route_consts/data/InsightsRoutesConfig";
import { INSIGHTS_ROUTE, TOP_TAB_ROUTES } from "../../common/components/route_consts/data/RoutesConfig";
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