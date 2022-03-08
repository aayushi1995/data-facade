import React from "react";
import {Box, Card, CardContent, Grid, TextField, Typography} from "@material-ui/core";
import {TableWrapper} from "../../../../common/components/TableWrapper";
import {Route, useHistory} from "react-router-dom";
import CreateDataSourceRow from "../../../configurations/components/CreateDataSourceRow";
import {useConnectionProviders} from "./hooks/useConnectionProviders";
import {
    CHOOSE_CONNECTOR_ROUTE,
    CHOOSE_CONNECTOR_SELECTED_ROUTE,
} from "./DataRoutesConstants";
import {CardActionArea, CardMedia} from "@mui/material";
import {DATA_CONNECTIONS_ROUTE} from "../../../../common/components/header/data/DataRoutesConfig";

export type ProviderType = {
    ProviderParameterDefinition:
        {
            ProviderDefinitionId: string,
            FilledBy: string,
            DeletedStatus: string,
            ParameterName: string, Id: string, Datatype: string
        }[],
    ProviderDefinition: {
        SourceURL: string, Description: string,
        DeletedStatus: string, ImageURL: string, Id: string, ProviderType: string, UniqueName: string,
        SupportedRuntimeGroup: string
    }
}

function ConnectorCard(props: { onClick: () => void, provider: ProviderType }
) {
    const {currentProvider} = useConnectionProviders();
    return <Card
        onClick={props.onClick}
        sx={{
            width: 150,
            backgroundColor: currentProvider?.ProviderDefinition?.Id === props.provider.ProviderDefinition.Id ?
                "black" : ""
        }}>
        <CardActionArea>
            <CardMedia src={props.provider.ProviderDefinition.ImageURL}
                       component="img"
                       height="140"
                       alt={props.provider.ProviderDefinition.UniqueName}/>
            <CardContent>
                <Typography
                    gutterBottom variant="h6" component="div"
                >{props.provider.ProviderDefinition.UniqueName}</Typography>
            </CardContent>
        </CardActionArea>
    </Card>;
}

export const ConnectionDialogContent = ({handleDialogClose}: { handleDialogClose: () => void }) => {
    const [searchText, setSearchText] = React.useState<string>('');
    const {queryData, filterQueryData} = useConnectionProviders();
    const history = useHistory();
    const searchPredicate = (provider: ProviderType) => !!searchText && provider?.ProviderDefinition ?
        provider.ProviderDefinition.UniqueName.toLowerCase().includes(searchText.toLowerCase()) : true;
    return <>
        <Route exact path={CHOOSE_CONNECTOR_ROUTE}>
            <TextField
                id="search connector"
                rows={2}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                variant="outlined"
                fullWidth
                placeholder="Search Connector"
            />
            <Box sx={{fontSize: "xs"}}><Typography>Available Connectors</Typography></Box>
            <TableWrapper
                {...queryData}
            >
                {() => <Grid container gap={2}>
                    {filterQueryData(searchPredicate)?.map((provider, i: number) =>
                        <Grid item key={i}>
                            <ConnectorCard onClick={() => {
                                history.push(CHOOSE_CONNECTOR_SELECTED_ROUTE.replace(':Id', provider?.ProviderDefinition.Id));
                            }} provider={provider}/>
                        </Grid>)}
                </Grid>}
            </TableWrapper>
        </Route>
        <Route exact path={CHOOSE_CONNECTOR_SELECTED_ROUTE}>
            <CreateDataSourceRow selectedId='' handleClose={()=>{
                history.push(DATA_CONNECTIONS_ROUTE);
            }}/>
        </Route>
    </>
}