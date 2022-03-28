import {Grid} from "@mui/material";
import {ConnectionCard} from "../../data/components/connections/ConnectionCard";
import React from "react";
import {ConnectionsContext, ConnectionsSetContext} from "../context/ConnectionsContext";
import {ReactQueryWrapper} from "../../../common/components/ReactQueryWrapper";
import {ProviderIcon, ProviderType} from "../../data/components/connections/ConnectionDialogContent";

export const ConnectionCardList = () => {
    const {
        selectedConnectionId,
        providerInstanceDetailsQueryData,
        ProvidersQueryData
    } = React.useContext(ConnectionsContext);
    const setSelectedConnectionId = React.useContext(ConnectionsSetContext);
    const onClickConnectionCard = (selectedConnectionId: string) => setSelectedConnectionId({
        selectedConnectionId
    });
    return <ReactQueryWrapper {...providerInstanceDetailsQueryData}>{()=><ReactQueryWrapper {...ProvidersQueryData}>{() =>
        <Grid container gap={5}>{
            providerInstanceDetailsQueryData?.data?.map(connection => {
                const provider = ProvidersQueryData?.data?.find((d: ProviderType) => d?.ProviderDefinition?.Id === connection.model?.ProviderDefinitionId);
                return <Grid item>
                    <ConnectionCard
                        Icon={<ProviderIcon provider={provider}/>}
                        Name={connection.model?.Name}
                        key={connection.model?.Id}
                        LastSyncOn={connection.lastSyncedOn ? new Date(connection.lastSyncedOn)?.toString() : 'NA'}
                        isSelected={connection.model?.Id === selectedConnectionId}
                        onClick={onClickConnectionCard}
                        ConnectionID={connection.model?.Id ?? ''}
                        Actions={connection.numberOfExecutions}
                        Tables={connection.numberOfTables}
                    />
                </Grid>
            })
        }
        </Grid>}</ReactQueryWrapper>}</ReactQueryWrapper>
}