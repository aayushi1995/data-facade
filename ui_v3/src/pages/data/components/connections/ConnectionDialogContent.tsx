import { Box, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { useQuery } from "react-query";
import { generatePath, Route, useHistory } from "react-router-dom";
import useSlackInstallURL from "../../../../common/components/common/useSlackInstallURL";
import GoogleAuth from "../../../../common/components/google/GoogleAuth";
import { ReactQueryWrapper } from "../../../../common/components/ReactQueryWrapper";
import ProviderDefinitionId from "../../../../enums/ProviderDefinitionId";
import { Fetcher } from "../../../../generated/apis/api";
import { ProviderDefinitionDetail } from "../../../../generated/interfaces/Interfaces";
import labels from "../../../../labels/labels";
import { ProviderInputConnectionStateWrapper } from "../../../configurations/components/ProviderParameterInput";
import { ConnectionsProvider, ConnectionStateContext } from "../../../configurations/context/ConnectionsContext";
import {
    CHOOSE_CONNECTOR_ROUTE,
    CHOOSE_CONNECTOR_SELECTED_ROUTE
} from "./DataRoutesConstants";
import { iconProviderMap } from "./iconProviderMap";


const useStyles = makeStyles(() => ({
    img: {
        maxWidth: 100
    }
}))


export function ProviderIcon({ providerUniqueName, height , width }: {providerUniqueName?: string, height?: number, width?: number}) {
    const classes = useStyles();
    // ignoring because server should send ProviderType with only legit enum UniqueNames in its type
    // @ts-ignore
    const src = (providerUniqueName && (providerUniqueName in iconProviderMap))? iconProviderMap[providerUniqueName]: '';
    return src? <img src={src}
                className={classes.img}
                height={height || 65}
                width={width || 130}
                alt={providerUniqueName}
    />: null;
}

function ConnectorCard(props: { onClick?: () => void, provider: ProviderDefinitionDetail }
) {
    const connectionState = React.useContext(ConnectionStateContext)

    return <Card
        onClick={props?.onClick}
        sx={{
            width: 150,
            height: 140,
            cursor: 'pointer'
        }}>
        <CardContent sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            height: '100%',
            alignItems: 'center'
        }}>
            <ProviderIcon providerUniqueName={props.provider.ProviderDefinition?.UniqueName || "NA"}/>
            <Typography
                gutterBottom variant="h6" component="div"
            >{props.provider?.ProviderDefinition?.UniqueName}</Typography>
        </CardContent>
    </Card>;
}

export const ConnectionDialogContent = ({handleDialogClose}: { handleDialogClose: () => void }) => {
    const [searchText, setSearchText] = React.useState<string>('');
    const providerDefinitionQuery = useQuery([labels.entities.ProviderDefinition, "Detail"], () => Fetcher.fetchData("GET", "/providerDefinitionDetail", { IsVisibleOnUI: true }))
    const history = useHistory();
    const { url: slackInstallUrl } = useSlackInstallURL()
    const searchPredicate = (provider: ProviderDefinitionDetail) => !!searchText && provider?.ProviderDefinition ?
        (provider?.ProviderDefinition?.UniqueName||"").toLowerCase().includes(searchText.toLowerCase()) : true;

    const providerComponents = {
        [ProviderDefinitionId.SLACK]: (provider: ProviderDefinitionDetail) => 
            slackInstallUrl && <ConnectorCard onClick={() => window.open(slackInstallUrl)} provider={provider}/>,

        [ProviderDefinitionId.GOOGLE_SHEETS]: (provider: ProviderDefinitionDetail) => 
            <GoogleAuth><ConnectorCard provider={provider}/></GoogleAuth>,
        
        DEFAULT: (provider: ProviderDefinitionDetail) => <ConnectorCard onClick={() => {
            if(!!provider?.ProviderDefinition?.Id) {
                history.push(generatePath(CHOOSE_CONNECTOR_SELECTED_ROUTE, { ProviderDefinitionId: provider?.ProviderDefinition?.Id}))
            }
        }} provider={provider}
    />
    }

    const getProviderComponent = (provider: ProviderDefinitionDetail) => {

        const component = providerComponents?.[provider?.ProviderDefinition?.Id || "NA"] || providerComponents.DEFAULT
        return component(provider)
    }
    
    return (
        <ConnectionsProvider>
            <>
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
                        isLoading={providerDefinitionQuery.isLoading}
                        error={providerDefinitionQuery.error}
                        data={providerDefinitionQuery.data}
                        sx={{
                            minHeight: 200,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {() => <Grid container gap={2} alignItems={'space-between'} justifyContent={'space-between'}>
                            {providerDefinitionQuery.data?.filter(searchPredicate)?.map((provider, i: number) =>
                                <Grid item key={i}>
                                    { getProviderComponent(provider) }
                                </Grid>)
                            }
                        </Grid>}
                    </ReactQueryWrapper>
                </Route>
                <Route exact path={CHOOSE_CONNECTOR_SELECTED_ROUTE} render={ (routeProps) =>
                    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                        <Box sx={{ height: "100%" }}>
                            <ProviderInputConnectionStateWrapper {...routeProps}/>
                        </Box>
                    </Box>
                    
                }/>
            </>
        </ConnectionsProvider>
    )
}