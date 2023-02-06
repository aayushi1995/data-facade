import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { useQuery } from "react-query";
import { generatePath, Route, useHistory } from "react-router-dom";
import useSlackInstallURL from "../../../../common/components/common/useSlackInstallURL";
import { ReactQueryWrapper } from "../../../../common/components/error-boundary/ReactQueryWrapper";
import GoogleAuth from "../../../../common/components/google/GoogleAuth";
import ImportGoogleSheet from "../../../../common/components/google/ImportGoogleSheet";
import ImportS3File from '../../../../common/components/google/ImportS3File';
import ProviderDefinitionId from "../../../../enums/ProviderDefinitionId";
import { Fetcher } from "../../../../generated/apis/api";
import { ProviderDefinitionDetail } from "../../../../generated/interfaces/Interfaces";
import labels from "../../../../labels/labels";
import { ProviderInputConnectionStateWrapper } from "../../configurations/components/ProviderParameterInput";
import { ConnectionsProvider, ConnectionStateContext } from "../../configurations/context/ConnectionsContext";
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
            <GoogleConnectorCard provider={provider}/>,
        [ProviderDefinitionId.S3]: (provider: ProviderDefinitionDetail) => <S3ConnectorCard provider={provider}/>,
        DEFAULT: (provider: ProviderDefinitionDetail) => <ConnectorCard onClick={() => {
            if(!!provider?.ProviderDefinition?.Id) {
                // history.push(generatePath(CHOOSE_CONNECTOR_SELECTED_ROUTE, { ProviderDefinitionId: provider?.ProviderDefinition?.Id}))
                history.push(`/data/connections/choose/${provider?.ProviderDefinition?.Id}?name=${provider?.ProviderDefinition?.UniqueName}`)
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

const GoogleConnectorCard = (props: { onClick?: () => {}, provider: ProviderDefinitionDetail }) => {
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const closeDialog = () => setDialogOpen(false)
    const openDialog = () => setDialogOpen(true)
    return (
        <>
            <Dialog maxWidth="md" fullWidth open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Box>
                            Google
                        </Box>
                        <IconButton aria-label="close" onClick={closeDialog}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 1 }}>
                        <ImportGoogleSheet/>
                        <GoogleAuth>
                            <Button>Add New</Button>
                        </GoogleAuth>
                    </Box>
                </DialogContent>
            </Dialog>
            <ConnectorCard onClick={openDialog} provider={props?.provider}/>
        </>
    )
}

const S3ConnectorCard = (props: { provider: ProviderDefinitionDetail }) => {
    const history = useHistory()
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const openDialog = () => setDialogOpen(true)
    const closeDialog = () => setDialogOpen(false)

    const onAddNew = () => props?.provider?.ProviderDefinition?.Id && history.push(
        generatePath(CHOOSE_CONNECTOR_SELECTED_ROUTE, { ProviderDefinitionId: props?.provider?.ProviderDefinition?.Id})
        )

    return (
        <>
            <Dialog maxWidth="md" fullWidth open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Box>
                            S3
                        </Box>
                        <IconButton aria-label="close" onClick={closeDialog}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 1 }}>
                        <ImportS3File/>
                        <Button onClick={onAddNew}>
                            Add New
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <ConnectorCard provider={props?.provider} onClick={() => openDialog()}/>
        </>
    )
}