import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom"
import { DATA_CONNECTION_DETAIL_DEFAULT_TAB, DATA_CONNECTION_DETAIL_ROUTE, DATA_CONNECTION_DETAIL_TAB } from "../../../../common/components/route_consts/data/DataRoutesConfig"
import ConnectionDetails from "./ConnectionDetails"



const ConnectionDetailRoutes = () => {
    const match = useRouteMatch()

    return (
        <Switch>
            <Redirect exact from={DATA_CONNECTION_DETAIL_ROUTE} to={DATA_CONNECTION_DETAIL_DEFAULT_TAB}/>
            <Route path={DATA_CONNECTION_DETAIL_TAB} component={ConnectionDetails}/>
        </Switch>
    )
}


export default ConnectionDetailRoutes
