import { Grid } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { generatePath, useHistory } from "react-router";
import { DATA_CONNECTION_DETAIL_ROUTE } from "../../../common/components/header/data/DataRoutesConfig";
import LoadingWrapper from "../../../common/components/LoadingWrapper";
import { Fetcher } from "../../../generated/apis/api";
import labels from "../../../labels/labels";
import { ConnectionCard } from "../../data/components/connections/ConnectionCard";
import { ProviderIcon } from "../../data/components/connections/ConnectionDialogContent";

export const ConnectionCardList = () => {
    const providerCardQuery = useQuery([labels.entities.ProviderInstance, "Card"], () => Fetcher.fetchData("GET", "/providerCardView", { IsVisibleOnUI: true }))
    const history = useHistory()
    const onClickConnectionCard = (selectedConnectionId: string) => history.push(generatePath(DATA_CONNECTION_DETAIL_ROUTE, { ProviderInstanceId: selectedConnectionId }));

    return (
        <LoadingWrapper
            isLoading={providerCardQuery.isLoading}
            error={providerCardQuery.error}
            data={providerCardQuery.data}
        >
            <Grid container gap={5}>{
                providerCardQuery.data?.map(providerCardData => {
                    return <Grid item>
                        <ConnectionCard
                            Icon={<ProviderIcon providerUniqueName={providerCardData?.ProviderDefinition?.UniqueName || "NA"}/>}
                            Name={providerCardData?.ProviderInstance?.Name}
                            key={providerCardData?.ProviderInstance?.Id}
                            LastSyncOn={providerCardData?.ProviderInstanceStat?.LastSyncedOn ? new Date(providerCardData?.ProviderInstanceStat?.LastSyncedOn)?.toString() : 'NA'}
                            isSelected={true}
                            onClick={onClickConnectionCard}
                            ConnectionID={providerCardData?.ProviderInstance?.Id ?? ''}
                            Actions={providerCardData?.ProviderInstanceStat?.NumberOfExecutions}
                            Tables={providerCardData?.ProviderInstanceStat?.NumberOfTables}
                        />
                    </Grid>
                })
            }
            </Grid>
        </LoadingWrapper>
    )
}