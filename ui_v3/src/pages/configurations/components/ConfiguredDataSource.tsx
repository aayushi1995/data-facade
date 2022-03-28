import React from 'react'
import {Route, Switch, useRouteMatch, withRouter} from "react-router-dom";
import {DATA_CONNECTIONS_ROUTE} from "../../../common/components/header/data/DataRoutesConfig";
import {ConnectionCardList} from "./ConnectionCardList";
import {ConnectionsProvider} from "../context/ConnectionsContext";
import {ConnectionDetails} from "./ConnectionDetails";
import {Stack} from "@mui/material";

export const ConfiguredDataSourceInternal = () => {
    return (
        <ConnectionsProvider>
            <Stack gap={4} minHeight={400}>
                <ConnectionCardList/>
                <ConnectionDetails/>
            </Stack>
        </ConnectionsProvider>
    )
}
const ConfiguredDataSource = withRouter(function ConfiguredDataSourceRoutes() {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={DATA_CONNECTIONS_ROUTE} component={ConfiguredDataSourceInternal}/>
        </Switch>
    )
});
export default ConfiguredDataSource;