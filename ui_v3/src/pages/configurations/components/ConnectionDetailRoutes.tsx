import { useRouteMatch, Route, Switch, Redirect } from "react-router-dom"
import { DATA_CONNECTION_DETAIL_DEFAULT_TAB, DATA_CONNECTION_DETAIL_ROUTE, DATA_CONNECTION_DETAIL_TAB } from "../../../common/components/header/data/DataRoutesConfig"
import ConnectionDetails from "./ConnectionDetails"
import ConnectionDetailsSetup  from "./ConnectionDetailsSetup"



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
