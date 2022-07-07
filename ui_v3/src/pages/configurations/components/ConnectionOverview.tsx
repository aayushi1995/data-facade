import { Box, Typography } from "@mui/material"
import AllTableView from "../../table_browser/components/AllTableView"
import { ConnectionsDataGrid } from "./ConnectionsDataGrid"

export interface ConnectionOverviewProps {
    ProviderInstanceId: string
}

const ConnectionOverview = (props: ConnectionOverviewProps) => {

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 4, minWidth: '100%', minHeight: '100%'}}>
            <ConnectionsDataGrid filter={{Id: props.ProviderInstanceId}} showSyncStatus={true}/>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                <Typography variant="heroHeader" sx={{fontSize: 25}}>
                    Tables List
                </Typography>
                <AllTableView tableFilter={{ProviderInstanceID: props.ProviderInstanceId}} disableCellClick={true}/>
            </Box>
        </Box>
    )
}


export default ConnectionOverview
