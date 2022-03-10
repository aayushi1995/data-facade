import { Route, Switch, useRouteMatch } from "react-router-dom";
import ExecuteAction from "./components/ExecuteAction";

const ExecuteActionHomePage = () => {
    const match = useRouteMatch()

    return (
        <Switch>
            <Route path={`${match.path}/:actionDefinitionId`} component={ExecuteAction}/>
        </Switch>
    )
}

export default ExecuteActionHomePage;