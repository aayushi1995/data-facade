import { Stack } from "@mui/material";
import React, { useContext } from 'react';
import { Route, Switch, withRouter } from "react-router-dom";
import { SetModuleContextState } from "../../../../common/components/main_module/context/ModuleContext";
import { DATA_CONNECTIONS_ROUTE, DATA_CONNECTION_DETAIL_ROUTE, DATA_SUB_TABS, findTab } from "../../../../common/components/route_consts/data/DataRoutesConfig";
import { ConnectionsProvider } from "../context/ConnectionsContext";
import ConnectionDetailRoutes from "./ConnectionDetailRoutes";
import { ConnectionsDataGrid } from "./ConnectionsDataGrid";

export const ConfiguredDataSourceInternal = () => {
    const setModuleContext = useContext(SetModuleContextState)

    React.useEffect(() => {
        const tab = findTab(DATA_SUB_TABS, DATA_CONNECTIONS_ROUTE)
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
        <Stack gap={4} minHeight={400}>
            <ConnectionsDataGrid/>
        </Stack>
    )
}
const ConfiguredDataSource = withRouter(function ConfiguredDataSourceRoutes() {
    
    return (
        <ConnectionsProvider>
            <Switch >
                <Route path={DATA_CONNECTION_DETAIL_ROUTE} component={ConnectionDetailRoutes}/>
                <Route path={DATA_CONNECTIONS_ROUTE} component={ConfiguredDataSourceInternal}/>
            </Switch>
        </ConnectionsProvider>
    )
});
export default ConfiguredDataSource;