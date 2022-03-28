import React from "react";
import {Box, Card, CardContent, Grid, TextField, Typography} from "@mui/material";
import {ReactQueryWrapper} from "../../../../common/components/ReactQueryWrapper";
import {Route, useHistory} from "react-router-dom";
import CreateDataSourceRow from "../../../configurations/components/CreateDataSourceRow";
import {useConnectionProviders} from "./hooks/useConnectionProviders";
import {
    CHOOSE_CONNECTOR_ROUTE,
    CHOOSE_CONNECTOR_SELECTED_ROUTE,
} from "./DataRoutesConstants";
import {DATA_CONNECTIONS_ROUTE} from "../../../../common/components/header/data/DataRoutesConfig";
import {iconProviderMap} from "./iconProviderMap";
import {makeStyles} from "@mui/styles";


const useStyles = makeStyles(() => ({
    img: {
        maxWidth: 100
    }
}))


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

export function ProviderIcon({ provider }: {provider?: ProviderType}) {
    const classes = useStyles();
    const providerUniqueName = provider?.ProviderDefinition?.UniqueName;
    // ignoring because server should send ProviderType with only legit enum UniqueNames in its type
    // @ts-ignore
    const src = (providerUniqueName && (providerUniqueName in iconProviderMap))? iconProviderMap[providerUniqueName]: '';
    return src? <img src={src}
                className={classes.img}
                height={50}
                alt={provider?.ProviderDefinition?.UniqueName}
    />: null;
}

function ConnectorCard(props: { onClick: () => void, provider: ProviderType }
) {
    const {currentProvider} = useConnectionProviders();

    return <Card
        onClick={props.onClick}
        sx={{
            width: 150,
            height: 140,
            backgroundColor: currentProvider?.ProviderDefinition?.Id === props.provider.ProviderDefinition.Id ?
                "black" : "",
            cursor: 'pointer'
        }}>
        <CardContent sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            height: '100%',
            alignItems: 'center'
        }}>
            <ProviderIcon provider={props.provider}/>
            <Typography
                gutterBottom variant="h6" component="div"
            >{props.provider.ProviderDefinition.UniqueName}</Typography>
        </CardContent>
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
            <Box sx={{fontSize: "xs", p: 2}}>
                <Typography>Available Connectors</Typography>
            </Box>
            <ReactQueryWrapper
                {...queryData}
                sx={{
                    minHeight: 200,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {() => <Grid container gap={2} alignItems={'space-between'} justifyContent={'space-between'}>
                    {filterQueryData(searchPredicate)?.map((provider, i: number) =>
                        <Grid item key={i}>
                            <ConnectorCard onClick={() => {
                                history.push(CHOOSE_CONNECTOR_SELECTED_ROUTE.replace(':Id', provider?.ProviderDefinition.Id));
                            }} provider={provider}/>
                        </Grid>)}
                </Grid>}
            </ReactQueryWrapper>
        </Route>
        <Route exact path={CHOOSE_CONNECTOR_SELECTED_ROUTE}>
            <CreateDataSourceRow isUpdate={false} selectedId='' handleClose={() => {
                history.push(DATA_CONNECTIONS_ROUTE);
            }}/>
        </Route>
    </>
}