import { useLocation, useRouteMatch, } from "react-router-dom";
import ExecuteAction from "./components/ExecuteAction";
import { ExecuteActionContextProvider } from "./context/ExecuteActionContext";

interface MatchParams {
    ActionDefinitionId: string
}


const ExecuteActionHomePage = () => {
    const match = useRouteMatch<MatchParams>()
    const location = useLocation()
    const tableId = new URLSearchParams(location.search)?.get("tableId") || undefined

    return (
        <ExecuteActionContextProvider>
            <ExecuteAction actionDefinitionId={match.params.ActionDefinitionId} showActionDescription={true} parentExecutionId={tableId}/>
        </ExecuteActionContextProvider>
    )
}

export default ExecuteActionHomePage;