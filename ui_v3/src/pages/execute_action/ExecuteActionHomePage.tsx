import { Route, Switch, useRouteMatch } from "react-router-dom";
import ExecuteAction from "./components/ExecuteAction";
import ExecuteActionNew from "./components/ExecuteActionNew";
import { ExecuteActionContextProvider } from "./context/ExecuteActionContext";

interface MatchParams {
    ActionDefinitionId: string
}


const ExecuteActionHomePage = () => {
    const match = useRouteMatch<MatchParams>()
    return (
        <ExecuteActionContextProvider>
            <ExecuteActionNew actionDefinitionId={match.params.ActionDefinitionId} showActionDescription={true}/>
        </ExecuteActionContextProvider>
    )
}

export default ExecuteActionHomePage;