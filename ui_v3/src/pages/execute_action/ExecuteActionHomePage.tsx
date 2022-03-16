import { Route, Switch, useRouteMatch } from "react-router-dom";
import ExecuteAction from "./components/ExecuteAction";
import { ExecuteActionContextProvider } from "./context/ExecuteActionContext";

const ExecuteActionHomePage = () => {
    const match = useRouteMatch()

    return (
        <ExecuteActionContextProvider>
            <Switch>
                <Route path={`${match.path}/:actionDefinitionId`} component={ExecuteAction}/>
            </Switch>
        </ExecuteActionContextProvider>
    )
}

export default ExecuteActionHomePage;