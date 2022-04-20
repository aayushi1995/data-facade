
import { Route, Switch, withRouter } from "react-router";
import { SINGLE_DASHBOARD_VIEW } from "../../common/components/header/data/InsightsRoutesConfig";
import { INSIGHTS_ROUTE } from "../../common/components/header/data/RoutesConfig";
import AllDashboardView from "./AllDashboardView";
import SingleDashboardView from "./SingleDashboardView";


export const InsightsContent = withRouter(function InsightRoutes() {

    return (
        <Switch>
            <Route path={SINGLE_DASHBOARD_VIEW} component={SingleDashboardView}/>
            <Route path={INSIGHTS_ROUTE} component={AllDashboardView}/>
        </Switch>
    )
});