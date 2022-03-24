import {Grid} from "@mui/material";
import {ConnectionCard} from "../../data/components/connections/ConnectionCard";
import React from "react";
import {ConnectionsContext, ConnectionsSetContext} from "../context/ConnectionsContext";
import {TableWrapper} from "../../../common/components/TableWrapper";

export const ConnectionCardList = () => {
    const { selectedConnectionId, providerInstanceDetailsQueryData} = React.useContext(ConnectionsContext);
    const setSelectedConnectionId = React.useContext(ConnectionsSetContext);
    const onClickConnectionCard = (selectedConnectionId: string) => setSelectedConnectionId({
        selectedConnectionId
    });
    return <TableWrapper {...providerInstanceDetailsQueryData}>{() => <Grid container gap={5}>{
        providerInstanceDetailsQueryData?.data?.map(connection => <Grid item>
            <ConnectionCard
                Name={connection.model?.Name}
                key={connection.model?.Id}
                LastSyncOn={connection.lastSyncedOn? new Date(connection.lastSyncedOn)?.toString() : 'NA'}
                isSelected={connection.model?.Id === selectedConnectionId}
                onClick={onClickConnectionCard}
                ConnectionID={connection.model?.Id ?? ''}
                Actions={connection.numberOfExecutions}
                Tables={connection.numberOfTables}
            />
        </Grid>)
    }
    </Grid>}</TableWrapper>
}