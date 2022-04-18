import { Box, Stack } from "@mui/material";
import React from 'react';
import { Route, withRouter } from "react-router-dom";
import { DATA_CONNECTIONS_ROUTE, DATA_CONNECTION_DETAIL_ROUTE } from "../../../common/components/header/data/DataRoutesConfig";
import { ConnectionsProvider } from "../context/ConnectionsContext";
import { ConnectionCardList } from "./ConnectionCardList";
import { ConnectionDetails } from "./ConnectionDetails";

export const ConfiguredDataSourceInternal = () => {
    return (
        <Stack gap={4} minHeight={400}>
            <ConnectionCardList/>
        </Stack>
    )
}
const ConfiguredDataSource = withRouter(function ConfiguredDataSourceRoutes() {
    return (
        <ConnectionsProvider>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2}}>
                <Box>
                    <Route path={DATA_CONNECTIONS_ROUTE} component={ConfiguredDataSourceInternal}/>
                </Box>
                <Box>
                    <Route path={DATA_CONNECTION_DETAIL_ROUTE} component={ConnectionDetails}/>
                </Box>
            </Box>
        </ConnectionsProvider>
    )
});
export default ConfiguredDataSource;