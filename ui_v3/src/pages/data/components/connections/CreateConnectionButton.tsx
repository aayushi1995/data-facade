import {Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import {Box, Dialog, DialogContent, DialogTitle, Grid, IconButton} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {ConnectionBreadCrumbs} from "./ConnectionBreadCrumbs";
import {ConnectionDialogContent} from "./ConnectionDialogContent";
import {Route, useHistory, useRouteMatch} from "react-router-dom";
import {CHOOSE_CONNECTOR_ROUTE, CHOOSE_CONNECTOR_SELECTED_ROUTE} from "./DataRoutesConstants";
import {DATA_CONNECTIONS_ROUTE} from "../../../../common/components/header/data/DataRoutesConfig";

export function CreateConnectionButton() {
    const history = useHistory();
    const dialogState = true;
    const handleDialogOpen = () => {
        history.push(CHOOSE_CONNECTOR_ROUTE)
    }
    const handleDialogClose = () =>{
        history.push(DATA_CONNECTIONS_ROUTE);
    }
    return <>
            <Button variant="contained"
                    endIcon={<AddIcon sx={{fontSize: "small", backgroundColor: "secondary"}}/>}
                    title="Create Connection"
                    onClick={handleDialogOpen}
            >
                Create Connection
            </Button>
            <Route path={CHOOSE_CONNECTOR_ROUTE}>
                <Dialog onClose={handleDialogClose} open={dialogState} fullWidth={true}>
                    <DialogTitle id="simple-dialog-title">
                        <Grid container>
                            <Grid item xs={9}>
                                <Box mx={1} py={0}>
                                    <Route exact path={CHOOSE_CONNECTOR_ROUTE}>
                                        <ConnectionBreadCrumbs/>
                                    </Route>
                                    <Route exact path={CHOOSE_CONNECTOR_SELECTED_ROUTE}>
                                        <ConnectionBreadCrumbs/>
                                    </Route>
                                </Box>
                            </Grid>
                            <Grid item xs={3} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <IconButton aria-label="close" onClick={handleDialogClose}>
                                    <CloseIcon/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent>
                        <ConnectionDialogContent handleDialogClose={handleDialogClose}/>
                    </DialogContent>
                </Dialog>
            </Route>
        </>;
}